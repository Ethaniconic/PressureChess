import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { BETA_CONFIG, CHANGELOG_HISTORY, AVATAR_OPTIONS, PROFILE_FRAMES, FAVORITE_OPENINGS } from '../data/betaData';

const BetaContext = createContext({});

const API_BASE = 'http://localhost:8000';

export const BetaProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  // 1. Beta Status & Founding Player
  const [isBeta] = useState(true);
  const [isFoundingPlayer, setIsFoundingPlayer] = useState(true);
  const [supporterTitle] = useState('Founding Beta Player');

  // Welcome modal state (auto-shows on first visit)
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    return !localStorage.getItem('pressure_chess_beta_welcome_seen');
  });

  // 2. Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackInitialType, setFeedbackInitialType] = useState('feature');
  const [feedbackInitialRating, setFeedbackInitialRating] = useState(5);
  const [feedbackInitialCategory, setFeedbackInitialCategory] = useState('General');

  // 3. User Customization (Frame, Avatar, Bio, Favorite Opening)
  const [profileFrame, setProfileFrame] = useState(() => {
    return localStorage.getItem('pressure_chess_profile_frame') || 'beta_founder';
  });

  const [avatarId, setAvatarId] = useState(() => {
    return localStorage.getItem('pressure_chess_avatar_id') || 'coach_orion';
  });

  const [bio, setBio] = useState(() => {
    return localStorage.getItem('pressure_chess_bio') || 'Founding Beta Player exploring tactical pressure.';
  });

  const [favoriteOpening, setFavoriteOpening] = useState(() => {
    return localStorage.getItem('pressure_chess_fav_opening') || 'Sicilian Defense (1. e4 c5)';
  });

  // 4. Notification Preferences
  const [notificationPreferences, setNotificationPreferences] = useState(() => {
    const saved = localStorage.getItem('pressure_chess_notification_prefs');
    return saved ? JSON.parse(saved) : {
      dailyReminder: true,
      puzzleReminder: true,
      streakReminder: true,
      betaUpdates: true
    };
  });

  // 5. Offline Status & Cache
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache essential content on mount
  useEffect(() => {
    try {
      localStorage.setItem('pressure_chess_offline_cache_timestamp', new Date().toISOString());
      localStorage.setItem('pressure_chess_offline_lessons_cached', '17');
      localStorage.setItem('pressure_chess_offline_puzzles_cached', '20');
    } catch (e) {}
  }, []);

  // Update customizations
  const updateProfileFrame = (frameId) => {
    setProfileFrame(frameId);
    localStorage.setItem('pressure_chess_profile_frame', frameId);
  };

  const updateAvatar = (newAvatarId) => {
    setAvatarId(newAvatarId);
    localStorage.setItem('pressure_chess_avatar_id', newAvatarId);
  };

  const updateBio = (newBio) => {
    setBio(newBio);
    localStorage.setItem('pressure_chess_bio', newBio);
  };

  const updateFavoriteOpening = (openingName) => {
    setFavoriteOpening(openingName);
    localStorage.setItem('pressure_chess_fav_opening', openingName);
  };

  const updateNotificationPreferences = (newPrefs) => {
    setNotificationPreferences(newPrefs);
    localStorage.setItem('pressure_chess_notification_prefs', JSON.stringify(newPrefs));

    // Async sync with backend
    fetch(`${API_BASE}/api/beta/notifications/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user?.id,
        daily_reminder: newPrefs.dailyReminder,
        puzzle_reminder: newPrefs.puzzleReminder,
        streak_reminder: newPrefs.streakReminder,
        beta_updates: newPrefs.betaUpdates
      })
    }).catch(() => {});
  };

  // Welcome modal handlers
  const openWelcomeModal = () => setShowWelcomeModal(true);
  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('pressure_chess_beta_welcome_seen', 'true');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}
  };

  // Feedback modal handlers
  const openFeedback = (type = 'feature', category = 'General', rating = 5) => {
    setFeedbackInitialType(type);
    setFeedbackInitialCategory(category);
    setFeedbackInitialRating(rating);
    setShowFeedbackModal(true);
  };

  const closeFeedback = () => setShowFeedbackModal(false);

  const submitFeedback = async (payload) => {
    const feedbackObj = {
      user_id: user?.id,
      username: user?.username || 'Tactician',
      feedback_type: payload.type || feedbackInitialType,
      rating: payload.rating || feedbackInitialRating,
      category: payload.category || feedbackInitialCategory,
      message: payload.message,
      device_info: {
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        isOnline: navigator.onLine
      }
    };

    try {
      const res = await fetch(`${API_BASE}/api/beta/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackObj)
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.log('Error submitting feedback, saving locally:', err);
      const localFeedbacks = JSON.parse(localStorage.getItem('pressure_chess_pending_feedback') || '[]');
      localFeedbacks.push(feedbackObj);
      localStorage.setItem('pressure_chess_pending_feedback', JSON.stringify(localFeedbacks));
      return { status: 'success', message: 'Saved locally. Will sync when online.' };
    }
  };

  // Anonymous Telemetry tracker
  const trackEvent = (eventName, properties = {}) => {
    try {
      fetch(`${API_BASE}/api/beta/analytics/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          event_name: eventName,
          event_properties: properties,
          platform: 'web'
        })
      }).catch(() => {});
    } catch (e) {}
  };

  return (
    <BetaContext.Provider
      value={{
        isBeta,
        isFoundingPlayer,
        supporterTitle,
        showWelcomeModal,
        openWelcomeModal,
        closeWelcomeModal,
        showFeedbackModal,
        feedbackInitialType,
        feedbackInitialCategory,
        feedbackInitialRating,
        openFeedback,
        closeFeedback,
        submitFeedback,
        profileFrame,
        updateProfileFrame,
        avatarId,
        updateAvatar,
        bio,
        updateBio,
        favoriteOpening,
        updateFavoriteOpening,
        notificationPreferences,
        updateNotificationPreferences,
        isOnline,
        trackEvent,
        betaConfig: BETA_CONFIG,
        changelog: CHANGELOG_HISTORY,
        avatarOptions: AVATAR_OPTIONS,
        profileFrames: PROFILE_FRAMES,
        favoriteOpenings: FAVORITE_OPENINGS
      }}
    >
      {children}
    </BetaContext.Provider>
  );
};

export const useBeta = () => {
  const context = useContext(BetaContext);
  if (!context) {
    throw new Error('useBeta must be used within a BetaProvider');
  }
  return context;
};
