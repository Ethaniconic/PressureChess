from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import GameSaveRequest, GameResponse
from app.core.supabase import get_supabase_client
from app.services.chess_service import ChessService
from typing import List, Optional
import uuid
from datetime import datetime
import logging

router = APIRouter(prefix="/api/games", tags=["Games"])
logger = logging.getLogger(__name__)

# In-memory storage fallback
MOCK_GAMES: List[dict] = [
    {
        "id": "game-sample-1",
        "user_id": "mock-user-123",
        "game_type": "offline",
        "opponent_name": "Player 2",
        "result": "1-0",
        "pgn": "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. O-O Nf6 5. d3 d6 6. c3 a6 7. Bg5 h6 8. Bh4 g5 9. Bg3 Ba7",
        "final_fen": "r1bqk2r/bpp2p2/p1np1n1p/4p1p1/2B1P3/2PP1NBP/PP3PP1/RN1Q1RK1 b kq - 1 9",
        "moves_count": 18,
        "created_at": datetime.utcnow()
    }
]

@router.post("/save", response_model=GameResponse)
def save_game(payload: GameSaveRequest):
    game_dict = {
        "id": str(uuid.uuid4()),
        "user_id": payload.user_id if payload.user_id and payload.user_id != "guest" else None,
        "game_type": payload.game_type,
        "opponent_name": payload.opponent_name,
        "result": payload.result,
        "pgn": payload.pgn or "",
        "final_fen": payload.final_fen or "",
        "moves_count": payload.moves_count,
        "player_color": payload.player_color,
        "time_control": payload.time_control,
        "created_at": datetime.utcnow()
    }

    supabase = get_supabase_client()
    if not supabase:
        MOCK_GAMES.insert(0, game_dict)
        return game_dict

    try:
        # Prepare for supabase insert
        db_payload = {
            "game_type": payload.game_type,
            "opponent_name": payload.opponent_name,
            "result": payload.result,
            "pgn": payload.pgn,
            "final_fen": payload.final_fen,
            "moves_count": payload.moves_count,
            "player_color": payload.player_color,
            "time_control": payload.time_control,
        }
        if payload.user_id and payload.user_id != "guest":
            db_payload["user_id"] = payload.user_id

        res = supabase.table("games").insert(db_payload).execute()
        if res.data:
            return res.data[0]
        # Fallback to local memory if insertion didn't return
        MOCK_GAMES.insert(0, game_dict)
        return game_dict
    except Exception as e:
        logger.error(f"Error saving game to Supabase: {e}")
        MOCK_GAMES.insert(0, game_dict)
        return game_dict

@router.get("/history", response_model=List[GameResponse])
def get_game_history(user_id: Optional[str] = Query(None)):
    supabase = get_supabase_client()
    if not supabase or user_id in ("guest", "mock-user-123", None):
        if user_id and user_id != "guest":
            return [g for g in MOCK_GAMES if g.get("user_id") == user_id]
        return MOCK_GAMES

    try:
        query = supabase.table("games").select("*").order("created_at", desc=True).limit(20)
        if user_id:
            query = query.eq("user_id", user_id)
        res = query.execute()
        return res.data or []
    except Exception as e:
        logger.error(f"Error fetching games: {e}")
        return MOCK_GAMES
