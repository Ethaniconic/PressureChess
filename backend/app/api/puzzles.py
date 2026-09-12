from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.data.puzzles_data import PUZZLE_CATEGORIES, CHAMPIONSHIP_SCENARIOS, TACTICAL_PUZZLES, ALL_PUZZLES
from app.core.supabase import get_supabase_client
import math
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/puzzles", tags=["Tactics & Pressure Trainer"])

class SolvePuzzleRequest(BaseModel):
    puzzle_id: str
    solved: bool
    time_taken_seconds: float
    mode: Optional[str] = "timed"
    user_id: Optional[str] = None
    hints_used: Optional[int] = 0

class SolvePuzzleResponse(BaseModel):
    success: bool
    puzzle_id: str
    solved: bool
    rating_delta: int
    new_puzzle_rating: int
    streak: int
    highest_streak: int
    accuracy_pct: float
    avg_solve_time: float
    total_solved: int

@router.get("/categories")
def get_categories():
    """Returns all tactical puzzle categories."""
    return {"categories": PUZZLE_CATEGORIES}

@router.get("/championship")
def get_championship_scenarios():
    """Returns curated historic championship scenarios."""
    return {"scenarios": CHAMPIONSHIP_SCENARIOS}

@router.get("/")
def get_puzzles(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    limit: int = Query(default=20, le=50)
):
    """Retrieve puzzles filtered by category and difficulty."""
    puzzles = ALL_PUZZLES
    
    if category and category != "all":
        puzzles = [p for p in puzzles if p.get("category") == category]
        
    if difficulty and difficulty != "all":
        puzzles = [p for p in puzzles if p.get("difficulty") == difficulty]
        
    return {
        "total": len(puzzles),
        "puzzles": puzzles[:limit]
    }

@router.get("/{puzzle_id}")
def get_puzzle(puzzle_id: str):
    """Retrieve a single puzzle by ID."""
    puzzle = next((p for p in ALL_PUZZLES if p["id"] == puzzle_id), None)
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")
    return {"puzzle": puzzle}

