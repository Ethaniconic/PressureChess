/**
 * PressureChess Multiplayer Configuration & Catalog
 * Modes, time controls, country definitions, and curated leaderboards.
 */

export const MULTIPLAYER_MODES = [
  {
    id: "bullet",
    name: "Bullet",
    icon: "⚡",
    subtitle: "High adrenaline reflex chess",
    description: "Ultra-fast calculation. Win on time scramble or lightning tactical vision.",
    color: "from-amber-400 to-orange-500",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    timeControls: [
      { id: "1+0", name: "1 min", initialSecs: 60, incSecs: 0, tag: "Hyper Bullet" },
      { id: "2+1", name: "2 | 1", initialSecs: 120, incSecs: 1, tag: "Bullet Increment" }
    ]
  },
  {
    id: "blitz",
    name: "Blitz",
    icon: "🔥",
    subtitle: "The competitive standard",
    description: "The official standard for online competitive scrambles and tactical speed.",
    color: "from-cyan-400 to-sky-500",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    timeControls: [
      { id: "3+0", name: "3 min", initialSecs: 180, incSecs: 0, tag: "Most Popular" },
      { id: "3+2", name: "3 | 2", initialSecs: 180, incSecs: 2, tag: "Fischer Blitz" },
      { id: "5+0", name: "5 min", initialSecs: 300, incSecs: 0, tag: "Classic Blitz" },
      { id: "5+3", name: "5 | 3", initialSecs: 300, incSecs: 3, tag: "FIDE Blitz" }
    ]
  },
  {
    id: "rapid",
    name: "Rapid",
    icon: "⏱️",
    subtitle: "Strategic precision & deep calculation",
    description: "Ample clock time for deep positional strategy, prophylactic maneuvers, and calculation.",
    color: "from-emerald-400 to-teal-500",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    timeControls: [
      { id: "10+0", name: "10 min", initialSecs: 600, incSecs: 0, tag: "Standard Rapid" },
      { id: "15+10", name: "15 | 10", initialSecs: 900, incSecs: 10, tag: "Championship" }
    ]
  },
  {
    id: "classical",
    name: "Classical",
    icon: "🏛️",
    subtitle: "Tournament masterplay",
    description: "True test of endgame depth, pawn structures, and psychological endurance.",
    color: "from-indigo-400 to-purple-500",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    timeControls: [
      { id: "30+0", name: "30 min", initialSecs: 1800, incSecs: 0, tag: "Deep Classical" }
    ]
  }
];

export const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" }
];

// Attach key lookup for convenience and backwards compatibility
COUNTRIES.forEach((c) => {
  COUNTRIES[c.code] = c;
});


