import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext({});

export const SettingsProvider = ({ children }) => {
  const [boardTheme, setBoardTheme] = useState('emerald');
  const [pieceStyle, setPieceStyle] = useState('neo');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const theme = await AsyncStorage.getItem('pc_board_theme');
        if (theme) setBoardTheme(theme);
        const style = await AsyncStorage.getItem('pc_piece_style');
        if (style) setPieceStyle(style);
        const sound = await AsyncStorage.getItem('pc_sound');
        if (sound !== null) setSoundEnabled(sound === 'true');
        const anim = await AsyncStorage.getItem('pc_anim');
        if (anim !== null) setAnimationEnabled(anim === 'true');
        const coords = await AsyncStorage.getItem('pc_coords');
        if (coords !== null) setShowCoordinates(coords === 'true');
      } catch (e) {}
    }
    loadSettings();
  }, []);

  const updateBoardTheme = async (val) => {
    setBoardTheme(val);
    await AsyncStorage.setItem('pc_board_theme', val);
  };

  const updatePieceStyle = async (val) => {
    setPieceStyle(val);
    await AsyncStorage.setItem('pc_piece_style', val);
  };

  const updateSound = async (val) => {
    setSoundEnabled(val);
    await AsyncStorage.setItem('pc_sound', String(val));
  };

  const updateAnim = async (val) => {
    setAnimationEnabled(val);
    await AsyncStorage.setItem('pc_anim', String(val));
  };

  const updateCoords = async (val) => {
    setShowCoordinates(val);
    await AsyncStorage.setItem('pc_coords', String(val));
  };

  const toggleFlip = () => setIsFlipped(prev => !prev);

  return (
    <SettingsContext.Provider value={{
      boardTheme,
      setBoardTheme: updateBoardTheme,
      pieceStyle,
      setPieceStyle: updatePieceStyle,
      soundEnabled,
      setSoundEnabled: updateSound,
      animationEnabled,
      setAnimationEnabled: updateAnim,
      showCoordinates,
      setShowCoordinates: updateCoords,
      isFlipped,
      setIsFlipped,
      toggleFlip
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
