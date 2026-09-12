import React, { useState } from 'react';
import { useMultiplayer } from '../context/MultiplayerContext';
import { MULTIPLAYER_MODES, COUNTRIES } from '../data/multiplayerData';
import { GlassCard } from '../components/GlassCard';
import {
  Swords,
  Zap,
  Flame,
  Clock,
  Trophy,
  Users,
  Copy,
  Check,
  ArrowRight,
  Shield,
  Sparkles,
  Search,
  Radio,
  Share2,
  Lock,
  Globe
} from 'lucide-react';

export const MultiplayerLobbyPage = ({ onNavigate }) => {
  const {
    selectedMode,
    setSelectedMode,
    selectedTimeControl,
    setSelectedTimeControl,
    matchmakingState,
    startQuickMatch,
    cancelMatchmaking,
    createPrivateRoom,
    joinPrivateRoom,
    userRatings,
    userStats,
    userCountry
  } = useMultiplayer();

  const [inputRoomCode, setInputRoomCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [createdCode, setCreatedCode] = useState(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [joinError, setJoinError] = useState(null);

  const activeModeObj = MULTIPLAYER_MODES.find((m) => m.id === selectedMode) || MULTIPLAYER_MODES[1];

  const handleStartQuickMatch = async (timeControlId) => {
    setSelectedTimeControl(timeControlId);
    await startQuickMatch(selectedMode, timeControlId);
    onNavigate?.('multiplayer-game');
  };

  const handleCreateRoom = async () => {
    setIsCreatingRoom(true);
    setJoinError(null);
    try {
      const game = await createPrivateRoom(selectedMode, selectedTimeControl);
      setCreatedCode(game.room_code);
      onNavigate?.('multiplayer-game');
    } catch (e) {
      setJoinError('Could not create room. Please try again.');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!inputRoomCode.trim()) return;
    setJoinError(null);
    try {
      await joinPrivateRoom(inputRoomCode.trim());
      onNavigate?.('multiplayer-game');
    } catch (e) {
      setJoinError(e.message || 'Invalid room code');
    }
  };

  const handleCopyCode = () => {
    if (!createdCode) return;
    navigator.clipboard.writeText(createdCode);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const userCountryObj = COUNTRIES.find((c) => c.code === userCountry) || COUNTRIES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Header & User Rating Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-brand/10 border border-cyan-brand/25 text-cyan-300 text-xs font-black uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-cyan-brand animate-pulse" />
            <span>Supabase Realtime Matchmaking • Instant Pairings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Online Multiplayer Arena</span>
            <span className="text-2xl">{userCountryObj.flag}</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Challenge players worldwide across Bullet, Blitz, Rapid, and Classical with synchronized clocks, real-time Elo rating stakes, and post-game AI coaching.
          </p>
        </div>

        {/* Live Ratings Pill Row */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="text-[10px] font-black uppercase text-amber-400">⚡ Bullet</div>
            <div className="text-base font-black text-white font-mono">{userRatings.bullet}</div>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-cyan-brand/10 border border-cyan-brand/20 text-xs">
            <div className="text-[10px] font-black uppercase text-cyan-300">🔥 Blitz</div>
            <div className="text-base font-black text-white font-mono">{userRatings.blitz}</div>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <div className="text-[10px] font-black uppercase text-emerald-400">⏱️ Rapid</div>
            <div className="text-base font-black text-white font-mono">{userRatings.rapid}</div>
          </div>
          <button
            onClick={() => onNavigate?.('leaderboard')}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs flex items-center gap-2 shadow-glow-gold transition-all"
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboards</span>
          </button>
        </div>
      </div>

      {/* Mode Selection Tabs (Bullet, Blitz, Rapid, Classical) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MULTIPLAYER_MODES.map((m) => {
          const isSelected = selectedMode === m.id;
          return (
            <div
              key={m.id}
              onClick={() => {
                setSelectedMode(m.id);
                setSelectedTimeControl(m.timeControls[0].id);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between group ${
                isSelected
                  ? 'bg-slate-900 border-cyan-brand shadow-glow-cyan/40 scale-[1.02]'
                  : 'bg-slate-900/60 border-white/[0.08] hover:border-white/20 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{m.icon}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                    {userRatings[m.id] || 1200} Elo
                  </span>
                </div>
                <h3 className="text-base font-black text-white group-hover:text-cyan-brand transition-colors">
                  {m.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{m.subtitle}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>{m.timeControls.map((tc) => tc.id).join(' • ')}</span>
                <span className={isSelected ? 'text-cyan-brand' : 'text-slate-500'}>
                  {isSelected ? 'Active' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Mode Time Controls & Quick Match Banner */}
      <GlassCard className="p-6 border-cyan-brand/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/20 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeModeObj.icon}</span>
              <h2 className="text-xl font-black text-white">
                {activeModeObj.name} Time Controls
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeModeObj.description} Tap a time control below for instant random matchmaking.
            </p>

            {/* Time Control Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {activeModeObj.timeControls.map((tc) => (
                <button
                  key={tc.id}
                  onClick={() => handleStartQuickMatch(tc.id)}
                  disabled={matchmakingState === 'searching'}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-black flex items-center gap-2 transition-all ${
                    selectedTimeControl === tc.id
                      ? 'bg-cyan-brand text-black border-cyan-brand shadow-glow-cyan'
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-cyan-brand/40'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{tc.id}</span>
                  <span className="text-[10px] font-semibold opacity-80 font-sans">({tc.tag})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Match Launch CTA */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            {matchmakingState === 'searching' ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-brand/40 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-cyan-brand font-black text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-brand animate-ping" />
                  <span>Searching for opponent ({selectedTimeControl})...</span>
                </div>
                <button
                  onClick={cancelMatchmaking}
                  className="px-4 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 transition-all"
                >
                  Cancel Search
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleStartQuickMatch(selectedTimeControl)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-brand via-sky-400 to-cyan-500 hover:from-cyan-400 hover:to-sky-300 text-black font-black text-sm flex items-center justify-center gap-2.5 shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Swords className="w-5 h-5" />
                <span>Play Quick Match ({selectedTimeControl})</span>
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* 2 Matchmaking Pillars: Friend Challenge & Private Room Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Friend Challenge */}
        <GlassCard className="p-6 border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white">Challenge a Friend</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create a custom game room with your chosen time control and share the invite code with a friend.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {createdCode ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-brand/30 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Your Room Code
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-cyan-brand tracking-wider">
                    {createdCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-xl bg-cyan-brand/20 text-cyan-300 hover:bg-cyan-brand/30 border border-cyan-brand/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleCreateRoom}
                disabled={isCreatingRoom}
                className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs flex items-center justify-center gap-2 border border-white/10 hover:border-cyan-brand/40 transition-all"
              >
                <Sparkles className="w-4 h-4 text-cyan-brand" />
                <span>Create Challenge Room</span>
              </button>
            )}
          </div>
        </GlassCard>

        {/* Pillar 2: Private Room Code */}
        <GlassCard className="p-6 border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white">Join with Room Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have a 6-character room code from a friend? Enter it below to join the match immediately.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={7}
                placeholder="e.g. PR-8291"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono font-bold text-sm tracking-widest uppercase focus:outline-none focus:border-cyan-brand/50"
              />
              <button
                onClick={handleJoinRoom}
                disabled={!inputRoomCode.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-brand hover:from-sky-300 hover:to-cyan-400 text-black font-black text-xs flex items-center gap-1.5 shadow-glow-cyan transition-all disabled:opacity-50"
              >
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {joinError && (
              <p className="text-xs text-rose-400 font-medium">{joinError}</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Online Arena Live Activity Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-slate-300">
            <span className="text-white font-black font-mono">1,482</span> players currently battling online
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Matchmaking response time: <span className="text-cyan-brand font-mono font-bold">&lt; 1.5s</span></span>
          <button
            onClick={() => onNavigate?.('profile')}
            className="text-cyan-brand hover:underline font-bold"
          >
            My Profile & Stats →
          </button>
        </div>
      </div>
    </div>
  );
};
