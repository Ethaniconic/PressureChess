import React, { useState, useRef, useEffect } from 'react';
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
  X,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({ currentTab, onNavigate }) => {
  const { user, logout } = useAuth();
  const { openFeedback, openWelcomeModal } = useBeta();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isMultiplayerActive = currentTab === 'multiplayer' || currentTab === 'multiplayer-game';

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: null },
    { id: 'multiplayer', label: 'Multiplayer', icon: <Swords className="w-3.5 h-3.5" />, isGold: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'academy', label: 'Academy', icon: <span className="text-xs">🎓</span> },
    { id: 'pressure-trainer', label: 'Pressure', icon: <span className="text-xs">⚡</span> },
    { id: 'game-review', label: 'Coach', icon: <span className="text-xs">🤖</span> },
  ];

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#22242B] bg-[#0A0A0C]/95 backdrop-blur-2xl shadow-lg shadow-black/80">
      {/* Top light reflection line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Unified Navbar: All contents horizontally centered */}
      <div className="w-full px-4 lg:px-6 h-16 flex items-center justify-between lg:justify-center relative max-w-7xl mx-auto">
        
        {/* Left/Center Container */}
        <div className="flex items-center gap-2 xl:gap-4 lg:w-full lg:max-w-4xl lg:justify-between">
          
          {/* Brand */}
          <div 
            onClick={() => { onNavigate('home'); setMenuOpen(false); }}
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
          >
            <div className="relative w-8 h-8 rounded-[5px] bg-[#141518] flex items-center justify-center shadow-md shadow-black/60 group-hover:scale-105 transition-transform duration-200 overflow-hidden border border-[#2D3039] border-t-white/40">
              <img 
                src="/icon.jpg" 
                alt="PressureChess" 
                className="absolute inset-0 w-full h-full object-cover rounded-[5px]"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div className="flex flex-col xl:flex-row xl:items-center xl:gap-1.5">
              <span className="text-sm font-black tracking-tight text-white flex items-center">
                PRESSURE<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A93C] to-[#F5C768]">CHESS</span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openWelcomeModal();
                }}
                className="hidden xl:flex px-1.5 py-0.5 rounded-[4px] bg-[#E5A93C]/15 text-[#E5A93C] border border-t-white/30 border-[#E5A93C]/40 text-[9px] font-black uppercase tracking-wider hover:scale-105 transition-transform"
                title="Public Beta (100% Free) - Click to view Founding Player benefits"
              >
                BETA
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0" ref={dropdownRef}>
            
            {/* Feedback Button (Desktop Only) */}
            <button
              onClick={() => openFeedback('feature', 'General', 5)}
              className="hidden lg:flex px-2.5 py-1.5 rounded-[5px] bg-[#E5A93C]/15 hover:bg-[#E5A93C]/25 border border-[#E5A93C]/40 border-t-white/30 text-[#E5A93C] text-xs font-bold items-center gap-1.5 transition-all shadow-sm"
              title="Give Feedback directly to founders"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Feedback</span>
            </button>

            {user && (
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
              </div>
            )}

            {/* Subtle Divider (Desktop Only) */}
            <div className="hidden lg:block h-5 w-px bg-[#262833] flex-shrink-0 mx-1" />

            {/* Menu Toggle Button */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] transition-all border ${
                menuOpen 
                  ? 'bg-white/10 border-white/20 text-white' 
                  : 'bg-[#141518] border-[#24262E] text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              aria-label="Toggle Menu"
            >
              <span className="text-xs font-bold uppercase tracking-wider hidden lg:block">Play</span>
              {menuOpen ? <X className="w-4 h-4 text-[#E5A93C]" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute top-16 right-0 lg:right-auto lg:top-14 mt-1 w-full lg:w-64 bg-[#0A0A0C]/98 lg:bg-[#121316] backdrop-blur-2xl border-t lg:border border-[#22242B] lg:rounded-[8px] shadow-2xl animate-fade-in z-50">
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
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
                            setMenuOpen(false);
                          }}
                          className={`px-3 py-2.5 rounded-[5px] text-xs transition-all flex items-center gap-2 lg:justify-start justify-center ${
                            isActive
                              ? 'bg-[#E5A93C]/20 text-[#F5C768] border border-[#E5A93C]/50 font-bold shadow-sm'
                              : 'bg-[#16171B] lg:bg-transparent text-slate-300 hover:text-white hover:bg-white/5 border border-[#24262E] lg:border-transparent font-semibold'
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {!user && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-[#1C1E24]">
                      <button
                        onClick={() => {
                          onNavigate('login');
                          setMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-[5px] text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all border border-[#24262E]"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('signup');
                          setMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-[5px] text-xs font-bold bg-[#E5A93C] hover:bg-[#F3BA54] text-black shadow-[0_0_12px_rgba(229,169,60,0.3)] transition-all"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#1C1E24] text-xs mt-2">
                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setMenuOpen(false);
                      }}
                      className="px-3 py-2 rounded-[5px] bg-[#141518] lg:bg-transparent border border-[#24262E] lg:border-transparent text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5 font-semibold transition-all"
                    >
                      <SettingsIcon className="w-3.5 h-3.5" />
                      <span>Settings</span>
                    </button>

                    {user && (
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="px-3 py-2 rounded-[5px] bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 flex items-center gap-1.5 font-semibold transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
