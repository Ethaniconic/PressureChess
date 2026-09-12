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
  global: [],
  weekly: [],
  daily: [],
  friends: []
};
