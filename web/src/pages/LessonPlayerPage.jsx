import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Board } from '../components/ChessBoard/Board';
import { GlassCard } from '../components/GlassCard';
import { useAcademy } from '../context/AcademyContext';
import { useSettings } from '../context/SettingsContext';
import { soundEngine } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Lightbulb, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  Award,
  Sparkles,
  Bot,
  MessageSquareQuote
} from 'lucide-react';

export const LessonPlayerPage = ({ onNavigate }) => {
  const { 
    modules, 
    selectedLesson, 
    setSelectedLesson, 
    markLessonComplete, 
    isLessonCompleted 
  } = useAcademy();

  const {
    boardTheme,
    pieceStyle,
    soundEnabled,
    animationEnabled,
    showCoordinates,
  } = useSettings();

  // Active lesson fallback
  const lesson = selectedLesson || modules[0]?.lessons[0];

  const [game, setGame] = useState(() => new Chess(lesson.fen));
  const [showHint, setShowHint] = useState(false);
  const [showCandidates, setShowCandidates] = useState(false);
  const [wrongMoveMessage, setWrongMoveMessage] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [coachCommentary, setCoachCommentary] = useState(
    "Assess the pawn structure and piece coordination. Find the most forcing, purposeful move!"
  );

  // Re-initialize when selected lesson changes
  useEffect(() => {
    if (lesson) {
      setGame(new Chess(lesson.fen));
      setShowHint(false);
      setShowCandidates(false);
      setWrongMoveMessage(null);
      setIsCompleted(false);
      setEarnedStars(3);
      setHintsUsedCount(0);
      setAttempts(1);
      setCoachCommentary("Focus on the goal. Look for how your piece movement shifts the balance of power.");
    }
  }, [lesson]);

  const handleLessonMove = (moveResult, currentChess) => {
    if (!moveResult || isCompleted) return;

    const moveUci = `${moveResult.from}${moveResult.to}${moveResult.promotion || ''}`;
    const moveSan = moveResult.san;

    // Check if the move is in expectedMoves
    const isTargetMove = lesson.expectedMoves.includes(moveUci) || 
                         lesson.expectedMoves.includes(moveSan) ||
                         lesson.expectedMoves.includes(`${moveResult.from}${moveResult.to}`);

    if (isTargetMove) {
      // SUCCESS!
      soundEngine.playGameEnd(soundEnabled);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

      let stars = 3;
      if (hintsUsedCount > 1 || attempts > 2) stars = 1;
      else if (hintsUsedCount === 1 || attempts === 2) stars = 2;

      setEarnedStars(stars);
      setIsCompleted(true);
      setWrongMoveMessage(null);
      setCoachCommentary("Magnificent tactical execution! You spotted the master move with clinical precision.");

      markLessonComplete(lesson.id, stars, hintsUsedCount, attempts, lesson.xp);
    } else {
      // WRONG MOVE: Enforce only target lesson move
      setAttempts(a => a + 1);
      setIsShaking(true);
      setWrongMoveMessage(`That is a valid chess move (${moveSan}), but does not accomplish the lesson objective. Try again!`);
      setCoachCommentary(`Move ${moveSan} doesn't quite fulfill the requirement. Re-examine the candidate squares.`);
      
      setTimeout(() => {
        setIsShaking(false);
        const resetGame = new Chess(lesson.fen);
        setGame(resetGame);
      }, 700);
    }
  };

  const handleResetLesson = () => {
    setGame(new Chess(lesson.fen));
    setWrongMoveMessage(null);
    setIsCompleted(false);
    setCoachCommentary("Board reset. Take a breath and calculate the forcing line.");
  };

  const handleToggleHint = () => {
    if (!showHint) {
      setHintsUsedCount(h => h + 1);
      setCoachCommentary(lesson.hint);
    } else {
      setCoachCommentary("Focus on the objective. You can do this!");
    }
    setShowHint(!showHint);
  };

  // Find next lesson
  const allLessons = modules.flatMap(m => m.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const nextLesson = allLessons[currentIndex + 1];

  const handleNextLesson = () => {
    if (nextLesson) {
      setSelectedLesson(nextLesson);
    } else {
      onNavigate('academy');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in space-y-6">
      
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('academy')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-cyan-brand transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Curriculum
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Lesson {currentIndex + 1} of {allLessons.length}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-brand font-black border border-cyan-500/30">
            +{lesson.xp} XP
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Board (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-4">
          
          <div className={`w-full max-w-[560px] transition-transform ${isShaking ? 'animate-shake' : ''}`}>
            <Board
              game={game}
              onMove={handleLessonMove}
              boardTheme={boardTheme}
              pieceStyle={pieceStyle}
              soundEnabled={soundEnabled}
              animationEnabled={animationEnabled}
              showCoordinates={showCoordinates}
              disabled={isCompleted}
            />
          </div>

          {/* Wrong move alert banner */}
          {wrongMoveMessage && (
            <div className="w-full max-w-[560px] p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{wrongMoveMessage}</span>
            </div>
          )}

          {/* Candidate Squares Markers Tooltip */}
          {showCandidates && lesson.candidateSquares && (
            <div className="w-full max-w-[560px] p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-brand" />
                <span>Target Candidate Squares: <strong>{lesson.candidateSquares.join(', ')}</strong></span>
              </div>
              <button 
                onClick={() => setShowCandidates(false)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Interactive Lesson Controls */}
          <div className="flex items-center gap-3 w-full max-w-[560px] justify-center pt-1">
            <button
              onClick={handleToggleHint}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                showHint 
                  ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-glow-gold' 
                  : 'bg-dark-850 border-white/10 text-slate-300 hover:border-gold-500/40 hover:text-gold-300'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'Hide Hint' : 'Get Hint'}
            </button>

            <button
              onClick={() => setShowCandidates(!showCandidates)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                showCandidates
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-brand'
                  : 'bg-dark-850 border-white/10 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-brand'
              }`}
            >
              <Target className="w-4 h-4" />
              Candidate Squares
            </button>

            <button
              onClick={handleResetLesson}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dark-850 border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:bg-dark-800 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

        </div>

        {/* Right Column: Goal, AI Coach Commentary, Explanation (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          
          <GlassCard className="p-6 space-y-5 border-cyan-500/30">
            <div>
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-brand border border-cyan-500/30">
                Lesson Objective
              </span>
              <h2 className="text-xl font-black text-white mt-2 mb-1">{lesson.title}</h2>
              <p className="text-sm font-semibold text-cyan-300 leading-snug">
                {lesson.goal}
              </p>
            </div>

            {/* AI Coach Live Commentary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-dark-850 border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-cyan-brand">
                <div className="relative w-5 h-5 rounded-md overflow-hidden shrink-0 flex items-center justify-center bg-cyan-500/20">
                  <img 
                    src="/coach_orion.jpg" 
                    alt="Coach Orion" 
                    className="w-full h-full object-cover absolute inset-0"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span>Coach Orion's Live Commentary</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{coachCommentary}"
              </p>
            </div>

            {/* Concept Explanation */}
            <div className="p-4 rounded-2xl bg-dark-800/80 border border-white/5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Concept Explanation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lesson.explanation}
              </p>
            </div>

            {/* Hint Box (when opened) */}
            {showHint && (
              <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-gold-400">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Coach's Tactical Hint</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {lesson.hint}
                </p>
              </div>
            )}

            {/* Status box */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span>Attempts: {attempts}</span>
              <span>Hints Used: {hintsUsedCount}</span>
            </div>
          </GlassCard>

        </div>

      </div>

      {/* Lesson Complete Celebration Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-dark-900 border border-cyan-500/50 rounded-3xl p-8 max-w-md w-full text-center shadow-glow-cyan">
            
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-brand mx-auto flex items-center justify-center mb-4 shadow-glow-cyan">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-white mb-1">Brilliant Move!</h2>
            <p className="text-xs text-slate-300 mb-6">You successfully completed this tactical lesson.</p>

            {/* Stars Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-8 h-8 ${s <= earnedStars ? 'text-gold-400 fill-gold-400 animate-bounce' : 'text-dark-700'}`}
                  style={{ animationDelay: `${s * 0.1}s` }}
                />
              ))}
            </div>

            {/* Rewards Pill */}
            <div className="p-4 rounded-2xl bg-dark-800 border border-white/10 mb-6 flex justify-around">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">XP Earned</div>
                <div className="text-xl font-black text-cyan-brand">+{lesson.xp} XP</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Rating</div>
                <div className="text-xl font-black text-gold-400">{earnedStars} Stars</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleNextLesson}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-brand to-sky-400 text-black font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-glow-cyan transition-all flex items-center justify-center gap-2"
              >
                <span>{nextLesson ? 'Next Lesson' : 'Complete Module'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetLesson}
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Replay
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
