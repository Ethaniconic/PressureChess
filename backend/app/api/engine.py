from fastapi import APIRouter
from app.models.schemas import LegalMovesRequest, LegalMovesResponse
from app.services.chess_service import ChessService

router = APIRouter(prefix="/api/engine", tags=["Chess Engine"])

@router.post("/validate-fen", response_model=LegalMovesResponse)
def validate_fen(payload: LegalMovesRequest):
    result = ChessService.validate_fen(payload.fen)
    return LegalMovesResponse(**result)

@router.get("/stockfish-status")
def stockfish_status(fen: str = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"):
    return ChessService.get_stockfish_placeholder(fen)
