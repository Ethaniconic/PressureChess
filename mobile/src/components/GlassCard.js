import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export const GlassCard = ({ children, style, onPress, glow = false, variant = 'bubble' }) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      activeOpacity={0.82}
      style={[
        styles.cardBase,
        styles.bubbleCard,
        glow && styles.glow,
        style
      ]}
    >
      {/* iOS Specular Top Reflection / Light Sheen */}
      <View pointerEvents="none" style={styles.topLightSheen} />
      
      {/* Content */}
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  cardBase: {
    position: 'relative',
    borderRadius: 14, // Minimal, clean rounded corners
    padding: 16,
    overflow: 'hidden',
  },
  bubbleCard: {
    backgroundColor: colors.cardBubble,
    borderWidth: 1,
    borderColor: 'rgba(255, 245, 235, 0.11)',
    borderTopColor: 'rgba(255, 255, 255, 0.28)', // Subtle warm specular reflection rim
    borderBottomColor: 'rgba(0, 0, 0, 0.20)',
    // Smooth depth shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  topLightSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  glow: {
    borderColor: 'rgba(45, 212, 191, 0.40)',
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  }
});

