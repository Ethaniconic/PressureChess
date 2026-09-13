import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useAuth } from './AuthContext';
import { Chess } from 'chess.js';
import { soundEngine } from '../utils/sound';
import confetti from 'canvas-confetti';
import { MULTIPLAYER_MODES, COUNTRIES } from '../data/multiplayerData';

const MultiplayerContext = createContext({});

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const MultiplayerProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const username = user?.username || 'Tactician';

  // Mode selection
  const [selectedMode, setSelectedMode] = useState('blitz');
  const [selectedTimeControl, setSelectedTimeControl] = useState('3+0');

  // Matchmaking & Room State
  const [matchmakingState, setMatchmakingState] = useState('idle'); // idle | searching | matched | in_game
  const [activeGame, setActiveGame] = useState(null);
  const [playerColor, setPlayerColor] = useState('white'); // white | black
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

  // User Multiplayer Profile & Ratings
  const [userCountry, setUserCountry] = useState(() => {
    return localStorage.getItem('pressure_chess_country') || 'US';
  });

  const [userRatings, setUserRatings] = useState(() => {
    const saved = localStorage.getItem('pressure_chess_mode_ratings');
    return saved ? JSON.parse(saved) : {
      bullet: 400,
      blitz: 400,
      rapid: 400,
      classical: 400,
      overall: 400
    };
  });

  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('pressure_chess_mp_stats');
    return saved ? JSON.parse(saved) : {
      wins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0,
      winRatePct: 0
    };
  });

  const [matchHistory, setMatchHistory] = useState(() => {
    const saved = localStorage.getItem('pressure_chess_mp_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Tickers & Supabase Realtime channel ref
  const clockIntervalRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const realtimeChannelRef = useRef(null);

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('pressure_chess_country', userCountry);
    localStorage.setItem('pressure_chess_mode_ratings', JSON.stringify(userRatings));
    localStorage.setItem('pressure_chess_mp_stats', JSON.stringify(userStats));
    localStorage.setItem('pressure_chess_mp_history', JSON.stringify(matchHistory));
  }, [userCountry, userRatings, userStats, matchHistory]);

  // Live profile synchronization with Supabase
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !userId || userId === 'guest') return;

    let isMounted = true;
    const fetchLiveProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data && isMounted) {
          if (data.country) setUserCountry(data.country);
          setUserRatings({
            bullet: data.bullet_rating || 400,
            blitz: data.blitz_rating || 400,
            rapid: data.rapid_rating || 400,
            classical: data.classical_rating || 400,
            overall: data.elo_rating || 400
          });
          const wins = data.wins || 0;
          const losses = data.losses || 0;
          const draws = data.draws || 0;
          const total = wins + losses + draws;
          setUserStats({
            wins,
            losses,
            draws,
            totalGames: total,
            winRatePct: total > 0 ? Math.round((wins / total) * 100) : 0
          });
        } else if (!data && !error && isMounted) {
          // If no profile exists (e.g. registered before trigger was added), create one natively
          const newProfile = {
            id: userId,
            username: username || 'Tactician',
            elo_rating: 400,
            bullet_rating: 400,
            blitz_rating: 400,
            rapid_rating: 400,
            classical_rating: 400,
            country: 'US',
            wins: 0,
            losses: 0,
            draws: 0
          };
          const { error: insertError } = await supabase.from('profiles').insert(newProfile);
          if (!insertError && isMounted) {
            setUserRatings({ bullet: 400, blitz: 400, rapid: 400, classical: 400, overall: 400 });
            setUserStats({ wins: 0, losses: 0, draws: 0, totalGames: 0, winRatePct: 0 });
          }
        }
      } catch (e) {
        console.warn('Profile sync error:', e);
      }
    };

    fetchLiveProfile();

    // Subscribe to real-time changes to this user profile in Supabase
    const profileChannel = supabase
      .channel(`profile:${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      }, (payload) => {
        const updated = payload.new;
        if (updated && isMounted) {
          setUserRatings({
            bullet: updated.bullet_rating || 400,
            blitz: updated.blitz_rating || 400,
            rapid: updated.rapid_rating || 400,
            classical: updated.classical_rating || 400,
            overall: updated.elo_rating || 400
          });
          const wins = updated.wins || 0;
          const losses = updated.losses || 0;
          const draws = updated.draws || 0;
          const total = wins + losses + draws;
          setUserStats({
            wins,
            losses,
            draws,
            totalGames: total,
            winRatePct: total > 0 ? Math.round((wins / total) * 100) : 0
          });
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      profileChannel.unsubscribe();
    };
  }, [userId]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (realtimeChannelRef.current) realtimeChannelRef.current.unsubscribe();
    };
  }, []);

  // Dual Chess Clock Engine: counts down for active player
  useEffect(() => {
    if (matchmakingState === 'in_game' && !gameResult) {
      clockIntervalRef.current = setInterval(() => {
        if (currentTurn === 'white') {
          setWhiteTime((prev) => {
            if (prev <= 0.1) {
              handleTimeout('white');
              return 0;
            }
            return Math.max(0, prev - 0.1);
          });
        } else {
          setBlackTime((prev) => {
            if (prev <= 0.1) {
              handleTimeout('black');
              return 0;
            }
            return Math.max(0, prev - 0.1);
          });
        }
      }, 100);
    } else {
      if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
    }

    return () => {
      if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
    };
  }, [matchmakingState, currentTurn, gameResult]);

  // Low time warning audio effect (<10s)
  useEffect(() => {
    const activeTime = currentTurn === 'white' ? whiteTime : blackTime;
    if (activeTime > 0 && activeTime <= 10.0 && Math.floor(activeTime * 10) % 10 === 0) {
      soundEngine.playCheck(true);
    }
  }, [whiteTime, blackTime, currentTurn]);

  // Computed captured pieces from current board FEN
  const { capturedWhite, capturedBlack, materialDifference } = useMemo(() => {
    try {
      const b = new Chess(fen);
      const pieceMap = { p: 0, n: 0, b: 0, r: 0, q: 0, P: 0, N: 0, B: 0, R: 0, Q: 0 };
      const values = { p: 1, n: 3, b: 3, r: 5, q: 9 };

      // Initial piece counts
      const standard = { p: 8, n: 2, b: 2, r: 2, q: 1 };

      const boardState = b.board();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = boardState[r][c];
          if (piece && piece.type !== 'k') {
            const key = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
            pieceMap[key] = (pieceMap[key] || 0) + 1;
          }
        }
      }

      // Calculate missing pieces
      const capWhite = []; // Black captured White pieces
      const capBlack = []; // White captured Black pieces

      for (const [type, count] of Object.entries(standard)) {
        const whiteCurrent = pieceMap[type.toUpperCase()] || 0;
        const blackCurrent = pieceMap[type.toLowerCase()] || 0;

        for (let i = 0; i < count - whiteCurrent; i++) capWhite.push(type.toUpperCase());
        for (let i = 0; i < count - blackCurrent; i++) capBlack.push(type.toLowerCase());
      }

      // Score difference
      let whiteScore = 0;
      let blackScore = 0;
      capBlack.forEach((p) => (whiteScore += values[p.toLowerCase()] || 0));
      capWhite.forEach((p) => (blackScore += values[p.toLowerCase()] || 0));

      return {
        capturedWhite: capWhite,
        capturedBlack: capBlack,
        materialDifference: whiteScore - blackScore
      };
    } catch (e) {
      return { capturedWhite: [], capturedBlack: [], materialDifference: 0 };
    }
  }, [fen]);

  // Timeout handler
  const handleTimeout = (timedOutColor) => {
    if (gameResult) return;
    const winnerColor = timedOutColor === 'white' ? 'black' : 'white';
    const res = winnerColor === 'white' ? '1-0' : '0-1';
    finishGame(res, `${timedOutColor === 'white' ? 'White' : 'Black'} timed out.`);
  };

  // Helper to parse time control seconds
  const getTimeControlSeconds = (tc) => {
    try {
      const parts = tc.split('+');
      return {
        initial: parseFloat(parts[0]) * 60,
        inc: parts.length > 1 ? parseInt(parts[1], 10) : 0
      };
    } catch (e) {
      return { initial: 180, inc: 0 };
    }
  };

  // Subscribe to Supabase Realtime channel for live peer-to-peer sync
  const subscribeToGameChannel = (gameId, myColor) => {
    return new Promise((resolve) => {
      if (!isSupabaseConfigured || !supabase) {
        resolve();
        return;
      }

    if (realtimeChannelRef.current) {
      realtimeChannelRef.current.unsubscribe();
    }

    const channel = supabase.channel(`game:${gameId}`, {
      config: { broadcast: { ack: true } }
    });

    channel
      .on('broadcast', { event: 'move' }, ({ payload }) => {
        if (payload.turn !== myColor) {
          applyIncomingMove(payload);
        }
      })
      .on('broadcast', { event: 'draw_offer' }, ({ payload }) => {
        if (payload.offeredBy !== myColor) {
          setDrawOfferedBy(payload.offeredBy);
        }
      })
      .on('broadcast', { event: 'draw_response' }, ({ payload }) => {
        if (payload.accepted) {
          finishGame('1/2-1/2', 'Draw agreed by mutual consent.');
        } else {
          setDrawOfferedBy(null);
        }
      })
      .on('broadcast', { event: 'resign' }, ({ payload }) => {
        const winner = payload.resignedBy === 'white' ? 'black' : 'white';
        finishGame(winner === 'white' ? '1-0' : '0-1', `${payload.resignedBy === 'white' ? 'White' : 'Black'} resigned.`);
      })
      .on('broadcast', { event: 'opponent_joined' }, ({ payload }) => {
        setOpponent({
          username: payload.black_username,
          country: payload.black_country,
          rating: payload.black_rating,
          avatar: '⚔️'
        });
        setMatchmakingState('in_game');
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime] Subscribed to game channel: game:${gameId}`);
          resolve();
        }
      });

    realtimeChannelRef.current = channel;
    });
  };

  // Initialize a new active game state
  const initializeGame = async (gameData, color, oppData) => {
    const { initial } = getTimeControlSeconds(gameData.time_control);
    setActiveGame(gameData);
    setPlayerColor(color);
    setOpponent(oppData);
    setFen(new Chess().fen());
    setWhiteTime(initial);
    setBlackTime(initial);
    setCurrentTurn('white');
    setMoves([]);
    setDrawOfferedBy(null);
    setGameResult(null);
    setTerminationReason(null);
    setRatingChange(0);
    setMatchmakingState('in_game');

    // Subscribe to Supabase Realtime
    await subscribeToGameChannel(gameData.id, color);
  };

  // Quick Match: Matchmaking queue
  const startQuickMatch = async (mode = selectedMode, timeControl = selectedTimeControl) => {
    setSelectedMode(mode);
    setSelectedTimeControl(timeControl);
    setMatchmakingState('searching');

    const myCurrentRating = userRatings[mode] || 400;

    if (isSupabaseConfigured && supabase) {
      try {
        // Query for another live human player waiting in queue
        const { data: waitingQueue, error: qErr } = await supabase
          .from('matchmaking_queue')
          .select('*')
          .eq('mode', mode)
          .eq('time_control', timeControl)
          .eq('status', 'searching')
          .neq('user_id', userId)
          .order('created_at', { ascending: true })
          .limit(1);

        if (!qErr && waitingQueue && waitingQueue.length > 0) {
          const oppEntry = waitingQueue[0];
          const gameId = `game_${Date.now()}`;
          const roomCode = `PR-${Math.floor(1000 + Math.random() * 9000)}`;
          const { initial, inc } = getTimeControlSeconds(timeControl);

          const amIWhite = Math.random() > 0.5;
          const whitePlayer = amIWhite ? { id: userId, username, rating: myCurrentRating, country: userCountry } : oppEntry;
          const blackPlayer = amIWhite ? oppEntry : { id: userId, username, rating: myCurrentRating, country: userCountry };

          const newGame = {
            id: gameId,
            room_code: roomCode,
            mode,
            time_control: timeControl,
            initial_time_seconds: initial,
            increment_seconds: inc,
            white_player_id: whitePlayer.id || whitePlayer.user_id,
            black_player_id: blackPlayer.id || blackPlayer.user_id,
            white_username: whitePlayer.username,
            black_username: blackPlayer.username,
            white_rating: whitePlayer.rating || 400,
            black_rating: blackPlayer.rating || 400,
            white_country: whitePlayer.country || 'US',
            black_country: blackPlayer.country || 'US',
            status: 'active',
            current_turn: 'white',
            fen: new Chess().fen(),
            moves: []
          };

          await supabase.from('multiplayer_games').insert(newGame);

          await supabase
            .from('matchmaking_queue')
            .update({ status: 'matched', matched_game_id: gameId })
            .eq('id', oppEntry.id);

          initializeGame(newGame, amIWhite ? 'white' : 'black', {
            username: oppEntry.username,
            country: oppEntry.country || 'US',
            rating: oppEntry.rating || 400,
            avatar: '♟️'
          });
          return;
        }

        // Clean previous queue rows for this player
        await supabase.from('matchmaking_queue').delete().eq('user_id', userId);

        // Add self to matchmaking queue
        const { data: myQueueEntry } = await supabase
          .from('matchmaking_queue')
          .insert({
            user_id: userId,
            username,
            rating: myCurrentRating,
            country: userCountry,
            mode,
            time_control: timeControl,
            status: 'searching'
          })
          .select()
          .single();

        if (myQueueEntry) {
          if (realtimeChannelRef.current) supabase.removeChannel(realtimeChannelRef.current);

          const queueChannel = supabase
            .channel(`web_queue_${myQueueEntry.id}`)
            .on('postgres_changes', {
              event: 'UPDATE',
              schema: 'public',
              table: 'matchmaking_queue',
              filter: `id=eq.${myQueueEntry.id}`
            }, async (payload) => {
              const updated = payload.new;
              if (updated && updated.status === 'matched' && updated.matched_game_id) {
                const { data: matchedGame } = await supabase
                  .from('multiplayer_games')
                  .select('*')
                  .eq('id', updated.matched_game_id)
                  .single();

                if (matchedGame) {
                  const myColor = matchedGame.white_player_id === userId ? 'white' : 'black';
                  const oppData = {
                    username: myColor === 'white' ? matchedGame.black_username : matchedGame.white_username,
                    country: myColor === 'white' ? matchedGame.black_country : matchedGame.white_country,
                    rating: myColor === 'white' ? matchedGame.black_rating : matchedGame.white_rating,
                    avatar: '♟️'
                  };
                  initializeGame(matchedGame, myColor, oppData);
                }
              }
            })
            .subscribe();

          realtimeChannelRef.current = queueChannel;
        }
      } catch (err) {
        console.warn('Live matchmaking queue error:', err);
      }
    }
  };

  const cancelMatchmaking = async () => {
    if (realtimeChannelRef.current && supabase) {
      supabase.removeChannel(realtimeChannelRef.current);
      realtimeChannelRef.current = null;
    }
    if (isSupabaseConfigured && supabase && userId) {
      try {
        await supabase.from('matchmaking_queue').delete().eq('user_id', userId);
      } catch (e) {}
    }
    setMatchmakingState('idle');
  };

  // Create private custom room
  const createPrivateRoom = async (mode = selectedMode, timeControl = selectedTimeControl) => {
    const { initial, inc } = getTimeControlSeconds(timeControl);
    const myCurrentRating = userRatings[mode] || 400;
    const code = `PR-${Math.floor(1000 + Math.random() * 9000)}`;

    let gameData = {
      room_code: code,
      mode,
      time_control: timeControl,
      initial_time_seconds: initial,
      increment_seconds: inc,
      white_player_id: userId !== 'guest' ? userId : null,
      black_player_id: null,
      white_username: username,
      black_username: 'Waiting for opponent...',
      white_country: userCountry,
      black_country: 'US',
      white_rating: myCurrentRating,
      black_rating: 400,
      white_time_remaining: initial,
      black_time_remaining: initial,
      current_turn: 'white',
      fen: new Chess().fen(),
      pgn: '',
      moves: [],
      status: 'waiting'
    };

    // Insert directly into Supabase multiplayer_games table if connected
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('multiplayer_games')
          .insert(gameData)
          .select()
          .single();
        if (!error && data) {
          gameData = data;
        }
      } catch (e) {
        console.warn('Supabase room insert error:', e);
      }
    } else {
      try {
        const res = await fetch(`${API_BASE}/api/multiplayer/room/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode,
            time_control: timeControl,
            user_id: userId,
            username,
            country: userCountry,
            rating: myCurrentRating
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.game) gameData = data.game;
        }
      } catch (e) {}
    }

    if (!gameData.id) {
      gameData.id = `room_${Date.now()}`;
    }

    setRoomCode(gameData.room_code);
    initializeGame(gameData, 'white', {
      username: 'Waiting for friend...',
      country: 'US',
      rating: 400,
      avatar: '⏳'
    });
    return gameData;
  };

  // Join private custom room via code
  const joinPrivateRoom = async (code) => {
    const cleanCode = code.trim().toUpperCase();
    const myCurrentRating = userRatings[selectedMode] || 400;

    let gameData = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existingGame, error } = await supabase
          .from('multiplayer_games')
          .select('*')
          .eq('room_code', cleanCode)
          .eq('status', 'waiting')
          .single();

        if (!error && existingGame) {
          const { data: updatedGame } = await supabase
            .from('multiplayer_games')
            .update({
              black_player_id: userId !== 'guest' ? userId : null,
              black_username: username,
              black_country: userCountry,
              black_rating: myCurrentRating,
              status: 'active',
              started_at: new Date().toISOString()
            })
            .eq('id', existingGame.id)
            .select()
            .single();

          gameData = updatedGame || existingGame;
        }
      } catch (e) {
        console.warn('Supabase room join error:', e);
      }
    }

    if (!gameData) {
      try {
        const res = await fetch(`${API_BASE}/api/multiplayer/room/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            room_code: cleanCode,
            user_id: userId,
            username,
            country: userCountry,
            rating: myCurrentRating
          })
        });
        if (res.ok) {
          const data = await res.json();
          gameData = data.game;
        }
      } catch (e) {}
    }

    if (!gameData) {
      throw new Error(`Room "${cleanCode}" was not found or has already expired.`);
    }

    setRoomCode(gameData.room_code);
    await initializeGame(gameData, 'black', {
      username: gameData.white_username,
      country: gameData.white_country,
      rating: gameData.white_rating,
      avatar: '👑'
    });

    // Notify white player through Realtime channel
    if (realtimeChannelRef.current) {
      realtimeChannelRef.current.send({
        type: 'broadcast',
        event: 'opponent_joined',
        payload: {
          black_username: username,
          black_country: userCountry,
          black_rating: myCurrentRating
        }
      });
    }

    return gameData;
  };

  // Make a move on the board
  const makeMove = (moveAttempt) => {
    if (matchmakingState !== 'in_game' || gameResult) return false;

    // Verify it is player's turn
    if (currentTurn !== playerColor) return false;

    try {
      const chessInstance = new Chess(fen);
      const isCapture = Boolean(chessInstance.get(moveAttempt.to)) || 
        chessInstance.moves({ square: moveAttempt.from, verbose: true }).find(m => m.to === moveAttempt.to && m.flags.includes('e'));

      const result = chessInstance.move(moveAttempt);
      if (!result) return false;

      const newFen = chessInstance.fen();
      setFen(newFen);

      // Play audio
      if (chessInstance.isCheckmate()) {
        soundEngine.playGameEnd(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else if (chessInstance.inCheck()) {
        soundEngine.playCheck(true);
      } else if (isCapture) {
        soundEngine.playCapture(true);
      } else {
        soundEngine.playMove(true);
      }

      // Add time increment
      const inc = activeGame?.increment_seconds || 0;
      let newWTime = whiteTime;
      let newBTime = blackTime;

      if (playerColor === 'white') {
        newWTime = whiteTime + inc;
        setWhiteTime(newWTime);
      } else {
        newBTime = blackTime + inc;
        setBlackTime(newBTime);
      }

      const nextTurnColor = playerColor === 'white' ? 'black' : 'white';
      setCurrentTurn(nextTurnColor);

      const moveObj = {
        from: moveAttempt.from,
        to: moveAttempt.to,
        san: result.san,
        uci: `${moveAttempt.from}${moveAttempt.to}`,
        turn: playerColor,
        fen: newFen,
        whiteTime: newWTime,
        blackTime: newBTime,
        captured: result.captured
      };

      setMoves((prev) => [...prev, moveObj]);

      // Broadcast move to opponent via Realtime Channel
      if (realtimeChannelRef.current) {
        realtimeChannelRef.current.send({
          type: 'broadcast',
          event: 'move',
          payload: moveObj
        });
      }

      // Sync with backend API
      if (activeGame?.id) {
        fetch(`${API_BASE}/api/multiplayer/game/${activeGame.id}/move`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game_id: activeGame.id,
            player_id: userId,
            from_sq: moveAttempt.from,
            to_sq: moveAttempt.to,
            promotion: moveAttempt.promotion || 'q',
            time_remaining: playerColor === 'white' ? newWTime : newBTime
          })
        }).catch(() => {});
      }

      // Check game over
      if (chessInstance.isCheckmate()) {
        const winResult = playerColor === 'white' ? '1-0' : '0-1';
        finishGame(winResult, `Checkmate! ${playerColor === 'white' ? 'White' : 'Black'} delivered mate.`);
      } else if (chessInstance.isStalemate() || chessInstance.isInsufficientMaterial() || chessInstance.isThreefoldRepetition()) {
        finishGame('1/2-1/2', 'Draw by stalemate or insufficient material.');
      }

      return true;
    } catch (e) {
      console.error('Invalid move attempted:', e);
      return false;
    }
  };

  // Handle incoming move from opponent
  const applyIncomingMove = (movePayload) => {
    try {
      const chessInstance = new Chess(fen);
      const isCapture = Boolean(chessInstance.get(movePayload.to));
      const res = chessInstance.move({
        from: movePayload.from,
        to: movePayload.to,
        promotion: movePayload.promotion || 'q'
      });

      if (res) {
        const newFen = chessInstance.fen();
        setFen(newFen);
        setWhiteTime(movePayload.whiteTime);
        setBlackTime(movePayload.blackTime);
        setCurrentTurn(playerColor);

        // Audio
        if (chessInstance.isCheckmate()) {
          soundEngine.playGameEnd(true);
        } else if (chessInstance.inCheck()) {
          soundEngine.playCheck(true);
        } else if (isCapture) {
          soundEngine.playCapture(true);
        } else {
          soundEngine.playMove(true);
        }

        setMoves((prev) => [...prev, movePayload]);

        if (chessInstance.isCheckmate()) {
          const winResult = playerColor === 'white' ? '0-1' : '1-0';
          finishGame(winResult, 'Checkmate! Opponent won.');
        } else if (chessInstance.isGameOver()) {
          finishGame('1/2-1/2', 'Draw.');
        }
      }
    } catch (e) {
      console.error('Error applying incoming move:', e);
    }
  };

  // Draw handlers
  const offerDraw = () => {
    if (matchmakingState !== 'in_game' || gameResult) return;
    setDrawOfferedBy(playerColor);

    if (realtimeChannelRef.current) {
      realtimeChannelRef.current.send({
        type: 'broadcast',
        event: 'draw_offer',
        payload: { offeredBy: playerColor }
      });
    }
  };

  const acceptDraw = () => {
    if (realtimeChannelRef.current) {
      realtimeChannelRef.current.send({
        type: 'broadcast',
        event: 'draw_response',
        payload: { accepted: true }
      });
    }
    finishGame('1/2-1/2', 'Draw agreed by mutual consent.');
  };

  const declineDraw = () => {
    setDrawOfferedBy(null);
    if (realtimeChannelRef.current) {
      realtimeChannelRef.current.send({
        type: 'broadcast',
        event: 'draw_response',
        payload: { accepted: false }
      });
    }
  };

  // Resign handler
  const resign = () => {
    if (matchmakingState !== 'in_game' || gameResult) return;
    const winnerColor = playerColor === 'white' ? 'black' : 'white';
    const res = winnerColor === 'white' ? '1-0' : '0-1';

    if (realtimeChannelRef.current) {
      realtimeChannelRef.current.send({
        type: 'broadcast',
        event: 'resign',
        payload: { resignedBy: playerColor }
      });
    }

    if (activeGame?.id) {
      fetch(`${API_BASE}/api/multiplayer/game/${activeGame.id}/resign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: activeGame.id, player_id: userId })
      }).catch(() => {});
    }

    finishGame(res, `You resigned.`);
  };

  // Finish match, update Elo rating & stats, archive match
  const finishGame = (res, reason) => {
    setGameResult(res);
    setTerminationReason(reason);

    const isWhite = playerColor === 'white';
    const isWin = (res === '1-0' && isWhite) || (res === '0-1' && !isWhite);
    const isDraw = res === '1/2-1/2' || res === 'draw';

    const currentModeKey = activeGame?.mode || selectedMode;
    const currentElo = userRatings[currentModeKey] || 400;
    const oppElo = opponent?.rating || 400;

    // Calculate rating delta
    const expected = 1.0 / (1.0 + Math.pow(10, (oppElo - currentElo) / 400.0));
    const actualScore = isWin ? 1.0 : isDraw ? 0.5 : 0.0;
    const delta = Math.round(32 * (actualScore - expected));
    setRatingChange(delta);

    // Update user stats
    setUserStats((prev) => {
      const newWins = isWin ? prev.wins + 1 : prev.wins;
      const newLosses = !isWin && !isDraw ? prev.losses + 1 : prev.losses;
      const newDraws = isDraw ? prev.draws + 1 : prev.draws;
      const total = newWins + newLosses + newDraws;
      return {
        wins: newWins,
        losses: newLosses,
        draws: newDraws,
        totalGames: total,
        winRatePct: Math.round((newWins / Math.max(1, total)) * 100)
      };
    });

    // Update rating
    setUserRatings((prev) => {
      const newModeRating = Math.max(100, (prev[currentModeKey] || 400) + delta);
      return {
        ...prev,
        [currentModeKey]: newModeRating,
        overall: Math.round(
          (prev.bullet + prev.blitz + prev.rapid + prev.classical + delta) / 4
        )
      };
    });

    // Add to match history
    const matchRecord = {
      id: activeGame?.id || `m_${Date.now()}`,
      mode: currentModeKey,
      timeControl: activeGame?.time_control || selectedTimeControl,
      opponent: opponent?.username || 'Opponent',
      opponentRating: oppElo,
      opponentCountry: opponent?.country || 'US',
      result: isWin ? 'Victory' : isDraw ? 'Draw' : 'Defeat',
      score: res,
      ratingDelta: delta,
      date: 'Just now',
      movesCount: moves.length,
      pgn: generatePgn(res)
    };

    setMatchHistory((prev) => [matchRecord, ...prev].slice(0, 30));

    // Live persistence to Supabase database
    if (isSupabaseConfigured && supabase && userId && userId !== 'guest') {
      const newOverall = Math.round(
        (userRatings.bullet + userRatings.blitz + userRatings.rapid + userRatings.classical + delta) / 4
      );

      supabase
        .from('profiles')
        .update({
          [`${currentModeKey}_rating`]: Math.max(100, (userRatings[currentModeKey] || 400) + delta),
          elo_rating: newOverall,
          wins: isWin ? userStats.wins + 1 : userStats.wins,
          losses: !isWin && !isDraw ? userStats.losses + 1 : userStats.losses,
          draws: isDraw ? userStats.draws + 1 : userStats.draws
        })
        .eq('id', userId)
        .then(() => {})
        .catch((e) => console.warn('Supabase profile stats update error:', e));

      supabase
        .from('games')
        .insert({
          user_id: userId,
          game_type: 'offline',
          opponent_name: opponent?.username || 'Opponent',
          result: res,
          pgn: generatePgn(res),
          final_fen: fen,
          moves_count: moves.length,
          player_color: playerColor,
          time_control: activeGame?.time_control || selectedTimeControl
        })
        .then(() => {})
        .catch((e) => console.warn('Supabase game insert error:', e));
    }

    if (isSupabaseConfigured && supabase && activeGame?.id && String(activeGame.id).length > 20) {
      supabase
        .from('multiplayer_games')
        .update({
          status: 'completed',
          result: res,
          termination_reason: reason,
          ended_at: new Date().toISOString()
        })
        .eq('id', activeGame.id)
        .then(() => {})
        .catch((e) => console.warn('Supabase multiplayer_games update error:', e));
    }
  };

  // Generate standard PGN from played match
  const generatePgn = (res = gameResult || '*') => {
    const whitePlayer = playerColor === 'white' ? username : opponent?.username || 'White';
    const blackPlayer = playerColor === 'black' ? username : opponent?.username || 'Black';
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '.');

    let header = `[Event "PressureChess Live Multiplayer"]\n[Date "${dateStr}"]\n[White "${whitePlayer}"]\n[Black "${blackPlayer}"]\n[Result "${res}"]\n[TimeControl "${activeGame?.time_control || selectedTimeControl}"]\n\n`;

    let movesStr = '';
    moves.forEach((m, idx) => {
      if (idx % 2 === 0) {
        movesStr += `${Math.floor(idx / 2) + 1}. ${m.san} `;
      } else {
        movesStr += `${m.san} `;
      }
    });

    return `${header}${movesStr.trim()} ${res}`;
  };

  // Rematch
  const rematch = () => {
    startQuickMatch(selectedMode, selectedTimeControl);
  };

  const updateProfileCountry = (countryCode) => {
    setUserCountry(countryCode);
  };

  // Fetch live leaderboards directly from Supabase database
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
            const rating = p[ratingCol] || p.elo_rating || 400;
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
              mode: mode === 'all' ? 'blitz' : mode
            };
          });
        }
      } catch (e) {
        console.warn('Direct Supabase leaderboard fetch error:', e);
      }
    }

    // Try Backend API fallback
    try {
      const res = await fetch(`${API_BASE}/api/multiplayer/leaderboard?timeframe=${timeframe}&mode=${mode}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.leaderboard)) {
          return data.leaderboard;
        }
      }
    } catch (e) {}

    // Clean sheet: no fake data
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
