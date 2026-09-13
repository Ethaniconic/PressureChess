import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { AcademyProvider } from './context/AcademyContext';
import { TacticsProvider } from './context/TacticsContext';
import { AnalysisProvider } from './context/AnalysisContext';
import { MultiplayerProvider } from './context/MultiplayerContext';
import { BetaProvider } from './context/BetaContext';
import { Navbar } from './components/Navbar';
import { BetaWelcomeModal } from './components/BetaWelcomeModal';
import { FeedbackModal } from './components/FeedbackModal';
import { HomePage } from './pages/HomePage';
import { OfflineGamePage } from './pages/OfflineGamePage';
import { AcademyCoursesPage } from './pages/AcademyCoursesPage';
import { LessonPlayerPage } from './pages/LessonPlayerPage';
import { PressureTrainerPage } from './pages/PressureTrainerPage';
import { PuzzlePlayerPage } from './pages/PuzzlePlayerPage';
import { TacticsStatsPage } from './pages/TacticsStatsPage';
import { GameReviewPage } from './pages/GameReviewPage';
import { ReviewDashboardPage } from './pages/ReviewDashboardPage';
import { MultiplayerLobbyPage } from './pages/MultiplayerLobbyPage';
import { MultiplayerGamePage } from './pages/MultiplayerGamePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProgressPage } from './pages/ProgressPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { ChangelogPage } from './pages/ChangelogPage';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('home');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-950 text-white space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-600/20 flex items-center justify-center text-3xl animate-bounce border border-cyan-500/30">
          ⚡
        </div>
        <div className="text-sm font-bold text-slate-300">Initializing PressureChess...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar currentTab={currentTab} onNavigate={setCurrentTab} />
      
      {/* Phase 5 Beta Modals */}
      <BetaWelcomeModal onNavigate={setCurrentTab} />
      <FeedbackModal />

      <main className="flex-1 pb-16">
        {currentTab === 'home' && <HomePage onNavigate={setCurrentTab} />}
        {currentTab === 'multiplayer' && <MultiplayerLobbyPage onNavigate={setCurrentTab} />}
        {currentTab === 'multiplayer-game' && <MultiplayerGamePage onNavigate={setCurrentTab} />}
        {currentTab === 'leaderboard' && <LeaderboardPage onNavigate={setCurrentTab} />}
        {currentTab === 'academy' && <AcademyCoursesPage onNavigate={setCurrentTab} />}
        {currentTab === 'lesson-player' && <LessonPlayerPage onNavigate={setCurrentTab} />}
        {currentTab === 'pressure-trainer' && <PressureTrainerPage onNavigate={setCurrentTab} />}
        {currentTab === 'puzzle-player' && <PuzzlePlayerPage onNavigate={setCurrentTab} />}
        {currentTab === 'tactics-stats' && <TacticsStatsPage onNavigate={setCurrentTab} />}
        {currentTab === 'game-review' && <GameReviewPage onNavigate={setCurrentTab} />}
        {currentTab === 'review-dashboard' && <ReviewDashboardPage onNavigate={setCurrentTab} />}
        {currentTab === 'changelog' && <ChangelogPage onNavigate={setCurrentTab} />}
        {currentTab === 'progress' && <ProgressPage onNavigate={setCurrentTab} />}
        {currentTab === 'achievements' && <AchievementsPage onNavigate={setCurrentTab} />}
        {currentTab === 'play' && <OfflineGamePage onNavigate={setCurrentTab} />}
        {currentTab === 'login' && <LoginPage onNavigate={setCurrentTab} />}
        {currentTab === 'signup' && <SignupPage onNavigate={setCurrentTab} />}
        {currentTab === 'forgot-password' && <ForgotPasswordPage onNavigate={setCurrentTab} />}
        {currentTab === 'profile' && <ProfilePage onNavigate={setCurrentTab} />}
        {currentTab === 'settings' && <SettingsPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-dark-950/90 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-black tracking-tight">PressureChess</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('changelog')} 
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              v0.5.0 Release Notes
            </button>
            <span className="text-white font-bold opacity-90 tracking-wide">PressureChess</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AcademyProvider>
          <TacticsProvider>
            <AnalysisProvider>
              <MultiplayerProvider>
                <BetaProvider>
                  <AppContent />
                </BetaProvider>
              </MultiplayerProvider>
            </AnalysisProvider>
          </TacticsProvider>
        </AcademyProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
