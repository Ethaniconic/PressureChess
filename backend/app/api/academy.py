from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.core.supabase import get_supabase_client
import logging

router = APIRouter(prefix="/api/academy", tags=["Academy"])
logger = logging.getLogger(__name__)

# Request and Response schemas
class LessonCompleteRequest(BaseModel):
    user_id: Optional[str] = "guest"
    lesson_id: str
    stars: int = 3
    hints_used: int = 0
    attempts: int = 1
    xp_earned: int = 50

class ProgressResponse(BaseModel):
    user_id: str
    total_xp: int
    level: int
    level_title: str
    total_stars: int
    completed_lessons: Dict[str, Any]
    unlocked_achievements: List[str]

# In-memory storage fallback for local/offline dev
MOCK_ACADEMY_PROGRESS: Dict[str, Dict[str, Any]] = {
    "guest": {
        "user_id": "guest",
        "total_xp": 150,
        "total_stars": 3,
        "completed_lessons": {
            "basics-center": {"stars": 3, "completed_at": datetime.utcnow().isoformat()}
        },
        "unlocked_achievements": ["first-lesson"]
    }
}

ACHIEVEMENT_DEFINITIONS = [
    {"id": "first-lesson", "title": "First Step", "desc": "Complete your first lesson", "icon": "🎯", "xp": 100},
    {"id": "board-master", "title": "Cartographer", "desc": "Complete Board Basics", "icon": "🗺️", "xp": 150},
    {"id": "piece-master", "title": "Grand Army", "desc": "Master all 6 piece types", "icon": "⚔️", "xp": 250},
    {"id": "check-master", "title": "Royal Shield", "desc": "Master Check and CPR escapes", "icon": "🛡️", "xp": 200},
    {"id": "checkmate-master", "title": "Checkmate Virtuoso", "desc": "Deliver back-rank and helper mates", "icon": "👑", "xp": 300},
    {"id": "special-moves-master", "title": "Special Forces", "desc": "Master Castling and En Passant", "icon": "⚡", "xp": 350},
    {"id": "scholar-grad", "title": "Academy Graduate", "desc": "Complete all 8 beginner modules", "icon": "🎓", "xp": 500}
]

def calculate_level_info(total_xp: int) -> Dict[str, Any]:
    if total_xp >= 2000:
        return {"level": 6, "title": "Grandmaster in Training"}
    if total_xp >= 1200:
        return {"level": 5, "title": "Queen Commander"}
    if total_xp >= 700:
        return {"level": 4, "title": "Rook Strategist"}
    if total_xp >= 350:
        return {"level": 3, "title": "Bishop Tactician"}
    if total_xp >= 100:
        return {"level": 2, "title": "Knight Rider"}
    return {"level": 1, "title": "Pawn Apprentice"}

@router.get("/progress", response_model=ProgressResponse)
def get_user_progress(user_id: str = Query("guest")):
    supabase = get_supabase_client()
    
    if not supabase or user_id in ("guest", "mock-user-123"):
        data = MOCK_ACADEMY_PROGRESS.setdefault(user_id, {
            "user_id": user_id,
            "total_xp": 0,
            "total_stars": 0,
            "completed_lessons": {},
            "unlocked_achievements": []
        })
        lvl = calculate_level_info(data["total_xp"])
        return ProgressResponse(
            user_id=user_id,
            total_xp=data["total_xp"],
            level=lvl["level"],
            level_title=lvl["title"],
            total_stars=data["total_stars"],
            completed_lessons=data["completed_lessons"],
            unlocked_achievements=data["unlocked_achievements"]
        )

    try:
        # Fetch from Supabase
        progress_res = supabase.table("academy_progress").select("*").eq("user_id", user_id).execute()
        achieve_res = supabase.table("user_achievements").select("achievement_id").eq("user_id", user_id).execute()

        completed = {}
        total_stars = 0
        total_xp = 0

        for row in progress_res.data or []:
            completed[row["lesson_id"]] = {
                "stars": row.get("stars", 3),
                "completed_at": row.get("completed_at")
            }
            total_stars += row.get("stars", 3)
            total_xp += row.get("xp_earned", 50)

        unlocked = [a["achievement_id"] for a in (achieve_res.data or [])]
        lvl = calculate_level_info(total_xp)

        return ProgressResponse(
            user_id=user_id,
            total_xp=total_xp,
            level=lvl["level"],
            level_title=lvl["title"],
            total_stars=total_stars,
            completed_lessons=completed,
            unlocked_achievements=unlocked
        )
    except Exception as e:
        logger.error(f"Error fetching academy progress: {e}")
        data = MOCK_ACADEMY_PROGRESS.setdefault(user_id, {
            "user_id": user_id,
            "total_xp": 0,
            "total_stars": 0,
            "completed_lessons": {},
            "unlocked_achievements": []
        })
        lvl = calculate_level_info(data["total_xp"])
        return ProgressResponse(
            user_id=user_id,
            total_xp=data["total_xp"],
            level=lvl["level"],
            level_title=lvl["title"],
            total_stars=data["total_stars"],
            completed_lessons=data["completed_lessons"],
            unlocked_achievements=data["unlocked_achievements"]
        )

