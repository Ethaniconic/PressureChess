// Complete Multi-Tier Curriculum Data for PressureChess Academy (Beginner to Advanced)

export const ACADEMY_TIERS = [
  {
    id: 'beginner',
    title: 'Tier 1: Beginner Foundations',
    subtitle: 'Board geometry, basic piece maneuvers, rules & checkmates',
    badge: 'Foundations',
    color: 'cyan',
    icon: '♟️',
  },
  {
    id: 'intermediate',
    title: 'Tier 2: Tactical Mastery',
    subtitle: 'Forks, pins, skewers, discovered attacks & deflection',
    badge: 'Tactician',
    color: 'emerald',
    icon: '⚔️',
  },
  {
    id: 'advanced',
    title: 'Tier 3: Advanced Calculation & Endgames',
    subtitle: 'King opposition, 7th rank dominance, knight outposts & pressure conversion',
    badge: 'Mastery',
    color: 'gold',
    icon: '👑',
  }
];

export const ACADEMY_MODULES = [
  // ==========================================
  // TIER 1: BEGINNER FOUNDATIONS (Modules 1-8)
  // ==========================================
  {
    id: 'board-basics',
    tier: 'beginner',
    title: 'Chess Board Basics',
    description: 'Master files, ranks, coordinates, and the golden center squares.',
    icon: 'Grid',
    color: 'cyan',
    badge: 'Navigator',
    coachTip: 'Always fight for the center (e4, d4, e5, d5). Pieces in the center control the most squares.',
    lessons: [
      {
        id: 'basics-center',
        moduleId: 'board-basics',
        tier: 'beginner',
        title: 'Controlling the Center',
        fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1',
        goal: 'Advance your pawn to the e4 center square to establish central presence.',
        explanation: 'The center of the board (d4, d5, e4, e5) is the battlefield heart. Controlling the center gives your pieces freedom of movement and tactical dominance.',
        hint: 'Push your pawn from e2 two squares forward to e4.',
        candidateSquares: ['e3', 'e4'],
        expectedMoves: ['e2e4'],
        xp: 50,
      },
      {
        id: 'basics-files',
        moduleId: 'board-basics',
        tier: 'beginner',
        title: 'The Open d-File',
        fen: '3r2k1/8/8/8/8/8/8/3R2K1 w - - 0 1',
        goal: 'Move your White Rook up the open d-file to capture the d8 rook.',
        explanation: 'Vertical columns of squares are called "files" (a through h). Rooks thrive when placed on open files where no pawns block their path.',
        hint: 'Slide your Rook all the way along the d-file to capture the enemy rook on d8.',
        candidateSquares: ['d2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'],
        expectedMoves: ['d1d8'],
        xp: 50,
      }
    ]
  },
  {
    id: 'piece-movement',
    tier: 'beginner',
    title: 'Piece Movement',
    description: 'Learn how the Rook, Bishop, Queen, Knight, Pawn, and King maneuver.',
    icon: 'Crown',
    color: 'cyan',
    badge: 'Piece Master',
    coachTip: 'Knights jump in an L-shape and are the only pieces that can jump over other units.',
    lessons: [
      {
        id: 'move-rook',
        moduleId: 'piece-movement',
        tier: 'beginner',
        title: 'The Rook’s Straight Line',
        fen: '4k3/8/8/8/8/8/8/R3K3 w - - 0 1',
        goal: 'Move your Rook horizontally across the first rank to a1 to d1.',
        explanation: 'Rooks move any number of squares horizontally or vertically, as long as no piece blocks their path.',
        hint: 'Select the Rook on a1 and move it along the 1st rank to d1.',
        candidateSquares: ['b1', 'c1', 'd1'],
        expectedMoves: ['a1d1'],
        xp: 50,
      },
      {
        id: 'move-bishop',
        moduleId: 'piece-movement',
        tier: 'beginner',
        title: 'The Bishop’s Diagonal',
        fen: '4k3/8/8/8/8/8/8/2B1K3 w - - 0 1',
        goal: 'Deploy your dark-squared Bishop from c1 to g5.',
        explanation: 'Bishops move diagonally on squares of their starting color. A dark-squared Bishop remains on dark squares for the entire game.',
        hint: 'Slide your Bishop diagonally upward across the board to g5.',
        candidateSquares: ['d2', 'e3', 'f4', 'g5'],
        expectedMoves: ['c1g5'],
        xp: 50,
      },
      {
        id: 'move-knight',
        moduleId: 'piece-movement',
        tier: 'beginner',
        title: 'The Knight’s Leap',
        fen: '4k3/8/8/8/8/8/8/1N2K3 w - - 0 1',
        goal: 'Leap your Knight from b1 to the natural development square c3.',
        explanation: 'The Knight moves in an "L-shape": two squares in one cardinal direction and one square perpendicularly. It is the only piece that can jump over other pieces.',
        hint: 'Move the Knight from b1 up two ranks and one square right to c3.',
        candidateSquares: ['a3', 'c3', 'd2'],
        expectedMoves: ['b1c3'],
        xp: 50,
      }
    ]
  },
  {
    id: 'capturing',
    tier: 'beginner',
    title: 'Capturing Pieces',
    description: 'Learn how to take opponent pieces and calculate material value.',
    icon: 'Swords',
    color: 'cyan',
    badge: 'Hunter',
    coachTip: 'Always check what defends a piece before capturing it. Free undefended pieces are called "hanging" pieces.',
    lessons: [
      {
        id: 'capture-free-pawn',
        moduleId: 'capturing',
        tier: 'beginner',
        title: 'Capturing a Hanging Piece',
        fen: '4k3/8/8/3p4/4N3/8/8/4K3 w - - 0 1',
        goal: 'Capture the undefended Black pawn on d5 using your Knight.',
        explanation: 'When your opponent leaves a piece undefended (hanging), capturing it gives you a free material advantage.',
        hint: 'Use your Knight on e4 to capture the pawn on d5.',
        candidateSquares: ['d5', 'c5', 'f6', 'g5', 'g3', 'f2', 'd2', 'c3'],
        expectedMoves: ['e4d5'],
        xp: 60,
      },
      {
        id: 'capture-bishop-trade',
        moduleId: 'capturing',
        tier: 'beginner',
        title: 'Trading Equal Pieces',
        fen: '4k3/8/8/2b5/8/4B3/8/4K3 w - - 0 1',
        goal: 'Capture the Black Bishop on c5 with your Bishop on e3.',
        explanation: 'Bishops are worth 3 points. Capturing a bishop with a bishop is an equal trade that simplifies the position.',
        hint: 'Take the bishop directly on c5.',
        candidateSquares: ['c5', 'd4', 'f4', 'g5', 'd2'],
        expectedMoves: ['e3c5'],
        xp: 60,
      }
    ]
  },
  {
    id: 'check-escaping',
    tier: 'beginner',
    title: 'Check & Escaping Check',
    description: 'Understand direct attacks on the King and the three CPR escape techniques.',
    icon: 'ShieldAlert',
    color: 'cyan',
    badge: 'Defender',
    coachTip: 'Remember the CPR rule to escape check: Capture the attacker, Protect (block), or Run away!',
    lessons: [
      {
        id: 'check-run-away',
        moduleId: 'check-escaping',
        tier: 'beginner',
        title: 'Run Away with the King',
        fen: '7k/8/8/8/8/4r3/8/4K3 w - - 0 1',
        goal: 'Your King is in check from the Rook on e3. Step out of check to d1.',
        explanation: 'When your King is in check, you MUST get out of check immediately. One method is moving the King to a safe square.',
        hint: 'Step your King to d1 or d2 away from the e-file.',
        candidateSquares: ['d1', 'd2', 'f1', 'f2'],
        expectedMoves: ['e1d1', 'e1d2', 'e1f1', 'e1f2'],
        xp: 70,
      },
      {
        id: 'check-block',
        moduleId: 'check-escaping',
        tier: 'beginner',
        title: 'Block with an Interposition',
        fen: '4k3/8/8/8/8/8/4B3/3qK3 w - - 0 1',
        goal: 'The Black Queen checks your King from d1. Capture the checking Queen with your Bishop!',
        explanation: 'The best way to resolve a check is capturing the attacker if a piece can do so safely.',
        hint: 'Take the checking Queen on d1 with your Bishop on e2.',
        candidateSquares: ['d1'],
        expectedMoves: ['e2d1'],
        xp: 70,
      }
    ]
  },
  {
    id: 'checkmate',
    tier: 'beginner',
    title: 'Checkmate: The Ultimate Goal',
    description: 'Deliver checkmate where the King cannot escape, block, or capture.',
    icon: 'Zap',
    color: 'cyan',
    badge: 'Executioner',
    coachTip: 'Checkmate ends the game instantly. Look for trapped enemy kings behind their pawn shield.',
    lessons: [
      {
        id: 'mate-back-rank',
        moduleId: 'checkmate',
        tier: 'beginner',
        title: 'The Back-Rank Checkmate',
        fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1',
        goal: 'Deliver checkmate on the 8th rank with your White Rook.',
        explanation: 'When the enemy King is trapped behind its own pawns on the back rank, a single Rook can deliver instant checkmate.',
        hint: 'Move your Rook from e1 all the way to e8.',
        candidateSquares: ['e8'],
        expectedMoves: ['e1e8'],
        xp: 80,
      },
      {
        id: 'mate-helper-queen',
        moduleId: 'checkmate',
        tier: 'beginner',
        title: 'The Helper Checkmate',
        fen: '4k3/4Q3/4K3/8/8/8/8/8 w - - 0 1',
        goal: 'Deliver checkmate with Queen on e7 supported by the King on e6.',
        explanation: 'When the Queen is guarded directly by her King, the enemy King cannot capture her and has no escape squares.',
        hint: 'The Queen delivers mate right in front of the King!',
        candidateSquares: ['e7'],
        expectedMoves: ['e7e7'],
        xp: 80,
      }
    ]
  },
  {
    id: 'castling',
    tier: 'beginner',
    title: 'Castling: King Safety',
    description: 'Tuck the King to safety and connect your Rooks in a single dual move.',
    icon: 'ShieldCheck',
    color: 'cyan',
    badge: 'Castellan',
    coachTip: 'Castle early in the opening to keep your king safe and bring your rook to active files.',
    lessons: [
      {
        id: 'castling-kingside',
        moduleId: 'castling',
        tier: 'beginner',
        title: 'Kingside Castling (O-O)',
        fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
        goal: 'Castle kingside to safeguard your White King.',
        explanation: 'Castling is the only move where you move two pieces in one turn: the King moves two squares toward the Rook, and the Rook hops over to the adjacent square.',
        hint: 'Move your King from e1 two squares right to g1.',
        candidateSquares: ['g1'],
        expectedMoves: ['e1g1', 'O-O'],
        xp: 80,
      }
    ]
  },
  {
    id: 'en-passant',
    tier: 'beginner',
    title: 'En Passant',
    description: 'Master the rare French special pawn capture rule.',
    icon: 'Sparkles',
    color: 'cyan',
    badge: 'Tactician',
    coachTip: 'En Passant is only legal on the very next turn immediately after a two-square enemy pawn push.',
    lessons: [
      {
        id: 'en-passant-capture',
        moduleId: 'en-passant',
        tier: 'beginner',
        title: 'The En Passant Strike',
        fen: '4k3/8/8/3Pp3/8/8/8/4K3 w - e6 0 1',
        goal: 'Capture the black pawn on e5 "in passing" by moving diagonally to e6.',
        explanation: 'When a pawn moves two squares forward from its starting rank and lands directly adjacent to an opposing pawn, the opponent may capture it as if it had only moved one square.',
        hint: 'Move your pawn on d5 diagonally to e6 to capture the e5 pawn.',
        candidateSquares: ['d6', 'e6'],
        expectedMoves: ['d5e6'],
        xp: 90,
      }
    ]
  },
  {
    id: 'promotion',
    tier: 'beginner',
    title: 'Pawn Promotion',
    description: 'Transform your humble pawn into a mighty Queen on the 8th rank.',
    icon: 'Award',
    color: 'cyan',
    badge: 'Ascendant',
    coachTip: 'Promoting to a Queen usually wins the game. Push your passed pawns with King support.',
    lessons: [
      {
        id: 'promote-queen',
        moduleId: 'promotion',
        tier: 'beginner',
        title: 'Queening the Passed Pawn',
        fen: '4k3/4P3/8/8/8/8/8/4K3 w - - 0 1',
        goal: 'Advance your pawn from e7 to e8 to promote into a Queen.',
        explanation: 'When a pawn reaches the opposite end of the board (8th rank for White, 1st for Black), it immediately promotes into a Queen, Rook, Bishop, or Knight.',
        hint: 'Push the pawn on e7 to e8 and choose Queen.',
        candidateSquares: ['e8'],
        expectedMoves: ['e7e8q', 'e7e8'],
        xp: 90,
      }
    ]
  },

  // ===============================================
  // TIER 2: INTERMEDIATE TACTICS (Modules 9-13)
  // ===============================================
  {
    id: 'tactics-fork',
    tier: 'intermediate',
    title: 'Forks & Double Attacks',
    description: 'Strike two enemy pieces simultaneously with a single devastating move.',
    icon: 'Target',
    color: 'emerald',
    badge: 'Fork Master',
    coachTip: 'Knights are the deadliest forking pieces because their jump cannot be blocked.',
    lessons: [
      {
        id: 'fork-knight-royal',
        moduleId: 'tactics-fork',
        tier: 'intermediate',
        title: 'The Knight Royal Fork',
        fen: '4k3/2r5/8/3N4/8/8/8/4K3 w - - 0 1',
        goal: 'Deliver a Knight fork on c7 attacking the Black King on e8 and Rook on c7.',
        explanation: 'A fork occurs when one piece attacks two or more opponent pieces simultaneously. Capturing the Rook on c7 gives White an overwhelming advantage.',
        hint: 'Jump your Knight from d5 to c7 to check the King and win the Rook!',
        candidateSquares: ['c7', 'e7', 'f6', 'b6'],
        expectedMoves: ['d5c7'],
        xp: 100,
      },
      {
        id: 'fork-pawn',
        moduleId: 'tactics-fork',
        tier: 'intermediate',
        title: 'The Humble Pawn Fork',
        fen: '4k3/8/8/2b1n3/3P4/8/8/4K3 w - - 0 1',
        goal: 'Push your pawn from d4 to d5 to fork the Black Bishop on c5 and Knight on e5.',
        explanation: 'Pawns can execute lethal forks against minor pieces. The opponent can only save one piece, letting you capture the other.',
        hint: 'Push the d-pawn to d5 to hit both the bishop and the knight!',
        candidateSquares: ['d5'],
        expectedMoves: ['d4d5'],
        xp: 100,
      }
    ]
  },
  {
    id: 'tactics-pin',
    tier: 'intermediate',
    title: 'Absolute & Relative Pins',
    description: 'Paralyze enemy pieces that cannot move without exposing a higher-value target.',
    icon: 'Shield',
    color: 'emerald',
    badge: 'Pin Enforcer',
    coachTip: 'When an enemy piece is pinned to their King, it literally cannot move. Pile up pressure on it!',
    lessons: [
      {
        id: 'pin-absolute-queen',
        moduleId: 'tactics-pin',
        tier: 'intermediate',
        title: 'Winning the Pinned Queen',
        fen: '7k/8/8/8/3q4/8/1B6/6K1 w - - 0 1',
        goal: 'Capture the Black Queen on d4 using your pinning Bishop on b2.',
        explanation: 'The Black Queen on d4 is in an absolute pin to the King on h8 along the a1-h8 diagonal. It cannot escape or defend itself.',
        hint: 'Take the pinned Queen on d4 with your Bishop!',
        candidateSquares: ['d4'],
        expectedMoves: ['b2d4'],
        xp: 110,
      }
    ]
  },
  {
    id: 'tactics-skewer',
    tier: 'intermediate',
    title: 'The Skewer (Reverse Pin)',
    description: 'Attack a high-value piece in front, forcing it to step aside and reveal a prize.',
    icon: 'Zap',
    color: 'emerald',
    badge: 'Skewer Sniper',
    coachTip: 'A skewer is the inverse of a pin: the more valuable piece is attacked in front.',
    lessons: [
      {
        id: 'skewer-king-rook',
        moduleId: 'tactics-skewer',
        tier: 'intermediate',
        title: 'Rook Skewer on the 8th Rank',
        fen: '4k2r/8/8/8/8/8/8/4R1K1 w - - 0 1',
        goal: 'Check the Black King on e8 with your Rook on e1, skewering the Rook on h8.',
        explanation: 'White checks the King on e8. The King is forced to step aside, allowing the White Rook to win the Black Rook on h8.',
        hint: 'Step your Rook forward along the e-file or check the King directly.',
        candidateSquares: ['e8', 'e7'],
        expectedMoves: ['e1e8'],
        xp: 110,
      }
    ]
  },
  {
    id: 'tactics-discovered',
    tier: 'intermediate',
    title: 'Discovered Checks & Attacks',
    description: 'Unleash hidden fire from behind a moving piece to create unavoidable threats.',
    icon: 'Crosshair',
    color: 'emerald',
    badge: 'Phantom Strike',
    coachTip: 'Discovered checks are lethal because the moving piece can capture something for free while the checking piece attacks the king.',
    lessons: [
      {
        id: 'discovered-check-win-queen',
        moduleId: 'tactics-discovered',
        tier: 'intermediate',
        title: 'Unveiling the Discovered Check',
        fen: '3k4/8/8/q7/3B4/8/8/3R2K1 w - - 0 1',
        goal: 'Move your Bishop from d4 to b6 with discovered check from the d1 Rook to win the Queen.',
        explanation: 'Moving the Bishop to b6 unmasks a check from the Rook on d1. Black is forced to respond to the check, allowing White to capture the Queen on a5 next turn.',
        hint: 'Move the Bishop to b6 to deliver check from the Rook behind it!',
        candidateSquares: ['b6', 'c5'],
        expectedMoves: ['d4b6'],
        xp: 120,
      }
    ]
  },
  {
    id: 'tactics-deflection',
    tier: 'intermediate',
    title: 'Deflection & Overloaded Pieces',
    description: 'Lure critical enemy defenders away from guarding crucial checkmate squares.',
    icon: 'Shuffle',
    color: 'emerald',
    badge: 'Deflector',
    coachTip: 'If a piece is doing two defensive jobs at once, deflect it from one to conquer the other.',
    lessons: [
      {
        id: 'deflection-back-rank',
        moduleId: 'tactics-deflection',
        tier: 'intermediate',
        title: 'Deflecting the Back-Rank Guard',
        fen: '3r2k1/5ppp/8/8/8/8/4QPPP/3R2K1 w - - 0 1',
        goal: 'Capture the Black Rook on d8 to deliver back-rank checkmate.',
        explanation: 'The Black Rook on d8 was the only piece defending against mate. Taking it dismantles Black’s entire defense.',
        hint: 'Capture the Rook directly on d8 with your Rook!',
        candidateSquares: ['d8'],
        expectedMoves: ['d1d8'],
        xp: 120,
      }
    ]
  },

  // ==========================================================
  // TIER 3: ADVANCED STRATEGY & ENDGAMES (Modules 14-17)
  // ==========================================================
  {
    id: 'endgame-opposition',
    tier: 'advanced',
    title: 'The Opposition & Key Squares',
    description: 'Master the fundamental geometric secret of King & Pawn endgames.',
    icon: 'Compass',
    color: 'gold',
    badge: 'Opposition Master',
    coachTip: 'Having the opposition means your opponent must step aside, letting you advance your king into their territory.',
    lessons: [
      {
        id: 'opposition-direct',
        moduleId: 'endgame-opposition',
        tier: 'advanced',
        title: 'Seizing Direct Opposition',
        fen: '8/4k3/8/8/4K3/8/4P3/8 w - - 0 1',
        goal: 'Advance your King to e5 to seize the direct opposition against Black’s King on e7.',
        explanation: 'With an odd number of squares between the Kings, moving to e5 takes the opposition. Black is in zugzwang and must cede control of key squares.',
        hint: 'Step your King directly opposite the black King to e5.',
        candidateSquares: ['e5', 'd5', 'f5'],
        expectedMoves: ['e4e5'],
        xp: 150,
      }
    ]
  },
  {
    id: 'endgame-rook',
    tier: 'advanced',
    title: 'Rook on the 7th Rank',
    description: 'Invade the second rank to slaughter base pawns and trap the enemy King.',
    icon: 'TrendingUp',
    color: 'gold',
    badge: 'Pig on 7th',
    coachTip: 'A Rook on the 7th rank is often worth a full piece because it paralyzes the opponent’s pawns.',
    lessons: [
      {
        id: 'rook-7th-rank-invasion',
        moduleId: 'endgame-rook',
        tier: 'advanced',
        title: 'Invading the 7th Rank',
        fen: '6k1/5ppp/8/8/8/8/1R6/6K1 w - - 0 1',
        goal: 'Deliver checkmate on the back rank with b2 to b8.',
        explanation: 'A Rook that controls the back rank or 7th rank restricts the enemy king completely.',
        hint: 'Slide the Rook to b8 for checkmate.',
        candidateSquares: ['b8'],
        expectedMoves: ['b2b8'],
        xp: 150,
      }
    ]
  },
  {
    id: 'strategy-outposts',
    tier: 'advanced',
    title: 'The Knight Outpost',
    description: 'Plant an unassailable Knight deep in opponent territory on a weak hole.',
    icon: 'Anchor',
    color: 'gold',
    badge: 'Outpost Commander',
    coachTip: 'An outpost cannot be driven away by enemy pawns and dominates the surrounding 8 squares.',
    lessons: [
      {
        id: 'outpost-occupy-d5',
        moduleId: 'strategy-outposts',
        tier: 'advanced',
        title: 'Securing the d5 Outpost',
        fen: '4k3/ppp2ppp/8/3N4/8/8/PPP2PPP/4K3 w - - 0 1',
        goal: 'Strike the weak c7 pawn from your d5 outpost with a royal check!',
        explanation: 'From the d5 central outpost, the Knight attacks c7, e7, and f6 simultaneously without danger of being challenged by black pawns.',
        hint: 'Jump the Knight to c7 with check.',
        candidateSquares: ['c7'],
        expectedMoves: ['d5c7'],
        xp: 150,
      }
    ]
  },
  {
    id: 'pressure-calculation',
    tier: 'advanced',
    title: 'Conversion Under Time Pressure',
    description: 'Make ruthless, clean simplifying decisions under low-clock pressure.',
    icon: 'Zap',
    color: 'gold',
    badge: 'Pressure Proof',
    coachTip: 'When up material under time pressure, trade down pieces to leave a totally won pawn endgame.',
    lessons: [
      {
        id: 'simplify-trade-rooks',
        moduleId: 'pressure-calculation',
        tier: 'advanced',
        title: 'Simplifying into a Won King Endgame',
        fen: '4k3/8/8/3r4/3R4/8/4P3/4K3 w - - 0 1',
        goal: 'Capture Black’s Rook on d5 with your Rook to force an easily won King & Pawn ending.',
        explanation: 'With an extra e-pawn, trading rooks instantly eliminates any tactical counterplay from Black, leaving a simple winning king conversion.',
        hint: 'Trade Rooks by capturing on d5.',
        candidateSquares: ['d5'],
        expectedMoves: ['d4d5'],
        xp: 160,
      }
    ]
  }
];