@router.post("/solve", response_model=SolvePuzzleResponse)
def solve_puzzle(payload: SolvePuzzleRequest):
    """
    Submits a puzzle solution attempt, calculates dynamic rating delta,
    and updates stats in Supabase if user is authenticated.
    """
    puzzle = next((p for p in ALL_PUZZLES if p["id"] == payload.puzzle_id), None)
    puzzle_rating = puzzle["rating"] if puzzle else 1200

    # Default baseline stats
    current_rating = 1200
    current_streak = 0
    highest_streak = 0
    total_attempted = 0
    total_solved = 0
    total_time = 0.0

    supabase = get_supabase_client()
    # Check if we can fetch user's live stats from Supabase
    if supabase and payload.user_id:
        try:
            res = supabase.table("user_puzzle_stats").select("*").eq("user_id", payload.user_id).execute()
            if res.data and len(res.data) > 0:
                stat = res.data[0]
                current_rating = stat.get("puzzle_rating", 1200)
                current_streak = stat.get("current_streak", 0)
                highest_streak = stat.get("highest_streak", 0)
                total_attempted = stat.get("puzzles_attempted", 0)
                total_solved = stat.get("puzzles_solved", 0)
                total_time = float(stat.get("total_time_spent_seconds", 0.0))
        except Exception as e:
            logger.warning(f"Could not load puzzle stats from Supabase: {e}")

    # Elo expectation algorithm
    # Expected score: 1 / (1 + 10^((puzzle_rating - user_rating) / 400))
    expected_score = 1.0 / (1.0 + math.pow(10, (puzzle_rating - current_rating) / 400.0))
    k_factor = 32

    if payload.solved:
        # Speed bonus: faster solve gives slightly higher gain
        actual_score = 1.0
        time_factor = max(0.7, 1.3 - (payload.time_taken_seconds / 30.0))
        base_delta = round(k_factor * (actual_score - expected_score) * time_factor)
        rating_delta = max(5, min(35, base_delta))
        
        # Penalize slightly if hints were used
        if payload.hints_used and payload.hints_used > 0:
            rating_delta = max(3, rating_delta - (payload.hints_used * 4))

        new_rating = current_rating + rating_delta
        current_streak += 1
        highest_streak = max(highest_streak, current_streak)
        total_solved += 1
    else:
        actual_score = 0.0
        base_delta = round(k_factor * (actual_score - expected_score))
        rating_delta = min(-5, max(-30, base_delta))
        new_rating = max(400, current_rating + rating_delta)
        current_streak = 0

    total_attempted += 1
    total_time += payload.time_taken_seconds
    accuracy_pct = round((total_solved / max(1, total_attempted)) * 100.0, 1)
    avg_solve_time = round(total_time / max(1, total_attempted), 1)

    # Persist in Supabase if available
    if supabase and payload.user_id:
        try:
            # 1. Update or Insert user_puzzle_stats
            supabase.table("user_puzzle_stats").upsert({
                "user_id": payload.user_id,
                "puzzle_rating": new_rating,
                "highest_rating": max(new_rating, highest_streak),
                "puzzles_attempted": total_attempted,
                "puzzles_solved": total_solved,
                "current_streak": current_streak,
                "highest_streak": highest_streak,
                "total_time_spent_seconds": total_time
            }).execute()

            # 2. Record history
            supabase.table("puzzle_history").insert({
                "user_id": payload.user_id,
                "puzzle_id": payload.puzzle_id,
                "category": puzzle.get("category", "all") if puzzle else "all",
                "difficulty": puzzle.get("difficulty", "intermediate") if puzzle else "intermediate",
                "mode": payload.mode or "timed",
                "time_taken_seconds": payload.time_taken_seconds,
                "solved": payload.solved,
                "rating_delta": rating_delta,
                "user_rating_after": new_rating
            }).execute()
        except Exception as e:
            logger.error(f"Error persisting solve result to Supabase: {e}")

    return SolvePuzzleResponse(
        success=True,
        puzzle_id=payload.puzzle_id,
        solved=payload.solved,
        rating_delta=rating_delta,
        new_puzzle_rating=new_rating,
        streak=current_streak,
        highest_streak=highest_streak,
        accuracy_pct=accuracy_pct,
        avg_solve_time=avg_solve_time,
        total_solved=total_solved
    )

@router.get("/stats/summary")
def get_user_stats(user_id: Optional[str] = None):
    """Retrieve overall puzzle statistics."""
    supabase = get_supabase_client()
    if supabase and user_id:
        try:
            res = supabase.table("user_puzzle_stats").select("*").eq("user_id", user_id).execute()
            if res.data and len(res.data) > 0:
                stat = res.data[0]
                total_attempted = stat.get("puzzles_attempted", 0)
                total_solved = stat.get("puzzles_solved", 0)
                accuracy_pct = round((total_solved / max(1, total_attempted)) * 100.0, 1)
                avg_time = round(float(stat.get("total_time_spent_seconds", 0)) / max(1, total_attempted), 1)

                return {
                    "puzzle_rating": stat.get("puzzle_rating", 1200),
                    "highest_rating": stat.get("highest_rating", 1200),
                    "current_streak": stat.get("current_streak", 0),
                    "highest_streak": stat.get("highest_streak", 0),
                    "puzzles_attempted": total_attempted,
                    "puzzles_solved": total_solved,
                    "accuracy_pct": accuracy_pct,
                    "avg_solve_time": avg_time
                }
        except Exception as e:
            logger.warning(f"Error fetching stats from Supabase: {e}")

    # Fallback guest statistics
    return {
        "puzzle_rating": 1200,
        "highest_rating": 1200,
        "current_streak": 0,
        "highest_streak": 0,
        "puzzles_attempted": 0,
        "puzzles_solved": 0,
        "accuracy_pct": 0.0,
        "avg_solve_time": 0.0
    }
