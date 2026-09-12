import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMultiplayer } from '../context/MultiplayerContext';
import { useAnalysis } from '../context/AnalysisContext';
import { useBeta } from '../context/BetaContext';
import { GlassCard } from '../components/GlassCard';
import { fetchGameHistory } from '../services/api';
import { COUNTRIES } from '../data/multiplayerData';
import { 
  User, 
  Trophy, 
  Flame, 
  Calendar, 
  Swords, 
  Award, 
  Clock, 
  ExternalLink,
  ShieldAlert,
  Zap,
  Globe,
  Bot,
  ChevronDown,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Edit3,
  Bell,
  HardDrive,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export const ProfilePage = ({ onNavigate }) => {
  const { user, isGuest } = useAuth();
  const { 
    userRatings, 
    userCountry, 
    updateProfileCountry, 
    userStats, 
    matchHistory 
  } = useMultiplayer();
  const { analyzePgn } = useAnalysis();

  const {
    isFoundingPlayer,
    supporterTitle,
    profileFrame,
    updateProfileFrame,
    avatarId,
    updateAvatar,
    bio,
    updateBio,
    favoriteOpening,
    updateFavoriteOpening,
    notificationPreferences,
    updateNotificationPreferences,
    isOnline,
    avatarOptions,
    profileFrames,
    favoriteOpenings
  } = useBeta();

  const [offlineGames, setOfflineGames] = useState([]);
  const [loadingOffline, setLoadingOffline] = useState(true);
  const [activeHistoryTab, setActiveHistoryTab] = useState('online'); // 'online' | 'offline'
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(bio);

  useEffect(() => {
    fetchGameHistory(user?.id)
      .then((data) => {
        setOfflineGames(data || []);
      })
      .finally(() => setLoadingOffline(false));
  }, [user]);

  const getCountry = (code) => {
    if (!code) return { code: 'US', name: 'United States', flag: '🇺🇸' };
    if (COUNTRIES[code]) return COUNTRIES[code];
    if (Array.isArray(COUNTRIES)) {
      return COUNTRIES.find(c => c.code === code) || COUNTRIES[0] || { code: 'US', name: 'United States', flag: '🇺🇸' };
    }
    return { code: 'US', name: 'United States', flag: '🇺🇸' };
  };

  const currentCountry = getCountry(userCountry);
  const currentAvatar = avatarOptions.find(a => a.id === avatarId) || avatarOptions[0];

  const handleReviewMatch = (pgn) => {
    if (pgn && analyzePgn) {
      analyzePgn(pgn);
      onNavigate('game-review');
    }
  };

  const handleSaveBio = () => {
    updateBio(bioInput.trim());
    setIsEditingBio(false);
  };

  const totalMpGames = (userStats.wins || 0) + (userStats.losses || 0) + (userStats.draws || 0);
  const mpWinRate = totalMpGames > 0 ? Math.round((userStats.wins / totalMpGames) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Guest Mode Warning Banner */}
      {isGuest && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">You are playing in Guest Mode</div>
              <div className="text-xs text-slate-300">Ratings, badges, and founding status are preserved locally. Sign up to sync across devices!</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('signup')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:opacity-90 transition-all shrink-0"
          >
            Create Free Account
          </button>
        </div>
      )}

      {/* User Header Profile Card with Founding Beta Frame */}
      <GlassCard className="p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar with Animated Beta Frame & Country Flag */}
          <div className="relative group">
            <div className={`w-28 h-28 rounded-3xl p-1 shadow-2xl transition-transform duration-300 group-hover:scale-105 ${
              profileFrame === 'beta_founder' 
                ? 'bg-gradient-to-tr from-cyan-400 via-sky-500 to-amber-400 shadow-glow-cyan' 
                : profileFrame === 'solar_gold'
                ? 'bg-gradient-to-tr from-amber-400 via-gold-500 to-orange-500 shadow-glow-gold'
                : 'bg-dark-800 border-2 border-white/20'
            }`}>
              <div 
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                className="w-full h-full bg-dark-950 rounded-[22px] flex items-center justify-center text-5xl cursor-pointer hover:bg-dark-900 transition-colors"
                title="Click to change avatar"
              >
                {currentAvatar.emoji}
              </div>
            </div>

            {/* Country Flag Badge */}
            <div 
              className="absolute -bottom-2 -right-2 text-2xl bg-dark-900/95 rounded-full p-0.5 border border-white/20 shadow-md cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setShowCountrySelector(!showCountrySelector)}
              title={`Country: ${currentCountry.name} (Click to change)`}
            >
              {currentCountry.flag}
            </div>

            {/* Change Avatar Button hint */}
            <button
              onClick={() => setShowAvatarSelector(!showAvatarSelector)}
              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-dark-900 border border-white/20 text-slate-300 hover:text-white shadow-md text-[10px]"
              title="Select Avatar"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 text-center sm:text-left flex-1 min-w-0">
            
            {/* Username & Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{user?.username || 'Tactician'}</h1>
              
              {/* Founding Beta Player Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-amber-500/20 text-cyan-300 border border-cyan-400/50 text-[10px] font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Founding Player</span>
              </span>

              {/* Country Badge */}
              <button
                onClick={() => setShowCountrySelector(!showCountrySelector)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
              >
                <span>{currentCountry.flag}</span>
                <span className="font-semibold">{currentCountry.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Bio with inline edit */}
            <div className="max-w-xl">
              {isEditingBio ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    maxLength={100}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-dark-800 border border-cyan-400 text-xs text-white outline-none"
                  />
                  <button
                    onClick={handleSaveBio}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 text-black text-xs font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p 
                  onClick={() => { setBioInput(bio); setIsEditingBio(true); }}
                  className="text-xs text-slate-300 italic cursor-pointer hover:text-white flex items-center justify-center sm:justify-start gap-1.5 group"
                  title="Click to edit bio"
                >
                  <span>"{bio}"</span>
                  <Edit3 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              )}
            </div>

            {/* Favorite Opening & Metadata */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Fav Opening:</span>
                <select
                  value={favoriteOpening}
                  onChange={(e) => updateFavoriteOpening(e.target.value)}
                  className="bg-dark-800 border border-white/10 rounded-lg px-2 py-0.5 text-slate-200 text-xs font-semibold outline-none cursor-pointer hover:border-cyan-400/50"
                >
                  {favoriteOpenings.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Beta Access: 100% Free</span>
              </div>
            </div>

            {/* Country Selector Dropdown */}
            {showCountrySelector && (
              <div className="p-3 mt-3 bg-dark-900/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl max-w-sm grid grid-cols-2 gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                  Select Your Country
                </div>
                {(Array.isArray(COUNTRIES) ? COUNTRIES : Object.entries(COUNTRIES).map(([code, data]) => ({ code, ...data }))).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      updateProfileCountry(c.code);
                      setShowCountrySelector(false);
                    }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                      userCountry === c.code 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold' 
                        : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    {userCountry === c.code && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </button>
                ))}
              </div>
            )}

            {/* Avatar Selector Grid */}
            {showAvatarSelector && (
              <div className="p-4 mt-3 bg-dark-900/95 border border-cyan-400/40 rounded-2xl shadow-2xl backdrop-blur-xl max-w-md animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Choose Grandmaster Avatar</div>
                  <button onClick={() => setShowAvatarSelector(false)} className="text-xs text-slate-400 hover:text-white">Close</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {avatarOptions.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => {
                        updateAvatar(av.id);
                        setShowAvatarSelector(false);
                      }}
                      className={`p-2.5 rounded-xl flex flex-col items-center justify-center transition-all ${
                        avatarId === av.id
                          ? 'bg-cyan-500/25 border border-cyan-400 text-white shadow-glow-cyan'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <span className="text-2xl">{av.emoji}</span>
                      <span className="text-[9px] font-bold mt-1 truncate max-w-full">{av.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Quick Stats Pill */}
          <div className="flex gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-dark-800/80 border border-cyan-500/20 text-center shadow-lg">
              <div className="text-[10px] uppercase font-bold text-cyan-400 flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> Overall ELO
              </div>
              <div className="text-2xl font-mono font-black text-cyan-300 mt-0.5">
                {userRatings.overall || 1340}
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-dark-800/80 border border-amber-500/20 text-center shadow-lg">
              <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" /> Streak
              </div>
              <div className="text-2xl font-mono font-black text-amber-400 mt-0.5">
                {user?.daily_streak || 1}d
              </div>
            </div>
          </div>

        </div>
      </GlassCard>

      {/* Ratings by Multiplayer Mode */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Competitive Mode Ratings
          </h2>
          <button
            onClick={() => onNavigate('multiplayer')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
          >
            Play Ranked Match →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <GlassCard className="p-4 bg-gradient-to-b from-orange-500/10 to-transparent border-orange-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">⚡</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 px-2 py-0.5 rounded-full bg-orange-500/10">
                1+0 • 2+1
              </span>
            </div>
            <div className="text-xs text-slate-400 font-semibold">Bullet</div>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {userRatings.bullet || 1300}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">FIDE Elo calculation</div>
          </GlassCard>

          <GlassCard className="p-4 bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">🔥</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10">
                3+0 • 5+0
              </span>
            </div>
            <div className="text-xs text-slate-400 font-semibold">Blitz</div>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {userRatings.blitz || 1340}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Primary mode</div>
          </GlassCard>

          <GlassCard className="p-4 bg-gradient-to-b from-cyan-500/10 to-transparent border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">⏱️</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10">
                10+0 • 15+10
              </span>
            </div>
            <div className="text-xs text-slate-400 font-semibold">Rapid</div>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {userRatings.rapid || 1400}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Tactical depth</div>
          </GlassCard>

          <GlassCard className="p-4 bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">🏛️</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10">
                30+0
              </span>
            </div>
            <div className="text-xs text-slate-400 font-semibold">Classical</div>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {userRatings.classical || 1440}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Master discipline</div>
          </GlassCard>
        </div>
      </div>

      {/* Notifications & Offline Cache Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Notification Preferences */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Notification Preferences</h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Daily Practice Reminder (19:00)</span>
              <input
                type="checkbox"
                checked={notificationPreferences.dailyReminder}
                onChange={(e) => updateNotificationPreferences({ ...notificationPreferences, dailyReminder: e.target.checked })}
                className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Tactics Puzzle Scramble Alerts</span>
              <input
                type="checkbox"
                checked={notificationPreferences.puzzleReminder}
                onChange={(e) => updateNotificationPreferences({ ...notificationPreferences, puzzleReminder: e.target.checked })}
                className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Streak Preservation Reminders</span>
              <input
                type="checkbox"
                checked={notificationPreferences.streakReminder}
                onChange={(e) => updateNotificationPreferences({ ...notificationPreferences, streakReminder: e.target.checked })}
                className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Beta Updates & Changelog Notes</span>
              <input
                type="checkbox"
                checked={notificationPreferences.betaUpdates}
                onChange={(e) => updateNotificationPreferences({ ...notificationPreferences, betaUpdates: e.target.checked })}
                className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
              />
            </label>
          </div>
        </GlassCard>

        {/* Offline Support & Content Cache */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Offline Learning Cache</h3>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {isOnline ? 'Online' : 'Offline Mode'}
            </span>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span>Cached Academy Lessons:</span>
              <span className="font-mono text-cyan-300 font-bold">17 of 17 Units</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cached Tactics Puzzles:</span>
              <span className="font-mono text-cyan-300 font-bold">20 Puzzles</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Offline Availability:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Ready for flights & offline practice
              </span>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Match History Tabs */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <Swords className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Match History & PGN Archive</h3>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-dark-900/80 border border-white/10 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveHistoryTab('online')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeHistoryTab === 'online'
                  ? 'bg-cyan-500 text-black shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Online Ranked ({matchHistory.length})
            </button>
            <button
              onClick={() => setActiveHistoryTab('offline')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeHistoryTab === 'offline'
                  ? 'bg-cyan-500 text-black shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Offline Solo ({offlineGames.length})
            </button>
          </div>
        </div>

        {/* ONLINE MATCH HISTORY */}
        {activeHistoryTab === 'online' && (
          <div>
            {matchHistory.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <div className="text-4xl">⚔️</div>
                <div className="text-sm font-semibold text-slate-300">No online matches played yet.</div>
                <button
                  onClick={() => onNavigate('multiplayer')}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-black font-black text-xs uppercase tracking-wider shadow-glow-cyan hover:opacity-90 transition-all"
                >
                  Enter Multiplayer Lobby
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/5 pb-2">
                      <th className="py-2.5 font-medium">Opponent</th>
                      <th className="py-2.5 font-medium">Mode</th>
                      <th className="py-2.5 font-medium">Result</th>
                      <th className="py-2.5 font-medium">Rating Δ</th>
                      <th className="py-2.5 font-medium">Moves</th>
                      <th className="py-2.5 font-medium">Date</th>
                      <th className="py-2.5 font-medium text-right">Coach Analysis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {matchHistory.map((m) => {
                      const oppCountry = getCountry(m.opponent_country);
                      const isWin = m.result === 'win';
                      const isLoss = m.result === 'loss';

                      return (
                        <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{oppCountry.flag}</span>
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  {m.opponent_name}
                                  <span className="text-[10px] text-slate-400 font-mono font-normal">
                                    ({m.opponent_rating || 1350})
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 capitalize">
                                  Played as {m.player_color}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300 capitalize">
                              {m.mode} ({m.time_control})
                            </span>
                          </td>

                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider ${
                              isWin 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : isLoss 
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                : 'bg-slate-700 text-slate-300'
                            }`}>
                              {m.result}
                            </span>
                          </td>

                          <td className="py-3 font-mono font-bold">
                            {m.rating_delta > 0 ? (
                              <span className="text-emerald-400 flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3" /> +{m.rating_delta}
                              </span>
                            ) : m.rating_delta < 0 ? (
                              <span className="text-red-400 flex items-center gap-0.5">
                                <TrendingDown className="w-3 h-3" /> {m.rating_delta}
                              </span>
                            ) : (
                              <span className="text-slate-400 flex items-center gap-0.5">
                                <Minus className="w-3 h-3" /> 0
                              </span>
                            )}
                          </td>

                          <td className="py-3 font-mono text-slate-400">{m.moves_count || m.moves?.length || 0}</td>
                          
                          <td className="py-3 text-slate-500">
                            {m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Today'}
                          </td>

                          <td className="py-3 text-right">
                            {m.pgn ? (
                              <button
                                onClick={() => handleReviewMatch(m.pgn)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 font-bold text-[11px] transition-colors shadow-sm"
                                title="Analyze with Coach Orion"
                              >
                                <Bot className="w-3 h-3" />
                                <span>Review</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-600">No PGN</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* OFFLINE MATCH HISTORY */}
        {activeHistoryTab === 'offline' && (
          <div>
            {loadingOffline ? (
              <div className="py-12 text-center text-xs text-slate-500">Loading matches from database...</div>
            ) : offlineGames.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <div className="text-3xl">♟️</div>
                <div className="text-xs">No offline games recorded yet. Start a solo match to log your moves!</div>
                <button
                  onClick={() => onNavigate('play')}
                  className="mt-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs"
                >
                  Play Offline Match
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/5 pb-2">
                      <th className="py-2 font-medium">Opponent</th>
                      <th className="py-2 font-medium">Result</th>
                      <th className="py-2 font-medium">Moves</th>
                      <th className="py-2 font-medium">Type</th>
                      <th className="py-2 font-medium">Date</th>
                      <th className="py-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {offlineGames.map((g) => (
                      <tr key={g.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-semibold text-white">{g.opponent_name || 'Pass & Play'}</td>
                        <td className="py-3 font-mono font-bold">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            g.result === '1-0' ? 'bg-emerald-500/20 text-emerald-400' :
                            g.result === '0-1' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {g.result}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400">{g.moves_count || 0}</td>
                        <td className="py-3 capitalize text-slate-400">{g.game_type || 'offline'}</td>
                        <td className="py-3 text-slate-500">
                          {g.created_at ? new Date(g.created_at).toLocaleDateString() : 'Today'}
                        </td>
                        <td className="py-3 text-right">
                          {g.pgn ? (
                            <button
                              onClick={() => handleReviewMatch(g.pgn)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-[11px] font-bold"
                            >
                              <Bot className="w-3 h-3" /> Review
                            </button>
                          ) : (
                            <span className="text-slate-600 text-[10px]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </GlassCard>

    </div>
  );
};
