import React, { useState } from 'react';
import { useTactics } from '../context/TacticsContext';
import { PUZZLE_MODES, PUZZLE_CATEGORIES, CHAMPIONSHIP_SCENARIOS } from '../data/puzzlesData';
import { GlassCard } from '../components/GlassCard';
import { 
  Timer, 
  Flame, 
  Trophy, 
  Sparkles, 
  Target, 
  ChevronRight, 
  Play, 
  Zap, 
  Crown, 
  History,
  CheckCircle2,
  Swords
} from 'lucide-react';

export const PressureTrainerPage = ({ onNavigate }) => {
  const { 
    puzzleRating, 
    currentStreak, 
    accuracyPct, 
    avgSolveTime, 
    startSession 
  } = useTactics();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  const handleLaunchMode = (modeId) => {
    startSession(modeId, 'all');
    onNavigate('puzzle-player');
  };

  const handleLaunchChampionship = (scenarioId) => {
    startSession('championship', 'all', scenarioId);
    onNavigate('puzzle-player');
  };

  const handleLaunchCategory = (categoryId) => {
    startSession('practice', categoryId);
    onNavigate('puzzle-player');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* ======================================================== */}
      {/* 1. HERO HEADER: PRESSURE TRAINER SPOTLIGHT               */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-brand text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 animate-pulse text-cyan-brand" />
              <span>Phase 2 • Pressure Trainer & Tactics</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Calculate Fast. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-brand via-sky-300 to-amber-400">Strike Under Pressure.</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Real tournament games are won and lost in time trouble. Train your brain to spot instant forks, pins, sacrifices, and mating nets while the clock ticks down.
            </p>

            {/* Quick Live Stats Pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-dark-800/90 border border-cyan-500/30 flex items-center gap-2 text-xs">
                <Trophy className="w-4 h-4 text-cyan-brand" />
                <span className="text-slate-400">Rating:</span>
                <span className="font-black text-white">{puzzleRating}</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-dark-800/90 border border-amber-500/30 flex items-center gap-2 text-xs">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400">Streak:</span>
                <span className="font-black text-white">{currentStreak}</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-dark-800/90 border border-emerald-500/30 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">Accuracy:</span>
                <span className="font-black text-white">{accuracyPct}%</span>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-dark-800/90 border border-purple-500/30 flex items-center gap-2 text-xs">
                <Timer className="w-4 h-4 text-purple-400" />
                <span className="text-slate-400">Avg Speed:</span>
                <span className="font-black text-white">{avgSolveTime}s</span>
              </div>
            </div>
          </div>

          {/* Quick Launch Sudden Death Action Card */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={() => handleLaunchMode('sudden_death')}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-red-500 via-amber-500 to-cyan-brand text-black font-black flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <Zap className="w-5 h-5 fill-black" />
              <span>Launch Sudden Death</span>
            </button>

            <button
              onClick={() => onNavigate('tactics-stats')}
              className="px-6 py-3 rounded-2xl bg-dark-800/80 hover:bg-dark-750 border border-white/10 hover:border-cyan-500/40 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <History className="w-4 h-4 text-cyan-brand" />
              <span>View Full Statistics</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TIMED PRESSURE MODES (4 BOXES)                        */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-brand">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Timed Pressure Scenarios</h2>
              <p className="text-xs text-slate-400">Select your countdown duration. Puzzles must be solved before zero!</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PUZZLE_MODES.map((mode) => (
            <GlassCard
              key={mode.id}
              onClick={() => handleLaunchMode(mode.id)}
              className={`p-5 flex flex-col justify-between cursor-pointer group hover:border-cyan-500/50 hover:bg-dark-850/90 transition-all duration-300 ${mode.bgGlow}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{mode.icon}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 uppercase">
                    {mode.badge}
                  </span>
                </div>

                <h3 className="text-base font-black text-white group-hover:text-cyan-brand transition-colors mb-1.5">
                  {mode.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {mode.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5 text-cyan-brand" />
                  {mode.seconds} Seconds
                </span>

                <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-cyan-500 group-hover:text-black flex items-center justify-center text-slate-300 transition-all">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. CHAMPIONSHIP SIMULATION (FAMOUS GAMES)                */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Championship Simulation</h2>
              <p className="text-xs text-slate-400">Step into the shoes of Kasparov, Tal, Anand, and Carlsen under intense historic pressure.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHAMPIONSHIP_SCENARIOS.map((scenario) => (
            <GlassCard
              key={scenario.id}
              onClick={() => handleLaunchChampionship(scenario.id)}
              className="p-5 flex flex-col justify-between cursor-pointer group hover:border-amber-500/50 hover:bg-dark-850/90 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    {scenario.championshipData.year} • {scenario.championshipData.event}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Rating: <span className="text-white font-black">{scenario.rating}</span>
                  </span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors mt-2 mb-1">
                  {scenario.title}
                </h3>

                <p className="text-xs font-semibold text-cyan-300 mb-2">
                  {scenario.subtitle}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {scenario.goal}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 italic">
                  "{scenario.championshipData.historicalNote.slice(0, 75)}..."
                </span>

                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-black border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-1 transition-all">
                  <span>Replay</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. TACTICS BY CATEGORY                                   */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Tactical Categories</h2>
              <p className="text-xs text-slate-400">Drill specific tactical themes: Forks, Pins, Skewers, Discovered Attacks, and Mates.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PUZZLE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleLaunchCategory(cat.id)}
              className="p-4 rounded-2xl bg-dark-850/80 border border-white/[0.08] hover:border-cyan-500/40 hover:bg-cyan-950/15 transition-all text-left group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div className="font-black text-white text-sm group-hover:text-cyan-brand transition-colors">
                  {cat.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-bold text-cyan-400">
                <span>Start Drill</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};
