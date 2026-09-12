// PressureChess Mobile Beta Data Catalog & Configuration

export const BETA_CONFIG = {
  version: 'v0.5.0',
  phase: 'Phase 5 — Public Beta Release',
  releaseDate: 'September 2026',
  badge: 'Founding Beta Pioneer',
  freePeriod: 'All features 100% free for founding beta players'
};

export const AVATAR_OPTIONS = [
  { id: 'pawn_classic', name: 'Classic Pawn', emoji: '♟️', category: 'Pieces' },
  { id: 'knight_tactician', name: 'Tactical Knight', emoji: '🐴', category: 'Pieces' },
  { id: 'bishop_sniper', name: 'Diagonal Bishop', emoji: '🎯', category: 'Pieces' },
  { id: 'rook_fortress', name: 'Castle Rook', emoji: '🏰', category: 'Pieces' },
  { id: 'queen_empower', name: 'Royal Queen', emoji: '👑', category: 'Pieces' },
  { id: 'king_master', name: 'Grandmaster King', emoji: '🤴', category: 'Pieces' },
  { id: 'coach_orion', name: 'Coach Orion', emoji: '🤖', category: 'AI Persona' },
  { id: 'pressure_bolt', name: 'Lightning Scramble', emoji: '⚡', category: 'Energy' },
  { id: 'fire_streak', name: 'Blazing Streak', emoji: '🔥', category: 'Energy' },
  { id: 'cyber_tactics', name: 'Cyber Tactician', emoji: '🛡️', category: 'Futuristic' },
  { id: 'sword_duelist', name: 'Multiplayer Duelist', emoji: '⚔️', category: 'Competitive' },
  { id: 'trophy_champion', name: 'Arena Champion', emoji: '🏆', category: 'Competitive' }
];

export const PROFILE_FRAMES = [
  { id: 'beta_founder', name: 'Founding Beta Player', color: '#00E5FF', badge: '✨ FOUNDER' },
  { id: 'solar_gold', name: 'Solar Grandmaster', color: '#F59E0B', badge: '👑 GOLD' },
  { id: 'emerald_tactics', name: 'Tactical Prodigy', color: '#10B981', badge: '⚡ MASTER' },
  { id: 'midnight_classic', name: 'Midnight Sapphire', color: '#475569', badge: 'CLASSIC' }
];

export const FAVORITE_OPENINGS = [
  'Sicilian Defense (1. e4 c5)',
  'Ruy Lopez (1. e4 e5 2. Nf3 Nc6 3. Bb5)',
  'French Defense (1. e4 e6)',
  'Caro-Kann Defense (1. e4 c6)',
  "Queen's Gambit (1. d4 d5 2. c4)",
  "King's Indian Defense (1. d4 Nf6 2. c4 g6)",
  'Italian Game (1. e4 e5 2. Nf3 Nc6 3. Bc4)',
  'London System (1. d4 d5 2. Bf4)',
  'English Opening (1. c4)',
  'Scandinavian Defense (1. e4 d5)',
  'Nimzo-Indian Defense (1. d4 Nf6 2. c4 e6 3. Nc3 Bb4)',
  'Dutch Defense (1. d4 f5)'
];

export const MULTI_METRIC_LEADERBOARDS = {
  weekly_xp: [
    { rank: 1, username: 'Tactician (You)', country: 'US', score: '3,850 XP', tag: 'Top Learner', isCurrentUser: true },
    { rank: 2, username: 'Pragg_Storm', country: 'IN', score: '3,420 XP', tag: 'Fast Solver' },
    { rank: 3, username: 'Magnus_Clone', country: 'NO', score: '3,180 XP', tag: 'Mastery Tier III' },
    { rank: 4, username: 'Hikaru_Stream', country: 'US', score: '2,940 XP', tag: 'Tactics Rush' },
    { rank: 5, username: 'Nodirbek_Speed', country: 'UZ', score: '2,750 XP', tag: 'Forks Expert' }
  ],
  monthly_xp: [
    { rank: 1, username: 'Pragg_Storm', country: 'IN', score: '14,200 XP', tag: 'Academy Champion' },
    { rank: 2, username: 'Magnus_Clone', country: 'NO', score: '13,850 XP', tag: 'All 17 Units' },
    { rank: 3, username: 'Tactician (You)', country: 'US', score: '12,900 XP', tag: 'Beta Pioneer', isCurrentUser: true },
    { rank: 4, username: 'Alireza_Flair', country: 'FR', score: '11,400 XP', tag: 'Sacrifice Master' },
    { rank: 5, username: 'Hikaru_Stream', country: 'US', score: '10,950 XP', tag: 'Bullet Specialist' }
  ],
  puzzle_streak: [
    { rank: 1, username: 'Nodirbek_Speed', country: 'UZ', score: '34 Streak', tag: 'Flawless 10s' },
    { rank: 2, username: 'Tactician (You)', country: 'US', score: '28 Streak', tag: 'Pin Smasher', isCurrentUser: true },
    { rank: 3, username: 'Duda_Tactics', country: 'PL', score: '26 Streak', tag: 'Sudden Death' },
    { rank: 4, username: 'Keymer_Precision', country: 'DE', score: '22 Streak', tag: 'Endgame Pro' },
    { rank: 5, username: 'Vishy_Prodigy', country: 'IN', score: '21 Streak', tag: 'Tactics Rusher' }
  ],
  beta_founders: [
    { rank: 1, username: 'Tactician (You)', country: 'US', score: 'Founder #001', tag: 'Founding Beta Player', isCurrentUser: true },
    { rank: 2, username: 'Dan_Pioneer', country: 'CA', score: 'Founder #002', tag: 'Founding Beta Player' },
    { rank: 3, username: 'Elena_Tactics', country: 'UK', score: 'Founder #003', tag: 'Founding Beta Player' },
    { rank: 4, username: 'Kai_Speed', country: 'JP', score: 'Founder #004', tag: 'Founding Beta Player' },
    { rank: 5, username: 'Mateo_Gambit', country: 'ES', score: 'Founder #005', tag: 'Founding Beta Player' }
  ]
};

