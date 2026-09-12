"""
PressureChess: ECO Opening Recognition Database & Curated Sample Games
"""

OPENINGS_DB = [
    # Sicilian Defense
    {
        "eco": "B90",
        "name": "Sicilian Defense: Najdorf Variation",
        "moves": ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"],
        "winrates": {"white": 34, "draw": 36, "black": 30},
        "description": "The sharpest, most popular response to 1. e4, favored by Fischer and Kasparov."
    },
    {
        "eco": "B33",
        "name": "Sicilian Defense: Sveshnikov Variation",
        "moves": ["e4", "c5", "Nf3", "Nc6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "e5"],
        "winrates": {"white": 32, "draw": 40, "black": 28},
        "description": "Dynamic pawn counter-punch accepting a backward d6 pawn for aggressive active piece play."
    },
    {
        "eco": "B20",
        "name": "Sicilian Defense",
        "moves": ["e4", "c5"],
        "winrates": {"white": 37, "draw": 33, "black": 30},
        "description": "Asymmetrical, combative opening striving for queenside counterplay and central imbalance."
    },

    # Ruy Lopez
    {
        "eco": "C65",
        "name": "Ruy Lopez: Berlin Defense",
        "moves": ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6"],
        "winrates": {"white": 33, "draw": 48, "black": 19},
        "description": "The famous 'Berlin Wall', renowned for its impenetrable endgame fortress."
    },
    {
        "eco": "C60",
        "name": "Ruy Lopez (Spanish Opening)",
        "moves": ["e4", "e5", "Nf3", "Nc6", "Bb5"],
        "winrates": {"white": 40, "draw": 34, "black": 26},
        "description": "One of the oldest, deepest classical openings applying enduring pressure to the e5 defender."
    },

    # Italian Game
    {
        "eco": "C50",
        "name": "Italian Game: Giuoco Piano",
        "moves": ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5"],
        "winrates": {"white": 38, "draw": 36, "black": 26},
        "description": "Classic rapid development targeting the f7 weakness and building central pawn tension."
    },
    {
        "eco": "C55",
        "name": "Italian Game: Two Knights Defense",
        "moves": ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6"],
        "winrates": {"white": 39, "draw": 31, "black": 30},
        "description": "A sharp counter-attack by Black immediately challenging White's e4 pawn."
    },

    # French & Caro-Kann
    {
        "eco": "C00",
        "name": "French Defense",
        "moves": ["e4", "e6"],
        "winrates": {"white": 41, "draw": 31, "black": 28},
        "description": "Solid hypermodern defense establishing a rock-solid pawn chain on d5 and e6."
    },
    {
        "eco": "B10",
        "name": "Caro-Kann Defense",
        "moves": ["e4", "c6"],
        "winrates": {"white": 38, "draw": 36, "black": 26},
        "description": "High-durability positional structure preparing d5 without trapping the c8 light-squared bishop."
    },

    # 1. d4 Openings
    {
        "eco": "D30",
        "name": "Queen's Gambit Declined",
        "moves": ["d4", "d5", "c4", "e6"],
        "winrates": {"white": 39, "draw": 38, "black": 23},
        "description": "Timeless classical fortress safeguarding the d5 stronghold against White's wing pawn sacrifice."
    },
    {
        "eco": "D20",
        "name": "Queen's Gambit Accepted",
        "moves": ["d4", "d5", "c4", "dxc4"],
        "winrates": {"white": 42, "draw": 33, "black": 25},
        "description": "Surrendering the center temporarily to generate rapid open-file piece activity."
    },
    {
        "eco": "E60",
        "name": "King's Indian Defense",
        "moves": ["d4", "Nf6", "c4", "g6"],
        "winrates": {"white": 42, "draw": 30, "black": 28},
        "description": "Aggressive, high-stakes defense allowing White a big center before launching a savage kingside onslaught."
    },
    {
        "eco": "A45",
        "name": "Queen's Pawn Game",
        "moves": ["d4", "d5"],
        "winrates": {"white": 39, "draw": 35, "black": 26},
        "description": "Classical central confrontation."
    }
]

SAMPLE_PGN_GAMES = [
    {
        "id": "sample-opera-1858",
        "title": "Morphy's Immortal Opera Game (1858)",
        "event": "Paris Opera",
        "white": "Paul Morphy",
        "black": "Duke of Brunswick & Count Isouard",
        "date": "1858.10.21",
        "result": "1-0",
        "eco": "C41",
        "opening": "Philidor Defense",
        "pgn": """[Event "Paris Opera"]
[Site "Paris"]
[Date "1858.10.21"]
[Round "1"]
[White "Paul Morphy"]
[Black "Duke of Brunswick and Count Isouard"]
[Result "1-0"]
[ECO "C41"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0"""
    },
    {
        "id": "sample-kasparov-topalov-1999",
        "title": "Kasparov's Pearl of Wijk aan Zee (1999)",
        "event": "Hoogovens Wijk aan Zee",
        "white": "Garry Kasparov",
        "black": "Veselin Topalov",
        "date": "1999.01.20",
        "result": "1-0",
        "eco": "B07",
        "opening": "Pirc Defense",
        "pgn": """[Event "Hoogovens Group A"]
[Site "Wijk aan Zee NED"]
[Date "1999.01.20"]
[Round "4"]
[White "Garry Kasparov"]
[Black "Veselin Topalov"]
[Result "1-0"]
[ECO "B07"]

1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8 Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0"""
    },
    {
        "id": "sample-blunder-clinic",
        "title": "Tactical Blunder Clinic (Instructive Game)",
        "event": "Rated Rapid Match",
        "white": "Tactical Learner",
        "black": "Opponent",
        "date": "2026.03.15",
        "result": "1-0",
        "eco": "C50",
        "opening": "Italian Game: Giuoco Piano",
        "pgn": """[Event "Rated Rapid Match"]
[Site "PressureChess"]
[Date "2026.03.15"]
[White "Tactical Learner"]
[Black "Opponent"]
[Result "1-0"]
[ECO "C50"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. d3 Nf6 5. Nc3 d6 6. Bg5 h6 7. Bh4 g5 8. Bg3 Bg4 9. h3 Bh5 10. Nd5 Nd4 11. c3 Nxf3+ 12. gxf3 c6 13. Ne3 Qb6 14. Qe2 O-O-O 15. O-O-O d5 16. exd5 cxd5 17. Bb3 Rhe8 18. Ng4 e4 19. dxe4 dxe4 20. Rxd8+ Kxd8 21. Rd1+ Kc8 22. Nxf6 Qxf6 23. Qc4 b6 24. Qa6# 1-0"""
    }
]

def detect_opening(moves_san):
    """
    Matches the played move sequence against the openings database
    and returns the most specific matching opening.
    """
    if not moves_san or len(moves_san) == 0:
        return {"eco": "A00", "name": "Unorthodox Opening", "description": "Custom starting move.", "winrates": {"white": 37, "draw": 33, "black": 30}}

    best_match = None
    longest_prefix = 0

    for opening in OPENINGS_DB:
        match_len = 0
        for i in range(min(len(moves_san), len(opening["moves"]))):
            if moves_san[i] == opening["moves"][i]:
                match_len += 1
            else:
                break
        
        if match_len == len(opening["moves"]) and match_len > longest_prefix:
            longest_prefix = match_len
            best_match = opening

    if best_match:
        return best_match

    # Fallback to first move
    first_move = moves_san[0] if len(moves_san) > 0 else "e4"
    if first_move == "e4":
        return {"eco": "B00", "name": "King's Pawn Opening", "description": "1. e4 central control.", "winrates": {"white": 38, "draw": 32, "black": 30}}
    elif first_move == "d4":
        return {"eco": "A40", "name": "Queen's Pawn Opening", "description": "1. d4 classical setup.", "winrates": {"white": 39, "draw": 35, "black": 26}}
    elif first_move == "c4":
        return {"eco": "A10", "name": "English Opening", "description": "Flank assault controlling d5.", "winrates": {"white": 38, "draw": 37, "black": 25}}
    elif first_move == "Nf3":
        return {"eco": "A04", "name": "Réti Opening", "description": "Flexible hypermodern system.", "winrates": {"white": 37, "draw": 38, "black": 25}}

    return {"eco": "A00", "name": "Unorthodox Opening", "description": "Custom opening moves.", "winrates": {"white": 35, "draw": 35, "black": 30}}
