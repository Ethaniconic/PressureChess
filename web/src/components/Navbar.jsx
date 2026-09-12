import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBeta } from '../context/BetaContext';
import { 
  Trophy, 
  Flame, 
  Settings as SettingsIcon, 
  LogOut, 
  Swords, 
  MessageSquarePlus,
  GitCommit,
  Menu,
  X
} from 'lucide-react';

export const Navbar = ({ currentTab, onNavigate }) => {
  const { user, logout } = useAuth();
  const { openFeedback, openWelcomeModal, profileFrame } = useBeta();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isMultiplayerActive = currentTab === 'multiplayer' || currentTab === 'multiplayer-game';

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: null },
    { id: 'multiplayer', label: 'Multiplayer', icon: <Swords className="w-3.5 h-3.5" />, isGold: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'academy', label: 'Academy', icon: <span className="text-xs">🎓</span> },
    { id: 'pressure-trainer', label: 'Pressure', icon: <span className="text-xs">⚡</span> },
    { id: 'game-review', label: 'Coach', icon: <span className="text-xs">🤖</span> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#22242B] bg-[#0A0A0C]/95 backdrop-blur-2xl shadow-lg shadow-black/80">
      {/* Top light reflection line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Desktop Navbar: All contents horizontally centered */}
      <div className="w-full px-2 sm:px-4 lg:px-6 h-16 hidden lg:flex items-center justify-center relative">
        <div className="flex items-center justify-center gap-2 xl:gap-4 max-w-full">
          
          {/* Brand */}
          <div 
            onClick={() => { onNavigate('home'); }}
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
          >
            <div className="relative w-8 h-8 rounded-[5px] bg-[#141518] flex items-center justify-center shadow-md shadow-black/60 group-hover:scale-105 transition-transform duration-200 overflow-hidden border border-[#2D3039] border-t-white/40">
              <img 
                src="/icon.jpg" 
                alt="PressureChess" 
                className="absolute inset-0 w-full h-full object-cover rounded-[5px]"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="text-base drop-shadow-sm">⚡</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-[2px] bg-[#E5A93C] border border-[#0A0A0C] flex items-center justify-center text-[6px] font-black text-black">
                ♟
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-white flex items-center">
                PRESSURE<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A93C] to-[#F5C768]">CHESS</span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openWelcomeModal();
                }}
                className="px-1.5 py-0.5 rounded-[4px] bg-[#E5A93C]/15 text-[#E5A93C] border border-t-white/30 border-[#E5A93C]/40 text-[9px] font-black uppercase tracking-wider hover:scale-105 transition-transform"
                title="Public Beta (100% Free) - Click to view Founding Player benefits"
              >
                BETA
              </button>
            </div>
          </div>

          {/* Subtle Divider */}
          <div className="h-5 w-px bg-[#262833] flex-shrink-0" />

          {/* Navigation Links */}
          <nav className="flex items-center gap-0.5 xl:gap-1 bg-[#121316] p-1 rounded-[5px] border border-[#24262E] border-t-white/20 shadow-inner shadow-black/40 flex-shrink-0">
            {navItems.map((item) => {
              const isActive = 
                currentTab === item.id || 
                (item.id === 'multiplayer' && isMultiplayerActive) ||
                (item.id === 'academy' && currentTab === 'lesson-player') ||
                (item.id === 'pressure-trainer' && (currentTab === 'puzzle-player' || currentTab === 'tactics-stats')) ||
                (item.id === 'game-review' && currentTab === 'review-dashboard');

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-2 xl:px-3 py-1.5 rounded-[4px] text-xs transition-all flex items-center gap-1 xl:gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#E5A93C]/20 text-[#F5C768] border border-[#E5A93C]/50 border-t-white/40 shadow-sm font-bold'
                      : item.isGold
                      ? 'text-[#E5A93C] hover:text-[#F5C768] hover:bg-[#E5A93C]/10 border border-transparent font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent font-semibold'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => onNavigate('settings')}
              className={`p-1.5 rounded-[4px] text-xs font-semibold transition-all flex items-center justify-center ${
                currentTab === 'settings' 
                  ? 'bg-white/15 text-white border border-white/20 border-t-white/40' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              title="Settings"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Subtle Divider */}
          <div className="h-5 w-px bg-[#262833] flex-shrink-0" />

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 xl:gap-2 flex-shrink-0">
            {/* Feedback Button */}
            <button
              onClick={() => openFeedback('feature', 'General', 5)}
              className="px-2 xl:px-2.5 py-1.5 rounded-[5px] bg-[#E5A93C]/15 hover:bg-[#E5A93C]/25 border border-[#E5A93C]/40 border-t-white/30 text-[#E5A93C] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Give Feedback directly to founders"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span className="hidden xl:inline">Feedback</span>
            </button>

            {user ? (
              <div className="flex items-center gap-1.5 xl:gap-2">
                {/* Daily Streak Badge */}
                <div 
                  className="flex items-center gap-1 px-1.5 xl:px-2 py-1 rounded-[4px] bg-[#221708] border border-[#E5A93C]/35 text-[#E5A93C] text-xs font-bold"
                  title={`${user.daily_streak || 1} day streak`}
                >
                  <Flame className="w-3.5 h-3.5 fill-[#E5A93C]" />
                  <span>{user.daily_streak || 1}</span>
                </div>

                {/* Profile Pill */}
                <button
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-1.5 px-2 xl:px-2.5 py-1 rounded-[5px] border text-xs font-semibold transition-all ${
                    currentTab === 'profile'
                      ? 'border-[#E5A93C] bg-[#E5A93C]/15 text-[#F5C768] shadow-[0_0_12px_rgba(229,169,60,0.25)]'
                      : 'border-[#E5A93C]/50 bg-[#16171B] text-slate-200 hover:border-[#E5A93C]'
                  }`}
                  title={user.username}
                >
                  <div className="w-5 h-5 rounded-[3px] bg-[#1C1E24] flex items-center justify-center text-[10px]">
                    🌟
                  </div>
                  <span className="truncate max-w-[70px] xl:max-w-[110px] text-xs font-bold text-white">
                    {user.username}
                  </span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 rounded-[5px] text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3 py-1.5 rounded-[5px] text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all border border-[#24262E]"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-3 py-1.5 rounded-[5px] text-xs font-bold bg-[#E5A93C] hover:bg-[#F3BA54] text-black shadow-[0_0_12px_rgba(229,169,60,0.3)] transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Header (< lg): Clean Balanced Layout */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
        >
          <div className="relative w-8 h-8 rounded-[5px] bg-[#141518] flex items-center justify-center shadow-md shadow-black/60 overflow-hidden border border-[#2D3039]">
            <img 
              src="/icon.jpg" 
              alt="PressureChess" 
              className="absolute inset-0 w-full h-full object-cover rounded-[5px]"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="text-base">⚡</span>
          </div>
          <span className="text-sm font-black tracking-tight text-white">
            PRESSURE<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A93C] to-[#F5C768]">CHESS</span>
          </span>
        </div>

        {/* Mobile Right Actions & Hamburger */}
        <div className="flex items-center gap-2">
          {user && (
            <div 
              className="flex items-center gap-1 px-2 py-1 rounded-[4px] bg-[#221708] border border-[#E5A93C]/35 text-[#E5A93C] text-xs font-bold"
              title={`${user.daily_streak || 1} day streak`}
            >
              <Flame className="w-3.5 h-3.5 fill-[#E5A93C]" />
              <span>{user.daily_streak || 1}</span>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-[5px] bg-[#141518] border border-[#24262E] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-[#E5A93C]" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu: Centered Grid */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#22242B] bg-[#0A0A0C]/98 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-2xl animate-fade-in">
          <div className="grid grid-cols-2 gap-2 text-center">
            {navItems.map((item) => {
              const isActive = 
                currentTab === item.id || 
                (item.id === 'multiplayer' && isMultiplayerActive) ||
                (item.id === 'academy' && currentTab === 'lesson-player') ||
                (item.id === 'pressure-trainer' && (currentTab === 'puzzle-player' || currentTab === 'tactics-stats')) ||
                (item.id === 'game-review' && currentTab === 'review-dashboard');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-[5px] text-xs transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-[#E5A93C]/20 text-[#F5C768] border border-[#E5A93C]/50 font-bold shadow-sm'
                      : 'bg-[#121316] text-slate-300 hover:text-white border border-[#24262E] font-semibold'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1C1E24] text-xs">
            <button
              onClick={() => {
                onNavigate('settings');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-[5px] bg-[#141518] border border-[#24262E] text-slate-300 hover:text-white flex items-center gap-1.5 font-semibold"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                onNavigate('changelog');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-[5px] bg-[#141518] border border-[#24262E] text-slate-400 hover:text-white flex items-center gap-1.5 font-semibold"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Changelog</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
