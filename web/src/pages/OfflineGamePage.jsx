import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Board } from '../components/ChessBoard/Board';
import { ChessClock } from '../components/ChessClock';
import { CapturedPieces } from '../components/ChessBoard/CapturedPieces';
import { GlassCard } from '../components/GlassCard';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { saveGameToBackend } from '../services/api';
import { 
  RotateCcw, 
  FlipVertical, 
  Flag, 
  Handshake, 
  Bot, 
  Users, 
  Clock, 
  Download,
  Award,
  Sparkles,
  ChevronLeft
} from 'lucide-react';

const PIECE_VALS = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

export const OfflineGamePage = ({ onNavigate }) => {
  const [chessInstance, setChessInstance] = useState(() => new Chess());
  const [, setTick] = useState(0); // Force re-render on chess internal changes
  const [gameMode, setGameMode] = useState('human'); // 'human' or 'bot'
  const [moveHistory, setMoveHistory] = useState([]);
  const [whiteCaptured, setWhiteCaptured] = useState([]); // Pieces captured BY white (black pieces)
  const [blackCaptured, setBlackCaptured] = useState([]); // Pieces captured BY black (white pieces)
  
  // Game Over Modal State
  const [gameOverModal, setGameOverModal] = useState(null); // { title, subtitle, result }

  // Clock Timers (Default 10 min Rapid)
  const [whiteSeconds, setWhiteSeconds] = useState(600);
  const [blackSeconds, setBlackSeconds] = useState(600);
  const [isClockPaused, setIsClockPaused] = useState(true);

  const {
    boardTheme,
    pieceStyle,
    soundEnabled,
    animationEnabled,
    showCoordinates,
    isFlipped,
    toggleFlip
  } = useSettings();

  const { user } = useAuth();
  const timerRef = useRef(null);

  // Clock countdown ticker
  useEffect(() => {
    if (!isClockPaused && !gameOverModal) {
      timerRef.current = setInterval(() => {
        const turn = chessInstance.turn();
        if (turn === 'w') {
          setWhiteSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleTimeOut('w');
              return 0;
            }
            return prev - 1;
          });
        } else {
          setBlackSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleTimeOut('b');
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isClockPaused, gameOverModal, chessInstance]);

  const handleTimeOut = (color) => {
    const winner = color === 'w' ? 'Black' : 'White';
    const result = color === 'w' ? '0-1' : '1-0';
    finishGame(`${winner} wins on time!`, 'Time forfeit', result);
  };

  // Recalculate captured pieces after a move
  const updateCapturedPieces = (game) => {
    const fullSet = {
      p: 8, n: 2, b: 2, r: 2, q: 1
    };

    const board = game.board();
    const currentCounts = { w: { p: 0, n: 0, b: 0, r: 0, q: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0 } };

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type !== 'k') {
          currentCounts[p.color][p.type]++;
        }
      }
    }

    // Black pieces captured BY White
    const byWhite = [];
    // White pieces captured BY Black
    const byBlack = [];

    Object.keys(fullSet).forEach((type) => {
      const max = fullSet[type];
      const blackRemaining = currentCounts['b'][type] || 0;
      const whiteRemaining = currentCounts['w'][type] || 0;

      for (let i = 0; i < max - blackRemaining; i++) byWhite.push(type);
      for (let i = 0; i < max - whiteRemaining; i++) byBlack.push(type);
    });

    setWhiteCaptured(byWhite);
    setBlackCaptured(byBlack);
  };

  // Calculate material advantages
  const calculateAdvantages = () => {
    const whiteScore = whiteCaptured.reduce((sum, p) => sum + (PIECE_VALS[p] || 0), 0);
    const blackScore = blackCaptured.reduce((sum, p) => sum + (PIECE_VALS[p] || 0), 0);
    return {
      whiteAdvantage: Math.max(0, whiteScore - blackScore),
      blackAdvantage: Math.max(0, blackScore - whiteScore)
    };
  };

  const { whiteAdvantage, blackAdvantage } = calculateAdvantages();

  const handleMove = (move, game) => {
    // Start clock on first move
    if (isClockPaused && moveHistory.length === 0) {
      setIsClockPaused(false);
    }

    setMoveHistory(game.history({ verbose: true }));
    updateCapturedPieces(game);
    setTick(t => t + 1);

    // If bot mode enabled, trigger placeholder bot response
    if (gameMode === 'bot' && game.turn() === 'b' && !game.isGameOver()) {
      setTimeout(() => {
        makeBotMove(game);
      }, 600);
    }
  };

  const makeBotMove = (game) => {
    const possibleMoves = game.moves({ verbose: true });
    if (possibleMoves.length === 0) return;
    // Choose random valid move as placeholder engine
    const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    game.move(randomMove);
    setMoveHistory(game.history({ verbose: true }));
    updateCapturedPieces(game);
    setTick(t => t + 1);

    if (game.isGameOver()) {
      handleGameOver('Game ended against Bot', game);
    }
  };

  const handleGameOver = (outcome, game) => {
    setIsClockPaused(true);
    let result = '1/2-1/2';
    if (game.isCheckmate()) {
      result = game.turn() === 'w' ? '0-1' : '1-0';
    }
    finishGame(outcome, 'Game Over', result);
  };

  const finishGame = (title, subtitle, result) => {
    setGameOverModal({ title, subtitle, result });
    // Auto-save to FastAPI backend
    saveGameToBackend({
      user_id: user?.id,
      game_type: 'offline',
      opponent_name: gameMode === 'bot' ? 'Stockfish Bot (P0)' : 'Player 2',
      result,
      pgn: chessInstance.pgn(),
      final_fen: chessInstance.fen(),
      moves_count: moveHistory.length,
      player_color: 'both',
      time_control: '10+0'
    });
  };

  const handleUndo = () => {
    if (moveHistory.length === 0 || gameOverModal) return;
    chessInstance.undo();
    if (gameMode === 'bot' && moveHistory.length >= 2) {
      chessInstance.undo(); // Undo bot move too
    }
    setMoveHistory(chessInstance.history({ verbose: true }));
    updateCapturedPieces(chessInstance);
    setTick(t => t + 1);
  };

  const handleResign = () => {
    if (gameOverModal) return;
    const currentTurn = chessInstance.turn();
    const winner = currentTurn === 'w' ? 'Black' : 'White';
    const result = currentTurn === 'w' ? '0-1' : '1-0';
    finishGame(`${winner} wins by resignation`, `${currentTurn === 'w' ? 'White' : 'Black'} resigned`, result);
  };

  const handleDraw = () => {
    if (gameOverModal) return;
    finishGame('Game drawn by agreement', 'Draw offered and accepted', '1/2-1/2');
  };

  const handleResetMatch = () => {
    const newGame = new Chess();
    setChessInstance(newGame);
    setMoveHistory([]);
    setWhiteCaptured([]);
    setBlackCaptured([]);
    setGameOverModal(null);
    setWhiteSeconds(600);
    setBlackSeconds(600);
    setIsClockPaused(true);
    setTick(t => t + 1);
  };

  // Group move history into pairs (e.g. 1. e4 e5)
  const pairedMoves = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    pairedMoves.push({
      number: Math.floor(i / 2) + 1,
      white: moveHistory[i]?.san || '',
      black: moveHistory[i + 1]?.san || ''
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      
      {/* Top Header / Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            title="Back to Home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Offline Match <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Standard</span>
            </h2>
            <p className="text-xs text-slate-400">Play locally on this device with timers and move log</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-dark-900 rounded-2xl border border-white/[0.08]">
          <button
            onClick={() => { setGameMode('human'); handleResetMatch(); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              gameMode === 'human'
                ? 'bg-emerald-600 text-white shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Human vs Human
          </button>
          <button
            onClick={() => { setGameMode('bot'); handleResetMatch(); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              gameMode === 'bot'
                ? 'bg-emerald-600 text-white shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            Human vs Bot
          </button>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center: Board & Clocks (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col items-center space-y-4">
          
          {/* Top Player Tray (Opponent: Black when normal, White when flipped) */}
          <div className="w-full max-w-[560px] flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center font-bold text-sm text-slate-300">
                {isFlipped ? 'W' : 'B'}
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {isFlipped ? 'Player 1 (White)' : (gameMode === 'bot' ? 'Stockfish Engine (Bot)' : 'Player 2 (Black)')}
                </div>
                <div className="text-[10px] text-slate-400">Rating 1200</div>
              </div>
            </div>

            {/* Captured Pieces tray */}
            <CapturedPieces 
              capturedPieces={isFlipped ? blackCaptured : whiteCaptured}
              color={isFlipped ? 'w' : 'b'}
              advantage={isFlipped ? blackAdvantage : whiteAdvantage}
            />
          </div>

          {/* Chess Clocks */}
          <div className="w-full max-w-[560px]">
            <ChessClock
              whiteTime={whiteSeconds}
              blackTime={blackSeconds}
              activeTurn={chessInstance.turn()}
              isPaused={isClockPaused}
              onTogglePause={() => setIsClockPaused(!isClockPaused)}
              onResetClock={() => { setWhiteSeconds(600); setBlackSeconds(600); }}
            />
          </div>

          {/* The Board */}
          <div className="w-full">
            <Board
              game={chessInstance}
              onMove={handleMove}
              onGameOver={handleGameOver}
              isFlipped={isFlipped}
              boardTheme={boardTheme}
              pieceStyle={pieceStyle}
              soundEnabled={soundEnabled}
              animationEnabled={animationEnabled}
              showCoordinates={showCoordinates}
              disabled={Boolean(gameOverModal)}
            />
          </div>

          {/* Bottom Player Tray (Player: White when normal, Black when flipped) */}
          <div className="w-full max-w-[560px] flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center font-bold text-sm text-gold-400">
                {isFlipped ? 'B' : 'W'}
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {isFlipped ? 'Player 2 (Black)' : `${user?.username || 'Player 1'} (White)`}
                </div>
                <div className="text-[10px] text-slate-400">{user?.elo_rating || 1200} ELO</div>
              </div>
            </div>

            {/* Captured Pieces tray */}
            <CapturedPieces 
              capturedPieces={isFlipped ? whiteCaptured : blackCaptured}
              color={isFlipped ? 'b' : 'w'}
              advantage={isFlipped ? whiteAdvantage : blackAdvantage}
            />
          </div>

          {/* Board Action Toolbar */}
          <div className="flex items-center gap-2 w-full max-w-[560px] justify-center pt-2">
            <button
              onClick={handleUndo}
              disabled={moveHistory.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-dark-800 disabled:opacity-40 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Undo
            </button>

            <button
              onClick={toggleFlip}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-dark-800 transition-all"
            >
              <FlipVertical className="w-3.5 h-3.5" />
              Flip
            </button>

            <button
              onClick={handleDraw}
              disabled={Boolean(gameOverModal) || moveHistory.length < 2}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-dark-800 disabled:opacity-40 transition-all"
            >
              <Handshake className="w-3.5 h-3.5" />
              Draw
            </button>

            <button
              onClick={handleResign}
              disabled={Boolean(gameOverModal) || moveHistory.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-xs font-semibold text-red-400 hover:bg-red-500/10 disabled:opacity-40 transition-all"
            >
              <Flag className="w-3.5 h-3.5" />
              Resign
            </button>
          </div>

        </div>

        {/* Right: Move History & Game Details (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          <GlassCard className="p-5 flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Move Log
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {moveHistory.length} moves
              </span>
            </div>

            {/* Move history table */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1 text-xs">
              {pairedMoves.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-4">
                  <span className="text-3xl mb-2">⚔️</span>
                  <span>Make your first move to begin logging notation</span>
                </div>
              ) : (
                <table className="w-full text-left font-mono">
                  <tbody>
                    {pairedMoves.map((pair) => (
                      <tr 
                        key={pair.number}
                        className="hover:bg-white/[0.04] rounded-lg transition-colors border-b border-white/[0.02]"
                      >
                        <td className="py-1.5 px-2 text-slate-500 w-12">{pair.number}.</td>
                        <td className="py-1.5 px-2 font-bold text-slate-200 w-24">{pair.white}</td>
                        <td className="py-1.5 px-2 font-bold text-slate-400">{pair.black}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* FEN & Match status summary */}
            <div className="pt-3 border-t border-white/[0.08] mt-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Active Turn:</span>
                <span className="font-bold text-white uppercase">
                  {chessInstance.turn() === 'w' ? 'White' : 'Black'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Status:</span>
                <span className={`font-bold ${chessInstance.inCheck() ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                  {chessInstance.inCheck() ? 'CHECK!' : 'Normal play'}
                </span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

      {/* Game Over Overlay Modal */}
      {gameOverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-dark-900 border border-gold-500/40 rounded-3xl p-8 max-w-md w-full text-center shadow-glow-gold">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/20 text-gold-400 mx-auto flex items-center justify-center mb-4">
              <Award className="w-9 h-9" />
            </div>

            <h2 className="text-2xl font-black text-white mb-1">{gameOverModal.title}</h2>
            <p className="text-xs text-slate-300 mb-6">{gameOverModal.subtitle}</p>

            <div className="p-4 rounded-2xl bg-dark-800/80 border border-white/10 mb-6 flex justify-around">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Result</div>
                <div className="text-lg font-mono font-bold text-emerald-400">{gameOverModal.result}</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Moves</div>
                <div className="text-lg font-mono font-bold text-white">{moveHistory.length}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleResetMatch}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-glow-emerald transition-all"
              >
                Play Again
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
