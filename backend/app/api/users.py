from fastapi import APIRouter, HTTPException, Header
from app.models.schemas import ProfileResponse, ProfileUpdateRequest
from app.core.supabase import get_supabase_client
from typing import Optional
import logging

router = APIRouter(prefix="/api/users", tags=["Users"])
logger = logging.getLogger(__name__)

# In-memory store fallback when Supabase is not connected
MOCK_PROFILES = {
    "guest": {
        "id": "guest",
        "username": "Guest Tactician",
        "full_name": "Guest Player",
        "avatar_url": "",
        "elo_rating": 1200,
        "daily_streak": 1,
        "board_theme": "emerald",
        "piece_theme": "neo",
        "sound_enabled": True,
        "animation_enabled": True,
        "created_at": None
    },
    "mock-user-123": {
        "id": "mock-user-123",
        "username": "PressureMaster",
        "full_name": "Alex Kasparov",
        "avatar_url": "",
        "elo_rating": 1340,
        "daily_streak": 5,
        "board_theme": "emerald",
        "piece_theme": "neo",
        "sound_enabled": True,
        "animation_enabled": True,
        "created_at": None
    }
}

@router.get("/{user_id}/profile", response_model=ProfileResponse)
def get_user_profile(user_id: str):
    if user_id in MOCK_PROFILES:
        return MOCK_PROFILES[user_id]
        
    supabase = get_supabase_client()
    if not supabase:
        return MOCK_PROFILES.get("guest")

    try:
        response = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        if response.data:
            return response.data
        # Return default if not found
        return {
            "id": user_id,
            "username": "ChessMaster",
            "full_name": "Tactician",
            "avatar_url": None,
            "elo_rating": 1200,
            "daily_streak": 1,
            "board_theme": "emerald",
            "piece_theme": "neo",
            "sound_enabled": True,
            "animation_enabled": True,
            "created_at": None
        }
    except Exception as e:
        logger.error(f"Error fetching profile: {e}")
        return MOCK_PROFILES.get("guest")

@router.put("/{user_id}/profile", response_model=ProfileResponse)
def update_user_profile(user_id: str, payload: ProfileUpdateRequest):
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    
    if user_id in MOCK_PROFILES:
        MOCK_PROFILES[user_id].update(update_data)
        return MOCK_PROFILES[user_id]
        
    supabase = get_supabase_client()
    if not supabase:
        profile = MOCK_PROFILES.setdefault(user_id, {
            "id": user_id,
            "username": "Tactician",
            "full_name": "Player",
            "avatar_url": None,
            "elo_rating": 1200,
            "daily_streak": 1,
            "board_theme": "emerald",
            "piece_theme": "neo",
            "sound_enabled": True,
            "animation_enabled": True,
            "created_at": None
        })
        profile.update(update_data)
        return profile

    try:
        response = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        if response.data:
            return response.data[0]
        raise HTTPException(status_code=400, detail="Profile update failed")
    except Exception as e:
        logger.error(f"Error updating profile: {e}")
        raise HTTPException(status_code=400, detail=str(e))
