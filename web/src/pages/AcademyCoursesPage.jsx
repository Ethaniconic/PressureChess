import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { GlassCard } from '../components/GlassCard';
import { 
  GraduationCap, 
  Star, 
  CheckCircle, 
  Play, 
  Award, 
  Zap, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  Filter,
  Bot
} from 'lucide-react';
import { ACADEMY_TIERS } from '../data/academyLessons';

export const AcademyCoursesPage = ({ onNavigate }) => {
  const { 
    modules, 
    totalXp, 
    levelInfo, 
    totalStars, 
    isLessonCompleted, 
    getLessonStars,
    setSelectedLesson 
  } = useAcademy();

  const [activeTierFilter, setActiveTierFilter] = useState('all');
  const [expandedModuleId, setExpandedModuleId] = useState('board-basics');

  const filteredModules = activeTierFilter === 'all' 
    ? modules 
    : modules.filter(m => m.tier === activeTierFilter);

  const handleStartLesson = (lesson) => {
    setSelectedLesson(lesson);
    onNavigate('lesson-player');
  };

  const totalLessonsCount = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessonsCount = modules.reduce((acc, m) => {
    return acc + m.lessons.filter(l => isLessonCompleted(l.id)).length;
  }, 0);
  const overallProgressPct = Math.round((completedLessonsCount / totalLessonsCount) * 100) || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Academy Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-cyan-500/30 p-6 sm:p-8 shadow-xl shadow-cyan-950/30">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-brand text-xs font-black uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" /> Comprehensive Curriculum • 17 Modules
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              PressureChess Academy
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Progressive chess training curriculum from beginner rules to advanced calculation, forks, skewers, pins, and master endgames.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-dark-800/90 border border-white/10 text-center min-w-[90px]">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Star className="w-3 h-3 text-gold-400 fill-gold-400" /> Stars
              </div>
              <div className="text-xl font-mono font-bold text-gold-400 mt-0.5">{totalStars}</div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-dark-800/90 border border-white/10 text-center min-w-[90px]">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-cyan-brand" /> Total XP
              </div>
              <div className="text-xl font-mono font-bold text-cyan-brand mt-0.5">{totalXp}</div>
            </div>
          </div>
        </div>

        {/* Course Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-semibold">
              <span>Overall Academy Completion: {completedLessonsCount} / {totalLessonsCount} Lessons</span>
              <span className="text-cyan-brand font-bold">{overallProgressPct}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-dark-700 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-brand via-sky-400 to-indigo-500 rounded-full transition-all duration-500 shadow-glow-cyan"
                style={{ width: `${overallProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTierFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTierFilter === 'all'
              ? 'bg-cyan-500/25 text-white border border-cyan-400/60 shadow-glow-cyan font-black'
              : 'bg-dark-850 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
          }`}
        >
          All Modules ({modules.length})
        </button>

        {ACADEMY_TIERS.map(tier => {
          const count = modules.filter(m => m.tier === tier.id).length;
          const isActive = activeTierFilter === tier.id;

          return (
            <button
              key={tier.id}
              onClick={() => setActiveTierFilter(tier.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-cyan-500/25 text-white border border-cyan-400/60 shadow-glow-cyan font-black'
                  : 'bg-dark-850 text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              <span>{tier.icon}</span>
              <span>{tier.title}</span>
              <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Modules List / Accordion */}
      <div className="space-y-4">
        {filteredModules.map((mod, idx) => {
          const isExpanded = expandedModuleId === mod.id;
          const completedInModule = mod.lessons.filter(l => isLessonCompleted(l.id)).length;
          const isModuleComplete = completedInModule === mod.lessons.length;

          return (
            <GlassCard 
              key={mod.id} 
              className={`overflow-hidden transition-all duration-300 border ${
                isExpanded 
                  ? 'border-cyan-500/40 bg-dark-850/90 shadow-lg' 
                  : 'hover:border-cyan-500/30'
              }`}
            >
              {/* Module Header */}
              <div 
                onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                className="p-5 sm:p-6 cursor-pointer flex items-center justify-between gap-4 select-none"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 ${
                    isModuleComplete 
                      ? 'bg-emerald-500 text-black shadow-glow-emerald' 
                      : 'bg-dark-800 border border-white/10 text-cyan-brand'
                  }`}>
                    {isModuleComplete ? '✓' : `0${idx + 1}`}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-white truncate">{mod.title}</h3>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {mod.badge}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
                        {mod.tier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">{mod.description}</p>
                    {mod.coachTip && (
                      <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-cyan-300 mt-1.5 font-medium">
                        <Bot className="w-3.5 h-3.5 text-cyan-brand shrink-0" />
                        <span className="italic truncate">Coach Orion: "{mod.coachTip}"</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-300">
                      {completedInModule} / {mod.lessons.length} Completed
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      {mod.lessons.map(l => (
                        <div 
                          key={l.id} 
                          className={`w-2 h-2 rounded-full ${
                            isLessonCompleted(l.id) ? 'bg-cyan-brand' : 'bg-dark-700'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>

                  <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    isExpanded ? 'rotate-90 text-cyan-brand' : ''
                  }`} />
                </div>
              </div>

              {/* Expanded Lessons List */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-white/[0.06] space-y-3 animate-fade-in bg-dark-900/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mod.lessons.map((lesson, lIdx) => {
                      const completed = isLessonCompleted(lesson.id);
                      const stars = getLessonStars(lesson.id);

                      return (
                        <div 
                          key={lesson.id}
                          className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                            completed 
                              ? 'bg-emerald-950/20 border-emerald-500/30' 
                              : 'bg-dark-800/80 border-white/[0.08] hover:border-cyan-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                              completed 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-dark-700 text-slate-400'
                            }`}>
                              {completed ? <CheckCircle className="w-4 h-4" /> : `${lIdx + 1}`}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">{lesson.title}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-cyan-400 font-semibold">+{lesson.xp} XP</span>
                                {completed && (
                                  <div className="flex items-center">
                                    {[1, 2, 3].map((s) => (
                                      <Star 
                                        key={s} 
                                        className={`w-3 h-3 ${s <= stars ? 'text-gold-400 fill-gold-400' : 'text-dark-600'}`} 
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleStartLesson(lesson)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                              completed 
                                ? 'bg-white/10 hover:bg-white/15 text-slate-200' 
                                : 'bg-gradient-to-r from-cyan-brand to-sky-400 hover:opacity-90 text-black font-black shadow-glow-cyan'
                            }`}
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>{completed ? 'Review' : 'Play'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};
