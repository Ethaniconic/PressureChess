import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { useTactics } from '../context/TacticsContext';
import { PUZZLE_MODES, PUZZLE_CATEGORIES, CHAMPIONSHIP_SCENARIOS } from '../data/puzzlesData';
import { 
  Timer, 
  Flame, 
  Trophy, 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Crown, 
  Target, 
  Sparkles,
  BarChart2
} from 'lucide-react-native';

export const PressureTrainerScreen = ({ navigation }) => {
  const { 
    puzzleRating, 
    currentStreak, 
    accuracyPct, 
    avgSolveTime, 
    startSession 
  } = useTactics();

  const handleLaunchMode = (modeId) => {
    startSession(modeId, 'all');
    navigation.navigate('PuzzlePlayer');
  };

  const handleLaunchChampionship = (scenarioId) => {
    startSession('championship', 'all', scenarioId);
    navigation.navigate('PuzzlePlayer');
  };

  const handleLaunchCategory = (categoryId) => {
    startSession('practice', categoryId);
    navigation.navigate('PuzzlePlayer');
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerSubtitle}>PHASE 2 TACTICS</Text>
            <Text style={styles.headerTitle}>Pressure Trainer</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.statsButton}
          onPress={() => navigation.navigate('TacticsStats')}
        >
          <BarChart2 size={16} color={colors.cyan} />
          <Text style={styles.statsButtonText}>Stats</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* KPI Rating Bar */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={styles.statLabelRow}>
              <Trophy size={13} color={colors.cyan} />
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <Text style={styles.statValue}>{puzzleRating}</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statLabelRow}>
              <Flame size={13} color="#F59E0B" />
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>{currentStreak}</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statLabelRow}>
              <Target size={13} color="#10B981" />
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{accuracyPct}%</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statLabelRow}>
              <Timer size={13} color="#A855F7" />
              <Text style={styles.statLabel}>Avg Speed</Text>
            </View>
            <Text style={[styles.statValue, { color: '#A855F7' }]}>{avgSolveTime}s</Text>
          </View>
        </View>

        {/* 1. Timed Scenarios Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconBox}>
            <Timer size={16} color={colors.cyan} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Timed Pressure Modes</Text>
            <Text style={styles.sectionSubtitle}>Select countdown speed. Solve before zero!</Text>
          </View>
        </View>

        <View style={styles.modesGrid}>
          {PUZZLE_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={styles.modeCard}
              onPress={() => handleLaunchMode(mode.id)}
              activeOpacity={0.8}
            >
              <View style={styles.modeTopRow}>
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{mode.badge}</Text>
                </View>
              </View>

              <Text style={styles.modeTitle}>{mode.title}</Text>
              <Text style={styles.modeDesc} numberOfLines={2}>{mode.description}</Text>

              <View style={styles.modeBottomRow}>
                <Text style={styles.modeDuration}>{mode.seconds} Seconds</Text>
                <View style={styles.playIconBox}>
                  <Play size={12} color="#000000" fill="#000000" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 2. Championship Scenarios */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <View style={[styles.sectionIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Crown size={16} color="#F59E0B" />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Championship Moments</Text>
            <Text style={styles.sectionSubtitle}>Famous game scrambles from Kasparov, Tal, & Carlsen</Text>
          </View>
        </View>

        <View style={styles.championshipList}>
          {CHAMPIONSHIP_SCENARIOS.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              style={styles.champCard}
              onPress={() => handleLaunchChampionship(scenario.id)}
              activeOpacity={0.8}
            >
              <View style={styles.champHeader}>
                <Text style={styles.champYear}>{scenario.championshipData.year} • {scenario.championshipData.event}</Text>
                <Text style={styles.champRating}>{scenario.rating} ELO</Text>
              </View>

              <Text style={styles.champTitle}>{scenario.title}</Text>
              <Text style={styles.champSubtitle}>{scenario.subtitle}</Text>
              <Text style={styles.champGoal} numberOfLines={2}>{scenario.goal}</Text>

              <View style={styles.champFooter}>
                <Text style={styles.champPlayer}>Play {scenario.playerColor === 'white' ? 'White' : 'Black'}</Text>
                <View style={styles.replayButton}>
                  <Text style={styles.replayButtonText}>Play</Text>
                  <ChevronRight size={14} color={colors.cyan} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Tactics Categories */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <View style={[styles.sectionIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Target size={16} color="#10B981" />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Tactical Categories</Text>
            <Text style={styles.sectionSubtitle}>Drill specific tactical themes & patterns</Text>
          </View>
        </View>

        <View style={styles.categoriesGrid}>
          {PUZZLE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.catCard}
              onPress={() => handleLaunchCategory(cat.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={styles.catTitle}>{cat.title}</Text>
              <Text style={styles.catDesc} numberOfLines={1}>{cat.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.cyan,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  statsButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.cyan,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modeCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    justifyContent: 'space-between',
  },
  modeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeIcon: {
    fontSize: 22,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.cyan,
  },
  modeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modeDesc: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
    marginBottom: 12,
  },
  modeBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  modeDuration: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.cyan,
  },
  playIconBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  championshipList: {
    gap: 10,
  },
  champCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  champHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  champYear: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B',
  },
  champRating: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  champTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  champSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.cyan,
    marginBottom: 4,
  },
  champGoal: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
    marginBottom: 10,
  },
  champFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  champPlayer: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  replayButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.cyan,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catCard: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  catIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  catTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  catDesc: {
    fontSize: 9,
    color: '#94A3B8',
  },
});
