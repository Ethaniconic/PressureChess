/**
 * PressureChess: Tactical Puzzles & Championship Scenarios Data Catalog (Web)
 */

export const PUZZLE_MODES = [
  {
    id: '10s',
    title: '10s Bullet Rush',
    seconds: 10,
    icon: '⚡',
    badge: 'Insane Speed',
    description: 'Instant pattern recognition under extreme clock panic. 10 seconds to find the master move.',
    color: 'from-amber-500 to-red-500',
    borderColor: 'border-red-500/40',
    bgGlow: 'shadow-red-500/20'
  },
  {
    id: '20s',
    title: '20s Blitz Crunch',
    seconds: 20,
    icon: '🔥',
    badge: 'Popular',
    description: 'Tournament blitz pressure. Calculate the forcing line and strike with precision.',
    color: 'from-cyan-500 to-sky-500',
    borderColor: 'border-cyan-400/40',
    bgGlow: 'shadow-cyan-500/20'
  },
  {
    id: '30s',
    title: '30s Rapid Precision',
    seconds: 30,
    icon: '⏱️',
    badge: 'Tactical Depth',
    description: 'Deeper tactical combinations, pins, skewers, and multi-move mating sequences.',
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/40',
    bgGlow: 'shadow-emerald-500/20'
  },
  {
    id: 'sudden_death',
    title: 'Sudden Death Survival',
    seconds: 20,
    isSurvival: true,
    icon: '☠️',
    badge: 'Hardcore',
    description: 'Start with 20s. Every correct move awards +5s bonus time. One blunder or timeout ends your run!',
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/40',
    bgGlow: 'shadow-purple-500/20'
  }
];

export const PUZZLE_CATEGORIES = [
  { id: 'all', title: 'All Tactics', icon: '⚡', description: 'Mixed tactical scenarios under clock pressure' },
  { id: 'fork', title: 'Fork', icon: '🔱', description: 'Attacking two or more enemy pieces simultaneously' },
  { id: 'pin', title: 'Pin', icon: '📌', description: 'Immobilizing an enemy piece shielding a higher-value target' },
  { id: 'skewer', title: 'Skewer', icon: '🗡️', description: 'Attacking a high-value piece in front of a vulnerable target' },
  { id: 'double_attack', title: 'Double Attack', icon: '⚔️', description: 'Creating multiple unstoppable simultaneous threats' },
  { id: 'discovered_attack', title: 'Discovered Attack', icon: '💥', description: 'Moving one piece to unmask an ambush from another' },
  { id: 'mate_in_1', title: 'Mate in 1', icon: '👑', description: 'Direct, single-turn execution of the enemy king' },
  { id: 'mate_in_2', title: 'Mate in 2', icon: '🎯', description: 'Forcing two-move combination concluding in checkmate' },
  { id: 'mate_in_3', title: 'Mate in 3+', icon: '🏆', description: 'Calculated multi-move forcing king hunt' },
  { id: 'sacrifice', title: 'Sacrifice', icon: '💎', description: "Giving up material to demolish the opponent's defenses" }
];

