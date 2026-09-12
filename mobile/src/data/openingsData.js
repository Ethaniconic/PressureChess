/**
 * PressureChess Mobile Openings & Curated Review Catalog
 */

export const ECO_OPENINGS = [
  {
    eco: "B90",
    name: "Sicilian Defense: Najdorf Variation",
    moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"],
    description: "Sharp and deeply analyzed response to 1.e4, beloved by Fischer and Kasparov.",
    whiteWinRate: 38,
    drawRate: 34,
    blackWinRate: 28,
    keyConcepts: ["Asymmetrical attacks", "Queenside minority expansion", "d5 outpost contest"]
  },
  {
    eco: "B20",
    name: "Sicilian Defense",
    moves: ["e4", "c5"],
    description: "Black fights for the center from the flank, producing unbalanced positions.",
    whiteWinRate: 37,
    drawRate: 33,
    blackWinRate: 30,
    keyConcepts: ["C-file counterplay", "Dynamic pawn structure"]
  },
  {
    eco: "C65",
    name: "Ruy Lopez: Berlin Defense",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6"],
    description: "The impenetrable 'Berlin Wall' known for solid endgame transitions.",
    whiteWinRate: 35,
    drawRate: 46,
    blackWinRate: 19,
    keyConcepts: ["Solid pawn structure", "Bishop pair advantage"]
  },
  {
    eco: "C50",
    name: "Italian Game: Giuoco Piano",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5"],
    description: "One of the oldest recorded openings, focusing on rapid development and f7 pressure.",
    whiteWinRate: 36,
    drawRate: 37,
    blackWinRate: 27,
    keyConcepts: ["Rapid development", "Pressure on f7"]
  },
  {
    eco: "C41",
    name: "Philidor Defense",
    moves: ["e4", "e5", "Nf3", "d6"],
    description: "A resilient defensive opening where Black protects e5 firmly.",
    whiteWinRate: 42,
    drawRate: 32,
    blackWinRate: 26,
    keyConcepts: ["Central resilience", "Cramped pieces"]
  },
  {
    eco: "D06",
    name: "Queen's Gambit",
    moves: ["d4", "d5", "c4"],
    description: "White immediately offers a wing pawn to gain dominant spatial control.",
    whiteWinRate: 41,
    drawRate: 36,
    blackWinRate: 23,
    keyConcepts: ["Central dominance", "Wing pawn diversion"]
  }
];

export const SAMPLE_PGN_GAMES = [
  {
    id: "opera-game-1858",
    title: "The Opera Game (Morphy)",
    event: "Paris Opera House",
    date: "1858.11.02",
    white: "Paul Morphy",
    black: "Duke Karl / Count Isouard",
    result: "1-0",
    eco: "C41",
    opening: "Philidor Defense",
    description: "The most famous instructional game demonstrating rapid development and piece sacrifices.",
    pgn: `[Event "Paris Opera House"]
[Date "1858.11.02"]
[White "Paul Morphy"]
[Black "Duke Karl / Count Isouard"]
[Result "1-0"]
[ECO "C41"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`
  },
  {
    id: "kasparov-topalov-1999",
    title: "Kasparov's Immortal",
    event: "Corus Tournament",
    date: "1999.01.20",
    white: "Garry Kasparov",
    black: "Veselin Topalov",
    result: "1-0",
    eco: "B07",
    opening: "Pirc Defense",
    description: "Legendary tactical tour-de-force featuring the 24.Rxd4!! king hunt sacrifice.",
    pgn: `[Event "Corus"]
[Date "1999.01.20"]
[White "Garry Kasparov"]
[Black "Veselin Topalov"]
[Result "1-0"]
[ECO "B07"]

1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8 Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0`
  },
  {
    id: "blunder-clinic-blitz",
    title: "Tactical Blunder Clinic",
    event: "PressureChess Arena",
    date: "2026.03.15",
    white: "TacticsHunter (1650)",
    black: "PressureKing (1620)",
    result: "1-0",
    eco: "C50",
    opening: "Italian Game: Giuoco Piano",
    description: "Showcasing opening inaccuracies, a missed pin, and a fatal queen blunder.",
    pgn: `[Event "PressureChess Rapid Arena"]
[Date "2026.03.15"]
[White "TacticsHunter"]
[Black "PressureKing"]
[Result "1-0"]
[ECO "C50"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. d3 Nf6 5. Bg5 h6 6. Bh4 d6 7. c3 g5 8. Bg3 Bg4 9. Nbd2 Nh5 10. Qb3 Qd7 11. Qxb7 Rb8 12. Qa6 Rxb2 13. Bb5 Bb6 14. Qa4 Rxb5 15. Qxb5 O-O 16. O-O Nxg3 17. hxg3 f5 18. exf5 Rxf5 19. Qd5+ Kg7 20. Qe4 Bxf3 21. Nxf3 d5 22. Qg4 Qf7 23. d4 exd4 24. cxd4 h5 25. Qh3 g4 26. Qh4 gxf3 27. gxf3 Nxd4 28. f4 Nf3+ 29. Kg2 Nxh4+ 30. gxh4 Rxf4 1-0`
  }
];

export function detectOpeningMobile(movesSan = []) {
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
      keyConcepts: bestMatch.keyConcepts || [],
      whiteWinRate: bestMatch.whiteWinRate,
      blackWinRate: bestMatch.blackWinRate,
      drawRate: bestMatch.drawRate
    };
  }

  if (movesSan[0] === "e4") return { eco: "B00", name: "King's Pawn Game" };
  if (movesSan[0] === "d4") return { eco: "A40", name: "Queen's Pawn Game" };
  if (movesSan[0] === "c4") return { eco: "A10", name: "English Opening" };
  return { eco: "A00", name: "Uncommon Opening" };
}
