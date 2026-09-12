import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chess } from 'chess.js';
import { Board } from '../components/ChessBoard/Board';
import { GlassCard } from '../components/GlassCard';
import { useAcademy } from '../context/AcademyContext';
import { useSettings } from '../context/SettingsContext';
import { colors } from '../theme/colors';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  RotateCcw, 
  Target, 
  Star, 
  CheckCircle2, 
  AlertTriangle, 
  Zap,
  Bot
} from 'lucide-react-native';

export const LessonPlayerScreen = ({ navigation }) => {
  const { 
    modules, 
    selectedLesson, 
    setSelectedLesson, 
    markLessonComplete 
  } = useAcademy();

  const {
    boardTheme,
    showCoordinates,
  } = useSettings();

  // Fallback to first lesson
  const lesson = selectedLesson || modules[0]?.lessons[0];

  const [game, setGame] = useState(() => new Chess(lesson?.fen || '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1'));
  const [showHint, setShowHint] = useState(false);
  const [showCandidates, setShowCandidates] = useState(false);
  const [wrongMoveMessage, setWrongMoveMessage] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [coachSpeech, setCoachSpeech] = useState("Assess the goal. Look for the most forcing, purposeful move!");

  // Shake animation for incorrect move
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
    if (lesson) {
      setGame(new Chess(lesson.fen));
      setShowHint(false);
      setShowCandidates(false);
      setWrongMoveMessage(null);
      setIsCompleted(false);
      setEarnedStars(3);
      setHintsUsedCount(0);
      setAttempts(1);
      setCoachSpeech("Focus on the objective. You've got this!");
    }
  }, [lesson]);

  const handleLessonMove = (moveResult) => {
    if (!moveResult || isCompleted) return;

    const moveUci = `${moveResult.from}${moveResult.to}${moveResult.promotion || ''}`;
    const moveSan = moveResult.san;

    // Check if the move matches lesson expected moves
    const isTarget = lesson.expectedMoves.includes(moveUci) || 
                     lesson.expectedMoves.includes(moveSan) ||
                     lesson.expectedMoves.includes(`${moveResult.from}${moveResult.to}`);

    if (isTarget) {
      // SUCCESS!
      let stars = 3;
      if (hintsUsedCount > 1 || attempts > 2) stars = 1;
      else if (hintsUsedCount === 1 || attempts === 2) stars = 2;

      setEarnedStars(stars);
      setIsCompleted(true);
      setWrongMoveMessage(null);
      setCoachSpeech("Brilliant move! You calculated and executed the winning line perfectly.");

      markLessonComplete(lesson.id, stars, hintsUsedCount, attempts, lesson.xp);
    } else {
      // WRONG MOVE: enforce only target lesson move
      setAttempts(a => a + 1);
      triggerShake();
      setWrongMoveMessage(`That is a valid move (${moveSan}), but does not reach the lesson goal. Try again!`);
      setCoachSpeech(`Move ${moveSan} doesn't accomplish the tactical objective. Try re-evaluating!`);

      // Reset board position back to lesson start
      setTimeout(() => {
        const resetGame = new Chess(lesson.fen);
        setGame(resetGame);
      }, 700);
    }
  };

  const handleReset = () => {
    setGame(new Chess(lesson.fen));
    setWrongMoveMessage(null);
    setIsCompleted(false);
    setCoachSpeech("Position reset. Calculate carefully!");
  };

  const handleToggleHint = () => {
    if (!showHint) {
      setHintsUsedCount(h => h + 1);
      setCoachSpeech(lesson?.hint || 'Look at your available moves.');
    } else {
      setCoachSpeech("Focus on the goal!");
    }
    setShowHint(!showHint);
  };

  // Find next lesson
  const allLessons = modules.flatMap(m => m.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === lesson?.id);
  const nextLesson = allLessons[currentIndex + 1];

  const handleNextLesson = () => {
    setIsCompleted(false);
    if (nextLesson) {
      setSelectedLesson(nextLesson);
    } else {
      navigation.navigate('AcademyCourses');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.navigate('AcademyCourses')}
        >
          <ChevronLeft size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>{lesson?.title}</Text>
          <Text style={styles.headerSub}>Lesson {currentIndex + 1} of {allLessons.length}</Text>
        </View>

        <View style={styles.xpPill}>
          <Zap size={12} color={colors.cyan} />
          <Text style={styles.xpPillText}>+{lesson?.xp} XP</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Interactive Chess Board with Shake */}
        <Animated.View style={[styles.boardWrapper, { transform: [{ translateX: shakeAnim }] }]}>
          <Board
            game={game}
            onMove={handleLessonMove}
            boardTheme={boardTheme}
            showCoordinates={showCoordinates}
            disabled={isCompleted}
            candidateSquares={showCandidates ? lesson?.candidateSquares : []}
          />
        </Animated.View>

        {/* Coach Orion Speech Bubble */}
        <View style={styles.coachBubbleBox}>
          <View style={styles.coachAvatar}>
            <Bot size={16} color="#000" />
          </View>
          <Text style={styles.coachBubbleText}>
            "{coachSpeech}"
          </Text>
        </View>

        {/* Wrong move alert banner */}
        {wrongMoveMessage && (
          <View style={styles.errorBanner}>
            <AlertTriangle size={16} color="#EF4444" />
            <Text style={styles.errorText}>{wrongMoveMessage}</Text>
          </View>
        )}

        {/* Candidate Squares alert banner */}
        {showCandidates && lesson?.candidateSquares && (
          <View style={styles.candidatesBanner}>
            <Target size={16} color={colors.cyan} />
            <Text style={styles.candidatesText}>
              Target squares: {lesson.candidateSquares.join(', ')}
            </Text>
          </View>
        )}

        {/* Action Controls: Hint, Candidate, Reset */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.controlBtn, showHint && styles.controlBtnActiveGold]}
            onPress={handleToggleHint}
            activeOpacity={0.8}
          >
            <Lightbulb size={16} color={showHint ? '#000' : colors.gold} />
            <Text style={[styles.controlBtnText, showHint && styles.controlBtnTextActiveGold]}>
              {showHint ? 'Hide Hint' : 'Hint'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, showCandidates && styles.controlBtnActiveCyan]}
            onPress={() => setShowCandidates(!showCandidates)}
            activeOpacity={0.8}
          >
            <Target size={16} color={showCandidates ? '#000' : colors.cyan} />
            <Text style={[styles.controlBtnText, showCandidates && styles.controlBtnTextActiveCyan]}>
              Candidates
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlBtn}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <RotateCcw size={16} color={colors.textMuted} />
            <Text style={styles.controlBtnText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Lesson Objective & Explanation (Spacious Box Layout) */}
        <GlassCard style={styles.infoCard}>
          <View style={styles.objectiveTag}>
            <Text style={styles.objectiveTagText}>OBJECTIVE</Text>
          </View>
          <Text style={styles.goalText}>{lesson?.goal}</Text>

          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>Concept Explanation</Text>
            <Text style={styles.explanationText}>{lesson?.explanation}</Text>
          </View>

          {/* Coach's Hint (Revealed) */}
          {showHint && (
            <View style={styles.hintBox}>
              <View style={styles.hintTitleRow}>
                <Lightbulb size={14} color={colors.gold} />
                <Text style={styles.hintTitle}>Coach's Tactical Hint</Text>
              </View>
              <Text style={styles.hintText}>{lesson?.hint}</Text>
            </View>
          )}

          <View style={styles.statusRow}>
            <Text style={styles.statusSub}>Attempts: {attempts}</Text>
            <Text style={styles.statusSub}>Hints Used: {hintsUsedCount}</Text>
          </View>
        </GlassCard>

      </ScrollView>

      {/* Completion Celebration Modal */}
      <Modal
        visible={isCompleted}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.celebrationIconBox}>
              <CheckCircle2 size={40} color={colors.cyan} />
            </View>

            <Text style={styles.celebrationTitle}>Brilliant Move!</Text>
            <Text style={styles.celebrationSub}>You mastered this lesson objective.</Text>

            {/* Stars */}
            <View style={styles.modalStarsRow}>
              {[1, 2, 3].map(s => (
                <Star 
                  key={s} 
                  size={32} 
                  color={s <= earnedStars ? colors.gold : colors.surfaceLight} 
                  style={{ marginHorizontal: 4 }}
                />
              ))}
            </View>

            {/* Reward Box */}
            <View style={styles.rewardBox}>
              <View style={styles.rewardItem}>
                <Text style={styles.rewardLabel}>XP EARNED</Text>
                <Text style={styles.rewardXp}>+{lesson?.xp} XP</Text>
              </View>
              <View style={styles.rewardDivider} />
              <View style={styles.rewardItem}>
                <Text style={styles.rewardLabel}>RATING</Text>
                <Text style={styles.rewardStars}>{earnedStars} Stars</Text>
              </View>
            </View>

            {/* Modal Buttons */}
            <TouchableOpacity
              style={styles.nextLessonBtn}
              onPress={handleNextLesson}
              activeOpacity={0.8}
            >
              <Text style={styles.nextLessonBtnText}>
                {nextLesson ? 'NEXT LESSON' : 'COMPLETE MODULE'}
              </Text>
              <ChevronRight size={18} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.replayBtn}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.replayBtnText}>REPLAY</Text>
            </TouchableOpacity>

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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  xpPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.cyan,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
    gap: 14,
  },
  boardWrapper: {
    alignItems: 'center',
  },
  coachBubbleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.25)',
    padding: 12,
    borderRadius: 14,
  },
  coachAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachBubbleText: {
    fontSize: 12,
    color: colors.text,
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 17,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: 10,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 11,
    color: '#FCA5A5',
    flex: 1,
    fontWeight: '600',
  },
  candidatesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    padding: 10,
    borderRadius: 12,
  },
  candidatesText: {
    fontSize: 11,
    color: colors.cyan,
    flex: 1,
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  controlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlBtnActiveGold: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  controlBtnActiveCyan: {
    backgroundColor: colors.cyan,
    borderColor: colors.cyan,
  },
  controlBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  controlBtnTextActiveGold: {
    color: '#000',
  },
  controlBtnTextActiveCyan: {
    color: '#000',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
  },
  objectiveTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  objectiveTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.cyan,
  },
  goalText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 20,
  },
  explanationBox: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  explanationTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  hintBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: 12,
    borderRadius: 12,
  },
  hintTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  hintTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.gold,
  },
  hintText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  statusSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    padding: 24,
    alignItems: 'center',
  },
  celebrationIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  celebrationTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 4,
  },
  celebrationSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 16,
  },
  modalStarsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  rewardBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  rewardItem: {
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: 2,
  },
  rewardXp: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.cyan,
  },
  rewardStars: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.gold,
  },
  rewardDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  nextLessonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.cyan,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  nextLessonBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  replayBtn: {
    paddingVertical: 10,
  },
  replayBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
});
