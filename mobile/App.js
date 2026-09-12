import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { AcademyProvider } from './src/context/AcademyContext';
import { TacticsProvider } from './src/context/TacticsContext';
import { AnalysisProvider } from './src/context/AnalysisContext';
import { MultiplayerProvider } from './src/context/MultiplayerContext';
import { BetaProvider } from './src/context/BetaContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SettingsProvider>
          <AcademyProvider>
            <TacticsProvider>
              <AnalysisProvider>
                <MultiplayerProvider>
                  <BetaProvider>
                    <StatusBar style="light" />
                    <AppNavigator />
                  </BetaProvider>
                </MultiplayerProvider>
              </AnalysisProvider>
            </TacticsProvider>
          </AcademyProvider>
        </SettingsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
