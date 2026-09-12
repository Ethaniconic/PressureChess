import React from 'react';
import { useBeta } from '../context/BetaContext';
import { GlassCard } from '../components/GlassCard';
import { 
  Sparkles, 
  GitCommit, 
  Calendar, 
  CheckCircle2, 
  Wrench, 
  Rocket, 
  MessageSquarePlus, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const ChangelogPage = ({ onNavigate }) => {
  const { changelog, openFeedback, betaConfig } = useBeta();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-brand text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-brand" />
              <span>PressureChess Release Notes & Roadmap</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              In-App Changelog
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track our journey from day one foundations to the public beta launch. Every release is shaped by our Founding Beta Players.
            </p>
          </div>

          <button
            onClick={() => openFeedback('feature', 'Roadmap Idea', 5)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-cyan hover:scale-105 transition-all shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Suggest a Feature</span>
          </button>
        </div>
      </div>

      {/* Release Timeline */}
      <div className="space-y-6">
        {changelog.map((release, idx) => {
          const isLatest = idx === 0;

          return (
            <GlassCard 
              key={release.version}
              className={`p-6 sm:p-8 relative overflow-hidden transition-all ${
                isLatest ? 'border-cyan-400/40 shadow-glow-cyan/20' : 'border-white/10'
              }`}
            >
              {isLatest && (
                <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              )}

              {/* Version & Badge Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-xl text-xs font-black font-mono tracking-wider ${
                    isLatest 
                      ? 'bg-cyan-500 text-black shadow-glow-cyan' 
                      : 'bg-dark-800 text-slate-300 border border-white/10'
                  }`}>
                    {release.version}
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white">{release.title}</h2>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{release.date}</span>
                  {release.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300">
                      {release.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                {release.description}
              </p>

              {/* Features List */}
              {release.features && release.features.length > 0 && (
                <div className="space-y-2 mb-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>New Features & Capabilities</span>
                  </h3>
                  <ul className="space-y-1.5">
                    {release.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-cyan-400 font-bold mt-0.5">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bug Fixes */}
              {release.fixes && release.fixes.length > 0 && (
                <div className="space-y-2 mb-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Improvements & Fixes</span>
                  </h3>
                  <ul className="space-y-1.5">
                    {release.fixes.map((fix, fxIdx) => (
                      <li key={fxIdx} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-0.5">•</span>
                        <span>{fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Upcoming Highlights */}
              {release.upcoming && release.upcoming.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Rocket className="w-3.5 h-3.5 text-amber-400" />
                    <span>Next on the Roadmap</span>
                  </h3>
                  <ul className="space-y-1">
                    {release.upcoming.map((up, upIdx) => (
                      <li key={upIdx} className="text-xs text-amber-100 flex items-start gap-2">
                        <span className="text-amber-400 font-bold mt-0.5">✦</span>
                        <span>{up}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};
