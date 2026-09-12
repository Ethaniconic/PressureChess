import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALL_PUZZLES, CHAMPIONSHIP_SCENARIOS, PUZZLE_MODES, PUZZLE_CATEGORIES } from '../data/puzzlesData';
import { useAuth } from './AuthContext';

const TacticsContext = createContext({});

export const TacticsProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  // State
  const [selectedMode, setSelectedMode] = useState('20s');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [puzzleQueue, setPuzzleQueue] = useState(ALL_PUZZLES);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(ALL_PUZZLES[0]);

  // Statistics
  const [puzzleRating, setPuzzleRating] = useState(1200);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0.0);
  const [history, setHistory] = useState([]);

  // Load from AsyncStorage
  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const [savedRating, savedStreak, savedHighest, savedAttempted, savedSolved, savedTime, savedHistory] = await Promise.all([
          AsyncStorage.getItem(`pc_puzzle_rating_${userId}`),
          AsyncStorage.getItem(`pc_puzzle_streak_${userId}`),
          AsyncStorage.getItem(`pc_puzzle_highest_streak_${userId}`),
          AsyncStorage.getItem(`pc_puzzle_attempted_${userId}`),
          AsyncStorage.getItem(`pc_puzzle_solved_${userId}`),
          AsyncStorage.getItem(`pc_puzzle_time_spent_${userId}`),
          AsyncStorage.getItem(`pc_puzzle_history_${userId}`),
        ]);

        if (isMounted) {
          if (savedRating) setPuzzleRating(parseInt(savedRating, 10));
          if (savedStreak) setCurrentStreak(parseInt(savedStreak, 10));
          if (savedHighest) setHighestStreak(parseInt(savedHighest, 10));
          if (savedAttempted) setTotalAttempted(parseInt(savedAttempted, 10));
          if (savedSolved) setTotalSolved(parseInt(savedSolved, 10));
          if (savedTime) setTotalTimeSpent(parseFloat(savedTime));
          if (savedHistory) setHistory(JSON.parse(savedHistory));
        }
      } catch (err) {
        console.warn('Error loading puzzle stats from storage:', err);
      }
    }

    loadStats();
    return () => { isMounted = false; };
  }, [userId]);

  // Save to AsyncStorage
  const persistStats = async (newRating, newStreak, newHighest, newAttempted, newSolved, newTime, newHistory) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(`pc_puzzle_rating_${userId}`, newRating.toString()),
        AsyncStorage.setItem(`pc_puzzle_streak_${userId}`, newStreak.toString()),
        AsyncStorage.setItem(`pc_puzzle_highest_streak_${userId}`, newHighest.toString()),
        AsyncStorage.setItem(`pc_puzzle_attempted_${userId}`, newAttempted.toString()),
        AsyncStorage.setItem(`pc_puzzle_solved_${userId}`, newSolved.toString()),
        AsyncStorage.setItem(`pc_puzzle_time_spent_${userId}`, newTime.toString()),
        AsyncStorage.setItem(`pc_puzzle_history_${userId}`, JSON.stringify(newHistory.slice(0, 30))),
      ]);
    } catch (err) {
      console.warn('Error persisting puzzle stats:', err);
    }
  };

  const startSession = (modeId = '20s', categoryId = 'all', specificPuzzleId = null) => {
    setSelectedMode(modeId);
    setSelectedCategory(categoryId);

    let filtered = [...ALL_PUZZLES];
    if (modeId === 'championship') {
      filtered = [...CHAMPIONSHIP_SCENARIOS];
    } else if (categoryId && categoryId !== 'all') {
      filtered = ALL_PUZZLES.filter(p => p.category === categoryId);
    }

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

  const submitPuzzleSolve = async (puzzleId, solved, timeTaken, hintsUsed = 0) => {
    const puzzle = ALL_PUZZLES.find(p => p.id === puzzleId) || currentPuzzle;
    const pRating = puzzle ? puzzle.rating : 1200;

    const expected = 1.0 / (1.0 + Math.pow(10, (pRating - puzzleRating) / 400));
    const kFactor = 32;
    let ratingDelta = 0;

    let newRating = puzzleRating;
    let newStreak = currentStreak;
    let newHighest = highestStreak;
    let newSolved = totalSolved;
    let newAttempted = totalAttempted + 1;
    let newTime = totalTimeSpent + timeTaken;

    if (solved) {
      const timeFactor = Math.max(0.7, 1.3 - (timeTaken / 30.0));
      let baseDelta = Math.round(kFactor * (1.0 - expected) * timeFactor);
      if (hintsUsed > 0) baseDelta = Math.max(3, baseDelta - (hintsUsed * 4));
      ratingDelta = Math.max(6, Math.min(32, baseDelta));

      newRating = puzzleRating + ratingDelta;
      newStreak = currentStreak + 1;
      newHighest = Math.max(highestStreak, newStreak);
      newSolved = totalSolved + 1;
    } else {
      ratingDelta = Math.min(-6, Math.max(-28, Math.round(kFactor * (0.0 - expected))));
      newRating = Math.max(400, puzzleRating + ratingDelta);
      newStreak = 0;
    }

    setPuzzleRating(newRating);
    setCurrentStreak(newStreak);
    setHighestStreak(newHighest);
    setTotalAttempted(newAttempted);
    setTotalSolved(newSolved);
    setTotalTimeSpent(newTime);

    const newHistoryEntry = {
      id: `${Date.now()}-${puzzleId}`,
      puzzleId,
      puzzleTitle: puzzle ? puzzle.title : 'Tactical Exercise',
      category: puzzle ? puzzle.category : 'all',
      difficulty: puzzle ? puzzle.difficulty : 'intermediate',
      mode: selectedMode,
      solved,
      timeTaken: parseFloat(timeTaken.toFixed(1)),
      ratingDelta,
      userRatingAfter: newRating,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [newHistoryEntry, ...history];
    setHistory(updatedHistory);

    persistStats(newRating, newStreak, newHighest, newAttempted, newSolved, newTime, updatedHistory);

    return {
      solved,
      ratingDelta,
      newRating,
      currentStreak: newStreak
    };
  };

  const nextPuzzle = () => {
    const nextIdx = (currentPuzzleIndex + 1) % puzzleQueue.length;
    setCurrentPuzzleIndex(nextIdx);
    setCurrentPuzzle(puzzleQueue[nextIdx]);
  };

  const accuracyPct = totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0;
  const avgSolveTime = totalAttempted > 0 ? (totalTimeSpent / totalAttempted).toFixed(1) : '0.0';

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
        setCurrentPuzzle
      }}
    >
      {children}
    </TacticsContext.Provider>
  );
};

export const useTactics = () => useContext(TacticsContext);
