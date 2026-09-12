import React from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

export const ChessClock = ({ 
  whiteTime = 600, 
  blackTime = 600, 
  activeTurn = 'w', 
  isPaused = false,
  onTogglePause,
  onResetClock
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-dark-900/80 border border-white/[0.08] backdrop-blur-md">
      {/* White Clock */}
      <div 
        className={`flex-1 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
          activeTurn === 'w' && !isPaused
            ? 'bg-emerald-500/15 border-emerald-500 shadow-glow-emerald'
            : 'bg-dark-800/60 border-white/[0.06]'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400" />
            White
          </span>
          {activeTurn === 'w' && !isPaused && (
            <span className="text-[10px] text-emerald-400 font-bold uppercase animate-pulse">
              Thinking
            </span>
          )}
        </div>
        <div className="text-2xl font-mono font-bold tracking-tight text-white">
          {formatTime(whiteTime)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={onTogglePause}
          className="p-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-slate-200 transition-colors"
          title={isPaused ? "Resume clock" : "Pause clock"}
        >
          {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
        </button>
        <button
          onClick={onResetClock}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-dark-800 transition-colors"
          title="Reset timers"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Black Clock */}
      <div 
        className={`flex-1 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
          activeTurn === 'b' && !isPaused
            ? 'bg-emerald-500/15 border-emerald-500 shadow-glow-emerald'
            : 'bg-dark-800/60 border-white/[0.06]'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-500" />
            Black
          </span>
          {activeTurn === 'b' && !isPaused && (
            <span className="text-[10px] text-emerald-400 font-bold uppercase animate-pulse">
              Thinking
            </span>
          )}
        </div>
        <div className="text-2xl font-mono font-bold tracking-tight text-white">
          {formatTime(blackTime)}
        </div>
      </div>
    </div>
  );
};
