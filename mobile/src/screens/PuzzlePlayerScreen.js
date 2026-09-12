import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chess } from 'chess.js';
import { Board } from '../components/ChessBoard/Board';
import { GlassCard } from '../components/GlassCard';
import { useTactics } from '../context/TacticsContext';
import { useSettings } from '../context/SettingsContext';
import { colors } from '../theme/colors';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  RotateCcw, 
  Trophy, 
  Flame, 
  Timer, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Bot,
  Eye,
  Sparkles
} from 'lucide-react-native';

export const PuzzlePlayerScreen = ({ navigation }) => {
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
    showCoordinates,
  } = useSettings();

  const [game, setGame] = useState(() => new Chess(currentPuzzle?.fen || '8/8/8/8/8/8/8/8 w - - 0 1'));
  const [moveIndex, setMoveIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [ratingResult, setRatingResult] = useState(null);
  const [wrongMoveMsg, setWrongMoveMsg] = useState(null);

  // Timer
  const getInitialSeconds = () => {
    if (selectedMode === '10s') return 10;
    if (selectedMode === '20s') return 20;
    if (selectedMode === '30s') return 30;
    if (selectedMode === 'sudden_death') return 20;
    return 60;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialSeconds);
  const [timerActive, setTimerActive] = useState(true);
  const [timeTaken, setTimeTaken] = useState(0);

  // Shake animation
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true })
    ]).start();
  };

  useEffect(() => {
    if (currentPuzzle) {
      setGame(new Chess(currentPuzzle.fen));
      setMoveIndex(0);
      setIsCompleted(false);
      setIsFailed(false);
      setShowHint(false);
      setHintsUsed(0);
      setShowResultModal(false);
      setRatingResult(null);
      setWrongMoveMsg(null);
      setTimeLeft(getInitialSeconds());
      setTimeTaken(0);
      setTimerActive(true);
    }
  }, [currentPuzzle]);

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

  const handleTimeOut = async () => {
    setTimerActive(false);
    setIsFailed(true);
    const result = await submitPuzzleSolve(currentPuzzle.id, false, timeTaken, hintsUsed);
    setRatingResult(result);
    setShowResultModal(true);
  };

  const handleMove = async (moveResult) => {
    if (!moveResult || isCompleted || isFailed) return;

    const expectedMove = currentPuzzle.expectedMoves[moveIndex];
    const moveSan = moveResult.san;
    const moveUci = `${moveResult.from}${moveResult.to}${moveResult.promotion || ''}`;

    const isCorrect = 
      moveSan === expectedMove || 
      moveUci === expectedMove ||
      moveSan.replace('+', '').replace('#', '') === expectedMove.replace('+', '').replace('#', '');

    if (isCorrect) {
      setWrongMoveMsg(null);
      const nextIdx = moveIndex + 1;

      if (nextIdx < currentPuzzle.expectedMoves.length) {
        setMoveIndex(nextIdx);

        // Opponent automatic response
        const oppResponse = currentPuzzle.opponentResponses?.[expectedMove];
        if (oppResponse) {
          setTimeout(() => {
            try {
              game.move(oppResponse);
              setGame(new Chess(game.fen()));
              setMoveIndex(nextIdx + 1);
            } catch (_) {}
          }, 400);
        }
      } else {
        // Solved
        setTimerActive(false);
        setIsCompleted(true);
        const result = await submitPuzzleSolve(currentPuzzle.id, true, timeTaken, hintsUsed);
        setRatingResult(result);
        setShowResultModal(true);

        if (selectedMode === 'sudden_death') {
          setTimeLeft(t => t + 5);
        }
      }
    } else {
      triggerShake();
      setWrongMoveMsg(`Move ${moveSan} is not the best line. Try again!`);

      setTimeout(() => {
        setGame(new Chess(currentPuzzle.fen));
        setMoveIndex(0);
      }, 700);
    }
  };

  const handleGiveUp = async () => {
    setTimerActive(false);
    setIsFailed(true);
    const result = await submitPuzzleSolve(currentPuzzle.id, false, timeTaken, hintsUsed);
    setRatingResult(result);
    setShowResultModal(true);
  };

  const handleReset = () => {
    setGame(new Chess(currentPuzzle.fen));
    setMoveIndex(0);
    setShowHint(false);
    setWrongMoveMsg(null);
  };

  if (!currentPuzzle) return null;

  const timerPct = Math.min(100, Math.max(0, (timeLeft / getInitialSeconds()) * 100));
  const isUrgent = timeLeft <= 5;
  const isWarning = timeLeft > 5 && timeLeft <= 10;

  let timerBarColor = colors.cyan;
  let timerTextColor = colors.cyan;
  if (isUrgent) {
    timerBarColor = '#EF4444';
    timerTextColor = '#EF4444';
  } else if (isWarning) {
    timerBarColor = '#F59E0B';
    timerTextColor = '#F59E0B';
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.statsBadge}>
          <Trophy size={13} color={colors.cyan} />
          <Text style={styles.statsText}>{puzzleRating} ELO</Text>
          <Text style={{ color: '#475569' }}>•</Text>
          <Flame size={13} color="#F59E0B" />
          <Text style={[styles.statsText, { color: '#F59E0B' }]}>{currentStreak}</Text>
        </View>

        <View style={[styles.timerBadge, { borderColor: timerBarColor }]}>
          <Timer size={14} color={timerTextColor} />
          <Text style={[styles.timerText, { color: timerTextColor }]}>{timeLeft}s</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.timerTrack}>
        <View style={[styles.timerFill, { width: `${timerPct}%`, backgroundColor: timerBarColor }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Puzzle Info */}
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.catLabel}>{currentPuzzle.category.toUpperCase()} • {currentPuzzle.difficulty.toUpperCase()}</Text>
            <Text style={styles.puzzleTitle}>{currentPuzzle.title}</Text>
          </View>
          <Text style={styles.targetRating}>{currentPuzzle.rating} ELO</Text>
        </View>

        {/* Wrong Move Banner */}
        {wrongMoveMsg && (
          <View style={styles.wrongBanner}>
            <AlertTriangle size={14} color="#EF4444" />
            <Text style={styles.wrongText}>{wrongMoveMsg}</Text>
          </View>
        )}

        {/* Board */}
        <Animated.View style={[styles.boardWrapper, { transform: [{ translateX: shakeAnim }] }]}>
          <Board
            game={game}
            onMove={handleMove}
            boardTheme={boardTheme}
            showCoordinates={showCoordinates}
            disabled={isCompleted || isFailed}
            isFlipped={currentPuzzle.playerColor === 'black'}
          />
        </Animated.View>

        {/* Player Turn */}
        <View style={styles.turnRow}>
          <View style={[styles.turnDot, { backgroundColor: currentPuzzle.playerColor === 'white' ? '#FFFFFF' : '#0F172A' }]} />
          <Text style={styles.turnText}>Play winning move for {currentPuzzle.playerColor === 'white' ? 'White' : 'Black'}</Text>
        </View>

        {/* Coach Orion Speech Bubble */}
        <View style={styles.coachBubble}>
          <View style={styles.coachHeader}>
            <Bot size={14} color={colors.cyan} />
            <Text style={styles.coachTitle}>Coach Orion's Radar</Text>
          </View>
          <Text style={styles.coachSpeech}>
            {showHint 
              ? `💡 Clue: ${currentPuzzle.hint}`
              : currentPuzzle.goal
            }
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={[styles.btn, showHint && styles.btnActive]}
            onPress={() => {
              if (!showHint) setHintsUsed(h => h + 1);
              setShowHint(!showHint);
            }}
          >
            <Lightbulb size={16} color={showHint ? '#F59E0B' : '#94A3B8'} />
            <Text style={[styles.btnText, showHint && { color: '#F59E0B' }]}>
              {showHint ? 'Hide Clue' : 'Clue (-4 ELO)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btn}
            onPress={handleReset}
          >
            <RotateCcw size={16} color="#94A3B8" />
            <Text style={styles.btnText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btn, styles.surrenderBtn]}
            onPress={handleGiveUp}
            disabled={isCompleted || isFailed}
          >
            <Eye size={16} color="#EF4444" />
            <Text style={[styles.btnText, { color: '#EF4444' }]}>Surrender</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Result Modal */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowResultModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            
            <View style={styles.modalIconBox}>
              <Text style={{ fontSize: 32 }}>{isCompleted ? '⚡' : '⏱️'}</Text>
            </View>

            <Text style={styles.modalTitle}>
              {isCompleted ? 'Brilliant Tactical Solve!' : (timeLeft === 0 ? 'Time Expired!' : 'Attempt Finished')}
            </Text>
            
            <Text style={styles.modalSubtitle}>
              {isCompleted ? `Executed in ${timeTaken} seconds under clock pressure.` : 'The timer ran out before the sequence was completed.'}
            </Text>

            {ratingResult && (
              <View style={styles.modalStatBox}>
                <View>
                  <Text style={styles.statBoxLabel}>Rating</Text>
                  <Text style={styles.statBoxValue}>{ratingResult.newRating} ELO</Text>
                </View>

                <View style={styles.deltaBadge}>
                  <Text style={[styles.deltaText, { color: ratingResult.ratingDelta >= 0 ? '#10B981' : '#EF4444' }]}>
                    {ratingResult.ratingDelta >= 0 ? `+${ratingResult.ratingDelta}` : ratingResult.ratingDelta} ELO
                  </Text>
                </View>
              </View>
            )}

            {/* Tactical Explanation */}
            <View style={styles.explanationBox}>
              <Text style={styles.explanationHeader}>TACTICAL BREAKDOWN</Text>
              <Text style={styles.explanationBody}>{currentPuzzle.explanation}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => {
                  setShowResultModal(false);
                  handleReset();
                }}
              >
                <Text style={styles.modalSecondaryText}>Review Position</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setShowResultModal(false);
                  nextPuzzle();
                }}
              >
                <Text style={styles.modalPrimaryText}>Next Puzzle</Text>
                <ChevronRight size={16} color="#000000" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statsText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  timerTrack: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  timerFill: {
    height: '100%',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  catLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.cyan,
    letterSpacing: 1,
  },
  puzzleTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  targetRating: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
  },
  wrongBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  wrongText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '700',
  },
  boardWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  turnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  turnDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  turnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  coachBubble: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    marginBottom: 16,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  coachTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.cyan,
  },
  coachSpeech: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 17,
  },
  controlsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  btnActive: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  surrenderBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  btnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    alignItems: 'center',
  },
  modalIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalStatBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
  },
  statBoxLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  statBoxValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  deltaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  deltaText: {
    fontSize: 13,
    fontWeight: '900',
  },
  explanationBox: {
    width: '100%',
    backgroundColor: 'rgba(0, 229, 255, 0.06)',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.15)',
    marginBottom: 16,
  },
  explanationHeader: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.cyan,
    letterSpacing: 1,
    marginBottom: 4,
  },
  explanationBody: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 17,
  },
  modalActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  modalSecondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalSecondaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
  },
  modalPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.cyan,
  },
  modalPrimaryText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
  },
});
