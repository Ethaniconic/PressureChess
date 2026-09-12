import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAcademy } from '../context/AcademyContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Flame, 
  Swords, 
  Sparkles, 
  GraduationCap, 
  Settings as SettingsIcon, 
  Trophy, 
  ChevronRight, 
  Zap, 
  Bot, 
  Target, 
  ArrowUpRight, 
  BookOpen, 
  Send, 
  Compass 
} from 'lucide-react';
import { ACADEMY_TIERS } from '../data/academyLessons';

export const HomePage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { 
    modules, 
    totalXp, 
    levelInfo, 
    totalStars, 
    isLessonCompleted, 
    setSelectedLesson 
  } = useAcademy();

  // AI Coach interactive state
  const [coachInput, setCoachInput] = useState('');
  const [coachMessages, setCoachMessages] = useState([
    {
      id: 1,
      sender: 'coach',
      text: "Greetings, tactician! I'm Coach Orion. Controlling center squares (e4, d4) grants your pieces supreme agility. What would you like to master today?",
      time: 'Just now'
    }
  ]);

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce((acc, m) => {
    return acc + m.lessons.filter(l => isLessonCompleted(l.id)).length;
  }, 0);
  const progressPct = Math.round((completedLessons / totalLessons) * 100) || 0;

  // Next incomplete lesson
  const allLessons = modules.flatMap(m => m.lessons);
  const nextLesson = allLessons.find(l => !isLessonCompleted(l.id)) || allLessons[0];

  const handleResumeAcademy = () => {
    if (nextLesson) {
      setSelectedLesson(nextLesson);
      onNavigate('lesson-player');
    } else {
      onNavigate('academy');
    }
  };

  const handleSendCoachMessage = (presetText) => {
    const query = presetText || coachInput.trim();
    if (!query) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query, time: 'Just now' };
    setCoachMessages(prev => [...prev, userMsg]);
    setCoachInput('');

    // Simulated conversational AI response
    setTimeout(() => {
      let reply = "Solid chess thinking! In rapid games, look for forcing moves first: Checks, Captures, and Threats (CCT).";
      if (query.toLowerCase().includes('pin')) {
        reply = "A pin paralyzes an enemy piece. If it's an absolute pin to the King, pile attackers onto that pinned square!";
      } else if (query.toLowerCase().includes('fork')) {
        reply = "Knights are the ultimate forking monsters. Always look for squares where a Knight can hit both King and Queen.";
      } else if (query.toLowerCase().includes('endgame')) {
        reply = "In king and pawn endgames, seizing the direct opposition is the master key to escorting your pawn to queen.";
      }

      setCoachMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'coach', text: reply, time: 'Just now' }
      ]);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      
      {/* ========================================================= */}
      {/* 1. TOP HERO: ACADEMY SPOTLIGHT & ACTIVE PROGRESS          */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-[5px] bg-[#0E0F12] border border-[#252831] border-t-white/20 p-6 sm:p-8 shadow-2xl shadow-black/80">
        {/* Subtle Specular Top Reflection / Light Sheen */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent rounded-t-[5px]" />

        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#E5A93C]/[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#E5A93C]/15 border border-[#E5A93C]/40 border-t-white/25 text-[#E5A93C] text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#E5A93C]" />
              <span>Interactive Chess Academy • 3 Mastery Tiers</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Master Chess Tactics <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A93C] via-[#F5C768] to-white">Under Timer Pressure</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Step-by-step interactive lessons from basic piece coordinates to grandmaster tactics, forks, pins, and endgames. Sharpen your calculation and crush opponents.
            </p>

            {/* Quick Tier Indicators */}
            <div className="flex flex-wrap gap-2 pt-1">
              {ACADEMY_TIERS.map(tier => (
                <div 
                  key={tier.id}
                  onClick={() => onNavigate('academy')}
                  className="px-3 py-1.5 rounded-[4px] bg-[#141518] border border-[#262830] border-t-white/15 hover:border-[#E5A93C]/40 text-xs font-semibold text-slate-200 hover:text-white cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>{tier.icon}</span>
                  <span>{tier.badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Action Card with 1-Click Launch */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <button
              onClick={handleResumeAcademy}
              className="group px-7 py-3.5 rounded-[5px] bg-[#E5A93C] hover:bg-[#F3BA54] text-black font-black flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(229,169,60,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 border border-t-white/40 border-[#E5A93C]"
            >
              <GraduationCap className="w-5 h-5 fill-black" />
              <div className="text-left">
                <div className="text-xs uppercase font-extrabold tracking-wider opacity-85 -mb-0.5">Resume Academy</div>
                <div className="text-sm font-black">{nextLesson ? nextLesson.title : 'Explore Curriculum'}</div>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-1" />
            </button>

            <button
              onClick={() => onNavigate('multiplayer')}
              className="px-5 py-2.5 rounded-[5px] bg-[#141518] hover:bg-[#1A1C22] border border-[#E5A93C]/40 text-[#E5A93C] hover:text-[#F5C768] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-sm"
            >
              <Swords className="w-4 h-4 text-[#E5A93C]" />
              <span>Play Online (Bullet / Blitz / Rapid)</span>
            </button>

            <button
              onClick={() => onNavigate('pressure-trainer')}
              className="px-5 py-2.5 rounded-[5px] bg-[#141518] hover:bg-[#1A1C22] border border-[#272932] text-amber-300 hover:text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-sm"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Pressure Trainer (10s–30s)</span>
            </button>

            <button
              onClick={() => onNavigate('play')}
              className="px-5 py-2 rounded-[5px] bg-[#141518] hover:bg-[#1A1C22] border border-[#272932] hover:border-white/30 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all"
            >
              <Swords className="w-3.5 h-3.5 text-slate-400" />
              <span>Local Clock Match</span>
            </button>
          </div>
        </div>

        {/* Hero Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#22242B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full flex-1">
            <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-bold">
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#E5A93C]" />
                Academy Completion: {completedLessons} of {totalLessons} Lessons
              </span>
              <span className="text-[#E5A93C] font-mono">{progressPct}%</span>
            </div>
            <div className="w-full h-2 rounded-[2px] bg-[#1A1B20] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#E5A93C] to-[#F5C768] rounded-[2px] transition-all duration-500 shadow-[0_0_8px_rgba(229,169,60,0.3)]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. POPULATED 2-COLUMN DASHBOARD GRID (8 / 4 COLS)          */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================= */}
        {/* LEFT COLUMN: CURRICULUM ROADMAP & TRAINING (8 COLS)     */}
        {/* ======================================================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[4px] bg-[#141518] border border-[#272932] flex items-center justify-center text-[#E5A93C]">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Curriculum Roadmap</h2>
                <p className="text-xs text-slate-400">Structured lessons designed for progressive tactical mastery</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('academy')}
              className="text-xs font-bold text-[#E5A93C] hover:underline flex items-center gap-1"
            >
              <span>View All 17 Modules</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Tier Pathway Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ACADEMY_TIERS.map((tier) => {
              const tierModules = modules.filter(m => m.tier === tier.id);
              const tierLessons = tierModules.flatMap(m => m.lessons);
              const tierCompleted = tierLessons.filter(l => isLessonCompleted(l.id)).length;
              const tierPct = Math.round((tierCompleted / (tierLessons.length || 1)) * 100);

              return (
                <GlassCard
                  key={tier.id}
                  onClick={() => onNavigate('academy')}
                  className="p-5 flex flex-col justify-between cursor-pointer group hover:border-[#E5A93C]/50 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{tier.icon}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-[3px] bg-white/5 border border-white/10 text-slate-300 uppercase">
                        {tier.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white group-hover:text-[#E5A93C] transition-colors mb-1.5 leading-snug">
                      {tier.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {tier.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/[0.06]">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                      <span>{tierCompleted}/{tierLessons.length} Done</span>
                      <span className="text-[#E5A93C]">{tierPct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-[2px] bg-[#1A1B20] overflow-hidden">
                      <div 
                        className="h-full bg-[#E5A93C] rounded-[2px] transition-all duration-300"
                        style={{ width: `${tierPct}%` }}
                      />
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Daily Tactical Rush Interactive Teaser */}
          <GlassCard className="p-6 border-[#272932]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-[3px] bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30">
                    Daily Tactical Drill
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Rating 1450</span>
                </div>

                <h3 className="text-lg font-black text-white">
                  Knight Fork: Royal Disruption
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed">
                  White has an overwhelming tactical opportunity. Jump your Knight into Black's camp to fork both the uncastled King and the undefended Rook!
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> Objective: Deliver Fork on c7
                  </span>
                  <span className="text-xs font-bold text-[#E5A93C]">
                    +100 XP Reward
                  </span>
                </div>
              </div>

              <button
                onClick={handleResumeAcademy}
                className="px-6 py-3.5 rounded-[5px] bg-[#E5A93C] hover:bg-[#F3BA54] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_12px_rgba(229,169,60,0.25)] hover:scale-[1.01] transition-all shrink-0"
              >
                <span>Solve on Board</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>

          {/* Realtime Online Multiplayer & Global Leaderboards */}
          <GlassCard className="p-6 border-[#272932] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[#E5A93C] text-[10px] font-black uppercase tracking-wider">
                  <Swords className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Public Beta • Supabase Realtime • Elo Matchmaking</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Realtime Online Multiplayer & Ranked Arena
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Challenge random opponents worldwide, invite friends with private room codes, or play Bullet, Blitz, Rapid, and Classical. Synchronized clocks, board state, draw/resign negotiations, and official Elo updates!
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-[3px] bg-white/5 border border-white/10 text-orange-300">
                    ⚡ Bullet (1+0 • 2+1)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-[3px] bg-white/5 border border-white/10 text-amber-300">
                    🔥 Blitz (3+0 • 5+3)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-[3px] bg-white/5 border border-white/10 text-slate-200">
                    ⏱️ Rapid (10+0 • 15+10)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-[3px] bg-white/5 border border-white/10 text-[#E5A93C]">
                    🏆 Global / Daily Leaderboards
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => onNavigate('multiplayer')}
                  className="px-6 py-3.5 rounded-[5px] bg-[#E5A93C] hover:bg-[#F3BA54] text-black font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(229,169,60,0.3)] hover:scale-[1.01] transition-all"
                >
                  <Swords className="w-4 h-4 fill-black" />
                  <span>Enter Multiplayer Lobby</span>
                </button>
                <button
                  onClick={() => onNavigate('leaderboard')}
                  className="px-5 py-2.5 rounded-[5px] bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-[#272932] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Trophy className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>View Leaderboards</span>
                </button>
              </div>
            </div>
          </GlassCard>

          {/* AI Game Review & Coach Orion Spotlight Card */}
          <GlassCard className="p-6 border-[#272932] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-wider">
                  <Bot className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Stockfish Engine + Coach Orion</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  AI Game Review & Tactical Coach
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Import your PGN games from Lichess or Chess.com. Stockfish evaluates every move with dynamic evaluation bars, move classifications (!!, ★, ?!), opening ECO recognition, and natural English explanations from Coach Orion.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-[3px] bg-white/5 border border-white/10 text-slate-200">
                    Eval Bar & Candidate Moves
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-[3px] bg-white/5 border border-white/10 text-amber-300">
                    ECO Opening Recognition
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-[3px] bg-white/5 border border-white/10 text-rose-300">
                    Blunder & Mistake Breakdown
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => onNavigate('game-review')}
                  className="px-6 py-3.5 rounded-[5px] bg-[#E5A93C] hover:bg-[#F3BA54] text-black font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(229,169,60,0.3)] hover:scale-[1.01] transition-all"
                >
                  <Bot className="w-4 h-4" />
                  <span>Review Game with Coach</span>
                </button>
                <button
                  onClick={() => onNavigate('review-dashboard')}
                  className="px-5 py-2.5 rounded-[5px] bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-[#272932] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Review Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#E5A93C]" />
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Quick Launchpad Buttons (Strictly 4-5px Corners & Royal Black) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                Training Modes & Quick Play
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <button
                onClick={() => onNavigate('game-review')}
                className="relative overflow-hidden p-3.5 rounded-[5px] bg-[#121316] border border-[#24262E] border-t-white/15 hover:border-[#E5A93C]/50 hover:bg-[#18191E] transition-all text-left group shadow-sm"
              >
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/[0.04] to-transparent rounded-t-[5px]" />
                <div className="w-8 h-8 rounded-[4px] bg-[#1A1C22] border border-[#2C2E38] flex items-center justify-center text-slate-300 mb-2 group-hover:scale-105 transition-transform">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-white text-xs sm:text-sm">AI Game Review</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Coach Orion & Eval</div>
              </button>

              <button
                onClick={() => onNavigate('play')}
                className="relative overflow-hidden p-3.5 rounded-[5px] bg-[#121316] border border-[#24262E] border-t-white/15 hover:border-[#E5A93C]/50 hover:bg-[#18191E] transition-all text-left group shadow-sm"
              >
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/[0.04] to-transparent rounded-t-[5px]" />
                <div className="w-8 h-8 rounded-[4px] bg-[#1A1C22] border border-[#2C2E38] flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
                  <Swords className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-white text-xs sm:text-sm">Offline Play</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">2-Player clock</div>
              </button>

              <button
                onClick={() => onNavigate('academy')}
                className="relative overflow-hidden p-3.5 rounded-[5px] bg-[#121316] border border-[#24262E] border-t-white/15 hover:border-[#E5A93C]/50 hover:bg-[#18191E] transition-all text-left group shadow-sm"
              >
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/[0.04] to-transparent rounded-t-[5px]" />
                <div className="w-8 h-8 rounded-[4px] bg-[#1A1C22] border border-[#2C2E38] flex items-center justify-center text-white mb-2 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-white text-xs sm:text-sm">All Lessons</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">17 Structured units</div>
              </button>

              <button
                onClick={() => onNavigate('progress')}
                className="relative overflow-hidden p-3.5 rounded-[5px] bg-[#121316] border border-[#24262E] border-t-white/15 hover:border-[#E5A93C]/50 hover:bg-[#18191E] transition-all text-left group shadow-sm"
              >
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/[0.04] to-transparent rounded-t-[5px]" />
                <div className="w-8 h-8 rounded-[4px] bg-[#1A1C22] border border-[#2C2E38] flex items-center justify-center text-[#E5A93C] mb-2 group-hover:scale-105 transition-transform">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-white text-xs sm:text-sm">Progress Hub</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Level & Stars</div>
              </button>

              <button
                onClick={() => onNavigate('pressure-trainer')}
                className="relative overflow-hidden p-3.5 rounded-[5px] bg-[#121316] border border-[#24262E] border-t-white/15 hover:border-[#E5A93C]/50 hover:bg-[#18191E] transition-all text-left group shadow-sm"
              >
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/[0.04] to-transparent rounded-t-[5px]" />
                <div className="w-8 h-8 rounded-[4px] bg-[#1A1C22] border border-[#2C2E38] flex items-center justify-center text-amber-300 mb-2 group-hover:scale-105 transition-transform">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-white text-xs sm:text-sm">Pressure Mode</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">10s–30s Scramble</div>
              </button>

              <button
                onClick={() => onNavigate('leaderboard')}
                className="relative overflow-hidden p-3.5 rounded-[5px] bg-[#121316] border border-[#24262E] border-t-white/15 hover:border-[#E5A93C]/50 hover:bg-[#18191E] transition-all text-left group shadow-sm"
              >
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/[0.04] to-transparent rounded-t-[5px]" />
                <div className="w-8 h-8 rounded-[4px] bg-[#1A1C22] border border-[#2C2E38] flex items-center justify-center text-[#E5A93C] mb-2 group-hover:scale-105 transition-transform">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-white text-xs sm:text-sm">Leaderboards</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Global Rankings</div>
              </button>

              <button
                onClick={() => onNavigate('review-dashboard')}
                className="relative overflow-hidden p-3.5 rounded-[5px] bg-[#121316] border border-[#24262E] border-t-white/15 hover:border-[#E5A93C]/50 hover:bg-[#18191E] transition-all text-left group shadow-sm"
              >
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/[0.04] to-transparent rounded-t-[5px]" />
                <div className="w-8 h-8 rounded-[4px] bg-[#1A1C22] border border-[#2C2E38] flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
                  <Target className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-white text-xs sm:text-sm">Coach Analytics</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Dashboard stats</div>
              </button>

              <button
                onClick={() => onNavigate('settings')}
                className="relative overflow-hidden p-3.5 rounded-[5px] bg-[#121316] border border-[#24262E] border-t-white/15 hover:border-[#E5A93C]/50 hover:bg-[#18191E] transition-all text-left group shadow-sm"
              >
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/[0.04] to-transparent rounded-t-[5px]" />
                <div className="w-8 h-8 rounded-[4px] bg-[#1A1C22] border border-[#2C2E38] flex items-center justify-center text-slate-300 mb-2 group-hover:scale-105 transition-transform">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div className="font-extrabold text-white text-xs sm:text-sm">Studio Settings</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Themes & audio</div>
              </button>

            </div>
          </div>

        </div>

        {/* ======================================================= */}
        {/* RIGHT COLUMN: AI COACH PREVIEW & PROGRESS (4 COLS)     */}
        {/* ======================================================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI COACH COMPANION INTERACTIVE PREVIEW PANEL */}
          <GlassCard className="p-5 border-[#272932] shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-[5px] bg-[#141518] flex items-center justify-center text-lg overflow-hidden border border-[#2C2E38] border-t-white/30">
                  <img 
                    src="/coach_orion.jpg" 
                    alt="Coach Orion" 
                    className="absolute inset-0 w-full h-full object-cover rounded-[5px] z-10"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <Bot className="w-5 h-5 text-slate-300" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0A0A0C] z-20" />
                </div>
                <div>
                  <div className="text-sm font-black text-white flex items-center gap-1.5">
                    Coach Orion <span className="text-[10px] px-1.5 py-0.2 rounded-[2px] bg-[#E5A93C]/20 text-[#E5A93C] font-extrabold">AI</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Tactical Companion</div>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold text-emerald-400">Online</span>
            </div>

            {/* Interactive Chat Stream */}
            <div className="py-4 space-y-3 max-h-[220px] overflow-y-auto">
              {coachMessages.map(msg => (
                <div 
                  key={msg.id}
                  className={`flex gap-2.5 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'coach' && (
                    <div className="w-6 h-6 rounded-[3px] bg-[#1A1C22] text-[#E5A93C] flex items-center justify-center text-[10px] font-bold shrink-0 border border-[#272932]">
                      ⚡
                    </div>
                  )}
                  <div className={`p-3 rounded-[5px] max-w-[85%] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#E5A93C] text-black font-semibold' 
                      : 'bg-[#141518] border border-[#252830] text-slate-200'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Ask Coach Orion:</div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleSendCoachMessage('How do I defend against pins?')}
                  className="px-2.5 py-1 rounded-[4px] bg-[#141518] hover:bg-[#1A1C22] border border-[#252830] hover:border-[#E5A93C]/40 text-[11px] text-slate-300 hover:text-[#E5A93C] transition-colors text-left"
                >
                  🛡️ Defend against pins
                </button>
                <button
                  onClick={() => handleSendCoachMessage('Explain knight forks')}
                  className="px-2.5 py-1 rounded-[4px] bg-[#141518] hover:bg-[#1A1C22] border border-[#252830] hover:border-[#E5A93C]/40 text-[11px] text-slate-300 hover:text-[#E5A93C] transition-colors text-left"
                >
                  ⚔️ Master knight forks
                </button>
                <button
                  onClick={() => handleSendCoachMessage('How to win King & Pawn endgames?')}
                  className="px-2.5 py-1 rounded-[4px] bg-[#141518] hover:bg-[#1A1C22] border border-[#252830] hover:border-[#E5A93C]/40 text-[11px] text-slate-300 hover:text-[#E5A93C] transition-colors text-left"
                >
                  👑 King opposition
                </button>
              </div>
            </div>

            {/* Message Input Box */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={coachInput}
                onChange={(e) => setCoachInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCoachMessage()}
                placeholder="Ask coach about tactics, openings..."
                className="flex-1 bg-[#141518] border border-[#252830] rounded-[5px] px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A93C] transition-colors"
              />
              <button
                onClick={() => handleSendCoachMessage()}
                className="p-2 rounded-[5px] bg-[#E5A93C] hover:bg-[#F3BA54] text-black transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>

          {/* Daily Streak Card */}
          <GlassCard className="p-5 border-[#272932]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E5A93C] flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-[#E5A93C]" /> Daily Study Streak
              </span>
              <span className="text-xs font-semibold text-slate-400">Peak Focus</span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-white">{user?.daily_streak || 1}</span>
              <span className="text-xs font-bold text-[#E5A93C]">Days Active</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Complete at least 1 lesson daily to maintain peak calculation sharpness and earn streak XP bonuses.
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-[4px] flex items-center justify-center text-xs font-bold ${
                    idx <= 2 
                      ? 'bg-[#E5A93C] text-black shadow-md' 
                      : 'bg-[#141518] text-slate-500 border border-[#252830]'
                  }`}>
                    {idx <= 2 ? '🔥' : day}
                  </div>
                  <span className="text-[10px] text-slate-500">{day}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Player Rank & Stats Box */}
          <GlassCard className="p-5 border-[#272932] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-[4px] bg-[#16140D] border border-[#E5A93C]/40 flex items-center justify-center font-black text-[#E5A93C] text-base">
                  L{levelInfo.level}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#E5A93C]">Current Rank</div>
                  <div className="text-sm font-black text-white">{levelInfo.title}</div>
                  <div className="text-[11px] text-slate-400">{totalXp} Total XP</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-[#E5A93C] flex items-center justify-end gap-1">
                  <span>★</span> {totalStars}
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Academy Stars</div>
              </div>
            </div>

            {/* Rank XP progress */}
            <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Progress to next rank</span>
                <span className="text-[#E5A93C] font-mono font-bold">
                  {totalXp - levelInfo.currentBase} / {levelInfo.nextXp - levelInfo.currentBase} XP
                </span>
              </div>
              <div className="w-full h-2 rounded-[2px] bg-[#1A1B20] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#E5A93C] to-[#F5C768] rounded-[2px]"
                  style={{ 
                    width: `${Math.min(100, Math.round(((totalXp - levelInfo.currentBase) / ((levelInfo.nextXp - levelInfo.currentBase) || 1)) * 100))}%` 
                  }}
                />
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
