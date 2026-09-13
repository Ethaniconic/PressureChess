from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import random
import string
import uuid
import chess
import chess.pgn
import io
import logging

from app.models.schemas import (
    CreateRoomRequest,
    JoinRoomRequest,
    MatchmakingJoinRequest,
    MatchmakingLeaveRequest,
    SubmitMoveRequest,
    ResignRequest,
    DrawRequest
)
from app.services.elo_calculator import EloCalculator
from app.core.supabase import get_supabase_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/multiplayer", tags=["Online Multiplayer"])

# In-memory store fallback for offline/demo/dev mode
IN_MEMORY_GAMES: Dict[str, Dict[str, Any]] = {}
IN_MEMORY_QUEUE: List[Dict[str, Any]] = []

def parse_time_control(tc: str) -> tuple:
    """Parses time control like '3+0' or '5+3' into (initial_seconds, increment_seconds)"""
    try:
        parts = tc.split('+')
        mins = float(parts[0])
        inc = int(parts[1]) if len(parts) > 1 else 0
        return int(mins * 60), inc
    except Exception:
        return 180, 0

def generate_room_code() -> str:
    """Generates an intuitive 6-character room code like PR-8492"""
    letters = ''.join(random.choices(string.ascii_uppercase, k=2))
    digits = ''.join(random.choices(string.digits, k=4))
    return f"{letters}-{digits}"