export const ACHIEVEMENTS = [
  {
    id: 'first-lesson',
    title: 'First Step to Mastery',
    description: 'Complete your first interactive academy lesson.',
    icon: '🎯',
    xpReward: 100,
  },
  {
    id: 'piece-master',
    title: 'Piece Virtuoso',
    description: 'Master Rook, Bishop, Queen, and Knight mobility lessons.',
    icon: '🏆',
    xpReward: 250,
  },
  {
    id: 'tactical-eye',
    title: 'Eagle Eye Tactician',
    description: 'Conquer 5 Tactical forks, pins, and skewers.',
    icon: '⚔️',
    xpReward: 200,
  },
  {
    id: 'iron-defense',
    title: 'Iron Defense',
    description: 'Master escaping check using all CPR techniques.',
    icon: '🛡️',
    xpReward: 200,
  },
  {
    id: 'checkmate-master',
    title: 'Checkmate Virtuoso',
    description: 'Execute classic Back-Rank and Helper mates.',
    icon: '👑',
    xpReward: 300,
  },
  {
    id: 'special-moves-master',
    title: 'Special Forces',
    description: 'Master Castling, En Passant, and Pawn Promotion.',
    icon: '⚡',
    xpReward: 350,
  },
  {
    id: 'endgame-maestro',
    title: 'Endgame Maestro',
    description: 'Conquer the Opposition and 7th Rank dominance.',
    icon: '🏛️',
    xpReward: 400,
  },
  {
    id: 'scholar-grad',
    title: 'Grandmaster Academy Graduate',
    description: 'Complete all 17 Beginner, Intermediate, and Advanced Modules.',
    icon: '🎓',
    xpReward: 750,
  },
];

