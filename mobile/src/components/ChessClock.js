import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { Play, Pause, RotateCcw } from 'lucide-react-native';

export const ChessClock = ({
  whiteTime = 600,
  blackTime = 600,
  activeTurn = 'w',
  isPaused = false,
  onTogglePause,
  onResetClock
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isWhiteActive = activeTurn === 'w' && !isPaused;
  const isBlackActive = activeTurn === 'b' && !isPaused;

  return (
    <View style={styles.container}>
      {/* White Clock */}
      <View style={[styles.clockBox, isWhiteActive && styles.activeBox]}>
        <View style={styles.headerRow}>
          <View style={styles.labelGroup}>
            <View style={[styles.colorDot, { backgroundColor: '#FFF' }]} />
            <Text style={styles.label}>White</Text>
          </View>
          {isWhiteActive && <Text style={styles.thinkingText}>ACTIVE</Text>}
        </View>
        <Text style={styles.timeText}>{formatTime(whiteTime)}</Text>
      </View>

      {/* Center Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={onTogglePause}>
          {isPaused ? (
            <Play size={16} color={colors.emerald} />
          ) : (
            <Pause size={16} color={colors.text} />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallResetBtn} onPress={onResetClock}>
          <RotateCcw size={12} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Black Clock */}
      <View style={[styles.clockBox, isBlackActive && styles.activeBox]}>
        <View style={styles.headerRow}>
          <View style={styles.labelGroup}>
            <View style={[styles.colorDot, { backgroundColor: '#0F172A', borderColor: '#475569', borderWidth: 1 }]} />
            <Text style={styles.label}>Black</Text>
          </View>
          {isBlackActive && <Text style={styles.thinkingText}>ACTIVE</Text>}
        </View>
        <Text style={styles.timeText}>{formatTime(blackTime)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    marginVertical: 8,
  },
  clockBox: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: colors.emerald,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  thinkingText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.emerald,
  },
  timeText: {
    fontSize: 22,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: colors.text,
  },
  controls: {
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4,
  },
  controlBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 8,
    borderRadius: 12,
  },
  smallResetBtn: {
    padding: 4,
  }
});
