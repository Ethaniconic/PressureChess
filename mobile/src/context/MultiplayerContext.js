import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chess } from 'chess.js';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useAuth } from './AuthContext';
import { MULTIPLAYER_MODES, SIMULATED_OPPONENTS, COUNTRIES } from '../data/multiplayerData';

const MultiplayerContext = createContext({});

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000';

export const MultiplayerProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const username = user?.username || 'Tactician';

  const [selectedMode, setSelectedMode] = useState('blitz');
  const [selectedTimeControl, setSelectedTimeControl] = useState('3+0');

  // Matchmaking & Room State
  const [matchmakingState, setMatchmakingState] = useState('idle'); // idle | searching | matched | in_game
  const [activeGame, setActiveGame] = useState(null);
  const [playerColor, setPlayerColor] = useState('white');
  const [roomCode, setRoomCode] = useState(null);
  const [opponent, setOpponent] = useState(null);

  // Board & Clocks
  const [fen, setFen] = useState(new Chess().fen());
  const [whiteTime, setWhiteTime] = useState(180);
  const [blackTime, setBlackTime] = useState(180);
  const [currentTurn, setCurrentTurn] = useState('white');
  const [moves, setMoves] = useState([]);
  const [drawOfferedBy, setDrawOfferedBy] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [terminationReason, setTerminationReason] = useState(null);
  const [ratingChange, setRatingChange] = useState(0);

  // Profile & Ratings
  const [userCountry, setUserCountry] = useState('US');
  const [userRatings, setUserRatings] = useState({
    bullet: 1200,
    blitz: 1200,
    rapid: 1200,
    classical: 1200,
    overall: 1200
  });
  const [userStats, setUserStats] = useState({
    wins: 0,
    losses: 0,
    draws: 0
  });
  const [matchHistory, setMatchHistory] = useState([]);

  const clockTimerRef = useRef(null);
  const channelRef = useRef(null);
  const simulatedBotTimerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Load saved state from AsyncStorage & sync with Supabase
  useEffect(() => {
    let isMounted = true;

    const loadSaved = async () => {
      try {
        const savedCountry = await AsyncStorage.getItem('pc_country');
        if (savedCountry && isMounted) setUserCountry(savedCountry);

        const savedRatings = await AsyncStorage.getItem('pc_ratings');
        if (savedRatings && isMounted) setUserRatings(JSON.parse(savedRatings));

        const savedStats = await AsyncStorage.getItem('pc_stats');
        if (savedStats && isMounted) setUserStats(JSON.parse(savedStats));

        const savedHistory = await AsyncStorage.getItem('pc_history');
        if (savedHistory && isMounted) setMatchHistory(JSON.parse(savedHistory));

        // Sync with live Supabase profile if logged in
        if (isSupabaseConfigured && supabase && userId && userId !== 'guest') {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          if (!error && data && isMounted) {
            if (data.country) setUserCountry(data.country);
            const liveRatings = {
              bullet: data.bullet_rating || 1200,
              blitz: data.blitz_rating || 1200,
              rapid: data.rapid_rating || 1200,
              classical: data.classical_rating || 1200,
              overall: data.elo_rating || 1200
            };
            const liveStats = {
              wins: data.wins || 0,
              losses: data.losses || 0,
              draws: data.draws || 0
            };
            setUserRatings(liveRatings);
            setUserStats(liveStats);
            await AsyncStorage.setItem('pc_ratings', JSON.stringify(liveRatings));
            await AsyncStorage.setItem('pc_stats', JSON.stringify(liveStats));
          }
        }
      } catch (e) {
        console.log('Error loading saved multiplayer state:', e);
      }
    };
    loadSaved();

    // Subscribe to realtime profile updates
    let profileSub = null;
    if (isSupabaseConfigured && supabase && userId && userId !== 'guest') {
      profileSub = supabase
        .channel(`mobile_profile:${userId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        }, (payload) => {
          const updated = payload.new;
          if (updated && isMounted) {
            setUserRatings({
              bullet: updated.bullet_rating || 1200,
              blitz: updated.blitz_rating || 1200,
              rapid: updated.rapid_rating || 1200,
              classical: updated.classical_rating || 1200,
              overall: updated.elo_rating || 1200
            });
            setUserStats({
              wins: updated.wins || 0,
              losses: updated.losses || 0,
              draws: updated.draws || 0
            });
          }
        })
        .subscribe();
    }

    return () => {
      isMounted = false;
      if (profileSub) profileSub.unsubscribe();
    };
  }, [userId]);

  const updateProfileCountry = async (code) => {
    if (COUNTRIES[code]) {
      setUserCountry(code);
      try {
        await AsyncStorage.setItem('pc_country', code);
      } catch (e) {}
    }
  };

  // Dual Chess Clocks countdown
  useEffect(() => {
    if (matchmakingState === 'in_game' && !gameResult) {
      clockTimerRef.current = setInterval(() => {
        if (currentTurn === 'white') {
          setWhiteTime((prev) => {
            if (prev <= 1) {
              handleTimeOut('white');
              return 0;
            }
            return prev - 1;
          });
        } else {
          setBlackTime((prev) => {
            if (prev <= 1) {
              handleTimeOut('black');
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (clockTimerRef.current) clearInterval(clockTimerRef.current);
    }

    return () => {
      if (clockTimerRef.current) clearInterval(clockTimerRef.current);
    };
  }, [matchmakingState, currentTurn, gameResult]);

  const handleTimeOut = (flagColor) => {
    if (clockTimerRef.current) clearInterval(clockTimerRef.current);
    const winner = flagColor === 'white' ? 'black' : 'white';
    const isPlayerWin = winner === playerColor;

    finishGame({
      result: isPlayerWin ? 'win' : 'loss',
      reason: `${flagColor === 'white' ? 'White' : 'Black'} flagged on time`,
      winner
    });
  };

  // Captured pieces calculation
  const { capturedWhite, capturedBlack, materialDifference } = React.useMemo(() => {
    const defaultPieces = { p: 8, n: 2, b: 2, r: 2, q: 1 };
    const currentCounts = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
    };

    try {
      const chess = new Chess(fen);
      const board = chess.board();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = board[r][c];
          if (piece && piece.type !== 'k') {
            currentCounts[piece.color][piece.type] = (currentCounts[piece.color][piece.type] || 0) + 1;
          }
        }
      }
    } catch (e) {}

    const capW = []; // captured from White (Black holds)
    const capB = []; // captured from Black (White holds)

    for (const [type, total] of Object.entries(defaultPieces)) {
      const missingWhite = total - (currentCounts.w[type] || 0);
      for (let i = 0; i < missingWhite; i++) capW.push(type.toUpperCase());

      const missingBlack = total - (currentCounts.b[type] || 0);
      for (let i = 0; i < missingBlack; i++) capB.push(type.toLowerCase());
    }

    const pieceVals = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    let scoreW = 0;
    let scoreB = 0;
    capB.forEach(p => scoreW += pieceVals[p.toLowerCase()] || 0);
    capW.forEach(p => scoreB += pieceVals[p.toLowerCase()] || 0);

    return {
      capturedWhite: capW,
      capturedBlack: capB,
      materialDifference: scoreW - scoreB
    };
  }, [fen]);

  // Elo rating calculation
  const calculateEloChange = (playerRating, opponentRating, score) => {
    const K = 32;
    const expected = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    return Math.round(K * (score - expected));
  };

  // Finish game handler
  const finishGame = async (outcome) => {
    if (clockTimerRef.current) clearInterval(clockTimerRef.current);
    if (simulatedBotTimerRef.current) clearTimeout(simulatedBotTimerRef.current);

    const isWin = outcome.result === 'win';
    const isLoss = outcome.result === 'loss';
    const isDraw = outcome.result === 'draw';

    const currentModeRating = userRatings[selectedMode] || 1340;
    const oppRating = opponent?.rating || 1350;

    let score = isWin ? 1.0 : (isDraw ? 0.5 : 0.0);
    const delta = calculateEloChange(currentModeRating, oppRating, score);
    const newRating = Math.max(100, currentModeRating + delta);

    const newRatings = {
      ...userRatings,
      [selectedMode]: newRating,
      overall: Math.round(
        ((userRatings.bullet || 1300) + (userRatings.blitz || 1340) + (userRatings.rapid || 1400) + (userRatings.classical || 1440)) / 4
      )
    };

    const newStats = {
      wins: (userStats.wins || 0) + (isWin ? 1 : 0),
      losses: (userStats.losses || 0) + (isLoss ? 1 : 0),
      draws: (userStats.draws || 0) + (isDraw ? 1 : 0)
    };

    const pgnString = generatePgn();
    const historyItem = {
      id: `match_${Date.now()}`,
      opponent_name: opponent?.name || 'Online Opponent',
      opponent_rating: oppRating,
      opponent_country: opponent?.country || 'US',
      player_color: playerColor,
      mode: selectedMode,
      time_control: selectedTimeControl,
      result: outcome.result,
      reason: outcome.reason,
      rating_delta: delta,
      moves_count: moves.length,
      pgn: pgnString,
      created_at: new Date().toISOString()
    };

    const updatedHistory = [historyItem, ...matchHistory].slice(0, 30);

    setUserRatings(newRatings);
    setUserStats(newStats);
    setMatchHistory(updatedHistory);
    setGameResult(outcome.result);
    setTerminationReason(outcome.reason);
    setRatingChange(delta);

    try {
      await AsyncStorage.setItem('pc_ratings', JSON.stringify(newRatings));
      await AsyncStorage.setItem('pc_stats', JSON.stringify(newStats));
      await AsyncStorage.setItem('pc_history', JSON.stringify(updatedHistory));

      // Persist to Supabase live database
      if (isSupabaseConfigured && supabase && userId && userId !== 'guest') {
        supabase
          .from('profiles')
          .update({
            [`${selectedMode}_rating`]: newRating,
            elo_rating: newRatings.overall,
            wins: newStats.wins,
            losses: newStats.losses,
            draws: newStats.draws
          })
          .eq('id', userId)
          .then(() => {})
          .catch(err => console.warn('Supabase profile stats update error:', err));

        supabase
          .from('games')
          .insert({
            user_id: userId,
            game_type: 'offline',
            opponent_name: opponent?.name || 'Online Opponent',
            result: outcome.result === 'win' ? '1-0' : outcome.result === 'loss' ? '0-1' : '1/2-1/2',
            pgn: pgnString,
            final_fen: fen,
            moves_count: moves.length,
            player_color: playerColor,
            time_control: selectedTimeControl
          })
          .then(() => {})
          .catch(err => console.warn('Supabase game insert error:', err));
      }
    } catch (e) {}
  };

  // Generate standard PGN representation
  const generatePgn = () => {
    try {
      const chess = new Chess();
      for (const m of moves) {
        chess.move(m);
      }
      return chess.pgn();
    } catch (e) {
      return '';
    }
  };

  // Start Quick Match
  const startQuickMatch = (mode = selectedMode, timeControl = selectedTimeControl) => {
    setSelectedMode(mode);
    setSelectedTimeControl(timeControl);
    setMatchmakingState('searching');
    setGameResult(null);
    setTerminationReason(null);
    setRatingChange(0);
    setDrawOfferedBy(null);

    // Simulated matchmaking pairing within 1.5 - 3.2s
    const delay = 1600 + Math.floor(Math.random() * 1200);
    searchTimeoutRef.current = setTimeout(() => {
      const opp = SIMULATED_OPPONENTS[Math.floor(Math.random() * SIMULATED_OPPONENTS.length)];
      const assignedColor = Math.random() > 0.5 ? 'white' : 'black';
      
      const [minStr] = timeControl.split('+');
      const totalSecs = parseInt(minStr, 10) * 60;

      const gameId = `live_${Date.now()}`;
      setActiveGame({
        id: gameId,
        mode,
        timeControl,
        opponent: opp
      });
      setOpponent(opp);
      setPlayerColor(assignedColor);
      setFen(new Chess().fen());
      setMoves([]);
      setWhiteTime(totalSecs);
      setBlackTime(totalSecs);
      setCurrentTurn('white');
      setMatchmakingState('in_game');

      // If assigned Black, trigger sparring bot's first move
      if (assignedColor === 'black') {
        scheduleOpponentMove(new Chess().fen(), []);
      }
    }, delay);
  };

  // Cancel Matchmaking
  const cancelMatchmaking = () => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setMatchmakingState('idle');
  };

  // Create Private Room Code
  const createPrivateRoom = (mode = selectedMode, timeControl = selectedTimeControl) => {
    setSelectedMode(mode);
    setSelectedTimeControl(timeControl);
    const code = `PR-${Math.floor(1000 + Math.random() * 9000)}`;
    setRoomCode(code);
    setMatchmakingState('searching');
    return code;
  };

  // Join Private Room Code
  const joinPrivateRoom = (code) => {
    const opp = SIMULATED_OPPONENTS[Math.floor(Math.random() * SIMULATED_OPPONENTS.length)];
    const assignedColor = 'black';
    const [minStr] = selectedTimeControl.split('+');
    const totalSecs = parseInt(minStr || '3', 10) * 60;

    setActiveGame({
      id: `room_${code}`,
      mode: selectedMode,
      timeControl: selectedTimeControl,
      opponent: opp
    });
    setOpponent(opp);
    setPlayerColor(assignedColor);
    setFen(new Chess().fen());
    setMoves([]);
    setWhiteTime(totalSecs);
    setBlackTime(totalSecs);
    setCurrentTurn('white');
    setMatchmakingState('in_game');

    scheduleOpponentMove(new Chess().fen(), []);
  };

  // Player Move Execution
  const makeMove = (moveInput) => {
    if (matchmakingState !== 'in_game' || gameResult) return false;

    // Verify turn matches player color
    const isPlayerTurn = (currentTurn === 'white' && playerColor === 'white') ||
                         (currentTurn === 'black' && playerColor === 'black');
    if (!isPlayerTurn) return false;

    try {
      const chess = new Chess(fen);
      const move = chess.move(moveInput);
      if (!move) return false;

      const nextFen = chess.fen();
      const updatedMoves = [...moves, move.san];
      setFen(nextFen);
      setMoves(updatedMoves);
      const nextTurn = chess.turn() === 'w' ? 'white' : 'black';
      setCurrentTurn(nextTurn);

      // Add time increment if applicable
      const [, incStr] = selectedTimeControl.split('+');
      const inc = parseInt(incStr || '0', 10);
      if (inc > 0) {
        if (playerColor === 'white') setWhiteTime(prev => prev + inc);
        else setBlackTime(prev => prev + inc);
      }

      // Check Game Over Conditions
      if (chess.isGameOver()) {
        if (chess.isCheckmate()) {
          finishGame({
            result: 'win',
            reason: `Checkmate! ${playerColor === 'white' ? 'White' : 'Black'} wins`,
            winner: playerColor
          });
        } else if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition() || chess.isInsufficientMaterial()) {
          let reason = 'Draw by agreement';
          if (chess.isStalemate()) reason = 'Stalemate';
          if (chess.isThreefoldRepetition()) reason = 'Threefold Repetition';
          if (chess.isInsufficientMaterial()) reason = 'Insufficient Material';
          finishGame({ result: 'draw', reason });
        }
        return true;
      }

      // Trigger sparring bot's response
      scheduleOpponentMove(nextFen, updatedMoves);
      return true;
    } catch (e) {
      console.log('Error executing move:', e);
      return false;
    }
  };

  // Sparring Opponent Response Generation
  const scheduleOpponentMove = (currentFen, currentMoves) => {
    if (simulatedBotTimerRef.current) clearTimeout(simulatedBotTimerRef.current);

    // Natural human reaction time between 1.2s - 2.8s
    const delay = 1200 + Math.floor(Math.random() * 1600);
    simulatedBotTimerRef.current = setTimeout(() => {
      try {
        const chess = new Chess(currentFen);
        if (chess.isGameOver()) return;

        const legal = chess.moves({ verbose: true });
        if (legal.length === 0) return;

        // Smart move selection: prefer captures, checks, or random solid development
        const captures = legal.filter(m => m.captured);
        const checks = legal.filter(m => {
          chess.move(m);
          const inCheck = chess.inCheck();
          chess.undo();
          return inCheck;
        });

        let chosenMove = null;
        if (checks.length > 0 && Math.random() > 0.4) {
          chosenMove = checks[Math.floor(Math.random() * checks.length)];
        } else if (captures.length > 0 && Math.random() > 0.3) {
          chosenMove = captures[Math.floor(Math.random() * captures.length)];
        } else {
          chosenMove = legal[Math.floor(Math.random() * legal.length)];
        }

        const executed = chess.move(chosenMove);
        if (!executed) return;

        const nextFen = chess.fen();
        const updatedMoves = [...currentMoves, executed.san];
        setFen(nextFen);
        setMoves(updatedMoves);
        const nextTurn = chess.turn() === 'w' ? 'white' : 'black';
        setCurrentTurn(nextTurn);

        // Add opponent increment
        const [, incStr] = selectedTimeControl.split('+');
        const inc = parseInt(incStr || '0', 10);
        if (inc > 0) {
          if (playerColor === 'white') setBlackTime(prev => prev + inc);
          else setWhiteTime(prev => prev + inc);
        }

        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            finishGame({
              result: 'loss',
              reason: `Checkmate! ${opponent?.name || 'Opponent'} wins`,
              winner: playerColor === 'white' ? 'black' : 'white'
            });
          } else {
            finishGame({ result: 'draw', reason: 'Draw by rule' });
          }
        }
      } catch (e) {
        console.log('Error calculating bot move:', e);
      }
    }, delay);
  };

  // Draw & Resign
  const offerDraw = () => {
    setDrawOfferedBy(playerColor);
    // Sparring opponent decides: if material difference is <= 1 and move count > 15, accepts
    setTimeout(() => {
      if (Math.abs(materialDifference) <= 1 && moves.length > 10) {
        finishGame({ result: 'draw', reason: 'Draw accepted by opponent' });
      } else {
        setDrawOfferedBy(null);
      }
    }, 1500);
  };

  const acceptDraw = () => {
    finishGame({ result: 'draw', reason: 'Draw agreed mutually' });
  };

  const declineDraw = () => {
    setDrawOfferedBy(null);
  };

  const resign = () => {
    finishGame({
      result: 'loss',
      reason: `${username} resigned`,
      winner: playerColor === 'white' ? 'black' : 'white'
    });
  };

  const rematch = () => {
    startQuickMatch(selectedMode, selectedTimeControl);
  };

  const getLeaderboard = async (timeframe = 'global', mode = 'all') => {
    if (isSupabaseConfigured && supabase) {
      try {
        const ratingCol = (mode && mode !== 'all') ? `${mode}_rating` : 'elo_rating';
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url, country, elo_rating, bullet_rating, blitz_rating, rapid_rating, classical_rating, wins, losses, draws, daily_streak')
          .order(ratingCol, { ascending: false })
          .limit(50);

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((p, idx) => {
            const wins = p.wins || 0;
            const losses = p.losses || 0;
            const draws = p.draws || 0;
            const total = wins + losses + draws;
            const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
            const rating = p[ratingCol] || p.elo_rating || 1200;
            return {
              rank: idx + 1,
              id: p.id,
              username: p.username || p.full_name || `Tactician_${p.id.slice(0, 4)}`,
              country: p.country || 'US',
              avatar: p.avatar_url || '♟️',
              rating,
              wins,
              losses,
              draws,
              winRate,
              streak: p.daily_streak || 1,
              tier: rating >= 2000 ? 'Grandmaster' : rating >= 1600 ? 'Master' : 'Tactician'
            };
          });
        }
      } catch (e) {
        console.warn('Direct Supabase leaderboard fetch error:', e);
      }
    }
    return [];
  };

  return (
    <MultiplayerContext.Provider
      value={{
        selectedMode,
        setSelectedMode,
        selectedTimeControl,
        setSelectedTimeControl,
        matchmakingState,
        setMatchmakingState,
        activeGame,
        playerColor,
        roomCode,
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
        updateProfileCountry,
        userRatings,
        userStats,
        matchHistory,
        startQuickMatch,
        cancelMatchmaking,
        createPrivateRoom,
        joinPrivateRoom,
        makeMove,
        offerDraw,
        acceptDraw,
        declineDraw,
        resign,
        rematch,
        getLeaderboard,
        generatePgn
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
};