@router.post("/complete-lesson", response_model=ProgressResponse)
def complete_lesson(payload: LessonCompleteRequest):
    user_id = payload.user_id or "guest"
    user_store = MOCK_ACADEMY_PROGRESS.setdefault(user_id, {
        "user_id": user_id,
        "total_xp": 0,
        "total_stars": 0,
        "completed_lessons": {},
        "unlocked_achievements": []
    })

    # Only grant rewards if not completed before or if upgraded stars
    already_done = payload.lesson_id in user_store["completed_lessons"]
    prev_stars = user_store["completed_lessons"].get(payload.lesson_id, {}).get("stars", 0)

    if not already_done:
        user_store["total_xp"] += payload.xp_earned
        user_store["total_stars"] += payload.stars
    elif payload.stars > prev_stars:
        user_store["total_stars"] += (payload.stars - prev_stars)

    user_store["completed_lessons"][payload.lesson_id] = {
        "stars": max(payload.stars, prev_stars),
        "completed_at": datetime.utcnow().isoformat()
    }

    # Unlock achievements dynamically
    completed_count = len(user_store["completed_lessons"])
    if completed_count >= 1 and "first-lesson" not in user_store["unlocked_achievements"]:
        user_store["unlocked_achievements"].append("first-lesson")
        user_store["total_xp"] += 100

    if completed_count >= 6 and "piece-master" not in user_store["unlocked_achievements"]:
        user_store["unlocked_achievements"].append("piece-master")
        user_store["total_xp"] += 250

    if completed_count >= 14 and "scholar-grad" not in user_store["unlocked_achievements"]:
        user_store["unlocked_achievements"].append("scholar-grad")
        user_store["total_xp"] += 500

    # Supabase sync if connected
    supabase = get_supabase_client()
    if supabase and user_id not in ("guest", "mock-user-123"):
        try:
            supabase.table("academy_progress").upsert({
                "user_id": user_id,
                "lesson_id": payload.lesson_id,
                "stars": payload.stars,
                "xp_earned": payload.xp_earned,
                "completed_at": datetime.utcnow().isoformat()
            }).execute()
        except Exception as e:
            logger.error(f"Error syncing academy progress: {e}")

    lvl = calculate_level_info(user_store["total_xp"])
    return ProgressResponse(
        user_id=user_id,
        total_xp=user_store["total_xp"],
        level=lvl["level"],
        level_title=lvl["title"],
        total_stars=user_store["total_stars"],
        completed_lessons=user_store["completed_lessons"],
        unlocked_achievements=user_store["unlocked_achievements"]
    )

@router.get("/achievements")
def get_achievements(user_id: str = Query("guest")):
    user_store = MOCK_ACADEMY_PROGRESS.get(user_id, {"unlocked_achievements": []})
    unlocked_set = set(user_store.get("unlocked_achievements", []))
    
    result = []
    for ach in ACHIEVEMENT_DEFINITIONS:
        result.append({
            **ach,
            "is_unlocked": ach["id"] in unlocked_set
        })
    return result
