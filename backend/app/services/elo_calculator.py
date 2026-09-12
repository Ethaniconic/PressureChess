"""
PressureChess: Official FIDE Elo Rating Calculation Service.
Calculates expected scores and rating changes for Multiplayer matches.
"""

from typing import Dict, Any, Tuple
import math

DEFAULT_K_FACTOR = 32

class EloCalculator:
    @staticmethod
    def calculate_expected_score(player_rating: int, opponent_rating: int) -> float:
        """
        Calculates the expected score (win probability) for player against opponent.
        Formula: E = 1 / (1 + 10^((R_opp - R_player) / 400))
        """
        exponent = (opponent_rating - player_rating) / 400.0
        return 1.0 / (1.0 + math.pow(10, exponent))

    @staticmethod
    def calculate_rating_change(
        player_rating: int,
        opponent_rating: int,
        actual_score: float,
        k_factor: int = DEFAULT_K_FACTOR
    ) -> int:
        """
        Calculates the integer Elo rating change for a single game.
        Delta = round(K * (ActualScore - ExpectedScore))
        """
        expected = EloCalculator.calculate_expected_score(player_rating, opponent_rating)
        delta = round(k_factor * (actual_score - expected))
        return delta

    @staticmethod
    def calculate_match_ratings(
        white_rating: int,
        black_rating: int,
        result: str,
        k_factor: int = DEFAULT_K_FACTOR
    ) -> Dict[str, Any]:
        """
        Computes rating changes for both White and Black given a game outcome:
        - '1-0': White wins
        - '0-1': Black wins
        - '1/2-1/2': Draw
        """
        if result == '1-0':
            white_score, black_score = 1.0, 0.0
        elif result == '0-1':
            white_score, black_score = 0.0, 1.0
        elif result in ('1/2-1/2', 'draw'):
            white_score, black_score = 0.5, 0.5
        else:
            # Aborted game or no result
            return {
                "white_change": 0,
                "black_change": 0,
                "new_white_rating": white_rating,
                "new_black_rating": black_rating,
                "white_expected": 0.5,
                "black_expected": 0.5
            }

        white_expected = EloCalculator.calculate_expected_score(white_rating, black_rating)
        black_expected = EloCalculator.calculate_expected_score(black_rating, white_rating)

        white_change = round(k_factor * (white_score - white_expected))
        black_change = round(k_factor * (black_score - black_expected))

        new_white = max(100, white_rating + white_change)
        new_black = max(100, black_rating + black_change)

        return {
            "white_change": white_change,
            "black_change": black_change,
            "new_white_rating": new_white,
            "new_black_rating": new_black,
            "white_expected": round(white_expected, 3),
            "black_expected": round(black_expected, 3)
        }
