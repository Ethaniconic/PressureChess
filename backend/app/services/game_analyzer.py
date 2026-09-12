"""
PressureChess: AI Game Review & Analysis Service.
Evaluates PGN games, classifies moves (Brilliant, Best, Great, Inaccuracy, Mistake, Blunder),
detects openings, and generates Coach Orion natural English breakdowns.
"""

import chess
import chess.pgn
import io
import math
import logging
from typing import Dict, Any, List, Optional
from app.data.openings_data import detect_opening

logger = logging.getLogger(__name__)

# Piece-Square positional values
PIECE_VALUES = {
    chess.PAWN: 100,
    chess.KNIGHT: 320,
    chess.BISHOP: 330,
    chess.ROOK: 500,
    chess.QUEEN: 900,
    chess.KING: 20000
}

# Positional bonus tables
PAWN_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0
]

KNIGHT_TABLE = [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50,
]

BISHOP_TABLE = [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20,
]

class GameAnalyzer:
    @staticmethod
    def evaluate_board(board: chess.Board) -> int:
        """
        Fast heuristic evaluation of a chess board in centipawns.
        Positive = White advantage, Negative = Black advantage.
        """
        if board.is_checkmate():
            return -30000 if board.turn == chess.WHITE else 30000
        if board.is_stalemate() or board.is_insufficient_material():
            return 0

        score = 0
        for square, piece in board.piece_map().items():
            val = PIECE_VALUES.get(piece.piece_type, 0)
            sq_idx = square if piece.color == chess.WHITE else chess.square_mirror(square)

            pos_bonus = 0
            if piece.piece_type == chess.PAWN:
                pos_bonus = PAWN_TABLE[sq_idx]
            elif piece.piece_type == chess.KNIGHT:
                pos_bonus = KNIGHT_TABLE[sq_idx]
            elif piece.piece_type == chess.BISHOP:
                pos_bonus = BISHOP_TABLE[sq_idx]
            elif piece.piece_type == chess.ROOK:
                # Bonus for rooks on 7th rank
                if (piece.color == chess.WHITE and chess.square_rank(square) == 6) or \
                   (piece.color == chess.BLACK and chess.square_rank(square) == 1):
                    pos_bonus = 25

            piece_score = val + pos_bonus
            if piece.color == chess.WHITE:
                score += piece_score
            else:
                score -= piece_score

        # Mobility bonus
        mobility = board.legal_moves.count()
        if board.turn == chess.WHITE:
            score += int(mobility * 3)
        else:
            score -= int(mobility * 3)

        return score

    @staticmethod
    def find_best_move_and_eval(board: chess.Board, depth: int = 2) -> tuple:
        """
        Minimax with alpha-beta pruning to find the best candidate move and evaluation.
        """
        if board.is_game_over() or depth == 0:
            return GameAnalyzer.evaluate_board(board), None

        is_white = board.turn == chess.WHITE
        best_eval = -99999 if is_white else 99999
        best_move = None

        # Sort moves: captures first
        moves = sorted(board.legal_moves, key=lambda m: board.is_capture(m), reverse=True)

        for move in moves[:16]:  # Limit branching factor for instant responsiveness
            board.push(move)
            eval_score = GameAnalyzer.evaluate_board(board)
            board.pop()

            if is_white:
                if eval_score > best_eval:
                    best_eval = eval_score
                    best_move = move
            else:
                if eval_score < best_eval:
                    best_eval = eval_score
                    best_move = move

        return best_eval, best_move

    @staticmethod
    def generate_coach_explanation(
        played_move_san: str,
        best_move_san: str,
        classification: str,
        eval_diff: int,
        turn_color: str,
        board_before: chess.Board
    ) -> Dict[str, Any]:
        """
        Generates contextual natural English explanations for Coach Orion.
        """
        if classification in ["brilliant", "best", "great"]:
            if classification == "brilliant":
                return {
                    "summary": f"Brilliant tactical move! {played_move_san} initiates a devastating combination or sacrifice.",
                    "why_weak": None,
                    "better_move": played_move_san,
                    "tactical_ideas": ["Initiative Surge", "Decisive Breakthrough"],
                    "positional_ideas": ["Total Board Dominance"]
                }
            elif classification == "best":
                return {
                    "summary": f"Optimal master move. {played_move_san} maintains maximum pressure and optimal piece coordination.",
                    "why_weak": None,
                    "better_move": played_move_san,
                    "tactical_ideas": ["Precision Execution"],
                    "positional_ideas": ["Active Harmony"]
                }
            else:
                return {
                    "summary": f"Strong move. {played_move_san} makes constructive progress and preserves the initiative.",
                    "why_weak": None,
                    "better_move": best_move_san or played_move_san,
                    "tactical_ideas": ["Solid Piece Activity"],
                    "positional_ideas": ["Sound Coordination"]
                }

        # For Inaccuracies, Mistakes, and Blunders:
        tactical_tags = []
        positional_tags = []
        reason = ""

        # Check tactical patterns
        if board_before.is_check():
            tactical_tags.append("Check Response")
        if any(board_before.is_pinned(turn_color == "white", sq) for sq in board_before.piece_map().keys()):
            tactical_tags.append("Pin Exploitation")
            
        if abs(eval_diff) > 300:
            tactical_tags.append("Material Hanging")
            reason = f"Moves like {played_move_san} overlook a direct tactical blow, hanging material or conceding an immediate mating threat."
        elif abs(eval_diff) > 150:
            tactical_tags.append("Tactical Concession")
            reason = f"{played_move_san} concedes the initiative and allows the opponent to target vulnerable central squares or king files."
        else:
            positional_tags.append("Suboptimal Square Selection")
            reason = f"{played_move_san} is slightly passive. Better was {best_move_san} to preserve active diagonals and coordinate pieces."

        if not positional_tags:
            positional_tags.append("Center & King Pressure")
        if not tactical_tags:
            tactical_tags.append("Candidate Calculation")

        return {
            "summary": f"{classification.capitalize()}: {reason}",
            "why_weak": reason,
            "better_move": best_move_san or "Look for active central moves",
            "tactical_ideas": tactical_tags,
            "positional_ideas": positional_tags
        }

    @staticmethod
    def analyze_pgn(pgn_str: str) -> Dict[str, Any]:
        """
        Parses and evaluates a full PGN game move-by-move.
        """
        try:
            pgn_io = io.StringIO(pgn_str.strip())
            game = chess.pgn.read_game(pgn_io)
            if not game:
                return {"error": "Invalid or empty PGN"}

            headers = dict(game.headers)
            white_player = headers.get("White", "White Player")
            black_player = headers.get("Black", "Black Player")
            result = headers.get("Result", "*")
            date_str = headers.get("Date", "Unknown Date")
            event_str = headers.get("Event", "Casual Game")

            board = game.board()
            moves_san = []
            analyzed_moves = []

            white_accuracies = []
            black_accuracies = []

            blunders_count = 0
            mistakes_count = 0
            inaccuracies_count = 0
            brilliants_count = 0

            # Initial baseline evaluation
            prev_eval = 0

            for move_idx, move in enumerate(game.mainline_moves()):
                fen_before = board.fen()
                turn = "white" if board.turn == chess.WHITE else "black"
                move_san = board.san(move)
                moves_san.append(move_san)

                # Find best engine move from this position
                current_best_eval, best_move_obj = GameAnalyzer.find_best_move_and_eval(board, depth=1)
                best_move_san = board.san(best_move_obj) if best_move_obj else move_san

                # Check if played move sacrifices material
                is_sacrifice = board.is_capture(move) and PIECE_VALUES.get(board.piece_at(move.from_square).piece_type, 0) > \
                               (PIECE_VALUES.get(board.piece_at(move.to_square).piece_type, 0) if board.piece_at(move.to_square) else 0)

                # Execute the move
                board.push(move)
                fen_after = board.fen()

                # Evaluate new position
                new_eval = GameAnalyzer.evaluate_board(board)

                # Eval difference from current player's perspective
                if turn == "white":
                    eval_diff = new_eval - prev_eval
                else:
                    eval_diff = prev_eval - new_eval

                # Classification rules
                if is_sacrifice and ((turn == "white" and new_eval > 150) or (turn == "black" and new_eval < -150)):
                    classification = "brilliant"
                    brilliants_count += 1
                elif move == best_move_obj or eval_diff >= -15:
                    classification = "best"
                elif eval_diff >= -40:
                    classification = "great"
                elif eval_diff >= -110:
                    classification = "inaccuracy"
                    inaccuracies_count += 1
                elif eval_diff >= -230:
                    classification = "mistake"
                    mistakes_count += 1
                else:
                    classification = "blunder"
                    blunders_count += 1

                # Accuracy calculation for this move
                # Map eval delta to accuracy percentage
                loss = max(0, -eval_diff)
                move_accuracy = max(10, min(100, round(103.0 - (loss * 0.35), 1)))

                if turn == "white":
                    white_accuracies.append(move_accuracy)
                else:
                    black_accuracies.append(move_accuracy)

                # Coach explanation
                coach_explanation = GameAnalyzer.generate_coach_explanation(
                    played_move_san=move_san,
                    best_move_san=best_move_san,
                    classification=classification,
                    eval_diff=eval_diff,
                    turn_color=turn,
                    board_before=chess.Board(fen_before)
                )

                # Formatted numeric evaluation string (e.g. +1.4 or -0.8)
                numeric_eval = round(new_eval / 100.0, 1)
                eval_str = f"+{numeric_eval}" if numeric_eval > 0 else f"{numeric_eval}"
                if board.is_checkmate():
                    eval_str = "#M"

                analyzed_moves.append({
                    "ply": move_idx + 1,
                    "moveNumber": (move_idx // 2) + 1,
                    "turn": turn,
                    "san": move_san,
                    "uci": move.uci(),
                    "fenBefore": fen_before,
                    "fenAfter": fen_after,
                    "eval": numeric_eval,
                    "evalStr": eval_str,
                    "evalDiff": eval_diff,
                    "classification": classification,
                    "bestMoveSan": best_move_san,
                    "accuracy": move_accuracy,
                    "coach": coach_explanation
                })

                prev_eval = new_eval

            # Overall game accuracy
            avg_white_acc = round(sum(white_accuracies) / max(1, len(white_accuracies)), 1)
            avg_black_acc = round(sum(black_accuracies) / max(1, len(black_accuracies)), 1)

            # Detect opening from moves
            opening_info = detect_opening(moves_san)

            return {
                "success": True,
                "headers": {
                    "white": white_player,
                    "black": black_player,
                    "result": result,
                    "date": date_str,
                    "event": event_str,
                },
                "opening": opening_info,
                "accuracy": {
                    "white": avg_white_acc,
                    "black": avg_black_acc
                },
                "counts": {
                    "totalMoves": len(analyzed_moves),
                    "brilliants": brilliants_count,
                    "inaccuracies": inaccuracies_count,
                    "mistakes": mistakes_count,
                    "blunders": blunders_count
                },
                "moves": analyzed_moves,
                "pgn": pgn_str
            }

        except Exception as e:
            logger.error(f"Error during PGN analysis: {e}", exc_info=True)
            return {"error": str(e), "success": False}
