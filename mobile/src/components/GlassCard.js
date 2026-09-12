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
    borderRadius: 5, // Small 4-5px round as explicitly requested
    padding: 16,
    overflow: 'hidden',
  },
  bubbleCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#242424', // High contrast royal border
    borderTopColor: '#383838', // Sharp platinum specular rim
    borderBottomColor: '#121212',
    // High contrast shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  topLightSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  glow: {
    borderColor: colors.gold,
    borderTopColor: '#FFEAA7',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  }
});

