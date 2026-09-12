import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { 
  BETA_CONFIG, 
  CHANGELOG_HISTORY, 
  AVATAR_OPTIONS, 
  PROFILE_FRAMES, 
  FAVORITE_OPENINGS 
} from '../data/betaData';
import { 
  submitBetaFeedback, 
  trackBetaEvent, 
  updateBetaNotificationPreferences 
} from '../services/api';

const BetaContext = createContext({});

export const BetaProvider = ({ children }) => {
  const { user } = useAuth();

  // 1. Beta Status & Founding Player
  const [isBeta] = useState(true);
  const [isFoundingPlayer] = useState(true);
  const [supporterTitle] = useState('Founding Beta Player');

  // Welcome modal state (auto-shows on first launch)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // 2. Customizations
  const [profileFrame, setProfileFrame] = useState('beta_founder');
  const [avatarId, setAvatarId] = useState('coach_orion');
  const [bio, setBio] = useState('Founding Beta Player exploring tactical pressure.');
  const [favoriteOpening, setFavoriteOpening] = useState('Sicilian Defense (1. e4 c5)');

  // 3. Notification Preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    dailyReminder: true,
    puzzleReminder: true,
    streakReminder: true,
    betaUpdates: true
  });

  // Load saved beta preferences from AsyncStorage on mount
  useEffect(() => {
    const loadBetaStorage = async () => {
      try {
        const welcomeSeen = await AsyncStorage.getItem('pressure_chess_beta_welcome_seen');
        if (!welcomeSeen) {
          setShowWelcomeModal(true);
        }

        const savedFrame = await AsyncStorage.getItem('pressure_chess_profile_frame');
        if (savedFrame) setProfileFrame(savedFrame);

        const savedAvatar = await AsyncStorage.getItem('pressure_chess_avatar_id');
        if (savedAvatar) setAvatarId(savedAvatar);

        const savedBio = await AsyncStorage.getItem('pressure_chess_bio');
        if (savedBio) setBio(savedBio);

        const savedOpening = await AsyncStorage.getItem('pressure_chess_fav_opening');
        if (savedOpening) setFavoriteOpening(savedOpening);

        const savedPrefs = await AsyncStorage.getItem('pressure_chess_notification_prefs');
        if (savedPrefs) setNotificationPreferences(JSON.parse(savedPrefs));

        // Cache indicators
        await AsyncStorage.setItem('pressure_chess_offline_lessons_cached', '17');
        await AsyncStorage.setItem('pressure_chess_offline_puzzles_cached', '20');
        await AsyncStorage.setItem('pressure_chess_offline_timestamp', new Date().toISOString());
      } catch (err) {
        console.warn('Error loading beta storage:', err);
      }
    };

    loadBetaStorage();
  }, []);

  const openWelcomeModal = () => setShowWelcomeModal(true);
  const closeWelcomeModal = async () => {
    setShowWelcomeModal(false);
    try {
      await AsyncStorage.setItem('pressure_chess_beta_welcome_seen', 'true');
    } catch (e) {}
  };

  const updateProfileFrame = async (frameId) => {
    setProfileFrame(frameId);
    try {
      await AsyncStorage.setItem('pressure_chess_profile_frame', frameId);
    } catch (e) {}
  };

  const updateAvatar = async (newAvatarId) => {
    setAvatarId(newAvatarId);
    try {
      await AsyncStorage.setItem('pressure_chess_avatar_id', newAvatarId);
    } catch (e) {}
  };

  const updateBio = async (newBio) => {
    setBio(newBio);
    try {
      await AsyncStorage.setItem('pressure_chess_bio', newBio);
    } catch (e) {}
  };

  const updateFavoriteOpening = async (openingName) => {
    setFavoriteOpening(openingName);
    try {
      await AsyncStorage.setItem('pressure_chess_fav_opening', openingName);
    } catch (e) {}
  };

  const updateNotificationPrefs = async (newPrefs) => {
    setNotificationPreferences(newPrefs);
    try {
      await AsyncStorage.setItem('pressure_chess_notification_prefs', JSON.stringify(newPrefs));
      updateBetaNotificationPreferences({
        user_id: user?.id,
        daily_reminder: newPrefs.dailyReminder,
        puzzle_reminder: newPrefs.puzzleReminder,
        streak_reminder: newPrefs.streakReminder,
        beta_updates: newPrefs.betaUpdates
      });
    } catch (e) {}
  };

  const submitFeedback = async (payload) => {
    const feedbackObj = {
      user_id: user?.id,
      username: user?.username || 'Mobile Tactician',
      feedback_type: payload.type || 'feature',
      rating: payload.rating || 5,
      category: payload.category || 'General',
      message: payload.message,
      device_info: {
        platform: 'mobile',
        timestamp: new Date().toISOString()
      }
    };

    const res = await submitBetaFeedback(feedbackObj);
    if (!res) {
      // Save locally if offline
      try {
        const existing = await AsyncStorage.getItem('pressure_chess_pending_feedback');
        const list = existing ? JSON.parse(existing) : [];
        list.push(feedbackObj);
        await AsyncStorage.setItem('pressure_chess_pending_feedback', JSON.stringify(list));
      } catch (e) {}
      return { status: 'success', message: 'Saved offline. Will sync with server.' };
    }
    return res;
  };

  const trackEvent = (eventName, properties = {}) => {
    trackBetaEvent({
      user_id: user?.id,
      event_name: eventName,
      event_properties: properties,
      platform: 'mobile'
    });
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
        profileFrame,
        updateProfileFrame,
        avatarId,
        updateAvatar,
        bio,
        updateBio,
        favoriteOpening,
        updateFavoriteOpening,
        notificationPreferences,
        updateNotificationPreferences: updateNotificationPrefs,
        submitFeedback,
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
