import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { ChessPiece } from '../../utils/chessPieces';
import { PromotionModal } from './PromotionModal';
import { soundEngine } from '../../utils/sound';
import { useSettings } from '../../context/SettingsContext';
import confetti from 'canvas-confetti';

export const Board = ({
  game,
  onMove,
  onGameOver,
  isFlipped = false,
  boardTheme = 'emerald',
  pieceStyle = 'neo',
  soundEnabled = true,
  animationEnabled = true,
  showCoordinates = true,
  disabled = false
}) => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [draggedSquare, setDraggedSquare] = useState(null);

  // Files & ranks
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = isFlipped ? [...files].reverse() : files;
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;

  // Find King square in check
  const kingInCheckSquare = useMemo(() => {
    if (!game.inCheck()) return null;
    const turn = game.turn();
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          return `${files[c]}${8 - r}`;
        }
      }
    }
    return null;
  }, [game]);

  // Compute legal moves when a square is clicked or dragged
  const getMovesForSquare = useCallback((sq) => {
    try {
      const moves = game.moves({ square: sq, verbose: true });
      return moves;
    } catch (e) {
      return [];
    }
  }, [game]);

  const handleSelectSquare = (square) => {
    if (disabled || game.isGameOver()) return;

    const piece = game.get(square);

    // If a square is already selected, try to move to target square
    if (selectedSquare) {
      if (selectedSquare === square) {
        // Deselect
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      const moveAttempt = legalMoves.find((m) => m.to === square);
      if (moveAttempt) {
        // Check for pawn promotion
        if (
          moveAttempt.piece === 'p' &&
          ((moveAttempt.color === 'w' && square.endsWith('8')) ||
            (moveAttempt.color === 'b' && square.endsWith('1')))
        ) {
          setPendingPromotion({ from: selectedSquare, to: square, color: moveAttempt.color });
          return;
        }

        executeMove({ from: selectedSquare, to: square });
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
    }

    // Otherwise select the piece if it belongs to current player turn
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = getMovesForSquare(square);
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const executeMove = ({ from, to, promotion = 'q' }) => {
    try {
      const isCapture = Boolean(game.get(to)) || game.moves({ square: from, verbose: true }).find(m => m.to === to && m.flags.includes('e'));
      
      const moveResult = game.move({ from, to, promotion });
      if (!moveResult) return;

      setLastMove({ from, to });

      // Audio feedback
      if (game.isCheckmate()) {
        soundEngine.playGameEnd(soundEnabled);
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      } else if (game.inCheck()) {
        soundEngine.playCheck(soundEnabled);
      } else if (isCapture) {
        soundEngine.playCapture(soundEnabled);
      } else {
        soundEngine.playMove(soundEnabled);
      }

      if (onMove) {
        onMove(moveResult, game);
      }

      if (game.isGameOver() && onGameOver) {
        let outcome = 'Draw';
        if (game.isCheckmate()) {
          outcome = game.turn() === 'w' ? 'Black wins by Checkmate' : 'White wins by Checkmate';
        } else if (game.isStalemate()) {
          outcome = 'Draw by Stalemate';
        } else if (game.isThreefoldRepetition()) {
          outcome = 'Draw by Threefold Repetition';
        } else if (game.isInsufficientMaterial()) {
          outcome = 'Draw by Insufficient Material';
        }
        onGameOver(outcome, game);
      }
    } catch (err) {
      console.error('Invalid move execution:', err);
    }
  };

  const handlePromotionSelect = (promoPiece) => {
    if (!pendingPromotion) return;
    executeMove({
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion: promoPiece
    });
    setPendingPromotion(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  // Drag and Drop handlers
  const handleDragStart = (e, square) => {
    if (disabled || game.isGameOver()) return;
    const piece = game.get(square);
    if (!piece || piece.color !== game.turn()) {
      e.preventDefault();
      return;
    }
    setDraggedSquare(square);
    setSelectedSquare(square);
    setLegalMoves(getMovesForSquare(square));
    e.dataTransfer.setData('text/plain', square);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSquare) => {
    e.preventDefault();
    const fromSquare = draggedSquare || e.dataTransfer.getData('text/plain');
    if (!fromSquare || fromSquare === targetSquare) {
      setDraggedSquare(null);
      return;
    }

    const moveAttempt = legalMoves.find((m) => m.to === targetSquare);
    if (moveAttempt) {
      if (
        moveAttempt.piece === 'p' &&
        ((moveAttempt.color === 'w' && targetSquare.endsWith('8')) ||
          (moveAttempt.color === 'b' && targetSquare.endsWith('1')))
      ) {
        setPendingPromotion({ from: fromSquare, to: targetSquare, color: moveAttempt.color });
      } else {
        executeMove({ from: fromSquare, to: targetSquare });
      }
    }

    setDraggedSquare(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  return (
    <div className={`relative select-none theme-${boardTheme}`}>
      {/* Promotion Modal */}
      <PromotionModal
        isOpen={Boolean(pendingPromotion)}
        color={pendingPromotion?.color || 'w'}
        onSelectPiece={handlePromotionSelect}
      />

      {/* Chessboard Grid */}
      <div className="aspect-square w-full max-w-[560px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-dark-800/90 relative">
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {displayRanks.map((rank, rIdx) => {
            return displayFiles.map((file, fIdx) => {
              const square = `${file}${rank}`;
              const isLight = (fIdx + rIdx) % 2 === 0;
              const piece = game.get(square);
              
              const isSelected = selectedSquare === square;
              const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
              const isKingInCheck = kingInCheckSquare === square;

              const legalMoveOption = legalMoves.find((m) => m.to === square);
              const isCaptureMove = legalMoveOption && (Boolean(piece) || legalMoveOption.flags.includes('e'));

              return (
                <div
                  key={square}
                  onClick={() => handleSelectSquare(square)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, square)}
                  className={`
                    relative flex items-center justify-center cursor-pointer
                    ${isLight ? 'sq-light' : 'sq-dark'}
                    ${isSelected ? 'square-selected' : ''}
                    ${isLastMoveSquare && !isSelected ? 'square-last-move' : ''}
                    ${isKingInCheck ? 'square-check' : ''}
                    ${animationEnabled ? 'transition-colors duration-150' : ''}
                  `}
                >
                  {/* File & Rank Coordinate Markers */}
                  {showCoordinates && (
                    <>
                      {fIdx === 0 && (
                        <span className={`absolute top-1 left-1.5 text-[10px] font-bold pointer-events-none ${isLight ? 'text-dark-800/60' : 'text-slate-200/60'}`}>
                          {rank}
                        </span>
                      )}
                      {rIdx === 7 && (
                        <span className={`absolute bottom-0.5 right-1.5 text-[10px] font-bold pointer-events-none ${isLight ? 'text-dark-800/60' : 'text-slate-200/60'}`}>
                          {file}
                        </span>
                      )}
                    </>
                  )}

                  {/* Piece Display with Drag support */}
                  {piece && (
                    <div
                      draggable={!disabled && piece.color === game.turn()}
                      onDragStart={(e) => handleDragStart(e, square)}
                      className={`
                        w-full h-full p-1 sm:p-1.5 flex items-center justify-center z-10
                        ${animationEnabled ? 'transition-transform duration-150 hover:scale-105 active:scale-95' : ''}
                        ${piece.color === game.turn() ? 'cursor-grab active:cursor-grabbing' : ''}
                      `}
                    >
                      <ChessPiece
                        type={piece.type}
                        color={piece.color}
                        style={pieceStyle}
                        className="w-full h-full drop-shadow-md"
                      />
                    </div>
                  )}

                  {/* Legal Move Indicators */}
                  {legalMoveOption && !isCaptureMove && (
                    <div className="absolute z-20 w-3.5 h-3.5 rounded-full bg-emerald-500/80 shadow-glow-emerald pointer-events-none animate-scale-in" />
                  )}

                  {/* Legal Capture Ring Indicator */}
                  {legalMoveOption && isCaptureMove && (
                    <div className="absolute z-20 inset-1 rounded-xl border-4 border-emerald-400/80 pointer-events-none animate-pulse" />
                  )}
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};
