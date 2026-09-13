from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    username: str = Field(..., min_length=3, max_length=30)
    full_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class AuthResponse(BaseModel):
    access_token: Optional[str] = None
    user_id: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None
    message: str

# --- Profile Schemas ---
class ProfileResponse(BaseModel):
    id: str
    username: Optional[str] = "Grandmaster"
    full_name: Optional[str] = "Chess Player"
    avatar_url: Optional[str] = None
    elo_rating: int = 400
    daily_streak: int = 1
    board_theme: str = "emerald"
    piece_theme: str = "neo"
    sound_enabled: bool = True
    animation_enabled: bool = True
    created_at: Optional[datetime] = None

class ProfileUpdateRequest(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    board_theme: Optional[str] = None
    piece_theme: Optional[str] = None
    sound_enabled: Optional[bool] = None
    animation_enabled: Optional[bool] = None

# --- Game Schemas ---
class GameSaveRequest(BaseModel):
    user_id: Optional[str] = None
    game_type: str = "offline"
    opponent_name: str = "Local Opponent"
    result: str # '1-0', '0-1', '1/2-1/2', 'resigned'
    pgn: Optional[str] = ""
    final_fen: Optional[str] = ""
    moves_count: int = 0
    player_color: str = "white"
    time_control: str = "rapid"

class GameResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    game_type: str
    opponent_name: str
    result: str
    pgn: Optional[str]
    final_fen: Optional[str]
    moves_count: int
    created_at: Optional[datetime] = None

# --- Chess Engine / python-chess Schemas ---
class LegalMovesRequest(BaseModel):
    fen: str

class LegalMovesResponse(BaseModel):
    is_valid_fen: bool
    is_check: bool
    is_checkmate: bool
    is_stalemate: bool
    is_game_over: bool
    turn: str # 'w' or 'b'
    legal_moves: List[str] # UCI strings e.g. ["e2e4", "g1f3"]

# --- Multiplayer & Realtime Schemas ---
class CreateRoomRequest(BaseModel):
    mode: str = "blitz" # bullet, blitz, rapid, classical
    time_control: str = "3+0"
    user_id: Optional[str] = "guest"
    username: str = "Player 1"
    country: str = "US"
    rating: int = 400

class JoinRoomRequest(BaseModel):
    room_code: str
    user_id: Optional[str] = "guest"
    username: str = "Player 2"
    country: str = "US"
    rating: int = 400

class MatchmakingJoinRequest(BaseModel):
    mode: str = "blitz"
    time_control: str = "3+0"
    user_id: str
    username: str
    country: str = "US"
    rating: int = 400

class MatchmakingLeaveRequest(BaseModel):
    user_id: str

class SubmitMoveRequest(BaseModel):
    game_id: str
    player_id: str
    from_sq: str
    to_sq: str
    promotion: Optional[str] = "q"
    time_remaining: float

class ResignRequest(BaseModel):
    game_id: str
    player_id: str

class DrawRequest(BaseModel):
    game_id: str
    player_id: str
    action: str # offer, accept, decline

