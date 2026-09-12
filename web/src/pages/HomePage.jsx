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
  Play, 
  Trophy, 
  ChevronRight, 
  Zap,
  ShieldCheck,
  Bot,
  MessageSquare,
  Target,
  ArrowUpRight,
  Award,
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
    unlockedAchievements,
    setSelectedLesson 
  } = useAcademy();

  // AI Coach interactive state
  const [coachInput, setCoachInput] = useState('');
  const [coachMessages, setCoachMessages] = useState([
    {
      id: 1,
      sender: 'coach',
      text: "Greetings, tactician! I'm Coach Orion. Notice how controlling the center squares (e4, d4) grants your pieces supreme agility. What would you like to master today?",
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
      {/* 1. TOP HERO: ACADEMY SPOTLIGHT & ACTIVE PROGRESS (FRONT & CENTER) */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-brand text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-brand" />
              <span>Interactive Chess Academy • 3 Mastery Tiers</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Master Chess Tactics <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-brand via-sky-300 to-indigo-400">Under Timer Pressure</span>
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
                  className="px-3 py-1.5 rounded-xl bg-dark-800/80 border border-white/10 hover:border-cyan-500/40 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <span>{tier.icon}</span>
                  <span>{tier.badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Action Card with 1-Click Launch */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={handleResumeAcademy}
              className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-brand via-sky-400 to-cyan-500 hover:from-cyan-400 hover:to-sky-300 text-black font-black flex items-center justify-center gap-3 shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <GraduationCap className="w-5 h-5 fill-black" />
              <div className="text-left">
                <div className="text-xs uppercase font-extrabold tracking-wider opacity-80 -mb-0.5">Resume Academy</div>
                <div className="text-sm font-black">{nextLesson ? nextLesson.title : 'Explore Curriculum'}</div>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-1" />
            </button>

            <button
              onClick={() => onNavigate('multiplayer')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-sky-500/20 hover:from-cyan-500/30 hover:to-sky-500/30 border border-cyan-400/50 text-cyan-300 hover:text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-glow-cyan"
            >
              <Swords className="w-4 h-4 text-cyan-400" />
              <span>Play Online (Bullet / Blitz / Rapid)</span>
            </button>

            <button
              onClick={() => onNavigate('pressure-trainer')}
              className="px-5 py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-sm"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Pressure Trainer (10s–30s)</span>
            </button>

            <button
              onClick={() => onNavigate('play')}
              className="px-5 py-2 rounded-2xl bg-dark-800/90 hover:bg-dark-700/90 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all"
            >
              <Swords className="w-3.5 h-3.5 text-emerald-400" />
              <span>Local Clock Match</span>
            </button>
          </div>
        </div>

        {/* Hero Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full flex-1">
            <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-bold">
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-cyan-brand" />
                Academy Completion: {completedLessons} of {totalLessons} Lessons
              </span>
              <span className="text-cyan-brand font-mono">{progressPct}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-dark-700 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-brand via-sky-400 to-indigo-500 rounded-full transition-all duration-500 shadow-glow-cyan"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. LAPTOP POPULATED 2-COLUMN DASHBOARD GRID (8 / 4 COLS) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================= */}
        {/* LEFT COLUMN: CURRICULUM ROADMAP & TRAINING (8 COLS)     */}
        {/* ======================================================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-brand">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Curriculum Roadmap</h2>
                <p className="text-xs text-slate-400">Structured lessons designed for progressive tactical mastery</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('academy')}
              className="text-xs font-bold text-cyan-brand hover:underline flex items-center gap-1"
            >
              <span>View All 17 Modules</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Tier Pathway Cards (Proper box layout with balanced text padding) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ACADEMY_TIERS.map((tier, idx) => {
              const tierModules = modules.filter(m => m.tier === tier.id);
              const tierLessons = tierModules.flatMap(m => m.lessons);
              const tierCompleted = tierLessons.filter(l => isLessonCompleted(l.id)).length;
              const tierPct = Math.round((tierCompleted / (tierLessons.length || 1)) * 100);

              return (
                <GlassCard
                  key={tier.id}
                  onClick={() => onNavigate('academy')}
                  className="p-5 flex flex-col justify-between cursor-pointer group hover:border-cyan-500/50 hover:bg-dark-850/80 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{tier.icon}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 uppercase">
                        {tier.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white group-hover:text-cyan-brand transition-colors mb-1.5 leading-snug">
                      {tier.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {tier.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/[0.06]">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                      <span>{tierCompleted}/{tierLessons.length} Done</span>
                      <span className="text-cyan-brand">{tierPct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-dark-700 overflow-hidden">
                      <div 
                        className="h-full bg-cyan-brand rounded-full transition-all duration-300"
                        style={{ width: `${tierPct}%` }}
                      />
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Daily Tactical Rush Interactive Teaser */}
          <GlassCard className="p-6 border-sky-500/25 bg-gradient-to-r from-sky-500/5 via-dark-850 to-indigo-500/5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
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
                  <span className="text-xs font-bold text-gold-400">
                    +100 XP Reward
                  </span>
                </div>
              </div>

              <button
                onClick={handleResumeAcademy}
                className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-sky-950/50 hover:scale-105 transition-all shrink-0"
              >
                <span>Solve on Board</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>

          {/* PHASE 4: Realtime Online Multiplayer & Global Leaderboards */}
          <GlassCard className="p-6 border-cyan-400/40 bg-gradient-to-r from-cyan-950/40 via-dark-850 to-indigo-950/40 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                  <Swords className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Phase 4 • Supabase Realtime • Elo Matchmaking</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Realtime Online Multiplayer & Ranked Arena
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Challenge random opponents worldwide, invite friends with private room codes, or play Bullet, Blitz, Rapid, and Classical. Synchronized clocks, board state, draw/resign negotiations, and official FIDE Elo updates!
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-orange-300">
                    ⚡ Bullet (1+0 • 2+1)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-amber-300">
                    🔥 Blitz (3+0 • 5+3)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300">
                    ⏱️ Rapid (10+0 • 15+10)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-emerald-300">
                    🏆 Global / Daily / Friends Leaderboards
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => onNavigate('multiplayer')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-glow-cyan hover:scale-[1.02] transition-all"
                >
                  <Swords className="w-4 h-4 fill-black" />
                  <span>Enter Multiplayer Lobby</span>
                </button>
                <button
                  onClick={() => onNavigate('leaderboard')}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Leaderboards</span>
                </button>
              </div>
            </div>
          </GlassCard>

          {/* PHASE 3: AI Game Review & Coach Orion Spotlight Card */}
          <GlassCard className="p-6 border-cyan-brand/30 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-brand/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-brand/10 border border-cyan-brand/25 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                  <Bot className="w-3.5 h-3.5 text-cyan-brand" />
                  <span>Phase 3 • Stockfish Engine + Coach Orion</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  AI Game Review & Tactical Coach
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Import your PGN games from Lichess or Chess.com. Stockfish evaluates every move with dynamic evaluation bars, move classifications (!!, ★, ?!), opening ECO recognition, and natural English explanations from Coach Orion.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300">
                    Eval Bar & Candidate Moves
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-amber-300">
                    ECO Opening Recognition
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-rose-300">
                    Blunder & Mistake Breakdown
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => onNavigate('game-review')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-brand to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-black text-xs flex items-center justify-center gap-2 shadow-glow-cyan hover:scale-[1.02] transition-all"
                >
                  <Bot className="w-4 h-4" />
                  <span>Review Game with Coach</span>
                </button>
                <button
                  onClick={() => onNavigate('review-dashboard')}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Review Dashboard</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-brand" />
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Quick Launchpad Buttons (Properly padded, modern grid) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Training Modes & Quick Play
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <button
                onClick={() => onNavigate('game-review')}
                className="p-4 rounded-2xl bg-dark-850/80 border border-cyan-brand/30 hover:border-cyan-brand/60 hover:bg-cyan-950/20 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-brand/10 border border-cyan-brand/20 flex items-center justify-center text-cyan-brand mb-2.5 group-hover:scale-110 transition-transform">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs sm:text-sm">AI Game Review</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Coach Orion & Eval</div>
              </button>

              <button
                onClick={() => onNavigate('play')}
                className="p-4 rounded-2xl bg-dark-850/80 border border-white/[0.08] hover:border-emerald-500/40 hover:bg-emerald-950/15 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5 group-hover:scale-110 transition-transform">
                  <Swords className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs sm:text-sm">Offline Play</div>
                <div className="text-[11px] text-slate-400 mt-0.5">2-Player clock</div>
              </button>

              <button
                onClick={() => onNavigate('academy')}
                className="p-4 rounded-2xl bg-dark-850/80 border border-white/[0.08] hover:border-cyan-500/40 hover:bg-cyan-950/15 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-brand mb-2.5 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs sm:text-sm">All Lessons</div>
                <div className="text-[11px] text-slate-400 mt-0.5">17 Structured units</div>
              </button>

              <button
                onClick={() => onNavigate('progress')}
                className="p-4 rounded-2xl bg-dark-850/80 border border-white/[0.08] hover:border-gold-500/40 hover:bg-gold-950/15 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-2.5 group-hover:scale-110 transition-transform">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs sm:text-sm">Progress Hub</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Level & Stars</div>
              </button>

              <button
                onClick={() => onNavigate('settings')}
                className="p-4 rounded-2xl bg-dark-850/80 border border-white/[0.08] hover:border-purple-500/40 hover:bg-purple-950/15 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-2.5 group-hover:scale-110 transition-transform">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs sm:text-sm">Studio Settings</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Themes & audio</div>
              </button>

            </div>
          </div>

        </div>

        {/* ======================================================= */}
        {/* RIGHT COLUMN: AI COACH PREVIEW & PROGRESS (4 COLS)     */}
        {/* ======================================================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* ===================================================== */}
          {/* AI COACH COMPANION INTERACTIVE PREVIEW PANEL          */}
          {/* ===================================================== */}
          <GlassCard className="p-5 border-cyan-500/30 bg-gradient-to-b from-dark-850 via-dark-900 to-cyan-950/20 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-brand via-sky-500 to-indigo-600 flex items-center justify-center text-lg shadow-glow-cyan overflow-hidden">
                  <img 
                    src="/coach_orion.jpg" 
                    alt="Coach Orion" 
                    className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <Bot className="w-5 h-5 text-black" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-dark-900 z-20" />
                </div>
                <div>
                  <div className="text-sm font-black text-white flex items-center gap-1.5">
                    Coach Orion <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-brand font-extrabold">AI</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Grandmaster Tactical Companion</div>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold text-cyan-400 animate-pulse">Online</span>
            </div>

            {/* Interactive Chat Stream */}
            <div className="py-4 space-y-3 max-h-[220px] overflow-y-auto">
              {coachMessages.map(msg => (
                <div 
                  key={msg.id}
                  className={`flex gap-2.5 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'coach' && (
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-brand flex items-center justify-center text-[10px] font-bold shrink-0">
                      ⚡
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-cyan-500 text-black font-semibold rounded-br-none' 
                      : 'bg-dark-800 border border-white/10 text-slate-200 rounded-bl-none'
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
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-[11px] text-slate-300 hover:text-cyan-brand transition-colors text-left"
                >
                  🛡️ Defend against pins
                </button>
                <button
                  onClick={() => handleSendCoachMessage('Explain knight forks')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-[11px] text-slate-300 hover:text-cyan-brand transition-colors text-left"
                >
                  ⚔️ Master knight forks
                </button>
                <button
                  onClick={() => handleSendCoachMessage('How to win King & Pawn endgames?')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-[11px] text-slate-300 hover:text-cyan-brand transition-colors text-left"
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
                className="flex-1 bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-brand transition-colors"
              />
              <button
                onClick={() => handleSendCoachMessage()}
                className="p-2 rounded-xl bg-cyan-brand hover:bg-cyan-400 text-black transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>

          {/* Daily Streak Card */}
          <GlassCard className="p-5 border-orange-500/20 bg-gradient-to-b from-orange-500/5 to-transparent">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-orange-400" /> Daily Study Streak
              </span>
              <span className="text-xs font-semibold text-slate-400">Peak Focus</span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-white">{user?.daily_streak || 1}</span>
              <span className="text-xs font-bold text-orange-400">Days Active</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Complete at least 1 lesson daily to maintain peak calculation sharpness and earn streak XP bonuses.
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    idx <= 2 
                      ? 'bg-orange-500 text-black shadow-md shadow-orange-900/40' 
                      : 'bg-dark-800 text-slate-500'
                  }`}>
                    {idx <= 2 ? '🔥' : day}
                  </div>
                  <span className="text-[10px] text-slate-500">{day}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Player Rank & Stats Box */}
          <GlassCard className="p-5 border-gold-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center font-black text-gold-400 text-base">
                  L{levelInfo.level}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-gold-400">Current Rank</div>
                  <div className="text-sm font-black text-white">{levelInfo.title}</div>
                  <div className="text-[11px] text-slate-400">{totalXp} Total XP</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-gold-400 flex items-center justify-end gap-1">
                  <span>★</span> {totalStars}
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Academy Stars</div>
              </div>
            </div>

            {/* Rank XP progress */}
            <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Progress to next rank</span>
                <span className="text-gold-400 font-mono font-bold">
                  {totalXp - levelInfo.currentBase} / {levelInfo.nextXp - levelInfo.currentBase} XP
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-dark-700 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-gold-500 to-amber-300 rounded-full"
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
