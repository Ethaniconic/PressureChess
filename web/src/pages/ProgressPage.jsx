import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Zap, 
  Star, 
  Flame, 
  Trophy, 
  Award, 
  CheckCircle, 
  Play, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const ProgressPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { 
    modules, 
    totalXp, 
    levelInfo, 
    totalStars, 
    isLessonCompleted,
    setSelectedLesson 
  } = useAcademy();

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = modules.reduce((sum, m) => {
    return sum + m.lessons.filter(l => isLessonCompleted(l.id)).length;
  }, 0);

  // Level XP progress percentage
  const currentBase = levelInfo.currentBase;
  const nextXp = levelInfo.nextXp;
  const xpInLevel = totalXp - currentBase;
  const levelSpan = nextXp - currentBase;
  const levelProgressPct = Math.min(100, Math.max(0, Math.round((xpInLevel / levelSpan) * 100)));

  // Find next incomplete lesson
  const allLessons = modules.flatMap(m => m.lessons);
  const nextIncomplete = allLessons.find(l => !isLessonCompleted(l.id)) || allLessons[0];

  const handleResume = () => {
    setSelectedLesson(nextIncomplete);
    onNavigate('lesson-player');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-emerald-400" />
          Tactical Mastery & Progress
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Track your experience points, star ratings, and curriculum milestone completion
        </p>
      </div>

      {/* Level Card */}
      <GlassCard className="p-6 sm:p-8 border-gold-500/30 bg-gradient-to-br from-gold-500/5 via-dark-900 to-emerald-500/5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gold-500 to-amber-300 flex items-center justify-center font-black text-2xl text-black shadow-glow-gold">
              L{levelInfo.level}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gold-400">Current Rank</div>
              <h2 className="text-2xl font-black text-white">{levelInfo.title}</h2>
              <div className="text-xs text-slate-400 mt-0.5">
                {totalXp} Total XP Earned
              </div>
            </div>
          </div>

          <button
            onClick={handleResume}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-brand via-sky-400 to-cyan-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-cyan hover:opacity-95 transition-all shrink-0"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Resume Learning</span>
          </button>

        </div>

        {/* Level XP Bar */}
        <div className="mt-6 pt-6 border-t border-white/[0.08] space-y-2">
          <div className="flex justify-between text-xs text-slate-300 font-semibold">
            <span>Progress to Next Rank</span>
            <span className="text-gold-400 font-bold">{xpInLevel} / {levelSpan} XP ({levelProgressPct}%)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-dark-700 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-gold-500 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${levelProgressPct}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Stats Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5 border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Lessons Mastered</span>
            <CheckCircle className="w-4 h-4 text-cyan-brand" />
          </div>
          <div className="text-3xl font-black text-white">{completedLessons} / {totalLessons}</div>
          <div className="text-[11px] text-cyan-400 font-semibold mt-1">
            {Math.round((completedLessons / totalLessons) * 100)}% overall completion
          </div>
        </GlassCard>

        <GlassCard className="p-5 border-gold-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Academy Stars</span>
            <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
          </div>
          <div className="text-3xl font-black text-gold-400">{totalStars} ★</div>
          <div className="text-[11px] text-slate-400 mt-1">Earn up to 3 stars per lesson</div>
        </GlassCard>

        <GlassCard className="p-5 border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Daily Streak</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>
          <div className="text-3xl font-black text-orange-400">{user?.daily_streak || 1} Days</div>
          <div className="text-[11px] text-slate-400 mt-1">Active study streak</div>
        </GlassCard>
      </div>

      {/* Modules Breakdown List */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="font-bold text-white text-base">Module Completion Breakdown ({modules.length} Modules)</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modules.map((m) => {
            const done = m.lessons.filter(l => isLessonCompleted(l.id)).length;
            const pct = Math.round((done / m.lessons.length) * 100);

            return (
              <div key={m.id} className="p-4 rounded-2xl bg-dark-800/80 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white truncate max-w-[170px]">{m.title}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
                      {m.tier}
                    </span>
                  </div>
                  <span className="font-semibold text-cyan-brand">{done}/{m.lessons.length}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-dark-700 overflow-hidden">
                  <div 
                    className="h-full bg-cyan-brand rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

    </div>
  );
};
