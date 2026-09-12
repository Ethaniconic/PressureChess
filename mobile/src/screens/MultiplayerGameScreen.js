import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chess } from 'chess.js';
import { Board } from '../components/ChessBoard/Board';
import { CapturedPieces } from '../components/ChessBoard/CapturedPieces';
import { useMultiplayer } from '../context/MultiplayerContext';
import { useAnalysis } from '../context/AnalysisContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { COUNTRIES } from '../data/multiplayerData';
import { colors } from '../theme/colors';
import { 
  ChevronLeft, 
  Clock, 
  Flag, 
  Handshake, 
  RotateCcw, 
  Bot, 
  Trophy, 
  AlertTriangle,
  Check,
  X
} from 'lucide-react-native';

const formatClock = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const MultiplayerGameScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { boardTheme, showCoordinates } = useSettings();
  const { analyzePgn } = useAnalysis();

  const {
    selectedMode,
    selectedTimeControl,
    matchmakingState,
    cancelMatchmaking,
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

  const [showResignConfirm, setShowResignConfirm] = useState(false);

  const chessInstance = useMemo(() => {
    try {
      return new Chess(fen);
    } catch (e) {
      return new Chess();
    }
  }, [fen]);

  const oppCountry = COUNTRIES[opponent?.country] || COUNTRIES['US'];
  const userCountryData = COUNTRIES[userCountry] || COUNTRIES['US'];

  const isPlayerTurn = (currentTurn === 'white' && playerColor === 'white') ||
                       (currentTurn === 'black' && playerColor === 'black');

  const myTime = playerColor === 'white' ? whiteTime : blackTime;
  const oppTime = playerColor === 'white' ? blackTime : whiteTime;

  const handleMove = (moveObj) => {
    makeMove(moveObj);
  };

  const handleResign = () => {
    setShowResignConfirm(false);
    resign();
  };

  const handleReviewWithCoach = () => {
    const pgn = generatePgn();
    if (pgn && analyzePgn) {
      analyzePgn(pgn);
      navigation.navigate('GameReview');
    }
  };

  // 1. MATCHMAKING SEARCHING VIEW
  if (matchmakingState === 'searching') {
    return (
      <SafeAreaView style={styles.searchingContainer}>
        <View style={styles.searchingCard}>
          <ActivityIndicator size="large" color="#00E5FF" style={{ marginBottom: 20 }} />
          <Text style={styles.searchingTitle}>FINDING OPPONENT...</Text>
          <Text style={styles.searchingMode}>
            {selectedMode.toUpperCase()} • {selectedTimeControl}
          </Text>
          <Text style={styles.searchingDesc}>
            Searching matchmaking pool near {userRatings[selectedMode] || 1340} Elo...
          </Text>

          <TouchableOpacity
            style={styles.cancelSearchBtn}
            onPress={() => {
              cancelMatchmaking();
              navigation.goBack();
            }}
          >
            <Text style={styles.cancelSearchBtnText}>Cancel Matchmaking</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.gameHeader}>
        <TouchableOpacity 
          style={styles.iconBtn}
          onPress={() => {
            if (!gameResult) {
              Alert.alert('Leave Match?', 'Leaving will forfeit the match.', [
                { text: 'Stay', style: 'cancel' },
                { text: 'Leave & Resign', style: 'destructive', onPress: () => { resign(); navigation.goBack(); } }
              ]);
            } else {
              navigation.goBack();
            }
          }}
        >
          <ChevronLeft size={22} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerMiddle}>
          <Text style={styles.gameModeText}>
            RANKED {selectedMode.toUpperCase()} ({selectedTimeControl})
          </Text>
          <View style={[styles.turnBadge, isPlayerTurn ? styles.turnBadgeMyTurn : styles.turnBadgeOppTurn]}>
            <Text style={[styles.turnBadgeText, isPlayerTurn ? { color: '#00E5FF' } : { color: '#94A3B8' }]}>
              {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT THINKING'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRightSpace} />
      </View>

      <ScrollView contentContainerStyle={styles.gameLayout} bounces={false}>
        
        {/* OPPONENT BANNER */}
        <View style={styles.playerBar}>
          <View style={styles.playerInfoLeft}>
            <View style={styles.playerAvatar}>
              <Text style={{ fontSize: 18 }}>{opponent?.avatar || '♟️'}</Text>
              <Text style={styles.flagBadgeSmall}>{oppCountry.flag}</Text>
            </View>
            <View>
              <Text style={styles.playerNameText}>{opponent?.name || 'Opponent'}</Text>
              <Text style={styles.playerRatingText}>
                {opponent?.rating || 1350} • Playing {playerColor === 'white' ? 'Black' : 'White'}
              </Text>
            </View>
          </View>

          {/* Opponent Digital Clock */}
          <View style={[
            styles.digitalClock,
            currentTurn !== playerColor && styles.digitalClockActive,
            oppTime <= 30 && styles.digitalClockLowTime
          ]}>
            <Clock size={14} color={oppTime <= 30 ? '#EF4444' : (currentTurn !== playerColor ? '#00E5FF' : '#94A3B8')} />
            <Text style={[
              styles.clockText,
              oppTime <= 30 && { color: '#EF4444' },
              currentTurn !== playerColor && { color: '#00E5FF' }
            ]}>
              {formatClock(oppTime)}
            </Text>
          </View>
        </View>

        {/* OPPONENT CAPTURED PIECES */}
        <View style={styles.capturedRow}>
          <CapturedPieces 
            pieces={playerColor === 'white' ? capturedWhite : capturedBlack} 
            color={playerColor === 'white' ? 'w' : 'b'} 
          />
          {materialDifference < 0 && (
            <Text style={styles.matDeltaText}>+{Math.abs(materialDifference)}</Text>
          )}
        </View>

        {/* CHESS BOARD */}
        <View style={styles.boardContainer}>
          <Board
            game={chessInstance}
            onMove={handleMove}
            isFlipped={playerColor === 'black'}
            boardTheme={boardTheme}
            showCoordinates={showCoordinates}
            disabled={Boolean(gameResult) || !isPlayerTurn}
          />
        </View>

        {/* PLAYER CAPTURED PIECES */}
        <View style={styles.capturedRow}>
          <CapturedPieces 
            pieces={playerColor === 'white' ? capturedBlack : capturedWhite} 
            color={playerColor === 'white' ? 'b' : 'w'} 
          />
          {materialDifference > 0 && (
            <Text style={styles.matDeltaText}>+{materialDifference}</Text>
          )}
        </View>

        {/* PLAYER BANNER */}
        <View style={styles.playerBar}>
          <View style={styles.playerInfoLeft}>
            <View style={styles.playerAvatar}>
              <Text style={{ fontSize: 18 }}>♟️</Text>
              <Text style={styles.flagBadgeSmall}>{userCountryData.flag}</Text>
            </View>
            <View>
              <Text style={styles.playerNameText}>{user?.username || 'Tactician'}</Text>
              <Text style={styles.playerRatingText}>
                {userRatings[selectedMode] || 1340} • Playing {playerColor.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Player Digital Clock */}
          <View style={[
            styles.digitalClock,
            currentTurn === playerColor && styles.digitalClockActive,
            myTime <= 30 && styles.digitalClockLowTime
          ]}>
            <Clock size={14} color={myTime <= 30 ? '#EF4444' : (currentTurn === playerColor ? '#00E5FF' : '#94A3B8')} />
            <Text style={[
              styles.clockText,
              myTime <= 30 && { color: '#EF4444' },
              currentTurn === playerColor && { color: '#00E5FF' }
            ]}>
              {formatClock(myTime)}
            </Text>
          </View>
        </View>

        {/* DRAW OFFER BANNER (If pending) */}
        {drawOfferedBy && drawOfferedBy !== playerColor && (
          <View style={styles.drawOfferBanner}>
            <Text style={styles.drawOfferText}>Opponent offers a draw.</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.acceptDrawBtn} onPress={acceptDraw}>
                <Check size={14} color="#000" />
                <Text style={styles.acceptDrawBtnText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineDrawBtn} onPress={declineDraw}>
                <X size={14} color="#FFF" />
                <Text style={styles.declineDrawBtnText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* BOTTOM ACTION BUTTONS */}
        {!gameResult && (
          <View style={styles.controlsRow}>
            <TouchableOpacity 
              style={styles.controlBtn}
              onPress={offerDraw}
            >
              <Handshake size={16} color="#94A3B8" />
              <Text style={styles.controlBtnText}>Offer Draw</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlBtn, styles.resignBtn]}
              onPress={() => setShowResignConfirm(true)}
            >
              <Flag size={16} color="#EF4444" />
              <Text style={[styles.controlBtnText, { color: '#EF4444' }]}>Resign</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* RESIGN CONFIRMATION MODAL */}
      <Modal visible={showResignConfirm} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmCard}>
            <AlertTriangle size={32} color="#EF4444" style={{ alignSelf: 'center', marginBottom: 12 }} />
            <Text style={styles.confirmTitle}>Resign Match?</Text>
            <Text style={styles.confirmDesc}>
              This will forfeit the game and decrease your {selectedMode} Elo rating.
            </Text>

            <View style={styles.confirmBtnsRow}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setShowResignConfirm(false)}
              >
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmResignBtn}
                onPress={handleResign}
              >
                <Text style={styles.confirmResignBtnText}>Yes, Resign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* GAME OVER CELEBRATION MODAL */}
      <Modal visible={Boolean(gameResult)} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.gameOverCard}>
            <View style={[
              styles.resultIconPill,
              gameResult === 'win' ? styles.winIconPill : (gameResult === 'loss' ? styles.lossIconPill : styles.drawIconPill)
            ]}>
              <Text style={{ fontSize: 32 }}>
                {gameResult === 'win' ? '🏆' : (gameResult === 'loss' ? '💔' : '🤝')}
              </Text>
            </View>

            <Text style={styles.resultTitle}>
              {gameResult === 'win' ? 'VICTORY!' : (gameResult === 'loss' ? 'DEFEAT' : 'DRAW')}
            </Text>

            <Text style={styles.resultReason}>{terminationReason || 'Game completed'}</Text>

            {/* Rating Delta Pill */}
            <View style={styles.deltaPill}>
              <Text style={styles.deltaLabel}>{selectedMode.toUpperCase()} RATING</Text>
              <Text style={[
                styles.deltaVal,
                ratingChange > 0 ? { color: '#10B981' } : (ratingChange < 0 ? { color: '#EF4444' } : { color: '#94A3B8' })
              ]}>
                {ratingChange > 0 ? `+${ratingChange}` : ratingChange} ({userRatings[selectedMode] || 1340})
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.coachReviewBtn}
                onPress={handleReviewWithCoach}
              >
                <Bot size={18} color="#000" />
                <Text style={styles.coachReviewBtnText}>Review with Coach Orion</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rematchBtn}
                onPress={rematch}
              >
                <RotateCcw size={16} color="#00E5FF" />
                <Text style={styles.rematchBtnText}>Play Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backLobbyBtn}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backLobbyBtnText}>Back to Lobby</Text>
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
    backgroundColor: '#070B14'
  },
  searchingContainer: {
    flex: 1,
    backgroundColor: '#070B14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  searchingCard: {
    width: '100%',
    padding: 28,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    alignItems: 'center'
  },
  searchingTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1
  },
  searchingMode: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4
  },
  searchingDesc: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 18
  },
  cancelSearchBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)'
  },
  cancelSearchBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: 'bold'
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)'
  },
  iconBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)'
  },
  headerMiddle: {
    alignItems: 'center'
  },
  gameModeText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  turnBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 3
  },
  turnBadgeMyTurn: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)'
  },
  turnBadgeOppTurn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  turnBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  headerRightSpace: {
    width: 32
  },
  gameLayout: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center'
  },
  playerBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 4
  },
  playerInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  playerAvatar: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flagBadgeSmall: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    fontSize: 11
  },
  playerNameText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold'
  },
  playerRatingText: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 1
  },
  digitalClock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  digitalClockActive: {
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0, 229, 255, 0.1)'
  },
  digitalClockLowTime: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.15)'
  },
  clockText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  capturedRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    minHeight: 22
  },
  matDeltaText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace'
  },
  boardContainer: {
    marginVertical: 4,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4
  },
  drawOfferBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    marginVertical: 6
  },
  drawOfferText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: 'bold'
  },
  acceptDrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#10B981'
  },
  acceptDrawBtnText: {
    color: '#000',
    fontSize: 11,
    fontWeight: 'bold'
  },
  declineDrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#EF4444'
  },
  declineDrawBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold'
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 10
  },
  controlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  resignBtn: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)'
  },
  controlBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  confirmCard: {
    width: '100%',
    maxWidth: 340,
    padding: 22,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)'
  },
  confirmTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  confirmDesc: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18
  },
  confirmBtnsRow: {
    flexDirection: 'row',
    gap: 10
  },
  cancelModalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center'
  },
  cancelModalBtnText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: 'bold'
  },
  confirmResignBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center'
  },
  confirmResignBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  gameOverCard: {
    width: '100%',
    maxWidth: 360,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    alignItems: 'center'
  },
  resultIconPill: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  winIconPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)'
  },
  lossIconPill: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)'
  },
  drawIconPill: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.5)'
  },
  resultTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1
  },
  resultReason: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center'
  },
  deltaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16
  },
  deltaLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: 'bold'
  },
  deltaVal: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  modalActions: {
    width: '100%',
    gap: 8
  },
  coachReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#00E5FF'
  },
  coachReviewBtnText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '900'
  },
  rematchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)'
  },
  rematchBtnText: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  backLobbyBtn: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  backLobbyBtnText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600'
  }
});