export const CHAMPIONSHIP_SCENARIOS = [
  {
    id: 'champ-kasparov-topalov-1999',
    title: "Kasparov's Immortal Attack",
    subtitle: 'Garry Kasparov vs. Veselin Topalov, Wijk aan Zee 1999',
    category: 'sacrifice',
    difficulty: 'master',
    rating: 2350,
    fen: 'r1b1k2r/pp1p1pp1/2n1p3/7p/1b1NP1nP/2N1B3/PPP2PP1/R2QKB1R w KQkq - 0 10',
    playerColor: 'white',
    expectedMoves: ['Ndb5', 'a6', 'Nc7+'],
    opponentResponses: {
      'Ndb5': 'a6'
    },
    goal: "Unleash Kasparov's venomous kingside pressure and hunt the black king.",
    hint: 'Jump your knight forward to pressure the c7 hole.',
    explanation: 'Kasparov famously punished Topalov\'s passive opening setup by driving his knights into key weaknesses, ultimately leading to one of the most celebrated king-hunts in chess history.',
    championshipData: {
      white: 'Garry Kasparov',
      black: 'Veselin Topalov',
      event: 'Hoogovens Wijk aan Zee',
      year: 1999,
      historicalNote: 'Widely voted the greatest game in modern chess history. Kasparov unleashed a torrent of sacrifices to hunt the black king across the entire board.'
    }
  },
  {
    id: 'champ-tal-botvinnik-1960',
    title: "Tal's Magician Sacrifice",
    subtitle: 'Mikhail Tal vs. Mikhail Botvinnik, World Championship 1960',
    category: 'sacrifice',
    difficulty: 'advanced',
    rating: 2100,
    fen: 'r1bq1rk1/pp1nbppp/4pn2/2pp4/2PP4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 8',
    playerColor: 'white',
    expectedMoves: ['cxd5', 'exd5', 'dxc5'],
    opponentResponses: {
      'cxd5': 'exd5'
    },
    goal: "Open the central files in true Tal fashion to paralyze Botvinnik's solid structure.",
    hint: 'Dismantle the pawn center with forcing captures.',
    explanation: 'Mikhail Tal, \'The Magician of Riga\', shocked the chess world by constantly breaking open symmetrical pawn chains to generate violent tactical storms against positional master Botvinnik.',
    championshipData: {
      white: 'Mikhail Tal',
      black: 'Mikhail Botvinnik',
      event: 'World Chess Championship',
      year: 1960,
      historicalNote: 'Tal seized the World Crown at age 23 by bewildering the analytical Botvinnik with chaotic piece play.'
    }
  },
  {
    id: 'champ-anand-bologan-2003',
    title: "Anand's Lightning Positional Counter",
    subtitle: 'Viswanathan Anand vs. Viktor Bologan, Dortmund 2003',
    category: 'pin',
    difficulty: 'advanced',
    rating: 1950,
    fen: 'r2q1rk1/pp1b1ppp/2n1pn2/2bp4/8/2NBPN2/PPPB1PPP/R2Q1RK1 w - - 0 9',
    playerColor: 'white',
    expectedMoves: ['e4', 'dxe4', 'Nxe4'],
    opponentResponses: {
      'e4': 'dxe4'
    },
    goal: 'Strike the center with the thematic e4 thrust to unleash Anand\'s bishop pair.',
    hint: 'Anand excels at fast central breaks that activate all minor pieces.',
    explanation: 'Vishy Anand is renowned for lightning-fast tactical calculation. By blasting open the center with e4, White\'s bishops seize dominating diagonals.',
    championshipData: {
      white: 'Viswanathan Anand',
      black: 'Viktor Bologan',
      event: 'Dortmund Sparkassen Chess Meeting',
      year: 2003,
      historicalNote: 'Anand\'s legendary speed and deep positional intuition allowed him to execute complex dynamic breaks in under seconds on his clock.'
    }
  },
  {
    id: 'champ-magnus-karjakin-2016',
    title: "Carlsen's World Title Queen Sacrifice",
    subtitle: 'Magnus Carlsen vs. Sergey Karjakin, World Championship 2016',
    category: 'sacrifice',
    difficulty: 'master',
    rating: 2250,
    fen: '5rk1/6pp/p1bN4/1p1q4/3P4/2P1Q3/PP4PP/4R1K1 w - - 0 1',
    playerColor: 'white',
    expectedMoves: ['Qe6+', 'Qxe6', 'Rxe6'],
    opponentResponses: {
      'Qe6+': 'Qxe6'
    },
    goal: 'Convert into a completely dominating endgame under extreme tiebreak blitz clock pressure.',
    hint: 'Trade queens while capturing the initiative and activating your rook on the 6th rank.',
    explanation: 'Under severe time crunch in the rapid tiebreaks, Carlsen demonstrated cold-blooded endgame mastery to retain his World Championship title against Karjakin.',
    championshipData: {
      white: 'Magnus Carlsen',
      black: 'Sergey Karjakin',
      event: 'World Chess Championship Rapid Playoff',
      year: 2016,
      historicalNote: 'Carlsen sealed his title defense on his 26th birthday with an unforgettable Queen sacrifice finish in the final game.'
    }
  }
];

