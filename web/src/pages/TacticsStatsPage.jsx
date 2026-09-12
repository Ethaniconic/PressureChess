import React from 'react';
import { useTactics } from '../context/TacticsContext';
import { PUZZLE_CATEGORIES } from '../data/puzzlesData';
import { GlassCard } from '../components/GlassCard';
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Timer, 
  Zap, 
  ArrowUpRight, 
  TrendingUp, 
  History, 
  ChevronLeft,
  Calendar,
  Sparkles
} from 'lucide-react';

export const TacticsStatsPage = ({ onNavigate }) => {
  const {
    puzzleRating,
    highestRating,
    currentStreak,
    highestStreak,
    totalAttempted,
    totalSolved,
    accuracyPct,
    avgSolveTime,
    history
  } = useTactics();

  // Category breakdown calculation from history
  const categoryStats = PUZZLE_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
    const catAttempts = history.filter(h => h.category === cat.id);
    const catSolved = catAttempts.filter(h => h.solved).length;
    const pct = catAttempts.length > 0 ? Math.round((catSolved / catAttempts.length) * 100) : 0;
    return {
      ...cat,
      attempts: catAttempts.length,
      solved: catSolved,
      accuracy: pct
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('pressure-trainer')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-brand">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tactical Mastery Analytics</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">Pressure Tactics Statistics</h1>
          </div>
        </div>

        <button
          onClick={() => onNavigate('pressure-trainer')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-brand to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-black text-xs flex items-center gap-2 shadow-glow-cyan transition-all"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>Train Now</span>
        </button>
      </div>

      {/* 4 Core Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Rating Card */}
        <GlassCard className="p-5 border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Tactics Rating</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-brand flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{puzzleRating}</div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/[0.06]">
            <span>Peak Rating</span>
            <span className="text-cyan-300 font-bold">{highestRating} ELO</span>
          </div>
        </GlassCard>

        {/* Streak Card */}
        <GlassCard className="p-5 border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Current Streak</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-300">{currentStreak}</div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/[0.06]">
            <span>Longest Streak</span>
            <span className="text-amber-300 font-bold">{highestStreak} in a row</span>
          </div>
        </GlassCard>

        {/* Accuracy Card */}
        <GlassCard className="p-5 border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Overall Accuracy</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">{accuracyPct}%</div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/[0.06]">
            <span>Solved / Total</span>
            <span className="text-emerald-300 font-bold">{totalSolved} / {totalAttempted}</span>
          </div>
        </GlassCard>

        {/* Speed Card */}
        <GlassCard className="p-5 border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Avg Solve Time</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-300">{avgSolveTime}s</div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/[0.06]">
            <span>Pressure Speed</span>
            <span className="text-purple-300 font-bold">Fast Calculator</span>
          </div>
        </GlassCard>

      </div>

      {/* Grid: Category Breakdown & Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Strength Breakdown (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-brand" />
            <span>Category Proficiency Breakdown</span>
          </h3>

          <div className="space-y-3">
            {categoryStats.map((cat) => (
              <GlassCard key={cat.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-black text-white">
                    <span>{cat.icon}</span>
                    <span>{cat.title}</span>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-cyan-brand font-bold">{cat.solved}</span>/{cat.attempts} ({cat.accuracy}%)
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-dark-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-brand to-sky-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(5, cat.accuracy)}%` }}
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Recent History Log (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>Recent Pressure Attempts</span>
          </h3>

          {history.length === 0 ? (
            <GlassCard className="p-8 text-center space-y-2">
              <div className="text-2xl">⚡</div>
              <div className="text-sm font-bold text-white">No attempts recorded yet</div>
              <p className="text-xs text-slate-400">Launch a 10s, 20s, or Sudden Death run to build your tactical history.</p>
            </GlassCard>
          ) : (
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {history.slice(0, 15).map((item) => (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-xl bg-dark-850/80 border border-white/[0.06] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      item.solved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {item.solved ? '✓' : '✗'}
                    </div>
                    <div>
                      <div className="font-bold text-white">{item.puzzleTitle}</div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {item.category} • Mode: {item.mode} • {item.timeTaken}s
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-black ${item.ratingDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.ratingDelta >= 0 ? `+${item.ratingDelta}` : item.ratingDelta}
                    </span>
                    <div className="text-[10px] text-slate-400">{item.userRatingAfter} ELO</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
