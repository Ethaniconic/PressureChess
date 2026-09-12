import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { 
  Home, 
  Swords, 
  GraduationCap, 
  Zap, 
  User 
} from 'lucide-react-native';

export const FloatingBottomBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const currentRouteName = route.name;

  const tabs = [
    { name: 'Home', label: 'Home', icon: Home, route: 'Home' },
    { name: 'MultiplayerLobby', label: 'Play', icon: Swords, route: 'MultiplayerLobby' },
    { name: 'AcademyCourses', label: 'Academy', icon: GraduationCap, route: 'AcademyCourses' },
    { name: 'PressureTrainer', label: 'Pressure', icon: Zap, route: 'PressureTrainer' },
    { name: 'Profile', label: 'Profile', icon: User, route: 'Profile' },
  ];

  return (
    <View pointerEvents="box-none" style={styles.outerContainer}>
      <View style={styles.bubbleDock}>
        {/* iOS Top Specular Highlight */}
        <View pointerEvents="none" style={styles.dockSpecularHighlight} />

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentRouteName === tab.route || 
            (tab.route === 'MultiplayerLobby' && currentRouteName === 'MultiplayerGame') ||
            (tab.route === 'AcademyCourses' && currentRouteName === 'LessonPlayer');

          return (
            <TouchableOpacity
              key={tab.name}
              style={[styles.tabItem, isActive && styles.activeTabBubble]}
              onPress={() => navigation.navigate(tab.route)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                <Icon 
                  size={19} 
                  color={isActive ? '#00E5FF' : colors.textSecondary} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </View>
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]} numberOfLines={1}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  bubbleDock: {
    width: '94%',
    maxWidth: 420,
    height: 60,
    backgroundColor: 'rgba(32, 35, 45, 0.94)',
    borderRadius: 16, // Clean, minimal rounded corners
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 245, 235, 0.12)',
    borderTopColor: 'rgba(255, 255, 255, 0.35)', // Subtle specular top light rim
    // Smooth ambient shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 14,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  dockSpecularHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '38%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: 12,
  },
  activeTabBubble: {
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(45, 212, 191, 0.30)',
  },
  iconContainer: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  activeIconContainer: {
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.2,
  },
  activeTabLabel: {
    color: colors.cyan,
    fontWeight: '900',
  },
});

