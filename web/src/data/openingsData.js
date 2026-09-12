/**
 * PressureChess Openings & Curated Review Catalog
 * Comprehensive ECO definitions, tactical concepts, win rates, and curated sample games.
 */

export const ECO_OPENINGS = [
  {
    eco: "B90",
    name: "Sicilian Defense: Najdorf Variation",
    moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"],
    description: "The sharpest and most deeply analyzed response to 1.e4, beloved by Fischer and Kasparov.",
    whiteWinRate: 38,
    drawRate: 34,
    blackWinRate: 28,
    keyConcepts: ["Asymmetrical attacks", "Queenside minority expansion", "d5 outpost contest"]
  },
  {
    eco: "B20",
    name: "Sicilian Defense",
    moves: ["e4", "c5"],
    description: "Black fights for the center from the flank, producing unbalanced, fighting positions.",
    whiteWinRate: 37,
    drawRate: 33,
    blackWinRate: 30,
    keyConcepts: ["C-file counterplay", "Dynamic pawn structure", "Active piece activity"]
  },
  {
    eco: "C65",
    name: "Ruy Lopez: Berlin Defense",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6"],
    description: "The impenetrable 'Berlin Wall' known for solid endgame transitions.",
    whiteWinRate: 35,
    drawRate: 46,
    blackWinRate: 19,
    keyConcepts: ["Solid pawn structure", "Bishop pair advantage", "Deep endgame technique"]
  },
  {
    eco: "C50",
    name: "Italian Game: Giuoco Piano",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5"],
    description: "One of the oldest recorded openings, focusing on rapid development and pressure against f7.",
    whiteWinRate: 36,
    drawRate: 37,
    blackWinRate: 27,
    keyConcepts: ["Rapid development", "Pressure on f7", "c3/d4 central levers"]
  },
  {
    eco: "C41",
    name: "Philidor Defense",
    moves: ["e4", "e5", "Nf3", "d6"],
    description: "A resilient, defensive opening where Black protects the e5 pawn firmly but cramps the bishop.",
    whiteWinRate: 42,
    drawRate: 32,
    blackWinRate: 26,
    keyConcepts: ["Central resilience", "Cramped pieces", "f7-f5 pawn breaks"]
  },
  {
    eco: "C00",
    name: "French Defense",
    moves: ["e4", "e6"],
    description: "Black establishes a solid pawn wedge on d5 with immediate counter-punching on the c-file.",
    whiteWinRate: 38,
    drawRate: 35,
    blackWinRate: 27,
    keyConcepts: ["Pawn chains", "Light-squared bishop dilemma", "c7-c5 counter-thrust"]
  },
  {
    eco: "B10",
    name: "Caro-Kann Defense",
    moves: ["e4", "c6"],
    description: "A bulletproof foundation allowing Black to prepare d5 without locking in the light-squared bishop.",
    whiteWinRate: 36,
    drawRate: 38,
    blackWinRate: 26,
    keyConcepts: ["Pawn solidity", "Active light-square bishop", "Endgame resilience"]
  },
  {
    eco: "D06",
    name: "Queen's Gambit",
    moves: ["d4", "d5", "c4"],
    description: "White immediately offers a wing pawn to gain dominant spatial control over the center.",
    whiteWinRate: 41,
    drawRate: 36,
    blackWinRate: 23,
    keyConcepts: ["Central dominance", "Wing pawn diversion", "Positional clamps"]
  },
  {
    eco: "E60",
    name: "King's Indian Defense",
    moves: ["d4", "Nf6", "c4", "g6"],
    description: "A hypermodern weapon where Black cedes the center early to launch a vicious kingside pawn storm.",
    whiteWinRate: 39,
    drawRate: 33,
    blackWinRate: 28,
    keyConcepts: ["Kingside attack", "f7-f5 assault", "Closed center maneuvering"]
  },
  {
    eco: "A10",
    name: "English Opening",
    moves: ["c4"],
    description: "A subtle, flexible flank opening exerting quiet control over the central d5 square.",
    whiteWinRate: 37,
    drawRate: 39,
    blackWinRate: 24,
    keyConcepts: ["Flank dominance", "Fianchetto bishop", "Flexible transpositions"]
  }
];

