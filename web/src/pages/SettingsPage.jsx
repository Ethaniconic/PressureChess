import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { GlassCard } from '../components/GlassCard';
import { ChessPiece } from '../utils/chessPieces';
import { 
  Palette, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Eye, 
  Check, 
  Sliders
} from 'lucide-react';

export const SettingsPage = () => {
  const {
    boardTheme,
    setBoardTheme,
    pieceStyle,
    setPieceStyle,
    soundEnabled,
    setSoundEnabled,
    animationEnabled,
    setAnimationEnabled,
    showCoordinates,
    setShowCoordinates
  } = useSettings();

  const themes = [
    { id: 'emerald', name: 'Emerald Forest', light: '#e2e8f0', dark: '#059669' },
    { id: 'midnight', name: 'Midnight Obsidian', light: '#334155', dark: '#0f172a' },
    { id: 'wood', name: 'Grandmaster Wood', light: '#f0d9b5', dark: '#b58863' },
    { id: 'gold', name: 'Golden Pressure', light: '#fef3c7', dark: '#b45309' },
  ];

  const pieceStyles = [
    { id: 'neo', name: 'Neo Modern' },
    { id: 'classic', name: 'Staunton Classic' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
          <Sliders className="w-7 h-7 text-gold-400" />
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize your board colors, piece set, audio feedback, and animations
        </p>
      </div>

      {/* Live Preview Box */}
      <GlassCard className="p-6">
        <div className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4" /> Live Board Preview
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className={`w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-2 border-dark-700 theme-${boardTheme} shrink-0`}>
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
              <div className="sq-light flex items-center justify-center p-2">
                <ChessPiece type="k" color="w" style={pieceStyle} className="w-12 h-12" />
              </div>
              <div className="sq-dark flex items-center justify-center p-2">
                <ChessPiece type="q" color="b" style={pieceStyle} className="w-12 h-12" />
              </div>
              <div className="sq-dark flex items-center justify-center p-2">
                <ChessPiece type="n" color="w" style={pieceStyle} className="w-12 h-12" />
              </div>
              <div className="sq-light flex items-center justify-center p-2">
                <ChessPiece type="r" color="b" style={pieceStyle} className="w-12 h-12" />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Current Setup</h4>
            <div className="text-xs text-slate-300">
              <span className="text-slate-400">Board: </span>
              <span className="font-semibold text-emerald-400 capitalize">{boardTheme}</span>
            </div>
            <div className="text-xs text-slate-300">
              <span className="text-slate-400">Pieces: </span>
              <span className="font-semibold text-gold-400 capitalize">{pieceStyle}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Changes apply instantly to your offline games and future match sessions.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Board Color Theme Selector */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-white text-base">Board Theme</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {themes.map((t) => {
            const isSelected = boardTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setBoardTheme(t.id)}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected 
                    ? 'border-gold-400 bg-gold-500/10 shadow-glow-gold' 
                    : 'border-white/10 bg-dark-800/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 flex shrink-0">
                    <div className="w-1/2 h-full" style={{ backgroundColor: t.light }} />
                    <div className="w-1/2 h-full" style={{ backgroundColor: t.dark }} />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{t.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-gold-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Piece Style Selector */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="font-bold text-white text-base">Piece Style</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pieceStyles.map((ps) => {
            const isSelected = pieceStyle === ps.id;
            return (
              <button
                key={ps.id}
                onClick={() => setPieceStyle(ps.id)}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  isSelected 
                    ? 'border-gold-400 bg-gold-500/10 shadow-glow-gold' 
                    : 'border-white/10 bg-dark-800/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <ChessPiece type="k" color="w" style={ps.id} className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{ps.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-gold-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Toggles (Sound, Animations, Coordinates) */}
      <GlassCard className="p-6 space-y-5">
        <h3 className="font-bold text-white text-base">Audio & Controls</h3>

        {/* Sound Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-500" />
            )}
            <div>
              <div className="text-sm font-semibold text-white">Sound Effects</div>
              <div className="text-xs text-slate-400">Play clicks on moves, captures, checks, and game over</div>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              soundEnabled ? 'bg-emerald-600' : 'bg-dark-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
              soundEnabled ? 'right-0.5' : 'left-0.5'
            }`} />
          </button>
        </div>

        {/* Animation Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <div>
              <div className="text-sm font-semibold text-white">Piece Animations</div>
              <div className="text-xs text-slate-400">Smooth piece hover transitions and checkmate celebrations</div>
            </div>
          </div>
          <button
            onClick={() => setAnimationEnabled(!animationEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              animationEnabled ? 'bg-emerald-600' : 'bg-dark-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
              animationEnabled ? 'right-0.5' : 'left-0.5'
            }`} />
          </button>
        </div>

        {/* Coordinates Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm font-semibold text-white">Board Coordinates</div>
              <div className="text-xs text-slate-400">Show A-H and 1-8 rank and file indicators</div>
            </div>
          </div>
          <button
            onClick={() => setShowCoordinates(!showCoordinates)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              showCoordinates ? 'bg-emerald-600' : 'bg-dark-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
              showCoordinates ? 'right-0.5' : 'left-0.5'
            }`} />
          </button>
        </div>

      </GlassCard>

    </div>
  );
};
