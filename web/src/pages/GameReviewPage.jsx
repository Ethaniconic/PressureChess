import React, { useState, useMemo, useRef } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import { Board } from '../components/ChessBoard/Board';
import { Chess } from 'chess.js';
import { SAMPLE_PGN_GAMES, ECO_OPENINGS } from '../data/openingsData';
import { GlassCard } from '../components/GlassCard';
import {
  Upload,
  Sparkles,
  Bot,
  Zap,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  AlertTriangle,
  Flame,
  CheckCircle2,
  HelpCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  BookOpen,
  Info,
  Layers,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

export const GameReviewPage = ({ onNavigate }) => {
  const {
    activeGame,
    currentMoveIndex,
    currentMove,
    currentFen,
    currentEval,
    currentEvalStr,
    isAnalyzing,
    analysisError,
    isAutoPlaying,
    autoPlaySpeed,
    setAutoPlaySpeed,
    filterType,
    setFilterType,
    goToMove,
    nextMove,
    prevMove,
    firstMove,
    lastMove,
    jumpToNextMistake,
    jumpToPrevMistake,
    toggleAutoPlay,
    analyzePgn,
    loadSampleGame,
    history
  } = useAnalysis();

  const [isFlipped, setIsFlipped] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showOpeningModal, setShowOpeningModal] = useState(false);
  const [pastedPgn, setPastedPgn] = useState('');
  const [importTab, setImportTab] = useState('samples'); // samples | paste | file
  const fileInputRef = useRef(null);

  // Replay board instance from current FEN
  const replayChess = useMemo(() => {
    try {
      return new Chess(currentFen);
    } catch (e) {
      return new Chess();
    }
  }, [currentFen]);

  // Height percentage for the evaluation bar (eval range -10 to +10)
  const evalHeightPct = useMemo(() => {
    if (!currentMove) return 50;
    if (currentMove.evalStr === '#M') {
      return currentMove.eval > 0 ? 100 : 0;
    }
    const val = Math.max(-10, Math.min(10, currentEval));
    // -10 -> 0%, 0 -> 50%, +10 -> 100%
    return Math.round(((val + 10) / 20) * 100);
  }, [currentMove, currentEval]);

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        try {
          await analyzePgn(content, file.name.replace('.pgn', ''));
          setShowImportModal(false);
        } catch (err) {
          // Handled by analysis context
        }
      }
    };
    reader.readAsText(file);
  };

  // Handle Pasted PGN Submit
  const handlePastedPgnSubmit = async () => {
    if (!pastedPgn.trim()) return;
    try {
      await analyzePgn(pastedPgn.trim());
      setShowImportModal(false);
      setPastedPgn('');
    } catch (err) {
      // Handled by analysis context
    }
  };

  // Move classification badge renderer
  const getBadgeMeta = (classification) => {
    switch (classification) {
      case 'brilliant':
        return {
          label: 'Brilliant',
          symbol: '!!',
          bgColor: 'bg-gradient-to-r from-cyan-400 to-amber-300 text-black shadow-glow-cyan',
          textColor: 'text-cyan-300',
          borderColor: 'border-cyan-400/50'
        };
      case 'best':
        return {
          label: 'Best Move',
          symbol: '★',
          bgColor: 'bg-emerald-500 text-black',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/40'
        };
      case 'great':
        return {
          label: 'Great Move',
          symbol: '!',
          bgColor: 'bg-sky-500 text-black',
          textColor: 'text-sky-400',
          borderColor: 'border-sky-500/40'
        };
      case 'inaccuracy':
        return {
          label: 'Inaccuracy',
          symbol: '?!',
          bgColor: 'bg-amber-400 text-black',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-400/40'
        };
      case 'mistake':
        return {
          label: 'Mistake',
          symbol: '?',
          bgColor: 'bg-orange-500 text-white',
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/40'
        };
      case 'blunder':
        return {
          label: 'Blunder',
          symbol: '??',
          bgColor: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30',
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/50'
        };
      default:
        return {
          label: 'Good',
          symbol: '•',
          bgColor: 'bg-slate-700 text-slate-200',
          textColor: 'text-slate-300',
          borderColor: 'border-slate-600'
        };
    }
  };

  // Moves filtered by classification filter
  const filteredMoveIndexes = useMemo(() => {
    if (!activeGame?.moves) return [];
    return activeGame.moves
      .map((m, idx) => ({ ...m, origIdx: idx }))
      .filter((m) => {
        if (filterType === 'all') return true;
        if (filterType === 'mistakes') return ['inaccuracy', 'mistake', 'blunder'].includes(m.classification);
        return m.classification === filterType;
      });
  }, [activeGame, filterType]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header / Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-brand/20 via-sky-500/10 to-transparent border border-cyan-brand/30 flex items-center justify-center text-cyan-brand shadow-glow-cyan/50">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-cyan-brand">
                AI Game Review Studio
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-brand/10 border border-cyan-brand/20 text-cyan-300 font-bold">
                Coach Orion
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{activeGame?.headers?.white || 'White'}</span>
              <span className="text-slate-500 text-sm font-normal">vs</span>
              <span>{activeGame?.headers?.black || 'Black'}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300 ml-1">
                {activeGame?.headers?.result || '*'}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => onNavigate?.('review-dashboard')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-cyan-brand" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setShowOpeningModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{activeGame?.opening?.eco || 'A00'} Opening</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-brand to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-black text-xs flex items-center gap-2 shadow-glow-cyan transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Import / Sample</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Chess Board & Eval Bar (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center gap-4">
          {/* Match Scoreboard & Accuracy summary */}
          <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-md">
            {/* White Player */}
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-white border border-slate-400 shadow-sm" />
              <div>
                <div className="text-xs font-bold text-white leading-tight truncate max-w-[120px] sm:max-w-[160px]">
                  {activeGame?.headers?.white || 'White'}
                </div>
                <div className="text-[10px] text-cyan-brand font-semibold">
                  Acc: {activeGame?.accuracy?.white || 82}%
                </div>
              </div>
            </div>

            {/* Middle Result Badge */}
            <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-black tracking-wider text-slate-300">
              {activeGame?.headers?.result || '*'}
            </div>

            {/* Black Player */}
            <div className="flex items-center gap-2.5 text-right">
              <div>
                <div className="text-xs font-bold text-white leading-tight truncate max-w-[120px] sm:max-w-[160px]">
                  {activeGame?.headers?.black || 'Black'}
                </div>
                <div className="text-[10px] text-sky-400 font-semibold">
                  Acc: {activeGame?.accuracy?.black || 79}%
                </div>
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-600 shadow-sm" />
            </div>
          </div>

          {/* Board Area with Vertical Dynamic Evaluation Bar */}
          <div className="w-full flex justify-center items-stretch gap-3 sm:gap-4">
            {/* Dynamic Evaluation Bar */}
            <div className="flex flex-col items-center w-7 sm:w-8 py-1">
              <div className="relative w-full h-[340px] sm:h-[460px] md:h-[500px] rounded-full overflow-hidden bg-slate-950 border border-white/10 shadow-inner flex flex-col justify-end">
                {/* White Advantage Fill (bottom up) */}
                <div
                  className="w-full bg-gradient-to-t from-cyan-brand via-sky-400 to-white transition-all duration-300"
                  style={{ height: `${evalHeightPct}%` }}
                />

                {/* Equilibrium Midline (0.0) */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/40 pointer-events-none" />

                {/* Numeric Eval Pill */}
                <div
                  className={`absolute left-0 right-0 text-[10px] font-black text-center py-0.5 tracking-tight transition-all duration-300 pointer-events-none ${
                    evalHeightPct > 50
                      ? 'bottom-2 text-slate-950 bg-white/90 rounded-full mx-1'
                      : 'top-2 text-white bg-slate-900/90 rounded-full mx-1'
                  }`}
                >
                  {currentEvalStr}
                </div>
              </div>
              <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Eval</div>
            </div>

            {/* Chess Board Container */}
            <div className="flex-1 max-w-[500px] aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-900">
              <Board
                game={replayChess}
                disabled={true}
                isFlipped={isFlipped}
                boardTheme="emerald"
                pieceStyle="neo"
                soundEnabled={soundEnabled}
              />

              {/* Move Indicator Overlay */}
              {currentMove && (
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-black text-white flex items-center gap-1.5 shadow-lg">
                  <span className="text-cyan-brand font-mono">
                    {currentMove.moveNumber}.{currentMove.turn === 'black' ? '..' : ''} {currentMove.san}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                      getBadgeMeta(currentMove.classification).bgColor
                    }`}
                  >
                    {getBadgeMeta(currentMove.classification).symbol}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Board Navigation & Scrubber Toolbar */}
          <div className="w-full max-w-[560px] flex flex-col gap-2 p-3 rounded-2xl bg-slate-900/90 border border-white/[0.08] backdrop-blur-md">
            {/* Playback Button Group */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={firstMove}
                  disabled={currentMoveIndex === -1}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white transition-all"
                  title="First Move"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={prevMove}
                  disabled={currentMoveIndex === -1}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white transition-all"
                  title="Previous Move"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleAutoPlay}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                    isAutoPlaying
                      ? 'bg-amber-400 text-black shadow-glow-amber'
                      : 'bg-cyan-brand/20 hover:bg-cyan-brand/30 text-cyan-brand border border-cyan-brand/30'
                  }`}
                  title="Auto Play"
                >
                  {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isAutoPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={nextMove}
                  disabled={!activeGame?.moves || currentMoveIndex >= activeGame.moves.length - 1}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white transition-all"
                  title="Next Move"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={lastMove}
                  disabled={!activeGame?.moves || currentMoveIndex >= activeGame.moves.length - 1}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white transition-all"
                  title="Last Move"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Jump to Mistake / Blunder */}
              <button
                onClick={jumpToNextMistake}
                className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-black flex items-center gap-1.5 transition-all shadow-sm"
                title="Jump directly to next inaccuracy, mistake, or blunder"
              >
                <Zap className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Next Mistake</span>
              </button>

              {/* Utility Tools: Flip, Sound */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsFlipped((prev) => !prev)}
                  className={`p-2 rounded-xl text-slate-300 hover:text-white transition-all ${
                    isFlipped ? 'bg-cyan-brand/20 text-cyan-brand border border-cyan-brand/30' : 'bg-white/5 hover:bg-white/10'
                  }`}
                  title="Flip Board"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                  title="Toggle Sound"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Move Slider Scrubber */}
            {activeGame?.moves && activeGame.moves.length > 0 && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[10px] font-mono text-slate-400 font-bold min-w-[32px]">
                  {currentMoveIndex + 1}/{activeGame.moves.length}
                </span>
                <input
                  type="range"
                  min="-1"
                  max={activeGame.moves.length - 1}
                  value={currentMoveIndex}
                  onChange={(e) => goToMove(parseInt(e.target.value, 10))}
                  className="flex-1 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Coach Orion Advice & Move Explorer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Coach Orion Speech Card */}
          <GlassCard className="p-5 border-cyan-brand/30 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-cyan-950/20 relative overflow-hidden shadow-2xl">
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-brand/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start gap-3.5 relative z-10">
              {/* Coach Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-500 p-[2px] shadow-glow-cyan">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Bot className="w-6 h-6 text-cyan-brand" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
              </div>

              {/* Speech & Title */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>Coach Orion</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-brand/10 text-cyan-300 border border-cyan-brand/20">
                        AI Grandmaster
                      </span>
                    </h3>
                  </div>

                  {currentMove && (
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 shadow-sm ${
                        getBadgeMeta(currentMove.classification).bgColor
                      }`}
                    >
                      <span>{getBadgeMeta(currentMove.classification).symbol}</span>
                      <span>{getBadgeMeta(currentMove.classification).label}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed mt-2.5">
                  {currentMove
                    ? currentMove.coach?.why_weak || currentMove.coach?.summary || 'Good move keeping dynamic initiative.'
                    : 'Select a move or press Play to explore move evaluations, blunders, and Coach Orion advice.'}
                </p>
              </div>
            </div>

            {/* Move Comparison: Played vs Better Move */}
            {currentMove && (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/[0.08] relative z-10">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Move Played
                  </div>
                  <div className="text-base font-black text-white font-mono mt-0.5 flex items-center gap-1.5">
                    <span>{currentMove.san}</span>
                    <span className="text-xs text-slate-400 font-normal">
                      ({currentMove.accuracy}%)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-brand/10 border border-cyan-brand/20">
                  <div className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-brand" />
                    <span>Engine Suggestion</span>
                  </div>
                  <div className="text-base font-black text-cyan-300 font-mono mt-0.5">
                    {currentMove.bestMoveSan || currentMove.san}
                  </div>
                </div>
              </div>
            )}

            {/* Tactical & Positional Concept Tags */}
            {currentMove?.coach && (
              <div className="space-y-2 mt-3.5 pt-3 border-t border-white/[0.06] relative z-10">
                {currentMove.coach.tactical_ideas?.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Tactics:</span>
                    </span>
                    {currentMove.coach.tactical_ideas.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {currentMove.coach.positional_ideas?.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="w-3 h-3 text-cyan-brand" />
                      <span>Strategy:</span>
                    </span>
                    {currentMove.coach.positional_ideas.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-brand/10 border border-cyan-brand/20 text-cyan-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </GlassCard>

          {/* Game Stats & Move Classification Chips */}
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { type: 'brilliant', label: 'Brilliant', symbol: '!!', color: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10' },
              { type: 'best', label: 'Best', symbol: '★', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
              { type: 'inaccuracy', label: 'Inaccuracy', symbol: '?!', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
              { type: 'mistake', label: 'Mistake', symbol: '?', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
              { type: 'blunder', label: 'Blunder', symbol: '??', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' }
            ].map((cls) => {
              const count = activeGame?.moves?.filter((m) => m.classification === cls.type).length || 0;
              return (
                <button
                  key={cls.type}
                  onClick={() => setFilterType((prev) => (prev === cls.type ? 'all' : cls.type))}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    filterType === cls.type
                      ? 'ring-2 ring-cyan-brand bg-white/10'
                      : 'hover:bg-white/5'
                  } ${cls.color}`}
                >
                  <div className="text-xs font-black">{cls.symbol}</div>
                  <div className="text-[13px] font-black text-white">{count}</div>
                  <div className="text-[9px] font-bold uppercase truncate">{cls.label}</div>
                </button>
              );
            })}
          </div>

          {/* Move Explorer & Notation Table */}
          <div className="rounded-2xl bg-slate-900/90 border border-white/[0.08] backdrop-blur-md overflow-hidden flex flex-col h-[280px]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-slate-950/40">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-brand" />
                <span>Move Explorer</span>
              </span>
              <div className="flex items-center gap-1">
                {filterType !== 'all' && (
                  <button
                    onClick={() => setFilterType('all')}
                    className="text-[10px] text-cyan-brand font-bold hover:underline"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Notation List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-white/[0.04]">
              {activeGame?.moves && (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: Math.ceil(activeGame.moves.length / 2) }).map((_, moveRowIdx) => {
                    const whiteIdx = moveRowIdx * 2;
                    const blackIdx = moveRowIdx * 2 + 1;
                    const whiteMove = activeGame.moves[whiteIdx];
                    const blackMove = activeGame.moves[blackIdx];

                    return (
                      <React.Fragment key={moveRowIdx}>
                        {/* White Move Cell */}
                        {whiteMove && (
                          <div
                            onClick={() => goToMove(whiteIdx)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-mono transition-all ${
                              currentMoveIndex === whiteIdx
                                ? 'bg-cyan-brand/20 border border-cyan-brand/40 text-cyan-300 font-bold shadow-sm'
                                : 'hover:bg-white/5 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500 text-[11px] font-bold">
                                {whiteMove.moveNumber}.
                              </span>
                              <span>{whiteMove.san}</span>
                            </div>
                            <span
                              className={`text-[9px] px-1 py-0.2 rounded font-black ${
                                getBadgeMeta(whiteMove.classification).bgColor
                              }`}
                            >
                              {getBadgeMeta(whiteMove.classification).symbol}
                            </span>
                          </div>
                        )}

                        {/* Black Move Cell */}
                        {blackMove ? (
                          <div
                            onClick={() => goToMove(blackIdx)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-mono transition-all ${
                              currentMoveIndex === blackIdx
                                ? 'bg-cyan-brand/20 border border-cyan-brand/40 text-cyan-300 font-bold shadow-sm'
                                : 'hover:bg-white/5 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500 text-[11px] font-bold">
                                {blackMove.moveNumber}...
                              </span>
                              <span>{blackMove.san}</span>
                            </div>
                            <span
                              className={`text-[9px] px-1 py-0.2 rounded font-black ${
                                getBadgeMeta(blackMove.classification).bgColor
                              }`}
                            >
                              {getBadgeMeta(blackMove.classification).symbol}
                            </span>
                          </div>
                        ) : (
                          <div className="text-slate-700 font-mono text-xs px-2.5 py-1.5">—</div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Import / Sample Games Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-brand/20 text-cyan-brand flex items-center justify-center border border-cyan-brand/30">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white">Import Game for Review</h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Tab selector */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-white/10">
              <button
                onClick={() => setImportTab('samples')}
                className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
                  importTab === 'samples' ? 'bg-cyan-brand text-black shadow-glow-cyan' : 'text-slate-400 hover:text-white'
                }`}
              >
                Instructive Classics
              </button>
              <button
                onClick={() => setImportTab('paste')}
                className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
                  importTab === 'paste' ? 'bg-cyan-brand text-black shadow-glow-cyan' : 'text-slate-400 hover:text-white'
                }`}
              >
                Paste PGN Text
              </button>
              <button
                onClick={() => setImportTab('file')}
                className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
                  importTab === 'file' ? 'bg-cyan-brand text-black shadow-glow-cyan' : 'text-slate-400 hover:text-white'
                }`}
              >
                Upload .PGN File
              </button>
            </div>

            {/* Tab: Instructive Sample Games */}
            {importTab === 'samples' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {SAMPLE_PGN_GAMES.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => {
                      loadSampleGame(sample.id);
                      setShowImportModal(false);
                    }}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-cyan-brand/10 border border-white/10 hover:border-cyan-brand/40 cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-cyan-brand tracking-wider">
                          {sample.eco} • {sample.opening}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{sample.result}</span>
                      </div>
                      <h4 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors mt-1">
                        {sample.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {sample.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06] text-[11px] font-bold text-slate-400">
                      <span>{sample.date.split('.')[0]}</span>
                      <span className="text-cyan-brand group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Review Game <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Paste PGN */}
            {importTab === 'paste' && (
              <div className="space-y-4">
                <textarea
                  rows={8}
                  placeholder={`Paste your PGN game from Chess.com, Lichess, or offline analysis here...
Example:
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3...`}
                  value={pastedPgn}
                  onChange={(e) => setPastedPgn(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-brand/50 resize-none leading-relaxed placeholder-slate-600"
                />
                <button
                  onClick={handlePastedPgnSubmit}
                  disabled={!pastedPgn.trim() || isAnalyzing}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-brand to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-black text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <span>Analyzing moves with Coach Orion...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Start Game Analysis</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab: File Upload */}
            {importTab === 'file' && (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/15 rounded-2xl hover:border-cyan-brand/50 transition-all text-center space-y-3 bg-slate-950/40">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pgn"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-cyan-brand/10 text-cyan-brand flex items-center justify-center border border-cyan-brand/20">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Upload .pgn file</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Drop your exported game file here or browse your system
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Opening Recognition & Repertoire details */}
      {showOpeningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                    Opening Recognition
                  </span>
                  <h3 className="text-base font-black text-white">
                    {activeGame?.opening?.name || "King's Pawn Opening"}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowOpeningModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  ECO Code & Identification
                </div>
                <div className="text-lg font-black text-cyan-brand font-mono mt-0.5">
                  {activeGame?.opening?.eco || 'A00'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  {activeGame?.opening?.description ||
                    'A rich classical opening structure with strong central confrontation and dynamic counter-play.'}
                </p>
              </div>

              {/* Win-rate metrics */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">White Win</div>
                  <div className="text-base font-black text-white mt-0.5">
                    {activeGame?.opening?.whiteWinRate || 38}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Draw</div>
                  <div className="text-base font-black text-slate-300 mt-0.5">
                    {activeGame?.opening?.drawRate || 34}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Black Win</div>
                  <div className="text-base font-black text-sky-400 mt-0.5">
                    {activeGame?.opening?.blackWinRate || 28}%
                  </div>
                </div>
              </div>

              {/* Key Concepts */}
              {activeGame?.opening?.keyConcepts && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Key Tactical & Strategic Goals
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeGame.opening.keyConcepts.map((c, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-brand/10 border border-cyan-brand/20 text-cyan-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowOpeningModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