@router.post("/room/create")
def create_private_room(payload: CreateRoomRequest):
    """Creates a new private game room with a shareable 6-character code."""
    init_secs, inc_secs = parse_time_control(payload.time_control)
    room_code = generate_room_code()
    game_id = str(uuid.uuid4())

    game_data = {
        "id": game_id,
        "room_code": room_code,
        "mode": payload.mode,
        "time_control": payload.time_control,
        "initial_time_seconds": init_secs,
        "increment_seconds": inc_secs,
        "white_player_id": payload.user_id,
        "black_player_id": None,
        "white_username": payload.username,
        "black_username": "Waiting for opponent...",
        "white_country": payload.country or "US",
        "black_country": "US",
        "white_rating": payload.rating or 400,
        "black_rating": 400,
        "white_time_remaining": float(init_secs),
        "black_time_remaining": float(init_secs),
        "current_turn": "white",
        "fen": chess.STARTING_FEN,
        "pgn": "",
        "moves": [],
        "status": "waiting",
        "draw_offered_by": None,
        "result": None,
        "winner_id": None,
        "termination_reason": None,
        "white_rating_change": 0,
        "black_rating_change": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    # Store in memory
    IN_MEMORY_GAMES[game_id] = game_data

    # Persist to Supabase if connected
    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("multiplayer_games").insert(game_data).execute()
        except Exception as e:
            logger.warning(f"Could not persist game to Supabase: {e}")

    return {
        "success": True,
        "game_id": game_id,
        "room_code": room_code,
        "player_color": "white",
        "game": game_data
    }

@router.post("/room/join")
def join_private_room(payload: JoinRoomRequest):
    """Joins an existing room via 6-character room code."""
    code = payload.room_code.strip().upper()
    game = None

    # Search in memory
    for g in IN_MEMORY_GAMES.values():
        if g.get("room_code", "").upper() == code:
            game = g
            break

    # Search in Supabase if not found in memory
    supabase = get_supabase_client()
    if not game and supabase:
        try:
            res = supabase.table("multiplayer_games").select("*").eq("room_code", code).execute()
            if res.data and len(res.data) > 0:
                game = res.data[0]
                IN_MEMORY_GAMES[game["id"]] = game
        except Exception as e:
            logger.warning(f"Supabase room search failed: {e}")

    if not game:
        raise HTTPException(status_code=404, detail="Room code not found. Please check the code.")

    if game["status"] != "waiting" and game["black_player_id"] and game["black_player_id"] != payload.user_id:
        raise HTTPException(status_code=400, detail="Room is already full.")

    # Assign Black player
    game["black_player_id"] = payload.user_id
    game["black_username"] = payload.username
    game["black_country"] = payload.country or "US"
    game["black_rating"] = payload.rating or 400
    game["status"] = "active"
    game["started_at"] = datetime.now(timezone.utc).isoformat()

    IN_MEMORY_GAMES[game["id"]] = game

    if supabase:
        try:
            supabase.table("multiplayer_games").update({
                "black_player_id": game["black_player_id"],
                "black_username": game["black_username"],
                "black_country": game["black_country"],
                "black_rating": game["black_rating"],
                "status": "active",
                "started_at": game["started_at"]
            }).eq("id", game["id"]).execute()
        except Exception as e:
            logger.warning(f"Supabase room join update failed: {e}")

    return {
        "success": True,
        "game_id": game["id"],
        "room_code": game["room_code"],
        "player_color": "black",
        "game": game
    }

@router.post("/queue/join")
def join_matchmaking_queue(payload: MatchmakingJoinRequest):
    """
    Matchmaking: Pairs players seeking the same mode/time control within reasonable rating range.
    """
    global IN_MEMORY_QUEUE

    # Check for waiting opponent in queue
    matched_entry = None
    for idx, entry in enumerate(IN_MEMORY_QUEUE):
        if (
            entry["user_id"] != payload.user_id
            and entry["mode"] == payload.mode
            and entry["time_control"] == payload.time_control
            and abs(entry["rating"] - payload.rating) <= 400
        ):
            matched_entry = IN_MEMORY_QUEUE.pop(idx)
            break

    if matched_entry:
        # Match found! Create active match
        init_secs, inc_secs = parse_time_control(payload.time_control)
        game_id = str(uuid.uuid4())
        room_code = generate_room_code()

        # Randomize colors
        colors = ["white", "black"]
        random.shuffle(colors)
        p1_color, p2_color = colors[0], colors[1]

        white_player = payload if p1_color == "white" else matched_entry
        black_player = matched_entry if p1_color == "white" else payload

        game_data = {
            "id": game_id,
            "room_code": room_code,
            "mode": payload.mode,
            "time_control": payload.time_control,
            "initial_time_seconds": init_secs,
            "increment_seconds": inc_secs,
            "white_player_id": white_player["user_id"] if isinstance(white_player, dict) else white_player.user_id,
            "black_player_id": black_player["user_id"] if isinstance(black_player, dict) else black_player.user_id,
            "white_username": white_player["username"] if isinstance(white_player, dict) else white_player.username,
            "black_username": black_player["username"] if isinstance(black_player, dict) else black_player.username,
            "white_country": white_player.get("country", "US") if isinstance(white_player, dict) else getattr(white_player, "country", "US"),
            "black_country": black_player.get("country", "US") if isinstance(black_player, dict) else getattr(black_player, "country", "US"),
            "white_rating": white_player.get("rating", 400) if isinstance(white_player, dict) else getattr(white_player, "rating", 400),
            "black_rating": black_player.get("rating", 400) if isinstance(black_player, dict) else getattr(black_player, "rating", 400),
            "white_time_remaining": float(init_secs),
            "black_time_remaining": float(init_secs),
            "current_turn": "white",
            "fen": chess.STARTING_FEN,
            "pgn": "",
            "moves": [],
            "status": "active",
            "draw_offered_by": None,
            "result": None,
            "winner_id": None,
            "termination_reason": None,
            "white_rating_change": 0,
            "black_rating_change": 0,
            "started_at": datetime.now(timezone.utc).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        IN_MEMORY_GAMES[game_id] = game_data

        supabase = get_supabase_client()
        if supabase:
            try:
                supabase.table("multiplayer_games").insert(game_data).execute()
            except Exception as e:
                logger.warning(f"Failed to insert matched game in Supabase: {e}")

        return {
            "status": "matched",
            "game_id": game_id,
            "player_color": p1_color,
            "game": game_data
        }

    # No immediate match found: add to queue
    # Clean previous entries for this user
    IN_MEMORY_QUEUE = [e for e in IN_MEMORY_QUEUE if e["user_id"] != payload.user_id]
    IN_MEMORY_QUEUE.append(payload.dict())

    return {
        "status": "searching",
        "message": "Searching for an opponent with similar rating..."
    }

@router.post("/queue/leave")
def leave_matchmaking_queue(payload: MatchmakingLeaveRequest):
    """Cancels search in matchmaking queue."""
    global IN_MEMORY_QUEUE
    IN_MEMORY_QUEUE = [e for e in IN_MEMORY_QUEUE if e["user_id"] != payload.user_id]
    return {"success": True, "message": "Left matchmaking queue"}

@router.post("/game/{game_id}/move")
def submit_player_move(game_id: str, payload: SubmitMoveRequest):
    """
    Submits a move in an active game, verifies legal move with python-chess,
    switches turn, checks game over conditions, and updates clocks.
    """
    game = IN_MEMORY_GAMES.get(game_id)
    supabase = get_supabase_client()

    if not game and supabase:
        try:
            res = supabase.table("multiplayer_games").select("*").eq("id", game_id).execute()
            if res.data:
                game = res.data[0]
                IN_MEMORY_GAMES[game_id] = game
        except Exception as e:
            logger.warning(f"Error fetching game from Supabase: {e}")

    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    if game["status"] != "active":
        raise HTTPException(status_code=400, detail=f"Game is not active (current status: {game['status']})")

    # Verify whose turn it is
    expected_player_id = game["white_player_id"] if game["current_turn"] == "white" else game["black_player_id"]
    if payload.player_id and payload.player_id != expected_player_id and payload.player_id != "guest":
        raise HTTPException(status_code=403, detail="Not your turn")

    # Validate move using python-chess
    board = chess.Board(game["fen"])
    from_sq = chess.parse_square(payload.from_sq)
    to_sq = chess.parse_square(payload.to_sq)

    promo_piece = None
    if payload.promotion:
        promo_map = {'q': chess.QUEEN, 'r': chess.ROOK, 'b': chess.BISHOP, 'n': chess.KNIGHT}
        promo_piece = promo_map.get(payload.promotion.lower(), chess.QUEEN)

    move = chess.Move(from_sq, to_sq, promotion=promo_piece)

    # Check legality
    if move not in board.legal_moves:
        # Fallback check without promotion
        simple_move = chess.Move(from_sq, to_sq)
        if simple_move in board.legal_moves:
            move = simple_move
        else:
            raise HTTPException(status_code=400, detail=f"Illegal move: {payload.from_sq}->{payload.to_sq}")

    # Generate SAN before pushing
    move_san = board.san(move)
    is_capture = board.is_capture(move)
    captured_piece = board.piece_at(to_sq).symbol() if board.piece_at(to_sq) else None

    # Execute move
    board.push(move)

    # Update clocks
    if game["current_turn"] == "white":
        game["white_time_remaining"] = max(0.0, payload.time_remaining + game["increment_seconds"])
    else:
        game["black_time_remaining"] = max(0.0, payload.time_remaining + game["increment_seconds"])

    # Switch turn
    next_turn = "black" if game["current_turn"] == "white" else "white"
    game["current_turn"] = next_turn
    game["fen"] = board.fen()
    game["last_move_timestamp"] = datetime.now(timezone.utc).isoformat()

    # Append to moves array
    move_entry = {
        "from": payload.from_sq,
        "to": payload.to_sq,
        "san": move_san,
        "uci": move.uci(),
        "turn": "white" if next_turn == "black" else "black",
        "captured": captured_piece,
        "white_time": game["white_time_remaining"],
        "black_time": game["black_time_remaining"],
        "timestamp": game["last_move_timestamp"]
    }
    game["moves"].append(move_entry)

    # Check game over conditions
    if board.is_checkmate():
        winner = "white" if next_turn == "black" else "black"
        result = "1-0" if winner == "white" else "0-1"
        game["status"] = "completed"
        game["result"] = result
        game["termination_reason"] = "checkmate"
        game["winner_id"] = game["white_player_id"] if winner == "white" else game["black_player_id"]
        game["ended_at"] = datetime.now(timezone.utc).isoformat()

        # Calculate Elo rating updates
        ratings = EloCalculator.calculate_match_ratings(
            game["white_rating"],
            game["black_rating"],
            result
        )
        game["white_rating_change"] = ratings["white_change"]
        game["black_rating_change"] = ratings["black_change"]

    elif board.is_stalemate() or board.is_insufficient_material() or board.is_fifty_moves():
        game["status"] = "completed"
        game["result"] = "1/2-1/2"
        game["termination_reason"] = "stalemate" if board.is_stalemate() else "insufficient_material"
        game["ended_at"] = datetime.now(timezone.utc).isoformat()

        ratings = EloCalculator.calculate_match_ratings(
            game["white_rating"],
            game["black_rating"],
            "1/2-1/2"
        )
        game["white_rating_change"] = ratings["white_change"]
        game["black_rating_change"] = ratings["black_change"]

    IN_MEMORY_GAMES[game_id] = game

    if supabase:
        try:
            supabase.table("multiplayer_games").update({
                "fen": game["fen"],
                "current_turn": game["current_turn"],
                "moves": game["moves"],
                "white_time_remaining": game["white_time_remaining"],
                "black_time_remaining": game["black_time_remaining"],
                "last_move_timestamp": game["last_move_timestamp"],
                "status": game["status"],
                "result": game.get("result"),
                "termination_reason": game.get("termination_reason"),
                "winner_id": game.get("winner_id"),
                "ended_at": game.get("ended_at"),
                "white_rating_change": game.get("white_rating_change", 0),
                "black_rating_change": game.get("black_rating_change", 0)
            }).eq("id", game_id).execute()
        except Exception as e:
            logger.warning(f"Error updating game in Supabase: {e}")

    return {"success": True, "game": game, "move": move_entry}

@router.post("/game/{game_id}/resign")
def resign_game(game_id: str, payload: ResignRequest):
    """Handles resignation of a player and calculates final Elo adjustments."""
    game = IN_MEMORY_GAMES.get(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    if game["status"] != "active":
        raise HTTPException(status_code=400, detail="Game is not active")

    is_white = payload.player_id == game["white_player_id"]
    winner = "black" if is_white else "white"
    result = "0-1" if is_white else "1-0"

    game["status"] = "completed"
    game["result"] = result
    game["termination_reason"] = "resignation"
    game["winner_id"] = game["black_player_id"] if is_white else game["white_player_id"]
    game["ended_at"] = datetime.now(timezone.utc).isoformat()

    ratings = EloCalculator.calculate_match_ratings(
        game["white_rating"],
        game["black_rating"],
        result
    )
    game["white_rating_change"] = ratings["white_change"]
    game["black_rating_change"] = ratings["black_change"]

    IN_MEMORY_GAMES[game_id] = game

    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("multiplayer_games").update({
                "status": "completed",
                "result": result,
                "termination_reason": "resignation",
                "winner_id": game["winner_id"],
                "ended_at": game["ended_at"],
                "white_rating_change": ratings["white_change"],
                "black_rating_change": ratings["black_change"]
            }).eq("id", game_id).execute()
        except Exception as e:
            logger.warning(f"Supabase update on resign failed: {e}")

    return {"success": True, "game": game}

@router.post("/game/{game_id}/draw")
def handle_draw(game_id: str, payload: DrawRequest):
    """Handles draw offers, acceptance, or declination."""
    game = IN_MEMORY_GAMES.get(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    if game["status"] != "active":
        raise HTTPException(status_code=400, detail="Game is not active")

    action = payload.action.lower()
    is_white = payload.player_id == game["white_player_id"]

    if action == "offer":
        game["draw_offered_by"] = "white" if is_white else "black"
    elif action == "decline":
        game["draw_offered_by"] = None
    elif action == "accept":
        game["status"] = "completed"
        game["result"] = "1/2-1/2"
        game["termination_reason"] = "draw_agreement"
        game["ended_at"] = datetime.now(timezone.utc).isoformat()

        ratings = EloCalculator.calculate_match_ratings(
            game["white_rating"],
            game["black_rating"],
            "1/2-1/2"
        )
        game["white_rating_change"] = ratings["white_change"]
        game["black_rating_change"] = ratings["black_change"]
        game["draw_offered_by"] = None

    IN_MEMORY_GAMES[game_id] = game
    return {"success": True, "game": game}

@router.get("/game/{game_id}")
def get_game_state(game_id: str):
    """Fetches real-time game state."""
    game = IN_MEMORY_GAMES.get(game_id)
    if not game:
        supabase = get_supabase_client()
        if supabase:
            try:
                res = supabase.table("multiplayer_games").select("*").eq("id", game_id).execute()
                if res.data:
                    game = res.data[0]
                    IN_MEMORY_GAMES[game_id] = game
            except Exception as e:
                logger.warning(f"Supabase game fetch failed: {e}")

    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    return game

@router.get("/leaderboard")
def get_leaderboards(
    timeframe: str = Query("global", regex="^(daily|weekly|global|friends)$"),
    mode: str = Query("all", regex="^(all|bullet|blitz|rapid|classical)$")
):
    """
    Returns ranked leaderboard of players filtered by timeframe and mode.
    """
    supabase = get_supabase_client()
    if supabase:
        try:
            rating_col = "elo_rating"
            if mode in ("bullet", "blitz", "rapid", "classical"):
                rating_col = f"{mode}_rating"

            res = supabase.table("profiles").select(
                "id, username, full_name, avatar_url, country, elo_rating, bullet_rating, blitz_rating, rapid_rating, classical_rating, wins, losses, draws, daily_streak"
            ).order(rating_col, desc=True).limit(50).execute()

            if res.data is not None and len(res.data) > 0:
                leaderboard = []
                for idx, p in enumerate(res.data):
                    wins = p.get("wins") or 0
                    losses = p.get("losses") or 0
                    draws = p.get("draws") or 0
                    total = wins + losses + draws
                    win_rate = round((wins / max(1, total)) * 100, 1) if total > 0 else 0.0
                    rating_val = p.get(rating_col) or p.get("elo_rating") or 400
                    leaderboard.append({
                        "rank": idx + 1,
                        "id": p.get("id"),
                        "username": p.get("username") or p.get("full_name") or f"Tactician_{str(p.get('id', ''))[:4]}",
                        "country": p.get("country") or "US",
                        "avatar": p.get("avatar_url") or "♟️",
                        "rating": rating_val,
                        "wins": wins,
                        "losses": losses,
                        "draws": draws,
                        "win_rate": win_rate,
                        "streak": p.get("daily_streak") or 1
                    })
                return {
                    "timeframe": timeframe,
                    "mode": mode,
                    "total_players": len(leaderboard),
                    "leaderboard": leaderboard
                }
        except Exception as e:
            logger.warning(f"Error querying live Supabase leaderboard: {e}")

    return {
        "timeframe": timeframe,
        "mode": mode,
        "total_players": 0,
        "leaderboard": []
    }

@router.get("/profile/{user_id}")
def get_multiplayer_profile(user_id: str):
    """
    Returns full multiplayer statistics: ratings by mode (Bullet, Blitz, Rapid, Classical),
    wins, losses, draws, win rates, country, and recent matches from Supabase.
    """
    supabase = get_supabase_client()
    profile = None
    recent_matches = []
    if supabase and user_id != "guest":
        try:
            res = supabase.table("profiles").select("*").eq("id", user_id).execute()
            if res.data:
                profile = res.data[0]
            
            # Fetch recent games
            games_res = supabase.table("games").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(10).execute()
            if games_res.data:
                for g in games_res.data:
                    recent_matches.append({
                        "id": g.get("id"),
                        "mode": g.get("time_control", "blitz"),
                        "time_control": g.get("time_control", "3+0"),
                        "opponent": g.get("opponent_name", "Opponent"),
                        "opponent_rating": 400,
                        "opponent_country": "US",
                        "result": g.get("result", "*"),
                        "rating_delta": 0,
                        "date": str(g.get("created_at", ""))[:10]
                    })
        except Exception as e:
            logger.warning(f"Error fetching profile: {e}")

    country = profile.get("country", "US") if profile else "US"
    overall_elo = profile.get("elo_rating", 400) if profile else 400
    wins = profile.get("wins", 0) if profile else 0
    losses = profile.get("losses", 0) if profile else 0
    draws = profile.get("draws", 0) if profile else 0
    total_games = wins + losses + draws
    win_rate_pct = round((wins / max(1, total_games)) * 100, 1) if total_games > 0 else 0.0

    return {
        "user_id": user_id,
        "username": profile.get("username", "Guest Player") if profile else "Guest Player",
        "avatar_url": profile.get("avatar_url", "") if profile else "",
        "country": country,
        "ratings": {
            "bullet": profile.get("bullet_rating", overall_elo) if profile else 400,
            "blitz": profile.get("blitz_rating", overall_elo) if profile else 400,
            "rapid": profile.get("rapid_rating", overall_elo) if profile else 400,
            "classical": profile.get("classical_rating", overall_elo) if profile else 400,
            "overall": overall_elo
        },
        "stats": {
            "wins": wins,
            "losses": losses,
            "draws": draws,
            "total_games": total_games,
            "win_rate_pct": win_rate_pct
        },
        "recent_matches": recent_matches
    }
