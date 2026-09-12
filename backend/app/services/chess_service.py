import chess
import chess.pgn
import io
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class ChessService:
    @staticmethod
    def validate_fen(fen: str) -> Dict[str, Any]:
        """Validates a FEN string and returns current board status."""
        try:
            board = chess.Board(fen)
            legal_moves = [move.uci() for move in board.legal_moves]
            return {
                "is_valid_fen": True,
                "is_check": board.is_check(),
                "is_checkmate": board.is_checkmate(),
                "is_stalemate": board.is_stalemate(),
                "is_game_over": board.is_game_over(),
                "turn": "w" if board.turn == chess.WHITE else "b",
                "legal_moves": legal_moves
            }
        except Exception as e:
            logger.error(f"Error validating FEN: {e}")
            return {
                "is_valid_fen": False,
                "is_check": False,
                "is_checkmate": False,
                "is_stalemate": False,
                "is_game_over": False,
                "turn": "w",
                "legal_moves": []
            }

    @staticmethod
    def parse_pgn(pgn_str: str) -> Dict[str, Any]:
        """Parses a PGN string and extracts headers and move list."""
        try:
            pgn_io = io.StringIO(pgn_str)
            game = chess.pgn.read_game(pgn_io)
            if not game:
                return {"error": "Invalid PGN"}
            
            moves = [move.uci() for move in game.mainline_moves()]
            return {
                "headers": dict(game.headers),
                "moves": moves,
                "move_count": len(moves)
            }
        except Exception as e:
            logger.error(f"Error parsing PGN: {e}")
            return {"error": str(e)}

    @staticmethod
    def get_stockfish_placeholder(fen: str) -> Dict[str, Any]:
        """
        Stockfish integration readiness placeholder.
        Can be hooked directly to python-chess engine subprocess in future analysis phase.
        """
        board = chess.Board(fen)
        # Returns basic evaluation indicator ready for Stockfish depth
        return {
            "status": "ready",
            "fen": fen,
            "turn": "white" if board.turn == chess.WHITE else "black",
            "pieces_count": len(board.piece_map()),
            "message": "Stockfish engine hook ready for Phase 1 analysis integration"
        }