export const SAMPLE_PGN_GAMES = [
  {
    id: "opera-game-1858",
    title: "The Opera Game (Morphy's Masterpiece)",
    event: "Paris Opera House",
    site: "Paris, FRA",
    date: "1858.11.02",
    white: "Paul Morphy",
    black: "Duke Karl / Count Isouard",
    result: "1-0",
    eco: "C41",
    opening: "Philidor Defense",
    theme: "Lead in development & decisive sacrifices",
    description: "Considered the most famous instructional game of all time. Morphy demonstrates how rapid development punishes uncoordinated defense.",
    pgn: `[Event "Paris Opera House"]
[Site "Paris FRA"]
[Date "1858.11.02"]
[Round "1"]
[White "Paul Morphy"]
[Black "Duke Karl / Count Isouard"]
[Result "1-0"]
[ECO "C41"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`
  },
  {
    id: "kasparov-topalov-1999",
    title: "Kasparov's Immortal",
    event: "Corus Chess Tournament",
    site: "Wijk aan Zee, NED",
    date: "1999.01.20",
    white: "Garry Kasparov",
    black: "Veselin Topalov",
    result: "1-0",
    eco: "B07",
    opening: "Pirc Defense",
    theme: "Brilliant Rook Sacrifice (24.Rxd4!!) & King Hunt",
    description: "A legendary tactical tour-de-force featuring one of the most stunning rook sacrifices in history.",
    pgn: `[Event "Corus"]
[Site "Wijk aan Zee NED"]
[Date "1999.01.20"]
[Round "4"]
[White "Garry Kasparov"]
[Black "Veselin Topalov"]
[Result "1-0"]
[ECO "B07"]

1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8 Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0`
  },
  {
    id: "fischer-byrne-1956",
    title: "Game of the Century",
    event: "Rosenwald Memorial",
    site: "New York, USA",
    date: "1956.10.17",
    white: "Donald Byrne",
    black: "Bobby Fischer",
    result: "0-1",
    eco: "D92",
    opening: "Grünfeld Defense",
    theme: "Immortal 17...Be6!! Queen Sacrifice",
    description: "At just 13 years old, Bobby Fischer shocked the chess world with a magnificent queen sacrifice.",
    pgn: `[Event "Third Rosenwald Trophy"]
[Site "New York, NY USA"]
[Date "1956.10.17"]
[Round "8"]
[White "Donald Byrne"]
[Black "Robert James Fischer"]
[Result "0-1"]
[ECO "D92"]

1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Rc2# 0-1`
  },
  {
    id: "blunder-clinic-blitz",
    title: "Tactical Blunder Clinic",
    event: "PressureChess Rapid Arena",
    site: "Online",
    date: "2026.03.15",
    white: "TacticsHunter (1650)",
    black: "PressureKing (1620)",
    result: "1-0",
    eco: "C50",
    opening: "Italian Game: Giuoco Piano",
    theme: "Opening inaccuracy, missed pin, and queen blunder",
    description: "A fast-paced instructional battle showcasing inaccuracies, a missed pin, and a fatal queen blunder. Ideal for testing Coach Orion's advice.",
    pgn: `[Event "PressureChess Rapid Arena"]
[Site "Online"]
[Date "2026.03.15"]
[White "TacticsHunter"]
[Black "PressureKing"]
[Result "1-0"]
[ECO "C50"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. d3 Nf6 5. Bg5 h6 6. Bh4 d6 7. c3 g5 8. Bg3 Bg4 9. Nbd2 Nh5 10. Qb3 Qd7 11. Qxb7 Rb8 12. Qa6 Rxb2 13. Bb5 Bb6 14. Qa4 Rxb5 15. Qxb5 O-O 16. O-O Nxg3 17. hxg3 f5 18. exf5 Rxf5 19. Qd5+ Kg7 20. Qe4 Bxf3 21. Nxf3 d5 22. Qg4 Qf7 23. d4 exd4 24. cxd4 h5 25. Qh3 g4 26. Qh4 gxf3 27. gxf3 Nxd4 28. f4 Nf3+ 29. Kg2 Nxh4+ 30. gxh4 Rxf4 1-0`
  }
];

export function detectOpeningClient(movesSan = []) {
  if (!movesSan || movesSan.length === 0) {
    return { eco: "A00", name: "Standard Starting Position" };
  }

  let bestMatch = null;
  let maxMatchedLen = 0;

  for (const op of ECO_OPENINGS) {
    let match = true;
    for (let i = 0; i < op.moves.length; i++) {
      if (i >= movesSan.length || movesSan[i] !== op.moves[i]) {
        match = false;
        break;
      }
    }
    if (match && op.moves.length > maxMatchedLen) {
      maxMatchedLen = op.moves.length;
      bestMatch = op;
    }
  }

  if (bestMatch) {
    return {
      eco: bestMatch.eco,
      name: bestMatch.name,
      description: bestMatch.description,
      keyConcepts: bestMatch.keyConcepts,
      whiteWinRate: bestMatch.whiteWinRate,
      blackWinRate: bestMatch.blackWinRate,
      drawRate: bestMatch.drawRate
    };
  }

  if (movesSan[0] === "e4") return { eco: "B00", name: "King's Pawn Game" };
  if (movesSan[0] === "d4") return { eco: "A40", name: "Queen's Pawn Game" };
  if (movesSan[0] === "c4") return { eco: "A10", name: "English Opening" };
  if (movesSan[0] === "Nf3") return { eco: "A04", name: "Réti Opening" };

  return { eco: "A00", name: "Uncommon Opening" };
}
