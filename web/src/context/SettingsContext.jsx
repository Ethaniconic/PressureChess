import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext({});

export const SettingsProvider = ({ children }) => {
  const [boardTheme, setBoardTheme] = useState(() => localStorage.getItem('pc_board_theme') || 'emerald');
  const [pieceStyle, setPieceStyle] = useState(() => localStorage.getItem('pc_piece_style') || 'neo');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('pc_sound') !== 'false');
  const [animationEnabled, setAnimationEnabled] = useState(() => localStorage.getItem('pc_anim') !== 'false');
  const [showCoordinates, setShowCoordinates] = useState(() => localStorage.getItem('pc_coords') !== 'false');
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    localStorage.setItem('pc_board_theme', boardTheme);
  }, [boardTheme]);

  useEffect(() => {
    localStorage.setItem('pc_piece_style', pieceStyle);
  }, [pieceStyle]);

  useEffect(() => {
    localStorage.setItem('pc_sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('pc_anim', String(animationEnabled));
  }, [animationEnabled]);

  useEffect(() => {
    localStorage.setItem('pc_coords', String(showCoordinates));
  }, [showCoordinates]);

  const toggleFlip = () => setIsFlipped(prev => !prev);

  return (
    <SettingsContext.Provider value={{
      boardTheme,
      setBoardTheme,
      pieceStyle,
      setPieceStyle,
      soundEnabled,
      setSoundEnabled,
      animationEnabled,
      setAnimationEnabled,
      showCoordinates,
      setShowCoordinates,
      isFlipped,
      setIsFlipped,
      toggleFlip
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
