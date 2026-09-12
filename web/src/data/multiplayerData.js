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
  global: [],
  weekly: [],
  daily: [],
  friends: []
};
