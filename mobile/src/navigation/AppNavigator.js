import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { HomeScreen } from '../screens/HomeScreen';
import { OfflineGameScreen } from '../screens/OfflineGameScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AcademyCoursesScreen } from '../screens/AcademyCoursesScreen';
import { LessonPlayerScreen } from '../screens/LessonPlayerScreen';
import { PressureTrainerScreen } from '../screens/PressureTrainerScreen';
import { PuzzlePlayerScreen } from '../screens/PuzzlePlayerScreen';
import { TacticsStatsScreen } from '../screens/TacticsStatsScreen';
import { GameReviewScreen } from '../screens/GameReviewScreen';
import { ReviewDashboardScreen } from '../screens/ReviewDashboardScreen';
import { MultiplayerLobbyScreen } from '../screens/MultiplayerLobbyScreen';
import { MultiplayerGameScreen } from '../screens/MultiplayerGameScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { FeedbackScreen } from '../screens/FeedbackScreen';
import { ChangelogScreen } from '../screens/ChangelogScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.cyan || '#00E5FF',
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.gold,
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MultiplayerLobby" component={MultiplayerLobbyScreen} />
            <Stack.Screen name="MultiplayerGame" component={MultiplayerGameScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Stack.Screen name="AcademyCourses" component={AcademyCoursesScreen} />
            <Stack.Screen name="LessonPlayer" component={LessonPlayerScreen} />
            <Stack.Screen name="PressureTrainer" component={PressureTrainerScreen} />
            <Stack.Screen name="PuzzlePlayer" component={PuzzlePlayerScreen} />
            <Stack.Screen name="TacticsStats" component={TacticsStatsScreen} />
            <Stack.Screen name="GameReview" component={GameReviewScreen} />
            <Stack.Screen name="ReviewDashboard" component={ReviewDashboardScreen} />
            <Stack.Screen name="Progress" component={ProgressScreen} />
            <Stack.Screen name="Achievements" component={AchievementsScreen} />
            <Stack.Screen name="OfflineGame" component={OfflineGameScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
            <Stack.Screen name="Changelog" component={ChangelogScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
