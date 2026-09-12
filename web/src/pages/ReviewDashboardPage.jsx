import React from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import { GlassCard } from '../components/GlassCard';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  Bot,
  Zap,
  ArrowUpRight,
  Sparkles,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  BarChart2,
  PieChart,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ReviewDashboardPage = ({ onNavigate }) => {
  const { dashboardStats, history, loadFromHistory } = useAnalysis();

  const handleReviewGame = (reviewId) => {
    loadFromHistory(reviewId);
    onNavigate?.('game-review');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('game-review')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            title="Back to Game Review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-brand">
              <Bot className="w-3.5 h-3.5" />
              <span>Coach Orion Analytics</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">Personal Review Dashboard</h1>
          </div>
        </div>

        <button
          onClick={() => onNavigate?.('game-review')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-brand to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-black text-xs flex items-center gap-2 shadow-glow-cyan transition-all"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>Review Next Game</span>
        </button>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 border-cyan-brand/20 bg-gradient-to-br from-cyan-950/20 via-slate-900 to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Overall Accuracy
            </span>
            <div className="p-2 rounded-xl bg-cyan-brand/10 text-cyan-brand">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-1">
            <span>{dashboardStats.overallAccuracy}%</span>
          </div>
          <p className="text-[11px] text-cyan-300/80 font-medium mt-1">
            Weighted centipawn precision score
          </p>
        </GlassCard>

        <GlassCard className="p-5 border-rose-500/20 bg-gradient-to-br from-rose-950/20 via-slate-900 to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Blunder Rate
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-1">
            <span>{dashboardStats.blunderRatePct}%</span>
          </div>
          <p className="text-[11px] text-rose-300/80 font-medium mt-1">
            Moves with &gt;200 cp loss
          </p>
        </GlassCard>

        <GlassCard className="p-5 border-sky-500/20 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Games Reviewed
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {dashboardStats.gamesAnalyzed}
          </div>
          <p className="text-[11px] text-sky-300/80 font-medium mt-1">
            Full Stockfish / Engine scans
          </p>
        </GlassCard>

        <GlassCard className="p-5 border-amber-500/20 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Brilliant Moves
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {dashboardStats.brilliantsTotal}
          </div>
          <p className="text-[11px] text-amber-300/80 font-medium mt-1">
            High-leverage tactical sacrifices
          </p>
        </GlassCard>
      </div>

      {/* Accuracy Progression Graph & Tactical Weakness Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Accuracy SVG Graph (7 cols) */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-brand" />
                  <span>Accuracy Progression</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track your tactical consistency across your analyzed games
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-brand" />
                  <span className="text-slate-300 font-semibold">Your Accuracy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  <span className="text-slate-400 font-semibold">Opponent</span>
                </div>
              </div>
            </div>

            {/* SVG Line Chart */}
            <div className="w-full h-56 relative pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
                {/* Horizontal reference grid lines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="#334155" strokeDasharray="3 3" />
                <text x="15" y="24" fill="#64748b" fontSize="10" fontWeight="bold">100%</text>

                <line x1="40" y1="65" x2="480" y2="65" stroke="#334155" strokeDasharray="3 3" />
                <text x="20" y="69" fill="#64748b" fontSize="10" fontWeight="bold">80%</text>

                <line x1="40" y1="110" x2="480" y2="110" stroke="#334155" strokeDasharray="3 3" />
                <text x="20" y="114" fill="#64748b" fontSize="10" fontWeight="bold">60%</text>

                <line x1="40" y1="155" x2="480" y2="155" stroke="#334155" strokeDasharray="3 3" />
                <text x="20" y="159" fill="#64748b" fontSize="10" fontWeight="bold">40%</text>

                {/* Plot points & path for player accuracy */}
                {(() => {
                  const pts = dashboardStats.accuracyTrend;
                  if (!pts || pts.length === 0) return null;
                  const stepX = (480 - 60) / Math.max(1, pts.length - 1);

                  const pathD = pts
                    .map((p, i) => {
                      const x = 60 + i * stepX;
                      // Map accuracy 40-100 to y 155-20
                      const y = 155 - ((p.accuracy - 40) / 60) * (155 - 20);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ');

                  const oppPathD = pts
                    .map((p, i) => {
                      const x = 60 + i * stepX;
                      const y = 155 - ((p.opponentAcc - 40) / 60) * (155 - 20);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ');

                  return (
                    <>
                      {/* Opponent line */}
                      <path d={oppPathD} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />

                      {/* Player line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#00E5FF"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="filter drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                      />

                      {/* Data Point Circles */}
                      {pts.map((p, i) => {
                        const x = 60 + i * stepX;
                        const y = 155 - ((p.accuracy - 40) / 60) * (155 - 20);
                        return (
                          <g key={i} className="group cursor-pointer">
                            <circle
                              cx={x}
                              cy={y}
                              r="5"
                              fill="#070B14"
                              stroke="#00E5FF"
                              strokeWidth="2.5"
                            />
                            {/* Value Label */}
                            <text
                              x={x}
                              y={y - 10}
                              fill="#00E5FF"
                              fontSize="10"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {p.accuracy}%
                            </text>
                            {/* X-axis Label */}
                            <text
                              x={x}
                              y="172"
                              fill="#94a3b8"
                              fontSize="9"
                              fontWeight="600"
                              textAnchor="middle"
                            >
                              {p.game}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>
          </GlassCard>
        </div>

        {/* Tactical Weaknesses Breakdown (5 cols) */}
        <div className="lg:col-span-5">
          <GlassCard className="p-6 border-white/10 space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Tactical Vulnerabilities</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Recurring Themes
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Identified patterns from your game blunders and inaccuracies
              </p>
            </div>

            <div className="space-y-3 my-2">
              {dashboardStats.weaknesses.map((weak, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1.5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{weak.theme}</span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        weak.severity === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : weak.severity === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {weak.severity} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {weak.description}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate?.('pressure-trainer')}
              className="w-full py-2.5 rounded-xl bg-cyan-brand/10 hover:bg-cyan-brand/20 text-cyan-brand border border-cyan-brand/30 text-xs font-black flex items-center justify-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Train These Themes in Pressure Hub</span>
            </button>
          </GlassCard>
        </div>
      </div>

      {/* Opening Repertoire Performance */}
      <GlassCard className="p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Opening Repertoire Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Performance and engine accuracy measured by opening family
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                <th className="pb-3">ECO</th>
                <th className="pb-3">Opening Name</th>
                <th className="pb-3 text-center">Games</th>
                <th className="pb-3 text-center">Win Rate</th>
                <th className="pb-3 text-center">Avg Accuracy</th>
                <th className="pb-3 text-right">Mastery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {dashboardStats.openingRepertoire.map((op, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-mono font-bold text-cyan-brand">{op.eco}</td>
                  <td className="py-3 font-semibold text-white">{op.name}</td>
                  <td className="py-3 text-center font-bold text-slate-300">{op.games}</td>
                  <td className="py-3 text-center">
                    <span
                      className={`font-black ${
                        op.winRate >= 65 ? 'text-emerald-400' : op.winRate >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}
                    >
                      {op.winRate}%
                    </span>
                  </td>
                  <td className="py-3 text-center font-bold text-sky-400">{op.avgAccuracy}%</td>
                  <td className="py-3 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300">
                      {op.winRate >= 65 ? 'Confident' : 'Needs Polish'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Review History Library */}
      <GlassCard className="p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-brand" />
              <span>Saved Game Reviews</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review any previously analyzed game move-by-move with Coach Orion
            </p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Bot className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-400">
              No saved reviews yet. Import a PGN or analyze a sample game to get started!
            </p>
            <button
              onClick={() => onNavigate?.('game-review')}
              className="px-4 py-2 rounded-xl bg-cyan-brand/20 text-cyan-brand font-black text-xs hover:bg-cyan-brand/30 border border-cyan-brand/30 transition-all"
            >
              Analyze Your First Game
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.map((rev) => (
              <div
                key={rev.id}
                onClick={() => handleReviewGame(rev.id)}
                className="p-4 rounded-2xl bg-white/5 hover:bg-cyan-brand/10 border border-white/10 hover:border-cyan-brand/40 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-brand font-black uppercase">
                      {rev.opening?.eco || 'A00'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {rev.headers?.result || '*'}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors mt-1 truncate">
                    {rev.headers?.white || 'White'} vs {rev.headers?.black || 'Black'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {rev.opening?.name || 'Custom Game'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-white/[0.06] text-[11px] font-bold">
                  <span className="text-slate-400">
                    Acc: <span className="text-cyan-brand">{rev.accuracy?.white || 80}%</span>
                  </span>
                  <span className="text-cyan-brand group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-black">
                    Review <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
