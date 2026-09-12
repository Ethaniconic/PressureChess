import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
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
  const currentRouteName = useNavigationState((state) => {
    if (!state || !state.routes || state.routes.length === 0) return 'Home';
    let r = state.routes[state.index ?? 0];
    while (r && r.state && r.state.routes) {
      r = r.state.routes[r.state.index ?? 0];
    }
    return r ? r.name : 'Home';
  });

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
                  color={isActive ? '#E5A93C' : colors.textSecondary} 
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
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  bubbleDock: {
    width: '96%',
    maxWidth: 440,
    height: 56,
    backgroundColor: '#0F0F0F',
    borderRadius: 5, // Small 4-5px round
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#242424',
    borderTopColor: '#383838', // High contrast platinum rim
    // Sharp royal shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  dockSpecularHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeTabBubble: {
    backgroundColor: '#1C1A14',
    borderWidth: 1,
    borderTopColor: '#E5A93C',
    borderColor: 'rgba(229, 169, 60, 0.4)',
  },
  iconContainer: {
    width: 24,
    height: 24,
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
    color: '#8E8E93',
    letterSpacing: 0.2,
  },
  activeTabLabel: {
    color: '#E5A93C',
    fontWeight: '900',
  },
});

