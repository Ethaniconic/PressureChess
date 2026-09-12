// PressureChess Mobile Multiplayer Data & Configuration

export const MULTIPLAYER_MODES = {
  bullet: {
    id: 'bullet',
    name: 'Bullet',
    icon: '⚡',
    description: 'Ultra-fast blitz warfare. Pure reflex and intuition under extreme time crunch.',
    accentColor: '#FF6B00',
    timeControls: [
      { id: '1+0', name: '1 min', seconds: 60, increment: 0, tag: 'Hyper' },
      { id: '2+1', name: '2 | 1', seconds: 120, increment: 1, tag: 'Standard' }
    ]
  },
  blitz: {
    id: 'blitz',
    name: 'Blitz',
    icon: '🔥',
    description: 'Fast-paced tactical showdown. Rapid calculation with clock pressure.',
    accentColor: '#F59E0B',
    timeControls: [
      { id: '3+0', name: '3 min', seconds: 180, increment: 0, tag: 'Popular' },
      { id: '3+2', name: '3 | 2', seconds: 180, increment: 2, tag: 'Increment' },
      { id: '5+0', name: '5 min', seconds: 300, increment: 0, tag: 'Classic' },
      { id: '5+3', name: '5 | 3', seconds: 300, increment: 3, tag: 'FIDE' }
    ]
  },
  rapid: {
    id: 'rapid',
    name: 'Rapid',
    icon: '⏱️',
    description: 'Strategic depth with time to calculate combinations and openings.',
    accentColor: '#00E5FF',
    timeControls: [
      { id: '10+0', name: '10 min', seconds: 600, increment: 0, tag: 'Standard' },
      { id: '15+10', name: '15 | 10', seconds: 900, increment: 10, tag: 'Classical Prep' }
    ]
  },
  classical: {
    id: 'classical',
    name: 'Classical',
    icon: '🏛️',
    description: 'Grandmaster tournament pacing for deep positional strategy.',
    accentColor: '#10B981',
    timeControls: [
      { id: '30+0', name: '30 min', seconds: 1800, increment: 0, tag: 'Marathon' }
    ]
  }
};

export const COUNTRIES = {
  US: { name: 'United States', flag: '🇺🇸' },
  IN: { name: 'India', flag: '🇮🇳' },
  NO: { name: 'Norway', flag: '🇳🇴' },
  UZ: { name: 'Uzbekistan', flag: '🇺🇿' },
  DE: { name: 'Germany', flag: '🇩🇪' },
  FR: { name: 'France', flag: '🇫🇷' },
  UK: { name: 'United Kingdom', flag: '🇬🇧' },
  CA: { name: 'Canada', flag: '🇨🇦' },
  BR: { name: 'Brazil', flag: '🇧🇷' },
  JP: { name: 'Japan', flag: '🇯🇵' },
  ES: { name: 'Spain', flag: '🇪🇸' },
  PL: { name: 'Poland', flag: '🇵🇱' }
};

export const SIMULATED_OPPONENTS = [
  { id: 'sim_1', name: 'Hikaru_Fan99', rating: 1420, country: 'US', avatar: '⚡' },
  { id: 'sim_2', name: 'Vishy_Prodigy', rating: 1380, country: 'IN', avatar: '♟️' },
  { id: 'sim_3', name: 'Nordic_Crusher', rating: 1460, country: 'NO', avatar: '🛡️' },
  { id: 'sim_4', name: 'Tashkent_Tactics', rating: 1490, country: 'UZ', avatar: '⚔️' },
  { id: 'sim_5', name: 'Berlin_Wall_88', rating: 1350, country: 'DE', avatar: '🏰' },
  { id: 'sim_6', name: 'Paris_Knight', rating: 1310, country: 'FR', avatar: '🐴' }
];

export const MOCK_LEADERBOARDS = {
  global: [
    { rank: 1, username: 'Magnus_Clone', country: 'NO', rating: 2845, wins: 412, losses: 38, draws: 90, tier: 'Grandmaster' },
    { rank: 2, username: 'Pragg_Storm', country: 'IN', rating: 2790, wins: 389, losses: 44, draws: 82, tier: 'Grandmaster' },
    { rank: 3, username: 'Nodirbek_Speed', country: 'UZ', rating: 2760, wins: 360, losses: 52, draws: 75, tier: 'Grandmaster' },
    { rank: 4, username: 'Hikaru_Stream', country: 'US', rating: 2755, wins: 540, losses: 80, draws: 110, tier: 'Grandmaster' },
    { rank: 5, username: 'Alireza_Flair', country: 'FR', rating: 2740, wins: 310, losses: 49, draws: 65, tier: 'Grandmaster' },
    { rank: 6, username: 'Duda_Tactics', country: 'PL', rating: 2680, wins: 290, losses: 61, draws: 70, tier: 'International Master' },
    { rank: 7, username: 'Keymer_Precision', country: 'DE', rating: 2650, wins: 275, losses: 58, draws: 62, tier: 'International Master' },
    { rank: 8, username: 'PressureKing', country: 'UK', rating: 2590, wins: 240, losses: 65, draws: 45, tier: 'Candidate Master' },
    { rank: 9, username: 'Samurai_Check', country: 'JP', rating: 2540, wins: 220, losses: 70, draws: 50, tier: 'Candidate Master' },
    { rank: 10, username: 'Rio_Gambit', country: 'BR', rating: 2490, wins: 205, losses: 75, draws: 40, tier: 'Expert' }
  ],
  weekly: [
    { rank: 1, username: 'Pragg_Storm', country: 'IN', rating: 2790, pointsGained: 68, wins: 24, losses: 2, draws: 4 },
    { rank: 2, username: 'Magnus_Clone', country: 'NO', rating: 2845, pointsGained: 52, wins: 18, losses: 1, draws: 3 },
    { rank: 3, username: 'Hikaru_Stream', country: 'US', rating: 2755, pointsGained: 46, wins: 32, losses: 6, draws: 5 },
    { rank: 4, username: 'PressureKing', country: 'UK', rating: 2590, pointsGained: 38, wins: 15, losses: 3, draws: 2 },
    { rank: 5, username: 'Tactician', country: 'US', rating: 1340, pointsGained: 32, wins: 12, losses: 4, draws: 2, isCurrentUser: true }
  ],
  daily: [
    { rank: 1, username: 'Hikaru_Stream', country: 'US', rating: 2755, pointsGained: 24, wins: 8, losses: 1, draws: 0 },
    { rank: 2, username: 'Tactician', country: 'US', rating: 1340, pointsGained: 16, wins: 5, losses: 1, draws: 0, isCurrentUser: true },
    { rank: 3, username: 'Tashkent_Tactics', country: 'UZ', rating: 1490, pointsGained: 14, wins: 4, losses: 0, draws: 1 }
  ],
  friends: [
    { rank: 1, username: 'Tactician (You)', country: 'US', rating: 1340, wins: 28, losses: 12, draws: 4, isCurrentUser: true },
    { rank: 2, username: 'ChessFriend_Dan', country: 'US', rating: 1315, wins: 22, losses: 18, draws: 5 },
    { rank: 3, username: 'Grandma_Gambit', country: 'CA', rating: 1280, wins: 19, losses: 14, draws: 2 },
    { rank: 4, username: 'RookRookie', country: 'UK', rating: 1190, wins: 14, losses: 25, draws: 3 }
  ]
};
