import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ChessPiece } from '../../utils/chessPieces';
import { PromotionModal } from './PromotionModal';
import { colors } from '../../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 24, 380);
const SQUARE_SIZE = BOARD_SIZE / 8;

export const Board = ({
  game,
  onMove,
  onGameOver,
  isFlipped = false,
  boardTheme = 'emerald',
  showCoordinates = true,
  disabled = false,
  candidateSquares = []
}) => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [pendingPromotion, setPendingPromotion] = useState(null);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = isFlipped ? [...files].reverse() : files;
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;

  const currentTheme = colors.themes[boardTheme] || colors.themes.emerald;

  // Detect King in check
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

  const getMovesForSquare = useCallback((sq) => {
    try {
      return game.moves({ square: sq, verbose: true });
    } catch (e) {
      return [];
    }
  }, [game]);

  const handleSquarePress = (square) => {
    if (disabled || game.isGameOver()) return;

    const piece = game.get(square);

    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      const moveAttempt = legalMoves.find((m) => m.to === square);
      if (moveAttempt) {
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

    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      setLegalMoves(getMovesForSquare(square));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const executeMove = ({ from, to, promotion = 'q' }) => {
    try {
      const moveResult = game.move({ from, to, promotion });
      if (!moveResult) return;

      setLastMove({ from, to });

      if (onMove) {
        onMove(moveResult, game);
      }

      if (game.isGameOver() && onGameOver) {
        let outcome = 'Draw';
        if (game.isCheckmate()) {
          outcome = game.turn() === 'w' ? 'Black wins by Checkmate' : 'White wins by Checkmate';
        } else if (game.isStalemate()) {
          outcome = 'Draw by Stalemate';
        }
        onGameOver(outcome, game);
      }
    } catch (e) {}
  };

  const handlePromotionSelect = (piece) => {
    if (!pendingPromotion) return;
    executeMove({
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion: piece
    });
    setPendingPromotion(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  return (
    <View style={styles.boardWrapper}>
      <PromotionModal
        visible={Boolean(pendingPromotion)}
        color={pendingPromotion?.color || 'w'}
        onSelectPiece={handlePromotionSelect}
      />

      <View style={[styles.boardContainer, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
        {displayRanks.map((rank, rIdx) => (
          <View key={rank} style={styles.rankRow}>
            {displayFiles.map((file, fIdx) => {
              const square = `${file}${rank}`;
              const isLight = (fIdx + rIdx) % 2 === 0;
              const piece = game.get(square);

              const isSelected = selectedSquare === square;
              const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
              const isCheck = kingInCheckSquare === square;

              const legalMoveOption = legalMoves.find((m) => m.to === square);
              const isCaptureMove = legalMoveOption && (Boolean(piece) || legalMoveOption.flags.includes('e'));

              return (
                <TouchableOpacity
                  key={square}
                  activeOpacity={0.8}
                  onPress={() => handleSquarePress(square)}
                  style={[
                    styles.square,
                    {
                      width: SQUARE_SIZE,
                      height: SQUARE_SIZE,
                      backgroundColor: isLight ? currentTheme.light : currentTheme.dark,
                    },
                    isSelected && styles.squareSelected,
                    isLastMove && !isSelected && styles.squareLastMove,
                    isCheck && styles.squareCheck,
                  ]}
                >
                  {/* Coordinates */}
                  {showCoordinates && (
                    <>
                      {fIdx === 0 && (
                        <Text style={[styles.coordRank, { color: isLight ? '#475569' : '#CBD5E1' }]}>
                          {rank}
                        </Text>
                      )}
                      {rIdx === 7 && (
                        <Text style={[styles.coordFile, { color: isLight ? '#475569' : '#CBD5E1' }]}>
                          {file}
                        </Text>
                      )}
                    </>
                  )}

                  {/* Candidate Square highlight */}
                  {candidateSquares.includes(square) && !isSelected && (
                    <View style={styles.candidateHighlight} />
                  )}

                  {/* Piece */}
                  {piece && (
                    <ChessPiece
                      type={piece.type}
                      color={piece.color}
                      size={SQUARE_SIZE * 0.78}
                    />
                  )}

                  {/* Legal move dot */}
                  {legalMoveOption && !isCaptureMove && (
                    <View style={styles.legalDot} />
                  )}

                  {/* Legal capture ring */}
                  {legalMoveOption && isCaptureMove && (
                    <View style={styles.captureRing} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  boardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.surfaceLight,
  },
  rankRow: {
    flexDirection: 'row',
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  squareSelected: {
    backgroundColor: 'rgba(245, 158, 11, 0.55)',
  },
  squareLastMove: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
  },
  squareCheck: {
    backgroundColor: 'rgba(239, 68, 68, 0.7)',
  },
  coordRank: {
    position: 'absolute',
    top: 2,
    left: 3,
    fontSize: 9,
    fontWeight: '700',
  },
  coordFile: {
    position: 'absolute',
    bottom: 1,
    right: 3,
    fontSize: 9,
    fontWeight: '700',
  },
  legalDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.emerald,
    opacity: 0.85,
  },
  captureRing: {
    position: 'absolute',
    width: SQUARE_SIZE - 6,
    height: SQUARE_SIZE - 6,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.emerald,
    opacity: 0.85,
  },
  candidateHighlight: {
    position: 'absolute',
    width: SQUARE_SIZE - 6,
    height: SQUARE_SIZE - 6,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: colors.emerald,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
  }
});
