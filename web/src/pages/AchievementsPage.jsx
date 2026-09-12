import React from 'react';
import { ACHIEVEMENTS } from '../data/academyLessons';
import { useAcademy } from '../context/AcademyContext';
import { GlassCard } from '../components/GlassCard';
import { Award, Lock, CheckCircle2, Zap } from 'lucide-react';

export const AchievementsPage = () => {
  const { unlockedAchievements, totalXp } = useAcademy();

  const unlockedCount = ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id)).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Award className="w-7 h-7 text-gold-400" />
            Academy Badges & Achievements
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Unlock trophies and XP bonuses as you complete tactical lessons and master concepts
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-bold flex items-center gap-2">
          <span>{unlockedCount} / {ACHIEVEMENTS.length} Badges Unlocked</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlockedAchievements.includes(ach.id);

          return (
            <GlassCard
              key={ach.id}
              className={`p-6 flex flex-col justify-between transition-all duration-300 border ${
                isUnlocked 
                  ? 'border-gold-500/40 bg-gradient-to-br from-gold-500/10 via-dark-900 to-dark-850 shadow-glow-gold' 
                  : 'border-white/[0.06] opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                    isUnlocked 
                      ? 'bg-dark-800 border border-gold-400/50 shadow-md' 
                      : 'bg-dark-800/80 border border-white/5 grayscale'
                  }`}>
                    {ach.icon}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-dark-700 text-slate-400 text-[10px] font-bold uppercase">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{ach.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Reward:</span>
                <span className="text-gold-400 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> +{ach.xpReward} XP
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};
