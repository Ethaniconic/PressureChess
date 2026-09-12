import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chess } from 'chess.js';
import { Board } from '../components/ChessBoard/Board';
import { ChessClock } from '../components/ChessClock';
import { CapturedPieces } from '../components/ChessBoard/CapturedPieces';
import { colors } from '../theme/colors';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { saveGameToBackend } from '../services/api';
import { 
  RotateCcw, 
  FlipVertical, 
  Flag, 
  Handshake, 
  ChevronLeft,
  Users,
  Bot
} from 'lucide-react-native';

const PIECE_VALS = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

export const OfflineGameScreen = ({ navigation }) => {
  const [chessInstance, setChessInstance] = useState(() => new Chess());
  const [, setTick] = useState(0);
  const [gameMode, setGameMode] = useState('human');
  const [moveHistory, setMoveHistory] = useState([]);
  const [whiteCaptured, setWhiteCaptured] = useState([]);
  const [blackCaptured, setBlackCaptured] = useState([]);
  const [gameOver, setGameOver] = useState(null);

  // Clocks (10 minutes)
  const [whiteSeconds, setWhiteSeconds] = useState(600);
  const [blackSeconds, setBlackSeconds] = useState(600);
  const [isClockPaused, setIsClockPaused] = useState(true);

  const { boardTheme, showCoordinates, isFlipped, toggleFlip } = useSettings();
  const { user } = useAuth();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isClockPaused && !gameOver) {
      timerRef.current = setInterval(() => {
        const turn = chessInstance.turn();
        if (turn === 'w') {
          setWhiteSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleGameOver('Black wins on time!', chessInstance);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setBlackSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleGameOver('White wins on time!', chessInstance);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isClockPaused, gameOver, chessInstance]);

  const updateCapturedPieces = (game) => {
    const fullSet = { p: 8, n: 2, b: 2, r: 2, q: 1 };
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

    const byWhite = [];
    const byBlack = [];

    Object.keys(fullSet).forEach((type) => {
      const max = fullSet[type];
      const blackRem = currentCounts['b'][type] || 0;
      const whiteRem = currentCounts['w'][type] || 0;
      for (let i = 0; i < max - blackRem; i++) byWhite.push(type);
      for (let i = 0; i < max - whiteRem; i++) byBlack.push(type);
    });

    setWhiteCaptured(byWhite);
    setBlackCaptured(byBlack);
  };

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
    if (isClockPaused && moveHistory.length === 0) {
      setIsClockPaused(false);
    }

    setMoveHistory(game.history({ verbose: true }));
    updateCapturedPieces(game);
    setTick(t => t + 1);

    if (gameMode === 'bot' && game.turn() === 'b' && !game.isGameOver()) {
      setTimeout(() => {
        const moves = game.moves({ verbose: true });
        if (moves.length > 0) {
          const randomMove = moves[Math.floor(Math.random() * moves.length)];
          game.move(randomMove);
          setMoveHistory(game.history({ verbose: true }));
          updateCapturedPieces(game);
          setTick(t => t + 1);
          if (game.isGameOver()) {
            handleGameOver('Game ended vs Bot', game);
          }
        }
      }, 500);
    }
  };

  const handleGameOver = (outcome, game) => {
    setIsClockPaused(true);
    let result = '1/2-1/2';
    if (game.isCheckmate()) {
      result = game.turn() === 'w' ? '0-1' : '1-0';
    }
    setGameOver({ title: outcome, result });

    saveGameToBackend({
      user_id: user?.id,
      game_type: 'offline',
      opponent_name: gameMode === 'bot' ? 'Stockfish Bot' : 'Player 2',
      result,
      pgn: game.pgn(),
      final_fen: game.fen(),
      moves_count: game.history().length,
      player_color: 'both',
      time_control: '10+0'
    });

    Alert.alert('Match Finished', `${outcome}\nResult: ${result}`);
  };

  const handleUndo = () => {
    if (moveHistory.length === 0 || gameOver) return;
    chessInstance.undo();
    if (gameMode === 'bot' && moveHistory.length >= 2) {
      chessInstance.undo();
    }
    setMoveHistory(chessInstance.history({ verbose: true }));
    updateCapturedPieces(chessInstance);
    setTick(t => t + 1);
  };

  const handleResign = () => {
    if (gameOver) return;
    Alert.alert('Resign Match', 'Are you sure you want to resign?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Resign',
        style: 'destructive',
        onPress: () => {
          const winner = chessInstance.turn() === 'w' ? 'Black' : 'White';
          handleGameOver(`${winner} wins by resignation`, chessInstance);
        }
      }
    ]);
  };

  const handleDraw = () => {
    if (gameOver) return;
    Alert.alert('Offer Draw', 'Agree to a draw?', [
      { text: 'Decline', style: 'cancel' },
      {
        text: 'Agree Draw',
        onPress: () => {
          handleGameOver('Match drawn by mutual agreement', chessInstance);
        }
      }
    ]);
  };

  const handleReset = () => {
    const fresh = new Chess();
    setChessInstance(fresh);
    setMoveHistory([]);
    setWhiteCaptured([]);
    setBlackCaptured([]);
    setGameOver(null);
    setWhiteSeconds(600);
    setBlackSeconds(600);
    setIsClockPaused(true);
    setTick(t => t + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Offline Chess Arena</Text>

        {/* Mode switcher */}
        <View style={styles.modeRow}>
          <TouchableOpacity 
            style={[styles.modeBtn, gameMode === 'human' && styles.modeBtnActive]}
            onPress={() => { setGameMode('human'); handleReset(); }}
          >
            <Users size={14} color={gameMode === 'human' ? '#000' : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeBtn, gameMode === 'bot' && styles.modeBtnActive]}
            onPress={() => { setGameMode('bot'); handleReset(); }}
          >
            <Bot size={14} color={gameMode === 'bot' ? '#000' : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Top Opponent Tray */}
        <View style={styles.playerTray}>
          <View style={styles.playerInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{isFlipped ? 'W' : 'B'}</Text>
            </View>
            <Text style={styles.playerName}>
              {isFlipped ? 'White' : (gameMode === 'bot' ? 'Bot' : 'Black')}
            </Text>
          </View>
          <CapturedPieces
            capturedPieces={isFlipped ? blackCaptured : whiteCaptured}
            color={isFlipped ? 'w' : 'b'}
            advantage={isFlipped ? blackAdvantage : whiteAdvantage}
          />
        </View>

        {/* Dual Clocks */}
        <ChessClock
          whiteTime={whiteSeconds}
          blackTime={blackSeconds}
          activeTurn={chessInstance.turn()}
          isPaused={isClockPaused}
          onTogglePause={() => setIsClockPaused(!isClockPaused)}
          onResetClock={() => { setWhiteSeconds(600); setBlackSeconds(600); }}
        />

        {/* Board */}
        <Board
          game={chessInstance}
          onMove={handleMove}
          onGameOver={handleGameOver}
          isFlipped={isFlipped}
          boardTheme={boardTheme}
          showCoordinates={showCoordinates}
          disabled={Boolean(gameOver)}
        />

        {/* Bottom Player Tray */}
        <View style={styles.playerTray}>
          <View style={styles.playerInfo}>
            <View style={[styles.avatar, { borderColor: colors.gold }]}>
              <Text style={[styles.avatarText, { color: colors.gold }]}>{isFlipped ? 'B' : 'W'}</Text>
            </View>
            <Text style={styles.playerName}>
              {isFlipped ? 'Black' : `${user?.username || 'You'}`}
            </Text>
          </View>
          <CapturedPieces
            capturedPieces={isFlipped ? whiteCaptured : blackCaptured}
            color={isFlipped ? 'b' : 'w'}
            advantage={isFlipped ? whiteAdvantage : blackAdvantage}
          />
        </View>

        {/* Control Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolBtn} onPress={handleUndo} disabled={moveHistory.length === 0}>
            <RotateCcw size={16} color={colors.text} />
            <Text style={styles.toolText}>Undo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn} onPress={toggleFlip}>
            <FlipVertical size={16} color={colors.text} />
            <Text style={styles.toolText}>Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn} onPress={handleDraw} disabled={Boolean(gameOver)}>
            <Handshake size={16} color={colors.gold} />
            <Text style={[styles.toolText, { color: colors.gold }]}>Draw</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn} onPress={handleResign} disabled={Boolean(gameOver)}>
            <Flag size={16} color={colors.danger} />
            <Text style={[styles.toolText, { color: colors.danger }]}>Resign</Text>
          </TouchableOpacity>
        </View>

        {/* Move log */}
        <View style={styles.logCard}>
          <Text style={styles.logTitle}>Notation Log ({moveHistory.length} moves)</Text>
          <Text style={styles.movesDisplay}>
            {moveHistory.map((m, i) => `${i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : ''}${m.san} `).join('') || 'Game in starting position.'}
          </Text>
        </View>

      </ScrollView>
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
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  modeRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 2,
  },
  modeBtn: {
    padding: 6,
    borderRadius: 10,
  },
  modeBtnActive: {
    backgroundColor: colors.emerald,
  },
  content: {
    padding: 12,
    alignItems: 'center',
  },
  playerTray: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginVertical: 4,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text,
  },
  playerName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  toolbar: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  toolText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  logCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginTop: 8,
  },
  logTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: 4,
  },
  movesDisplay: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: colors.text,
    lineHeight: 18,
  }
});