export const LEVEL_TIERS = [
  { level: 1, title: 'Pawn Apprentice', minXp: 0, maxXp: 149 },
  { level: 2, title: 'Knight Rider', minXp: 150, maxXp: 449 },
  { level: 3, title: 'Bishop Tactician', minXp: 450, maxXp: 899 },
  { level: 4, title: 'Rook Strategist', minXp: 900, maxXp: 1499 },
  { level: 5, title: 'Queen Commander', minXp: 1500, maxXp: 2499 },
  { level: 6, title: 'Grandmaster in Training', minXp: 2500, maxXp: 99999 },
];

export const calculateLevel = (totalXp) => {
  if (totalXp >= 2500) return { level: 6, title: 'Grandmaster in Training', nextXp: 4000, currentBase: 2500 };
  if (totalXp >= 1500) return { level: 5, title: 'Queen Commander', nextXp: 2500, currentBase: 1500 };
  if (totalXp >= 900) return { level: 4, title: 'Rook Strategist', nextXp: 1500, currentBase: 900 };
  if (totalXp >= 450) return { level: 3, title: 'Bishop Tactician', nextXp: 900, currentBase: 450 };
  if (totalXp >= 150) return { level: 2, title: 'Knight Rider', nextXp: 450, currentBase: 150 };
  return { level: 1, title: 'Pawn Apprentice', nextXp: 150, currentBase: 0 };
};