export const CHANGELOG_HISTORY = [
  {
    version: 'v0.5.0',
    date: 'September 2026',
    title: 'PressureChess Public Beta Release',
    badge: 'Latest Release',
    description: 'Welcome to the PressureChess Public Beta! Every feature is 100% free for founding players while we gather tactical feedback and build community trust.',
    features: [
      'Founding Beta Player status: Permanent badge, cyan-gold glowing profile frame, and Pioneer title',
      'In-App Feedback Center: Direct reporting for bugs, feature requests, and lesson/puzzle ratings',
      'In-App Changelog: Version timeline, release notes, and upcoming roadmap',
      'Multi-metric Leaderboards: Weekly XP, Monthly XP, Puzzle Streak, and Beta Founders',
      'Profile Enhancements: 12 grandmaster avatars, player biography, and favorite opening selector',
      'Offline Learning Cache: Practice cached academy lessons and tactics rush with zero internet connection',
      'Smart Notification Preferences: Practice reminders, puzzle scrambles, and beta patch notes'
    ],
    fixes: [
      'Dual clock synchronization enhanced for low-time sub-second scrambles',
      'Improved responsive box layouts across laptop and mobile viewports',
      'Prevented unwanted page jumps during move executions'
    ],
    upcoming: [
      'Coach Orion Audio Voice: Realistic speech narration of tactical moves and blunder explanations',
      'Tournament Arena: Automated Swiss and knockout elimination brackets',
      'Chess Clans & Teams: Form tactical squads and compete in weekly clan wars'
    ]
  },
  {
    version: 'v0.4.0',
    date: 'September 2026',
    title: 'Realtime Online Multiplayer & Global Elo',
    badge: 'Phase 4',
    description: 'Live ranked multiplayer arena across Bullet, Blitz, Rapid, and Classical with Supabase Realtime synchronization.',
    features: [
      '4 Multiplayer modes (Bullet 1+0, Blitz 3+0/5+0, Rapid 10+0, Classical 30+0)',
      'Matchmaking queue and 6-character private challenge room codes (e.g. PR-8291)',
      'Synchronized chess clocks with low-time warning visual pressure',
      'Captured pieces trays with real-time material advantage delta',
      'FIDE standard Elo calculation (K=32) updating live upon checkmate, resign, or draw',
      'Post-game 1-click "Review with Coach Orion" passing match PGN directly to Stockfish'
    ],
    fixes: [
      'Handled rapid draw offer/decline edge cases',
      'King-in-check square red flash alert'
    ],
    upcoming: []
  },
  {
    version: 'v0.3.0',
    date: 'September 2026',
    title: 'AI Chess Coach & Stockfish Game Review',
    badge: 'Phase 3',
    description: 'Interactive game review led by Coach Orion with dynamic evaluation bar and move classifications.',
    features: [
      'Stockfish engine evaluation with dynamic vertical evaluation bar (-10 to +10)',
      'Move classification tags: Brilliant (!!), Best (★), Great (!), Inaccuracy (?!), Mistake (?), Blunder (??)',
      'Coach Orion plain-English breakdown explaining why moves were mistakes and better alternatives',
      'Opening recognition catalog identifying ECO codes and name variations',
      'Personal Review Dashboard with accuracy progress graph and tactical weakness breakdown'
    ],
    fixes: [],
    upcoming: []
  },
  {
    version: 'v0.2.0',
    date: 'August 2026',
    title: 'Pressure Trainer & Tactics Scrambles',
    badge: 'Phase 2',
    description: 'High-adrenaline tactical rush with countdown timers and famous historical championship scrambles.',
    features: [
      'Pressure Trainer with 10s, 20s, 30s, and Sudden Death scramble modes',
      'Championship simulations from games of Kasparov, Tal, Anand, and Carlsen',
      'Tactical puzzle categories: Fork, Pin, Skewer, Double Attack, and Sacrifice'
    ],
    fixes: [],
    upcoming: []
  },
  {
    version: 'v0.1.0',
    date: 'August 2026',
    title: 'Interactive Academy Foundations',
    badge: 'Phase 0 & 1',
    description: '17 step-by-step interactive lessons spanning Beginner, Intermediate, and Advanced tiers.',
    features: [
      'Comprehensive curriculum covering board coordinates, piece movement, forks, pins, and endgames',
      'Pass & Play offline 2-player chess board with clock controls'
    ],
    fixes: [],
    upcoming: []
  }
];
