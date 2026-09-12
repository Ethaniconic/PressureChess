import React, { useState, useMemo } from 'react';
import { useMultiplayer } from '../context/MultiplayerContext';
import { useAnalysis } from '../context/AnalysisContext';
import { Board } from '../components/ChessBoard/Board';
import { Chess } from 'chess.js';
import { COUNTRIES } from '../data/multiplayerData';
import { GlassCard } from '../components/GlassCard';
import {
  Swords,
  Clock,
  Flag,
  Handshake,
  RotateCcw,
  Bot,
  Trophy,
  ChevronLeft,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Shield,
  Volume2
} from 'lucide-react';

export const MultiplayerGamePage = ({ onNavigate }) => {
  const {
    activeGame,
    playerColor,
    opponent,
    fen,
    whiteTime,
    blackTime,
    currentTurn,
    moves,
    capturedWhite,
    capturedBlack,
    materialDifference,
    drawOfferedBy,
    gameResult,
    terminationReason,
    ratingChange,
    userCountry,
    userRatings,
    makeMove,
    offerDraw,
    acceptDraw,
    declineDraw,
    resign,
    rematch,
    generatePgn
  } = useMultiplayer();

  const { analyzePgn } = useAnalysis();

  const [showResignModal, setShowResignModal] = useState(false);

  const chessInstance = useMemo(() => {
    try {
      return new Chess(fen);
    } catch (e) {
      return new Chess();
    }
  }, [fen]);

  const isFlipped = playerColor === 'black';
  const isMyTurn = currentTurn === playerColor && !gameResult;

  const formatClock = (seconds) => {
    const total = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBoardMove = (moveResult) => {
    makeMove({
      from: moveResult.from,
      to: moveResult.to,
      promotion: moveResult.promotion || 'q'
    });
  };

  const handleReviewWithCoach = async () => {
    const pgn = generatePgn();
    try {
      await analyzePgn(pgn, `Multiplayer: vs ${opponent?.username || 'Opponent'}`);
      onNavigate?.('game-review');
    } catch (e) {
      onNavigate?.('game-review');
    }
  };

  const userCountryObj = COUNTRIES.find((c) => c.code === userCountry) || COUNTRIES[0];
  const oppCountryObj = COUNTRIES.find((c) => c.code === opponent?.country) || COUNTRIES[1];

  const myTime = playerColor === 'white' ? whiteTime : blackTime;
  const oppTime = playerColor === 'white' ? blackTime : whiteTime;

  const isMyTimeLow = myTime <= 15.0 && myTime > 0;
  const isOppTimeLow = oppTime <= 15.0 && oppTime > 0;

  const isWin = (gameResult === '1-0' && playerColor === 'white') || (gameResult === '0-1' && playerColor === 'black');
  const isDraw = gameResult === '1/2-1/2' || gameResult === 'draw';

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-4 animate-fadeIn">
      {/* Top Match Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-white/[0.08] backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate?.('multiplayer')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Lobby"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase text-cyan-brand tracking-wider">
              {activeGame?.mode?.toUpperCase() || 'BLITZ'} • {activeGame?.time_control || '3+0'}
            </span>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Room:</span>
              <span className="font-mono text-cyan-300">{activeGame?.room_code || 'LIVE'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Draw & Resign */}
        <div className="flex items-center gap-2">
          {!gameResult && (
            <>
              <button
                onClick={offerDraw}
                disabled={Boolean(drawOfferedBy)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  drawOfferedBy === playerColor
                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>{drawOfferedBy === playerColor ? 'Draw Offered' : 'Offer Draw'}</span>
              </button>

              <button
                onClick={() => setShowResignModal(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Resign</span>
              </button>
            </>
          )}

          {gameResult && (
            <button
              onClick={handleReviewWithCoach}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-brand to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-black text-xs flex items-center gap-1.5 shadow-glow-cyan transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Review Game</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Arena Layout */}
      <div className="flex flex-col items-center gap-3">
        {/* OPPONENT BAR (TOP) */}
        <div className="w-full max-w-[500px] flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-900 border border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-base">
              {opponent?.avatar || '⚡'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{oppCountryObj.flag}</span>
                <span className="text-xs font-black text-white">{opponent?.username || 'Opponent'}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold font-mono">
                {opponent?.rating || 1350} Elo
              </div>
            </div>
          </div>

          {/* Opponent Captured & Clock */}
          <div className="flex items-center gap-3">
            {/* Captured Pieces by Opponent */}
            <div className="hidden sm:flex items-center gap-0.5 text-xs text-slate-300 font-mono">
              {(playerColor === 'white' ? capturedWhite : capturedBlack).slice(-5).map((p, i) => (
                <span key={i} className="opacity-80 uppercase">{p}</span>
              ))}
            </div>

            {/* Digital Clock */}
            <div
              className={`px-3.5 py-1.5 rounded-xl border font-mono font-black text-lg transition-all ${
                currentTurn !== playerColor && !gameResult
                  ? isOppTimeLow
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-cyan-brand/15 border-cyan-brand text-cyan-300 shadow-glow-cyan/50'
                  : 'bg-slate-950 border-white/10 text-slate-300'
              }`}
            >
              {formatClock(oppTime)}
            </div>
          </div>
        </div>

        {/* CHESS BOARD */}
        <div className="w-full max-w-[500px] aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-slate-900">
          <Board
            game={chessInstance}
            onMove={handleBoardMove}
            disabled={!isMyTurn}
            isFlipped={isFlipped}
            boardTheme="emerald"
            pieceStyle="neo"
            soundEnabled={true}
          />

          {/* Turn Indicator Banner */}
          {!gameResult && (
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md border border-white/10 text-[10px] font-black flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isMyTurn ? 'bg-cyan-brand animate-ping' : 'bg-slate-500'}`} />
              <span className={isMyTurn ? 'text-cyan-brand' : 'text-slate-400'}>
                {isMyTurn ? 'Your Turn to Move' : "Opponent's Turn"}
              </span>
            </div>
          )}
        </div>

        {/* PLAYER BAR (BOTTOM) */}
        <div className="w-full max-w-[500px] flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-900 border border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-brand/10 border border-cyan-brand/20 flex items-center justify-center text-cyan-brand font-bold text-sm">
              ♟️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{userCountryObj.flag}</span>
                <span className="text-xs font-black text-white">You</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-mono">
                  {playerColor.toUpperCase()}
                </span>
              </div>
              <div className="text-[10px] text-cyan-brand font-bold font-mono">
                {userRatings[activeGame?.mode || 'blitz'] || 1340} Elo
              </div>
            </div>
          </div>

          {/* Player Captured & Clock */}
          <div className="flex items-center gap-3">
            {/* Material Advantage Badge */}
            {materialDifference !== 0 && (
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono">
                {(playerColor === 'white' ? materialDifference : -materialDifference) > 0
                  ? `+${playerColor === 'white' ? materialDifference : -materialDifference}`
                  : ''}
              </span>
            )}

            {/* Captured Pieces by Player */}
            <div className="hidden sm:flex items-center gap-0.5 text-xs text-slate-300 font-mono">
              {(playerColor === 'white' ? capturedBlack : capturedWhite).slice(-5).map((p, i) => (
                <span key={i} className="opacity-80 uppercase">{p}</span>
              ))}
            </div>

            {/* Digital Clock */}
            <div
              className={`px-3.5 py-1.5 rounded-xl border font-mono font-black text-lg transition-all ${
                isMyTurn
                  ? isMyTimeLow
                    ? 'bg-rose-500/25 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-cyan-brand/20 border-cyan-brand text-cyan-brand shadow-glow-cyan'
                  : 'bg-slate-950 border-white/10 text-slate-300'
              }`}
            >
              {formatClock(myTime)}
            </div>
          </div>
        </div>
      </div>

      {/* DRAW OFFER RECEIVED MODAL */}
      {drawOfferedBy && drawOfferedBy !== playerColor && !gameResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <Handshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">Draw Offer Received</h3>
            <p className="text-xs text-slate-300">
              {opponent?.username || 'Opponent'} has offered a draw. Would you like to agree?
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={declineDraw}
                className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
              >
                Decline
              </button>
              <button
                onClick={acceptDraw}
                className="py-2.5 rounded-xl bg-cyan-brand hover:bg-cyan-400 text-black font-black text-xs shadow-glow-cyan"
              >
                Accept Draw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESIGN CONFIRMATION MODAL */}
      {showResignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Flag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">Confirm Resignation</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to resign this match? It will be scored as a defeat.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowResignModal(false)}
                className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
              >
                Keep Playing
              </button>
              <button
                onClick={() => {
                  setShowResignModal(false);
                  resign();
                }}
                className="py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs"
              >
                Yes, Resign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER CELEBRATION / DEFEAT MODAL */}
      {gameResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-brand/30 rounded-3xl p-6 shadow-2xl text-center space-y-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-brand/10 rounded-full blur-3xl pointer-events-none" />

            {/* Victory / Defeat Icon */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border shadow-lg ${
                isWin
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-glow-gold'
                  : isDraw
                  ? 'bg-sky-400/20 text-sky-300 border-sky-400/40'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}
            >
              {isWin ? <Trophy className="w-8 h-8" /> : isDraw ? <Handshake className="w-8 h-8" /> : <Flag className="w-8 h-8" />}
            </div>

            {/* Headline */}
            <div>
              <h2 className="text-2xl font-black text-white">
                {isWin ? 'VICTORY!' : isDraw ? 'DRAW AGREED' : 'DEFEAT'}
              </h2>
              <p className="text-xs text-slate-300 mt-1">{terminationReason}</p>
            </div>

            {/* Rating Delta Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-around">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Outcome</div>
                <div className="text-lg font-black text-white font-mono">{gameResult}</div>
              </div>

              <div className="h-8 w-[1px] bg-white/10" />

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Rating Change</div>
                <div
                  className={`text-lg font-black font-mono ${
                    ratingChange > 0 ? 'text-emerald-400' : ratingChange < 0 ? 'text-rose-400' : 'text-slate-300'
                  }`}
                >
                  {ratingChange > 0 ? `+${ratingChange}` : ratingChange} Elo
                </div>
              </div>

              <div className="h-8 w-[1px] bg-white/10" />

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">New Rating</div>
                <div className="text-lg font-black text-cyan-brand font-mono">
                  {userRatings[activeGame?.mode || 'blitz']}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleReviewWithCoach}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-brand to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-black text-xs flex items-center justify-center gap-2 shadow-glow-cyan transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>Review Game with Coach Orion</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={rematch}
                  className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rematch</span>
                </button>
                <button
                  onClick={() => onNavigate?.('multiplayer')}
                  className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs"
                >
                  Lobby
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
