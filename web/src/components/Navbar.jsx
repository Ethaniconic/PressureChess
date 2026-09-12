import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBeta } from '../context/BetaContext';
import { 
  Trophy, 
  Flame, 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  Swords, 
  Globe, 
  Sparkles,
  MessageSquarePlus,
  GitCommit
} from 'lucide-react';

export const Navbar = ({ currentTab, onNavigate }) => {
  const { user, isGuest, logout } = useAuth();
  const { openFeedback, openWelcomeModal, profileFrame, isFoundingPlayer } = useBeta();

  const isMultiplayerActive = currentTab === 'multiplayer' || currentTab === 'multiplayer-game';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-brand via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <img 
              src="/icon.jpg" 
              alt="PressureChess" 
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="text-xl drop-shadow-sm">⚡</span>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-gold-400 border-2 border-dark-950 flex items-center justify-center text-[7px] font-black text-black">
              ♟
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white flex items-center">
                PRESSURE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-brand to-sky-300">CHESS</span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openWelcomeModal();
                }}
                className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-amber-500/20 text-cyan-300 border border-cyan-400/60 text-[9px] font-black uppercase tracking-wider shadow-glow-cyan hover:scale-105 transition-transform"
                title="Public Beta (100% Free) - Click to view Founding Player benefits"
              >
                BETA
              </button>
            </div>
            <span className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase flex items-center gap-1 -mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-brand animate-ping inline-block" />
              Founding Player Release
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTab === 'home' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            Dashboard
          </button>

          {/* Online Multiplayer Button */}
          <button
            onClick={() => onNavigate('multiplayer')}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
              isMultiplayerActive
                ? 'bg-gradient-to-r from-cyan-500/30 to-sky-500/30 text-cyan-300 border border-cyan-400/60 shadow-glow-cyan font-black' 
                : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20 font-bold'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span className="tracking-wide">Multiplayer</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => onNavigate('leaderboard')}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
              currentTab === 'leaderboard'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-400/60 shadow-glow-gold font-black' 
                : 'text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent font-bold'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Leaderboards</span>
          </button>

          <button
            onClick={() => onNavigate('academy')}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
              currentTab === 'academy' || currentTab === 'lesson-player'
                ? 'bg-cyan-500/25 text-white border border-cyan-400/60 shadow-glow-cyan font-black' 
                : 'text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent font-bold'
            }`}
          >
            <span className="text-sm">🎓</span>
            <span className="font-black text-white tracking-wide">Academy</span>
          </button>

          <button
            onClick={() => onNavigate('pressure-trainer')}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
              currentTab === 'pressure-trainer' || currentTab === 'puzzle-player' || currentTab === 'tactics-stats'
                ? 'bg-amber-500/25 text-white border border-amber-400/60 shadow-glow-gold font-black' 
                : 'text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent font-bold'
            }`}
          >
            <span className="text-sm">⚡</span>
            <span className="font-black text-white tracking-wide">Pressure</span>
          </button>

          <button
            onClick={() => onNavigate('game-review')}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
              currentTab === 'game-review' || currentTab === 'review-dashboard'
                ? 'bg-cyan-500/25 text-white border border-cyan-400/60 shadow-glow-cyan font-black' 
                : 'text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent font-bold'
            }`}
          >
            <span className="text-sm">🤖</span>
            <span className="font-black text-white tracking-wide">Coach Review</span>
          </button>

          <button
            onClick={() => onNavigate('changelog')}
            className={`px-2.5 py-1.5 rounded-xl text-xs transition-all hidden xl:flex items-center gap-1.5 ${
              currentTab === 'changelog'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Changelog & Roadmap"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Changelog</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'settings' 
                ? 'bg-white/15 text-white border border-white/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
            title="Settings"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* User / Auth / Feedback Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Feedback Button */}
          <button
            onClick={() => openFeedback('feature', 'General', 5)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            title="Give Feedback directly to founders"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Feedback</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              {/* Daily Streak Badge */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                <span>{user.daily_streak || 1}</span>
              </div>

              {/* Profile Pill with Beta Founding Glow */}
              <button
                onClick={() => onNavigate('profile')}
                className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl border text-xs font-semibold transition-all ${
                  currentTab === 'profile'
                    ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-glow-cyan'
                    : profileFrame === 'beta_founder'
                    ? 'border-cyan-400/50 bg-cyan-500/10 text-slate-200 hover:border-cyan-400'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-dark-700 flex items-center justify-center text-xs">
                  🌟
                </div>
                <div className="text-left hidden md:block">
                  <div className="truncate max-w-[90px]">{user.username}</div>
                  <div className="text-[10px] text-cyan-400 font-bold">
                    Founding Beta
                  </div>
                </div>
              </button>

              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:opacity-90 shadow-glow-gold transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