export const MOCK_LEADERBOARDS = {
  global: [
    { rank: 1, id: "u-101", username: "Vishy_Lightning", country: "IN", avatar: "👑", rating: 2810, wins: 1420, losses: 310, draws: 420, winRate: 66.0, streak: 8 },
    { rank: 2, id: "u-102", username: "Magnus_Ice", country: "NO", avatar: "⚡", rating: 2795, wins: 1380, losses: 290, draws: 480, winRate: 64.2, streak: 5 },
    { rank: 3, id: "u-103", username: "Hikaru_Speed", country: "US", avatar: "🔥", rating: 2780, wins: 1650, losses: 410, draws: 380, winRate: 67.6, streak: 12 },
    { rank: 4, id: "u-104", username: "Alireza_Tactics", country: "FR", avatar: "🎯", rating: 2745, wins: 980, losses: 260, draws: 310, winRate: 63.2, streak: 4 },
    { rank: 5, id: "u-105", username: "Pragg_Prodigy", country: "IN", avatar: "🛡️", rating: 2730, wins: 890, losses: 220, draws: 290, winRate: 63.6, streak: 6 },
    { rank: 6, id: "u-106", username: "Gukesh_King", country: "IN", avatar: "⚔️", rating: 2725, wins: 840, losses: 210, draws: 300, winRate: 62.2, streak: 7 },
    { rank: 7, id: "u-107", username: "Nordic_Crusher", country: "SE", avatar: "❄️", rating: 2690, wins: 720, losses: 240, draws: 250, winRate: 59.5, streak: 3 },
    { rank: 8, id: "u-108", username: "Berlin_Wall99", country: "DE", avatar: "🏰", rating: 2660, wins: 650, losses: 230, draws: 280, winRate: 56.0, streak: 2 },
    { rank: 9, id: "u-109", username: "PressureMaster", country: "US", avatar: "⚡", rating: 2610, wins: 540, losses: 190, draws: 210, winRate: 57.4, streak: 4 },
    { rank: 10, id: "u-110", username: "Samba_Gambit", country: "BR", avatar: "🌴", rating: 2580, wins: 490, losses: 180, draws: 190, winRate: 57.0, streak: 1 }
  ],
  weekly: [
    { rank: 1, id: "u-103", username: "Hikaru_Speed", country: "US", avatar: "🔥", rating: 2780, wins: 142, losses: 18, draws: 22, winRate: 78.0, streak: 12 },
    { rank: 2, id: "u-101", username: "Vishy_Lightning", country: "IN", avatar: "👑", rating: 2810, wins: 128, losses: 21, draws: 34, winRate: 70.0, streak: 8 },
    { rank: 3, id: "u-105", username: "Pragg_Prodigy", country: "IN", avatar: "🛡️", rating: 2730, wins: 98, losses: 14, draws: 19, winRate: 75.0, streak: 6 },
    { rank: 4, id: "u-106", username: "Gukesh_King", country: "IN", avatar: "⚔️", rating: 2725, wins: 88, losses: 16, draws: 24, winRate: 68.8, streak: 7 },
    { rank: 5, id: "u-102", username: "Magnus_Ice", country: "NO", avatar: "⚡", rating: 2795, wins: 76, losses: 12, draws: 28, winRate: 65.5, streak: 5 }
  ],
  daily: [
    { rank: 1, id: "u-103", username: "Hikaru_Speed", country: "US", avatar: "🔥", rating: 2780, wins: 28, losses: 2, draws: 4, winRate: 82.3, streak: 12 },
    { rank: 2, id: "u-104", username: "Alireza_Tactics", country: "FR", avatar: "🎯", rating: 2745, wins: 24, losses: 3, draws: 5, winRate: 75.0, streak: 4 },
    { rank: 3, id: "u-105", username: "Pragg_Prodigy", country: "IN", avatar: "🛡️", rating: 2730, wins: 19, losses: 2, draws: 3, winRate: 79.1, streak: 6 },
    { rank: 4, id: "u-101", username: "Vishy_Lightning", country: "IN", avatar: "👑", rating: 2810, wins: 18, losses: 3, draws: 6, winRate: 66.7, streak: 8 },
    { rank: 5, id: "u-107", username: "Nordic_Crusher", country: "SE", avatar: "❄️", rating: 2690, wins: 15, losses: 4, draws: 2, winRate: 71.4, streak: 3 }
  ],
  friends: [
    { rank: 1, id: "u-109", username: "PressureMaster", country: "US", avatar: "⚡", rating: 1480, wins: 54, losses: 19, draws: 21, winRate: 57.4, streak: 4 },
    { rank: 2, id: "u-guest", username: "You (Tactician)", country: "US", avatar: "♟️", rating: 1340, wins: 28, losses: 12, draws: 6, winRate: 60.9, streak: 2 },
    { rank: 3, id: "u-f01", username: "Alex_Kasparov", country: "US", avatar: "🎯", rating: 1310, wins: 38, losses: 26, draws: 14, winRate: 48.7, streak: 1 },
    { rank: 4, id: "u-f02", username: "SpeedyKnight", country: "GB", avatar: "🐴", rating: 1260, wins: 24, losses: 22, draws: 9, winRate: 43.6, streak: 0 }
  ]
};

export const SIMULATED_OPPONENTS = [
  { username: "Hikaru_Fan99", country: "US", rating: 1380, avatar: "🔥" },
  { username: "Vishy_Prodigy", country: "IN", rating: 1410, avatar: "👑" },
  { username: "Nordic_Crusher", country: "SE", rating: 1350, avatar: "❄️" },
  { username: "Berlin_Knight", country: "DE", rating: 1290, avatar: "🏰" },
  { username: "French_Defenseur", country: "FR", rating: 1330, avatar: "🎯" },
  { username: "Samba_Tactics", country: "BR", rating: 1320, avatar: "🌴" }
];
