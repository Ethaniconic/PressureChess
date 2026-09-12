import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Board } from '../components/ChessBoard/Board';
import confetti from 'canvas-confetti';
import { useTactics } from '../context/TacticsContext';
import { useSettings } from '../context/SettingsContext';
import { soundEngine } from '../utils/sound';
import { GlassCard } from '../components/GlassCard';
import { 
  Timer, 
  Flame, 
  Trophy, 
  Lightbulb, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  Bot,
  Zap,
  ArrowRight
} from 'lucide-react';

export const PuzzlePlayerPage = ({ onNavigate }) => {
  const { 
    currentPuzzle, 
    selectedMode, 
    puzzleRating, 
    currentStreak, 
    submitPuzzleSolve, 
    nextPuzzle 
  } = useTactics();

  const {
    boardTheme,
    pieceStyle,
    soundEnabled,
    animationEnabled,
    showCoordinates
  } = useSettings();

  // Active game state
  const [game, setGame] = useState(() => new Chess(currentPuzzle.fen));
  const [moveIndex, setMoveIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [ratingResult, setRatingResult] = useState(null);
  const [wrongMoveMsg, setWrongMoveMsg] = useState(null);

  // Timer state
  const getInitialSeconds = () => {
    if (selectedMode === '10s') return 10;
    if (selectedMode === '20s') return 20;
    if (selectedMode === '30s') return 30;
    if (selectedMode === 'sudden_death') return 20;
    return 60; // practice
  };

  const [timeLeft, setTimeLeft] = useState(getInitialSeconds);
  const [timerActive, setTimerActive] = useState(true);
  const [timeTaken, setTimeTaken] = useState(0);

  // Re-initialize whenever currentPuzzle changes
  useEffect(() => {
    setGame(new Chess(currentPuzzle.fen));
    setMoveIndex(0);
    setIsCompleted(false);
    setIsFailed(false);
    setIsShaking(false);
    setShowHint(false);
    setHintsUsed(0);
    setAttempts(0);
    setShowExplanationModal(false);
    setRatingResult(null);
    setWrongMoveMsg(null);
    setTimeLeft(getInitialSeconds());
    setTimeTaken(0);
    setTimerActive(true);
  }, [currentPuzzle]);

  // Countdown timer loop
  useEffect(() => {
    if (!timerActive || isCompleted || isFailed) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
      setTimeTaken(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, isCompleted, isFailed]);

  // Handle timeout event
  const handleTimeOut = async () => {
    setTimerActive(false);
    setIsFailed(true);
    soundEngine.playIllegal(soundEnabled);

    const result = await submitPuzzleSolve(currentPuzzle.id, false, timeTaken, hintsUsed);
    setRatingResult(result);
    setShowExplanationModal(true);
  };

  // Called by Board component on valid chess move
  const handleBoardMove = async (moveResult) => {
    if (isCompleted || isFailed) return;

    const expectedMove = currentPuzzle.expectedMoves[moveIndex];
    const moveSan = moveResult.san;
    const moveUci = `${moveResult.from}${moveResult.to}`;

    const isCorrect = 
      moveSan === expectedMove || 
      moveUci === expectedMove ||
      moveSan.replace('+', '').replace('#', '') === expectedMove.replace('+', '').replace('#', '');

    if (isCorrect) {
      setWrongMoveMsg(null);
      const nextMoveIdx = moveIndex + 1;

      // Check if more moves expected
      if (nextMoveIdx < currentPuzzle.expectedMoves.length) {
        setMoveIndex(nextMoveIdx);

        // Opponent automatic response
        const opponentResponse = currentPuzzle.opponentResponses?.[expectedMove];
        if (opponentResponse) {
          setTimeout(() => {
            try {
              game.move(opponentResponse);
              setGame(new Chess(game.fen()));
              soundEngine.playCapture(soundEnabled);
              setMoveIndex(nextMoveIdx + 1);
            } catch (_) {}
          }, 450);
        }
      } else {
        // PUZZLE SOLVED!
        setTimerActive(false);
        setIsCompleted(true);
        soundEngine.playGameEnd(soundEnabled);
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

        const result = await submitPuzzleSolve(currentPuzzle.id, true, timeTaken, hintsUsed);
        setRatingResult(result);
        setShowExplanationModal(true);

        // Sudden death bonus: add 5s
        if (selectedMode === 'sudden_death') {
          setTimeLeft(t => t + 5);
        }
      }
    } else {
      // WRONG MOVE: Enforce expected tactic
      soundEngine.playIllegal(soundEnabled);
      setAttempts(a => a + 1);
      setIsShaking(true);
      setWrongMoveMsg(`Move ${moveSan} is not the optimal line. Try again!`);

      setTimeout(() => {
        setIsShaking(false);
        setGame(new Chess(currentPuzzle.fen));
        setMoveIndex(0);
      }, 700);
    }
  };

  const handleToggleHint = () => {
    if (!showHint) {
      setHintsUsed(h => h + 1);
      setShowHint(true);
    } else {
      setShowHint(false);
    }
  };

  const handleReset = () => {
    setGame(new Chess(currentPuzzle.fen));
    setMoveIndex(0);
    setShowHint(false);
    setWrongMoveMsg(null);
  };

  const handleGiveUp = async () => {
    setTimerActive(false);
    setIsFailed(true);
    soundEngine.playIllegal(soundEnabled);

    const result = await submitPuzzleSolve(currentPuzzle.id, false, timeTaken, hintsUsed);
    setRatingResult(result);
    setShowExplanationModal(true);
  };

  const handleNext = () => {
    nextPuzzle();
  };

  // Timer Visual Colors
  const timerPercentage = Math.min(100, Math.max(0, (timeLeft / getInitialSeconds()) * 100));
  const isUrgent = timeLeft <= 5;
  const isWarning = timeLeft > 5 && timeLeft <= 10;

  let timerColor = 'bg-cyan-brand';
  let timerTextColor = 'text-cyan-brand';
  if (isUrgent) {
    timerColor = 'bg-red-500 animate-pulse';
    timerTextColor = 'text-red-400 animate-pulse';
  } else if (isWarning) {
    timerColor = 'bg-amber-400';
    timerTextColor = 'text-amber-400';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('pressure-trainer')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-brand">
                {currentPuzzle.category.toUpperCase()}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Difficulty: <span className="text-white capitalize">{currentPuzzle.difficulty}</span>
              </span>
            </div>
            <h1 className="text-lg font-black text-white mt-0.5">{currentPuzzle.title}</h1>
          </div>
        </div>

        {/* Live Pressure Timer Bar & Rating Badge */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-2xl bg-dark-850/90 border border-white/10 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-cyan-brand" />
              <span className="text-xs font-black text-white">{puzzleRating} ELO</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-amber-300">{currentStreak} STREAK</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-2xl bg-dark-850/90 border border-white/10 flex items-center gap-2 font-mono font-black text-lg ${timerTextColor}`}>
            <Timer className="w-5 h-5" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Dynamic Timer Progress Bar */}
      <div className="w-full h-2 rounded-full bg-dark-800 overflow-hidden shadow-inner">
        <div 
          className={`h-full ${timerColor} transition-all duration-300`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>

      {/* Main Board & Tactical Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Chess Board (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-3">
          
          <div className={`w-full max-w-[560px] transition-transform ${isShaking ? 'animate-shake' : ''}`}>
            <Board
              game={game}
              onMove={handleBoardMove}
              isFlipped={currentPuzzle.playerColor === 'black'}
              boardTheme={boardTheme}
              pieceStyle={pieceStyle}
              soundEnabled={soundEnabled}
              animationEnabled={animationEnabled}
              showCoordinates={showCoordinates}
              disabled={isCompleted || isFailed}
            />
          </div>

          {/* Wrong move alert banner */}
          {wrongMoveMsg && (
            <div className="w-full max-w-[560px] p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{wrongMoveMsg}</span>
            </div>
          )}

          {/* Player Turn Indicator */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <span className={`w-3 h-3 rounded-full ${currentPuzzle.playerColor === 'white' ? 'bg-white' : 'bg-slate-900 border border-white/30'}`} />
            <span>Your turn: Find the winning tactical move for {currentPuzzle.playerColor === 'white' ? 'White' : 'Black'}</span>
          </div>
        </div>

        {/* Right: Tactical Objective, Hints & Action Controls (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-5">
          
          <GlassCard className="p-6 space-y-5 border-cyan-500/30">
            <div>
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-brand border border-cyan-500/30">
                Tactical Goal
              </span>
              <h2 className="text-xl font-black text-white mt-2 mb-1">{currentPuzzle.goal}</h2>
              <p className="text-xs text-slate-400">
                Target Rating: <span className="text-cyan-300 font-bold">{currentPuzzle.rating}</span> • Mode: <span className="text-white capitalize">{selectedMode}</span>
              </p>
            </div>

            {/* Coach Orion Live Advice */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-dark-850 border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-cyan-brand">
                <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 flex items-center justify-center bg-cyan-500/20">
                  <img 
                    src="/coach_orion.jpg" 
                    alt="Coach Orion" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span>Coach Orion's Tactical Radar</span>
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                {showHint 
                  ? `💡 Hint: ${currentPuzzle.hint}`
                  : "Scanning candidate squares. Look for undefended pieces, geometric pins, or forcing king checks."
                }
              </p>
            </div>

            {/* Tactical Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleToggleHint}
                className="flex-1 px-4 py-3 rounded-xl bg-dark-800 hover:bg-dark-750 border border-white/10 hover:border-amber-500/40 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all"
              >
                <Lightbulb className={`w-4 h-4 ${showHint ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                <span>{showHint ? 'Hide Clue' : 'Get Clue (-4 ELO)'}</span>
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-xl bg-dark-800 hover:bg-dark-750 border border-white/10 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleGiveUp}
                disabled={isCompleted || isFailed}
                className="px-4 py-3 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-xs font-bold text-red-300 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                <span>Surrender</span>
              </button>
            </div>
          </GlassCard>

          {/* Championship Historical Context Box (if applicable) */}
          {currentPuzzle.championshipData && (
            <div className="p-5 rounded-2xl bg-dark-850/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Championship History</span>
              </div>
              <div className="text-xs text-white font-bold">
                {currentPuzzle.championshipData.white} vs. {currentPuzzle.championshipData.black} ({currentPuzzle.championshipData.year})
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentPuzzle.championshipData.historicalNote}
              </p>
            </div>
          )}

        </div>
      </div>

      {/* ======================================================== */}
      {/* EXPLANATION & RATING RESULT MODAL                        */}
      {/* ======================================================== */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-dark-900 border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                  isCompleted ? 'bg-cyan-500 text-black shadow-cyan-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}>
                  {isCompleted ? '⚡' : '⏱️'}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    {isCompleted ? 'Brilliant Tactical Solve!' : (timeLeft === 0 ? 'Time Expired!' : 'Puzzle Incomplete')}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isCompleted ? `Executed in ${timeTaken} seconds under clock pressure.` : 'The timer ran out before the sequence was completed.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Delta Badge */}
            {ratingResult && (
              <div className="p-4 rounded-2xl bg-dark-800/80 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Performance Adjustment</div>
                  <div className="text-lg font-black text-white flex items-center gap-2">
                    <span>{ratingResult.newRating} ELO</span>
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                      ratingResult.ratingDelta >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {ratingResult.ratingDelta >= 0 ? `+${ratingResult.ratingDelta}` : ratingResult.ratingDelta}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Active Streak</div>
                  <div className="text-lg font-black text-amber-400 flex items-center justify-end gap-1">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>{ratingResult.currentStreak}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Deep Tactical Explanation */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 space-y-2">
              <h4 className="text-xs font-black uppercase text-cyan-brand tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tactical Breakdown</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentPuzzle.explanation}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowExplanationModal(false);
                  handleReset();
                }}
                className="flex-1 px-5 py-3 rounded-xl bg-dark-800 hover:bg-dark-750 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Review Position</span>
              </button>

              <button
                onClick={() => {
                  setShowExplanationModal(false);
                  handleNext();
                }}
                className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-brand to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-black text-xs flex items-center justify-center gap-2 shadow-glow-cyan transition-all"
              >
                <span>Next Puzzle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
