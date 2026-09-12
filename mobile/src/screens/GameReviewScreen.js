import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { Board } from '../components/ChessBoard/Board';
import { Chess } from 'chess.js';
import { useAnalysis } from '../context/AnalysisContext';
import { SAMPLE_PGN_GAMES } from '../data/openingsData';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Bot,
  Sparkles,
  BarChart2,
  Upload,
  BookOpen,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const GameReviewScreen = ({ navigation }) => {
  const {
    activeGame,
    currentMoveIndex,
    currentMove,
    currentFen,
    currentEval,
    currentEvalStr,
    isAutoPlaying,
    goToMove,
    nextMove,
    prevMove,
    firstMove,
    lastMove,
    jumpToNextMistake,
    toggleAutoPlay,
    analyzePgn,
    loadSampleGame
  } = useAnalysis();

  const [isFlipped, setIsFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pastedPgn, setPastedPgn] = useState('');
  const [modalTab, setModalTab] = useState('samples');

  const replayChess = useMemo(() => {
    try {
      return new Chess(currentFen);
    } catch (e) {
      return new Chess();
    }
  }, [currentFen]);

  // Height / Width percentage for evaluation indicator
  const evalPct = useMemo(() => {
    const val = Math.max(-10, Math.min(10, currentEval));
    return Math.round(((val + 10) / 20) * 100);
  }, [currentEval]);

  const handleImportPgn = async () => {
    if (!pastedPgn.trim()) return;
    try {
      await analyzePgn(pastedPgn.trim());
      setShowModal(false);
      setPastedPgn('');
    } catch (e) {}
  };

  const getBadgeStyle = (cls) => {
    switch (cls) {
      case 'brilliant':
        return { bg: '#00E5FF', text: '#070B14', symbol: '!!', label: 'Brilliant' };
      case 'best':
        return { bg: '#10B981', text: '#070B14', symbol: '★', label: 'Best' };
      case 'great':
        return { bg: '#0EA5E9', text: '#070B14', symbol: '!', label: 'Great' };
      case 'inaccuracy':
        return { bg: '#F59E0B', text: '#070B14', symbol: '?!', label: 'Inaccuracy' };
      case 'mistake':
        return { bg: '#F97316', text: '#FFFFFF', symbol: '?', label: 'Mistake' };
      case 'blunder':
        return { bg: '#EF4444', text: '#FFFFFF', symbol: '??', label: 'Blunder' };
      default:
        return { bg: '#334155', text: '#E2E8F0', symbol: '•', label: 'Good' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={20} color="#CBD5E1" />
          </TouchableOpacity>
          <View>
            <View style={styles.headerBadge}>
              <Bot size={11} color="#00E5FF" />
              <Text style={styles.headerBadgeText}>COACH ORION</Text>
            </View>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {activeGame?.headers?.white || 'White'} vs {activeGame?.headers?.black || 'Black'}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('ReviewDashboard')}
          >
            <BarChart2 size={18} color="#00E5FF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.importBtn} onPress={() => setShowModal(true)}>
            <Upload size={14} color="#070B14" />
            <Text style={styles.importBtnText}>Import</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Match scoreboard bar */}
        <View style={styles.scoreBar}>
          <View style={styles.playerBlock}>
            <View style={[styles.playerDot, { backgroundColor: '#FFFFFF' }]} />
            <Text style={styles.playerName} numberOfLines={1}>
              {activeGame?.headers?.white || 'White'}
            </Text>
            <Text style={styles.accBadge}>
              {activeGame?.accuracy?.white || 82}%
            </Text>
          </View>

          <View style={styles.resultPill}>
            <Text style={styles.resultText}>{activeGame?.headers?.result || '*'}</Text>
          </View>

          <View style={styles.playerBlockRight}>
            <Text style={styles.accBadgeBlack}>
              {activeGame?.accuracy?.black || 79}%
            </Text>
            <Text style={styles.playerName} numberOfLines={1}>
              {activeGame?.headers?.black || 'Black'}
            </Text>
            <View style={[styles.playerDot, { backgroundColor: '#0F172A' }]} />
          </View>
        </View>

        {/* Evaluation Bar (Horizontal gauge on mobile) */}
        <View style={styles.evalBarContainer}>
          <View style={styles.evalTrack}>
            <View style={[styles.evalFill, { width: `${evalPct}%` }]} />
            <View style={styles.evalCenterMark} />
          </View>
          <View style={styles.evalLabelRow}>
            <Text style={styles.evalLabel}>Advantage</Text>
            <Text style={styles.evalScore}>{currentEvalStr}</Text>
          </View>
        </View>

        {/* Chess Board */}
        <View style={styles.boardContainer}>
          <Board
            game={replayChess}
            disabled={true}
            isFlipped={isFlipped}
            boardTheme="emerald"
          />

          {currentMove && (
            <View style={styles.moveOverlay}>
              <Text style={styles.moveOverlayText}>
                {currentMove.moveNumber}.{currentMove.turn === 'black' ? '..' : ''} {currentMove.san}
              </Text>
              <View style={[styles.moveBadgeSmall, { backgroundColor: getBadgeStyle(currentMove.classification).bg }]}>
                <Text style={[styles.moveBadgeSymbol, { color: getBadgeStyle(currentMove.classification).text }]}>
                  {getBadgeStyle(currentMove.classification).symbol}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Scrubber & Toolbar */}
        <View style={styles.scrubberCard}>
          <View style={styles.scrubberRow}>
            <TouchableOpacity
              style={[styles.navBtn, currentMoveIndex === -1 && styles.disabledBtn]}
              onPress={firstMove}
              disabled={currentMoveIndex === -1}
            >
              <Text style={styles.navBtnText}>⏮</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navBtn, currentMoveIndex === -1 && styles.disabledBtn]}
              onPress={prevMove}
              disabled={currentMoveIndex === -1}
            >
              <ChevronLeft size={18} color="#CBD5E1" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.playBtn, isAutoPlaying && styles.playBtnActive]}
              onPress={toggleAutoPlay}
            >
              {isAutoPlaying ? (
                <Pause size={16} color="#070B14" />
              ) : (
                <Play size={16} color="#00E5FF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navBtn,
                (!activeGame?.moves || currentMoveIndex >= activeGame.moves.length - 1) && styles.disabledBtn
              ]}
              onPress={nextMove}
              disabled={!activeGame?.moves || currentMoveIndex >= activeGame.moves.length - 1}
            >
              <ChevronRight size={18} color="#CBD5E1" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navBtn,
                (!activeGame?.moves || currentMoveIndex >= activeGame.moves.length - 1) && styles.disabledBtn
              ]}
              onPress={lastMove}
              disabled={!activeGame?.moves || currentMoveIndex >= activeGame.moves.length - 1}
            >
              <Text style={styles.navBtnText}>⏭</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.jumpBtn} onPress={jumpToNextMistake}>
              <Zap size={14} color="#EF4444" />
              <Text style={styles.jumpBtnText}>Mistake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.flipBtn, isFlipped && styles.flipBtnActive]}
              onPress={() => setIsFlipped((prev) => !prev)}
            >
              <RotateCcw size={16} color={isFlipped ? '#00E5FF' : '#94A3B8'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Coach Orion Advice Card */}
        <GlassCard style={styles.coachCard}>
          <View style={styles.coachTop}>
            <View style={styles.coachAvatar}>
              <Bot size={22} color="#00E5FF" />
            </View>
            <View style={styles.coachInfo}>
              <View style={styles.coachHeaderRow}>
                <Text style={styles.coachName}>Coach Orion</Text>
                {currentMove && (
                  <View style={[styles.classPill, { backgroundColor: getBadgeStyle(currentMove.classification).bg }]}>
                    <Text style={[styles.classPillText, { color: getBadgeStyle(currentMove.classification).text }]}>
                      {getBadgeStyle(currentMove.classification).symbol} {getBadgeStyle(currentMove.classification).label}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.coachAdvice}>
                {currentMove
                  ? currentMove.coach?.why_weak || currentMove.coach?.summary
                  : 'Step through the game or tap Play to explore tactical moments.'}
              </Text>
            </View>
          </View>

          {currentMove && (
            <View style={styles.moveCompareRow}>
              <View style={styles.compareTile}>
                <Text style={styles.compareLabel}>Played</Text>
                <Text style={styles.compareMove}>{currentMove.san}</Text>
              </View>
              <View style={[styles.compareTile, styles.engineTile]}>
                <Text style={styles.compareLabelEngine}>Suggested</Text>
                <Text style={styles.compareMoveEngine}>
                  {currentMove.bestMoveSan || currentMove.san}
                </Text>
              </View>
            </View>
          )}

          {currentMove?.coach?.tactical_ideas?.length > 0 && (
            <View style={styles.tagRow}>
              {currentMove.coach.tactical_ideas.map((tag, i) => (
                <View key={i} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </GlassCard>

        {/* Opening Info Card */}
        <GlassCard style={styles.openingCard}>
          <View style={styles.openingRow}>
            <BookOpen size={16} color="#F59E0B" />
            <Text style={styles.openingTitle} numberOfLines={1}>
              {activeGame?.opening?.eco || 'A00'} • {activeGame?.opening?.name || "King's Pawn Opening"}
            </Text>
          </View>
        </GlassCard>
      </ScrollView>

      {/* Modal: Import / Sample Games */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Import Game</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalTabs}>
              <TouchableOpacity
                style={[styles.modalTabBtn, modalTab === 'samples' && styles.modalTabActive]}
                onPress={() => setModalTab('samples')}
              >
                <Text style={[styles.modalTabText, modalTab === 'samples' && styles.modalTabTextActive]}>
                  Classics
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalTabBtn, modalTab === 'paste' && styles.modalTabActive]}
                onPress={() => setModalTab('paste')}
              >
                <Text style={[styles.modalTabText, modalTab === 'paste' && styles.modalTabTextActive]}>
                  Paste PGN
                </Text>
              </TouchableOpacity>
            </View>

            {modalTab === 'samples' ? (
              <ScrollView style={styles.samplesList}>
                {SAMPLE_PGN_GAMES.map((sample) => (
                  <TouchableOpacity
                    key={sample.id}
                    style={styles.sampleItem}
                    onPress={() => {
                      loadSampleGame(sample.id);
                      setShowModal(false);
                    }}
                  >
                    <Text style={styles.sampleEco}>{sample.eco} • {sample.opening}</Text>
                    <Text style={styles.sampleTitle}>{sample.title}</Text>
                    <Text style={styles.sampleDesc} numberOfLines={2}>{sample.description}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.pasteContainer}>
                <TextInput
                  style={styles.pasteInput}
                  multiline
                  placeholder="Paste PGN here..."
                  placeholderTextColor="#64748B"
                  value={pastedPgn}
                  onChangeText={setPastedPgn}
                />
                <TouchableOpacity
                  style={styles.submitPgnBtn}
                  onPress={handleImportPgn}
                  disabled={!pastedPgn.trim()}
                >
                  <Text style={styles.submitPgnText}>Analyze Game</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  headerBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#00E5FF',
    letterSpacing: 1
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    maxWidth: 160
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00E5FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10
  },
  importBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#070B14'
  },
  content: {
    flex: 1
  },
  contentContainer: {
    padding: 12,
    gap: 12
  },
  scoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  playerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  playerBlockRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  playerDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  playerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    maxWidth: 90
  },
  accBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00E5FF'
  },
  accBadgeBlack: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8'
  },
  resultPill: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  resultText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#CBD5E1'
  },
  evalBarContainer: {
    paddingHorizontal: 4
  },
  evalTrack: {
    height: 8,
    backgroundColor: '#0F172A',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  evalFill: {
    height: '100%',
    backgroundColor: '#00E5FF'
  },
  evalCenterMark: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.4)'
  },
  evalLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3
  },
  evalLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase'
  },
  evalScore: {
    fontSize: 10,
    fontWeight: '900',
    color: '#00E5FF'
  },
  boardContainer: {
    alignItems: 'center',
    position: 'relative'
  },
  moveOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    backgroundColor: 'rgba(7, 11, 20, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  moveOverlayText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  moveBadgeSmall: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4
  },
  moveBadgeSymbol: {
    fontSize: 9,
    fontWeight: '900'
  },
  scrubberCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  scrubberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabledBtn: {
    opacity: 0.3
  },
  navBtnText: {
    color: '#CBD5E1',
    fontSize: 14
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderWidth: 1,
    borderColor: '#00E5FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playBtnActive: {
    backgroundColor: '#00E5FF'
  },
  jumpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10
  },
  jumpBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#F87171'
  },
  flipBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flipBtnActive: {
    borderColor: '#00E5FF',
    borderWidth: 1
  },
  coachCard: {
    padding: 14,
    borderColor: 'rgba(0, 229, 255, 0.25)',
    gap: 12
  },
  coachTop: {
    flexDirection: 'row',
    gap: 12
  },
  coachAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  coachInfo: {
    flex: 1
  },
  coachHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  coachName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  classPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  classPillText: {
    fontSize: 10,
    fontWeight: '900'
  },
  coachAdvice: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 17,
    marginTop: 4
  },
  moveCompareRow: {
    flexDirection: 'row',
    gap: 8
  },
  compareTile: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  engineTile: {
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderColor: 'rgba(0, 229, 255, 0.25)'
  },
  compareLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase'
  },
  compareLabelEngine: {
    fontSize: 9,
    fontWeight: '800',
    color: '#00E5FF',
    textTransform: 'uppercase'
  },
  compareMove: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2
  },
  compareMoveEngine: {
    fontSize: 14,
    fontWeight: '900',
    color: '#00E5FF',
    marginTop: 2
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  tagPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FBBF24'
  },
  openingCard: {
    padding: 12,
    borderColor: 'rgba(245, 158, 11, 0.2)'
  },
  openingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  openingTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  closeBtn: {
    fontSize: 18,
    color: '#94A3B8'
  },
  modalTabs: {
    flexDirection: 'row',
    backgroundColor: '#070B14',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12
  },
  modalTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8
  },
  modalTabActive: {
    backgroundColor: '#00E5FF'
  },
  modalTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8'
  },
  modalTabTextActive: {
    color: '#070B14'
  },
  samplesList: {
    maxHeight: 320
  },
  sampleItem: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  sampleEco: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00E5FF'
  },
  sampleTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2
  },
  sampleDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  },
  pasteContainer: {
    gap: 10
  },
  pasteInput: {
    backgroundColor: '#070B14',
    borderRadius: 12,
    padding: 12,
    color: '#FFFFFF',
    fontFamily: 'Courier',
    fontSize: 11,
    height: 140,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  submitPgnBtn: {
    backgroundColor: '#00E5FF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  submitPgnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#070B14'
  }
});
