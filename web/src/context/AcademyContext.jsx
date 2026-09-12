import React, { createContext, useContext, useState, useEffect } from 'react';
import { ACADEMY_MODULES, ACHIEVEMENTS, calculateLevel } from '../data/academyLessons';
import { fetchAcademyProgress, submitCompletedLesson, fetchAchievements } from '../services/api';
import { useAuth } from './AuthContext';

const AcademyContext = createContext({});

export const AcademyProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [modules] = useState(ACADEMY_MODULES);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem(`pc_academy_completed_${userId}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [totalXp, setTotalXp] = useState(() => {
    try {
      const saved = localStorage.getItem(`pc_academy_xp_${userId}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem(`pc_academy_achievements_${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [selectedLesson, setSelectedLesson] = useState(null);

  // Sync with backend on mount or user change
  useEffect(() => {
    fetchAcademyProgress(userId).then((res) => {
      if (res) {
        if (res.completed_lessons) setCompletedLessons(res.completed_lessons);
        if (res.total_xp !== undefined) setTotalXp(res.total_xp);
        if (res.unlocked_achievements) setUnlockedAchievements(res.unlocked_achievements);
      }
    });
  }, [userId]);

  // Persist state locally
  useEffect(() => {
    localStorage.setItem(`pc_academy_completed_${userId}`, JSON.stringify(completedLessons));
  }, [completedLessons, userId]);

  useEffect(() => {
    localStorage.setItem(`pc_academy_xp_${userId}`, String(totalXp));
  }, [totalXp, userId]);

  useEffect(() => {
    localStorage.setItem(`pc_academy_achievements_${userId}`, JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements, userId]);

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
      // Small bonus for improving rating
      setTotalXp((prev) => prev + 15);
    }

    // Check achievement conditions
    const updatedCompletedCount = Object.keys(updated).length;
    const newUnlocked = [...unlockedAchievements];

    if (updatedCompletedCount >= 1 && !newUnlocked.includes('first-lesson')) {
      newUnlocked.push('first-lesson');
      setTotalXp((prev) => prev + 100);
    }
    if (updatedCompletedCount >= 6 && !newUnlocked.includes('piece-master')) {
      newUnlocked.push('piece-master');
      setTotalXp((prev) => prev + 250);
    }
    if (updatedCompletedCount >= 12 && !newUnlocked.includes('scholar-grad')) {
      newUnlocked.push('scholar-grad');
      setTotalXp((prev) => prev + 500);
    }
    setUnlockedAchievements(newUnlocked);

    // Sync with backend
    submitCompletedLesson({
      user_id: userId,
      lesson_id: lessonId,
      stars,
      hints_used: hintsUsed,
      attempts,
      xp_earned: xpEarned
    });
  };

  return (
    <AcademyContext.Provider value={{
      modules,
      completedLessons,
      totalXp,
      levelInfo,
      totalStars,
      unlockedAchievements,
      selectedLesson,
      setSelectedLesson,
      isLessonCompleted,
      getLessonStars,
      markLessonComplete
    }}>
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => useContext(AcademyContext);
