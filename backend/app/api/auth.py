from fastapi import APIRouter, HTTPException, Depends, Header
from app.models.schemas import SignUpRequest, LoginRequest, ForgotPasswordRequest, AuthResponse
from app.core.supabase import get_supabase_client
from typing import Optional
import logging

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)

@router.post("/signup", response_model=AuthResponse)
def signup(payload: SignUpRequest):
    supabase = get_supabase_client()
    if not supabase:
        # Development / mock mode
        return AuthResponse(
            access_token="mock_dev_token_user_123",
            user_id="mock-user-123",
            email=payload.email,
            username=payload.username,
            message="User created (Dev Mode)"
        )
    
    try:
        res = supabase.auth.sign_up({
            "email": payload.email,
            "password": payload.password,
            "options": {
                "data": {
                    "username": payload.username,
                    "full_name": payload.full_name or payload.username
                }
            }
        })
        if res.user:
            token = res.session.access_token if res.session else None
            return AuthResponse(
                access_token=token,
                user_id=res.user.id,
                email=res.user.email,
                username=payload.username,
                message="Signup successful. Please verify your email if required."
            )
        else:
            raise HTTPException(status_code=400, detail="Signup failed")
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest):
    supabase = get_supabase_client()
    if not supabase:
        return AuthResponse(
            access_token="mock_dev_token_user_123",
            user_id="mock-user-123",
            email=payload.email,
            username=payload.email.split("@")[0],
            message="Login successful (Dev Mode)"
        )

    try:
        res = supabase.auth.sign_in_with_password({
            "email": payload.email,
            "password": payload.password
        })
        if res.user and res.session:
            user_metadata = res.user.user_metadata or {}
            username = user_metadata.get("username", payload.email.split("@")[0])
            return AuthResponse(
                access_token=res.session.access_token,
                user_id=res.user.id,
                email=res.user.email,
                username=username,
                message="Login successful"
            )
        raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest):
    supabase = get_supabase_client()
    if not supabase:
        return {"message": "Password reset instructions sent (Dev Mode)"}

    try:
        supabase.auth.reset_password_for_email(payload.email)
        return {"message": "Password reset instructions sent to your email."}
    except Exception as e:
        logger.error(f"Reset password error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        # Guest mode session
        return {
            "id": "guest",
            "username": "Guest Tactician",
            "is_guest": True,
            "elo_rating": 400
        }
    
    token = authorization.replace("Bearer ", "")
    supabase = get_supabase_client()
    if not supabase or token == "mock_dev_token_user_123":
        return {
            "id": "mock-user-123",
            "username": "PressureMaster",
            "email": "player@pressurechess.com",
            "is_guest": False,
            "elo_rating": 1250,
            "daily_streak": 3
        }

    try:
        user_res = supabase.auth.get_user(token)
        if user_res and user_res.user:
            return {
                "id": user_res.user.id,
                "email": user_res.user.email,
                "username": user_res.user.user_metadata.get("username", "Tactician"),
                "is_guest": False
            }
        raise HTTPException(status_code=401, detail="Invalid session")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Session validation failed: {e}")
