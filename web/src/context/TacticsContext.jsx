import React, { createContext, useContext, useState, useEffect } from 'react';
import { ALL_PUZZLES, CHAMPIONSHIP_SCENARIOS, PUZZLE_MODES, PUZZLE_CATEGORIES } from '../data/puzzlesData';
import { useAuth } from './AuthContext';

const TacticsContext = createContext();

export const TacticsProvider = ({ children }) => {
  const { user } = useAuth();

  // Mode & Queue
  const [selectedMode, setSelectedMode] = useState('20s');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [puzzleQueue, setPuzzleQueue] = useState(ALL_PUZZLES);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(ALL_PUZZLES[0]);

  // Statistics
  const [puzzleRating, setPuzzleRating] = useState(() => {
    const saved = localStorage.getItem('pressure_chess_puzzle_rating');
    return saved ? parseInt(saved, 10) : 1200;
  });

  const [currentStreak, setCurrentStreak] = useState(() => {
    const saved = localStorage.getItem('pressure_chess_puzzle_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [highestStreak, setHighestStreak] = useState(() => {
    const saved = localStorage.getItem('pressure_chess_highest_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [totalAttempted, setTotalAttempted] = useState(() => {
    const saved = localStorage.getItem('pressure_chess_attempted');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [totalSolved, setTotalSolved] = useState(() => {
    const saved = localStorage.getItem('pressure_chess_solved');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [totalTimeSpent, setTotalTimeSpent] = useState(() => {
    const saved = localStorage.getItem('pressure_chess_time_spent');
    return saved ? parseFloat(saved) : 0.0;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('pressure_chess_puzzle_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Derived metrics
  const accuracyPct = totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0;
  const avgSolveTime = totalAttempted > 0 ? (totalTimeSpent / totalAttempted).toFixed(1) : '0.0';

  // Save to localStorage whenever stats update
  useEffect(() => {
    localStorage.setItem('pressure_chess_puzzle_rating', puzzleRating.toString());
    localStorage.setItem('pressure_chess_puzzle_streak', currentStreak.toString());
    localStorage.setItem('pressure_chess_highest_streak', highestStreak.toString());
    localStorage.setItem('pressure_chess_attempted', totalAttempted.toString());
    localStorage.setItem('pressure_chess_solved', totalSolved.toString());
    localStorage.setItem('pressure_chess_time_spent', totalTimeSpent.toString());
    localStorage.setItem('pressure_chess_puzzle_history', JSON.stringify(history.slice(0, 50)));
  }, [puzzleRating, currentStreak, highestStreak, totalAttempted, totalSolved, totalTimeSpent, history]);

  // Start a structured pressure session
  const startSession = (modeId = '20s', categoryId = 'all', specificPuzzleId = null) => {
    setSelectedMode(modeId);
    setSelectedCategory(categoryId);

    let filtered = [...ALL_PUZZLES];
    if (modeId === 'championship') {
      filtered = [...CHAMPIONSHIP_SCENARIOS];
    } else if (categoryId && categoryId !== 'all') {
      filtered = ALL_PUZZLES.filter(p => p.category === categoryId);
    }

    // Shuffle if timed rush mode
    if (['10s', '20s', '30s', 'sudden_death'].includes(modeId)) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    if (filtered.length === 0) filtered = [...ALL_PUZZLES];

    let startIndex = 0;
    if (specificPuzzleId) {
      const idx = filtered.findIndex(p => p.id === specificPuzzleId);
      if (idx !== -1) startIndex = idx;
    }

    setPuzzleQueue(filtered);
    setCurrentPuzzleIndex(startIndex);
    setCurrentPuzzle(filtered[startIndex]);
  };

  // Record a solve attempt & adjust ELO rating
  const submitPuzzleSolve = async (puzzleId, solved, timeTaken, hintsUsed = 0) => {
    const puzzle = ALL_PUZZLES.find(p => p.id === puzzleId) || currentPuzzle;
    const pRating = puzzle ? puzzle.rating : 1200;

    // Calculate Elo adjustment
    const expected = 1.0 / (1.0 + Math.pow(10, (pRating - puzzleRating) / 400));
    const kFactor = 32;
    let ratingDelta = 0;

    if (solved) {
      const timeFactor = Math.max(0.7, 1.3 - (timeTaken / 30.0));
      let baseDelta = Math.round(kFactor * (1.0 - expected) * timeFactor);
      if (hintsUsed > 0) baseDelta = Math.max(3, baseDelta - (hintsUsed * 4));
      ratingDelta = Math.max(6, Math.min(32, baseDelta));

      const newRating = puzzleRating + ratingDelta;
      const newStreak = currentStreak + 1;
      setPuzzleRating(newRating);
      setCurrentStreak(newStreak);
      setHighestStreak(prev => Math.max(prev, newStreak));
      setTotalSolved(prev => prev + 1);
    } else {
      ratingDelta = Math.min(-6, Math.max(-28, Math.round(kFactor * (0.0 - expected))));
      setPuzzleRating(prev => Math.max(400, prev + ratingDelta));
      setCurrentStreak(0);
    }

    setTotalAttempted(prev => prev + 1);
    setTotalTimeSpent(prev => prev + timeTaken);

    // Add to history log
    const entry = {
      id: `${Date.now()}-${puzzleId}`,
      puzzleId,
      puzzleTitle: puzzle ? puzzle.title : 'Tactical Exercise',
      category: puzzle ? puzzle.category : 'all',
      difficulty: puzzle ? puzzle.difficulty : 'intermediate',
      mode: selectedMode,
      solved,
      timeTaken: parseFloat(timeTaken.toFixed(1)),
      ratingDelta,
      userRatingAfter: puzzleRating + ratingDelta,
      timestamp: new Date().toISOString()
    };

    setHistory(prev => [entry, ...prev]);

    // Async sync with FastAPI Backend if online
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      fetch(`${baseUrl}/api/puzzles/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzle_id: puzzleId,
          solved,
          time_taken_seconds: timeTaken,
          mode: selectedMode,
          user_id: user ? user.id : null,
          hints_used: hintsUsed
        })
      }).catch(() => {});
    } catch (_) {}

    return {
      solved,
      ratingDelta,
      newRating: puzzleRating + ratingDelta,
      currentStreak: solved ? currentStreak + 1 : 0
    };
  };

  const nextPuzzle = () => {
    const nextIdx = (currentPuzzleIndex + 1) % puzzleQueue.length;
    setCurrentPuzzleIndex(nextIdx);
    setCurrentPuzzle(puzzleQueue[nextIdx]);
  };

  const setSpecificPuzzle = (puzzle) => {
    setCurrentPuzzle(puzzle);
  };

  return (
    <TacticsContext.Provider
      value={{
        selectedMode,
        selectedCategory,
        puzzleQueue,
        currentPuzzleIndex,
        currentPuzzle,
        puzzleRating,
        currentStreak,
        highestStreak,
        totalAttempted,
        totalSolved,
        accuracyPct,
        avgSolveTime,
        history,
        startSession,
        submitPuzzleSolve,
        nextPuzzle,
        setSpecificPuzzle
      }}
    >
      {children}
    </TacticsContext.Provider>
  );
};

export const useTactics = () => {
  const context = useContext(TacticsContext);
  if (!context) {
    throw new Error('useTactics must be used within a TacticsProvider');
  }
  return context;
};