export const TACTICAL_PUZZLES = [
  // FORK
  {
    id: 'fork-01',
    title: 'Royal Family Fork',
    category: 'fork',
    difficulty: 'beginner',
    rating: 1050,
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5',
    playerColor: 'white',
    expectedMoves: ['Nxe5', 'Nxe5', 'd4'],
    opponentResponses: {
      'Nxe5': 'Nxe5'
    },
    goal: 'Execute the classic center fork trick to win back material with central dominance.',
    hint: 'Sacrifice the knight on e5, then push your d-pawn to fork bishop and knight!',
    explanation: 'The center fork trick: After 1. Nxe5 Nxe5 2. d4!, White forks Black\'s bishop and knight, regaining the piece with superior pawn control in the center.'
  },
  {
    id: 'fork-02',
    title: 'Knight Fork on c7',
    category: 'fork',
    difficulty: 'beginner',
    rating: 1150,
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5',
    playerColor: 'white',
    expectedMoves: ['Bxf7+', 'Kxf7', 'Nxe4'],
    opponentResponses: {
      'Bxf7+': 'Kxf7'
    },
    goal: 'Strip the enemy king of castling rights and regain material with an active initiative.',
    hint: 'Strike on the weak f7 square with check!',
    explanation: 'By sacrificing the bishop temporarily on f7+, Black is forced to forfeit castling rights and White\'s knights immediately jump into commanding squares.'
  },
  {
    id: 'fork-03',
    title: 'Pawn Fork Break',
    category: 'fork',
    difficulty: 'intermediate',
    rating: 1380,
    fen: 'r2q1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPP3PP/R2Q1RK1 w - - 3 10',
    playerColor: 'white',
    expectedMoves: ['Nxc6', 'bxc6', 'e5'],
    opponentResponses: {
      'Nxc6': 'bxc6'
    },
    goal: 'Disrupt Black\'s coordination and fork central defenses with an aggressive pawn thrust.',
    hint: 'Exchange on c6 first, then advance the e-pawn into the heart of Black\'s position.',
    explanation: 'Opening lines with tempo: The pawn thrust e5 attacks the f6 knight and opens diagonals for White\'s bishop pair.'
  },

  // PIN
  {
    id: 'pin-01',
    title: 'The Absolute Bishop Pin',
    category: 'pin',
    difficulty: 'beginner',
    rating: 1100,
    fen: 'rnbqk2r/pppp1ppp/5n2/4p3/1b2P3/2NP1N2/PPP2PPP/R1BQKB1R b KQkq - 0 4',
    playerColor: 'black',
    expectedMoves: ['Bxc3+', 'bxc3', 'd6'],
    opponentResponses: {
      'Bxc3+': 'bxc3'
    },
    goal: 'Exploit the pinned knight to inflict doubled isolated pawns on White\'s queenside.',
    hint: 'Capture the pinned piece directly to ruin White\'s pawn structure.',
    explanation: 'The bishop on b4 pinned the knight to White\'s king. Capturing on c3 leaves White with doubled c-pawns and an exposed king file.'
  },
  {
    id: 'pin-02',
    title: 'Queen Skewer-Pin on the e-File',
    category: 'pin',
    difficulty: 'intermediate',
    rating: 1450,
    fen: '4r1k1/ppp2ppp/8/3q4/3P4/2P5/PP1Q1PPP/4R1K1 b - - 1 18',
    playerColor: 'black',
    expectedMoves: ['Rxe1+', 'Qxe1', 'Kf8'],
    opponentResponses: {
      'Rxe1+': 'Qxe1'
    },
    goal: 'Trade down into an active king position while neutralizing back-rank mating threats.',
    hint: 'Control the open e-file by trading rooks and stepping the king up.',
    explanation: 'Tactical liquidation: Eliminating White\'s back rank rook relieves all mating pressure and gives Black full freedom.'
  },

  // SKEWER
  {
    id: 'skewer-01',
    title: 'Diagonal Rook Skewer',
    category: 'skewer',
    difficulty: 'intermediate',
    rating: 1320,
    fen: '8/5pk1/4p1p1/7p/7P/2B3P1/5PK1/1r6 b - - 1 35',
    playerColor: 'black',
    expectedMoves: ['Kg8', 'Bd4', 'Rb4'],
    opponentResponses: {
      'Kg8': 'Bd4'
    },
    goal: 'Step out of the bishop check safely and counter-attack White\'s bishop.',
    hint: 'Move the king away from the diagonal, then hit the bishop with your rook.',
    explanation: 'Escaping the check cleanly neutralizes White\'s skewer and activates Black\'s heavy rook to dominate the board.'
  },
  {
    id: 'skewer-02',
    title: 'Queen and King Line Skewer',
    category: 'skewer',
    difficulty: 'advanced',
    rating: 1720,
    fen: '2r3k1/5ppp/8/3Q4/8/1B6/P4PPP/4R1K1 w - - 0 1',
    playerColor: 'white',
    expectedMoves: ['Qxf7+', 'Kh8', 'Re8+'],
    opponentResponses: {
      'Qxf7+': 'Kh8'
    },
    goal: 'Crash through f7 with devastating checks leading to an unstoppable skewer-mate.',
    hint: 'Target the weak f7 square with queen and bishop battery.',
    explanation: '1. Qxf7+ Kh8 2. Re8+ Rxe8 3. Qxe8# delivers a decisive back-rank mate backed by the bishop on b3.'
  },

  // DOUBLE ATTACK
  {
    id: 'double-01',
    title: 'Queen Central Double Threat',
    category: 'double_attack',
    difficulty: 'beginner',
    rating: 1200,
    fen: 'r1bqk2r/pppp1ppp/2n5/4P3/1bB1n3/2N2N2/PPPP2PP/R1BQK2R b KQkq - 0 6',
    playerColor: 'black',
    expectedMoves: ['Nxc3', 'bxc3', 'Be7'],
    opponentResponses: {
      'Nxc3': 'bxc3'
    },
    goal: 'Eliminate White\'s key defender and preserve your bishop with secure advantage.',
    hint: 'Exchange the active knight on c3 to damage White\'s queenside.',
    explanation: 'Capturing on c3 destroys White\'s central coordination while safely safeguarding the bishop.'
  },

  // DISCOVERED ATTACK
  {
    id: 'discovered-01',
    title: 'Discovered Check Win',
    category: 'discovered_attack',
    difficulty: 'intermediate',
    rating: 1400,
    fen: 'r1b1k2r/pppp1ppp/8/4q3/1bP5/2N1P3/PP3PPP/R2QKB1R w KQkq - 0 10',
    playerColor: 'white',
    expectedMoves: ['Qd4', 'Qxd4', 'exd4'],
    opponentResponses: {
      'Qd4': 'Qxd4'
    },
    goal: 'Centralize the queen with tempo, neutralizing Black\'s pinning pressure.',
    hint: 'Centralize your queen to challenge Black\'s queen directly.',
    explanation: 'Offering the queen trade relieves the pin on c3 and gives White an active pawn mass in the center.'
  },

  // MATE IN 1
  {
    id: 'mate1-01',
    title: "Scholar's Execution",
    category: 'mate_in_1',
    difficulty: 'beginner',
    rating: 900,
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    playerColor: 'white',
    expectedMoves: ['Qxf7#'],
    opponentResponses: {},
    goal: 'Deliver checkmate in 1 move by attacking the undefended f7 weakness.',
    hint: 'The queen and bishop both zero in on f7!',
    explanation: '1. Qxf7# is checkmate. The black king cannot escape, capture the queen (defended by the bishop on c4), or block the check.'
  },
  {
    id: 'mate1-02',
    title: 'Back Rank Guillotine',
    category: 'mate_in_1',
    difficulty: 'beginner',
    rating: 950,
    fen: '6k1/5ppp/8/8/8/8/4rPPP/2R3K1 w - - 0 1',
    playerColor: 'white',
    expectedMoves: ['Rc8+'],
    opponentResponses: {},
    goal: 'Capitalize on Black\'s trapped king trapped behind its pawns.',
    hint: 'Slide your rook to the 8th rank for the back rank kill.',
    explanation: '1. Rc8+ forces 1... Re8 2. Rxe8# because Black has no luft (escape squares on g7 or h7).'
  },

  // MATE IN 2
  {
    id: 'mate2-01',
    title: 'Smothered Mate Sequence',
    category: 'mate_in_2',
    difficulty: 'intermediate',
    rating: 1550,
    fen: '6k1/5Npp/8/8/8/8/5PPP/4Q1K1 w - - 0 1',
    playerColor: 'white',
    expectedMoves: ['Qe8#'],
    opponentResponses: {},
    goal: 'Cut off all flight squares with immediate queen precision.',
    hint: 'The knight on f7 covers crucial escape squares while the queen attacks.',
    explanation: '1. Qe8# concludes the game instantly as the knight prevents any escape to g7 or h8.'
  },
  {
    id: 'mate2-02',
    title: "Anastasia's Mate Pattern",
    category: 'mate_in_2',
    difficulty: 'intermediate',
    rating: 1650,
    fen: '5rk1/1p3ppp/8/1N6/8/8/5PPP/R5K1 w - - 0 1',
    playerColor: 'white',
    expectedMoves: ['Nd6', 'b6', 'Ra7'],
    opponentResponses: {
      'Nd6': 'b6'
    },
    goal: 'Invade the 7th rank with rook and knight coordination.',
    hint: 'Reposition your knight to attack the base of Black\'s pawns.',
    explanation: 'Coordinating the knight on d6 and rook on the 7th rank restricts Black\'s king and wins material decisively.'
  },

  // MATE IN 3+
  {
    id: 'mate3-01',
    title: "Boden's Crossfire Mating Net",
    category: 'mate_in_3',
    difficulty: 'advanced',
    rating: 1850,
    fen: '2kr3r/pppn1ppp/4b3/8/1b1N4/2N5/PPP2PPP/2K1RB1R w - - 3 13',
    playerColor: 'white',
    expectedMoves: ['Nxe6', 'fxe6', 'Rxe6'],
    opponentResponses: {
      'Nxe6': 'fxe6'
    },
    goal: 'Dismantle Black\'s defensive bishop pair and capture free central material.',
    hint: 'Liquidate Black\'s active bishop on e6 to weaken their pawn structure.',
    explanation: '1. Nxe6 fxe6 2. Rxe6 strips Black of defensive assets and secures a clean pawn advantage.'
  },

  // SACRIFICE
  {
    id: 'sac-01',
    title: 'Greek Gift Bishop Sacrifice',
    category: 'sacrifice',
    difficulty: 'intermediate',
    rating: 1500,
    fen: 'r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 3 7',
    playerColor: 'white',
    expectedMoves: ['Bxh7+', 'Kxh7', 'Ng5+'],
    opponentResponses: {
      'Bxh7+': 'Kxh7'
    },
    goal: 'Shatter the black king\'s pawn shelter with the timeless Greek Gift sacrifice on h7.',
    hint: 'Sacrifice the bishop on h7 with check, followed by the knight leap to g5.',
    explanation: 'The quintessential Greek Gift sacrifice! 1. Bxh7+ Kxh7 2. Ng5+ draws the king into the open where the queen joins the attack on h5 or d3.'
  }
];

export const ALL_PUZZLES = [...CHAMPIONSHIP_SCENARIOS, ...TACTICAL_PUZZLES];
