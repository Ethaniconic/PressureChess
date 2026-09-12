import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACADEMY_MODULES, ACHIEVEMENTS, calculateLevel } from '../data/academyLessons';
import { fetchAcademyProgress, submitLessonCompletion } from '../services/api';
import { useAuth } from './AuthContext';

const AcademyContext = createContext({});

export const AcademyProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [modules] = useState(ACADEMY_MODULES);
  const [completedLessons, setCompletedLessons] = useState({});
  const [totalXp, setTotalXp] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from AsyncStorage on mount / user change
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [savedCompleted, savedXp, savedAch] = await Promise.all([
          AsyncStorage.getItem(`pc_academy_completed_${userId}`),
          AsyncStorage.getItem(`pc_academy_xp_${userId}`),
          AsyncStorage.getItem(`pc_academy_achievements_${userId}`),
        ]);

        if (isMounted) {
          if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));
          if (savedXp) setTotalXp(parseInt(savedXp, 10));
          if (savedAch) setUnlockedAchievements(JSON.parse(savedAch));
        }

        // Try backend sync
        const backendData = await fetchAcademyProgress(userId);
        if (backendData && isMounted) {
          if (backendData.completed_lessons) setCompletedLessons(backendData.completed_lessons);
          if (backendData.total_xp !== undefined) setTotalXp(backendData.total_xp);
          if (backendData.unlocked_achievements) setUnlockedAchievements(backendData.unlocked_achievements);
        }
      } catch (err) {
        console.warn('Error loading academy data from storage:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Persist helpers
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(`pc_academy_completed_${userId}`, JSON.stringify(completedLessons));
    }
  }, [completedLessons, userId, loading]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(`pc_academy_xp_${userId}`, String(totalXp));
    }
  }, [totalXp, userId, loading]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(`pc_academy_achievements_${userId}`, JSON.stringify(unlockedAchievements));
    }
  }, [unlockedAchievements, userId, loading]);

  const levelInfo = calculateLevel(totalXp);
  const totalStars = Object.values(completedLessons).reduce((acc, curr) => acc + (curr.stars || 0), 0);

  const isLessonCompleted = (lessonId) => Boolean(completedLessons[lessonId]);
  const getLessonStars = (lessonId) => completedLessons[lessonId]?.stars || 0;

  const markLessonComplete = async (lessonId, stars = 3, hintsUsed = 0, attempts = 1, xpEarned = 50) => {
    const isFirstTime = !completedLessons[lessonId];
    const prevStars = completedLessons[lessonId]?.stars || 0;

    const updated = {
      ...completedLessons,
      [lessonId]: {
        stars: Math.max(stars, prevStars),
        completed_at: new Date().toISOString()
      }
    };
    setCompletedLessons(updated);

    if (isFirstTime) {
      setTotalXp((prev) => prev + xpEarned);
    } else if (stars > prevStars) {
      setTotalXp((prev) => prev + 15);
    }

    // Check achievement milestones
    const updatedCount = Object.keys(updated).length;
    const newUnlocked = [...unlockedAchievements];

    if (updatedCount >= 1 && !newUnlocked.includes('first-lesson')) {
      newUnlocked.push('first-lesson');
      setTotalXp((prev) => prev + 100);
    }
    if (updatedCount >= 6 && !newUnlocked.includes('piece-master')) {
      newUnlocked.push('piece-master');
      setTotalXp((prev) => prev + 250);
    }
    if (updatedCount >= 12 && !newUnlocked.includes('scholar-grad')) {
      newUnlocked.push('scholar-grad');
      setTotalXp((prev) => prev + 500);
    }
    setUnlockedAchievements(newUnlocked);

    // Sync to backend asynchronously
    submitLessonCompletion({
      user_id: userId,
      lesson_id: lessonId,
      stars,
      hints_used: hintsUsed,
      attempts,
      xp_earned: xpEarned
    });
  };

  return (
    <AcademyContext.Provider
      value={{
        modules,
        completedLessons,
        totalXp,
        levelInfo,
        totalStars,
        unlockedAchievements,
        selectedLesson,
        setSelectedLesson,
        markLessonComplete,
        isLessonCompleted,
        getLessonStars,
        achievements: ACHIEVEMENTS,
        loading
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => useContext(AcademyContext);
