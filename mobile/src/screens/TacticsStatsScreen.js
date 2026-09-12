import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useTactics } from '../context/TacticsContext';
import { PUZZLE_CATEGORIES } from '../data/puzzlesData';
import { 
  ChevronLeft, 
  Trophy, 
  Flame, 
  Target, 
  Timer, 
  TrendingUp, 
  History,
  Zap
} from 'lucide-react-native';

export const TacticsStatsScreen = ({ navigation }) => {
  const {
    puzzleRating,
    highestRating,
    currentStreak,
    highestStreak,
    totalAttempted,
    totalSolved,
    accuracyPct,
    avgSolveTime,
    history
  } = useTactics();

  const categoryStats = PUZZLE_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
    const catAttempts = history.filter(h => h.category === cat.id);
    const catSolved = catAttempts.filter(h => h.solved).length;
    const pct = catAttempts.length > 0 ? Math.round((catSolved / catAttempts.length) * 100) : 0;
    return {
      ...cat,
      attempts: catAttempts.length,
      solved: catSolved,
      accuracy: pct
    };
  });

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
            <Text style={styles.headerSubtitle}>PERFORMANCE METRICS</Text>
            <Text style={styles.headerTitle}>Tactics Analytics</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.trainBtn}
          onPress={() => navigation.navigate('PressureTrainer')}
        >
          <Zap size={14} color="#000000" fill="#000000" />
          <Text style={styles.trainBtnText}>Train</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 4 KPI Grid */}
        <View style={styles.kpiGrid}>
          
          <View style={styles.kpiCard}>
            <View style={styles.kpiTop}>
              <Text style={styles.kpiLabel}>Tactics ELO</Text>
              <Trophy size={14} color={colors.cyan} />
            </View>
            <Text style={styles.kpiValue}>{puzzleRating}</Text>
            <Text style={styles.kpiSub}>Peak: {highestRating}</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={styles.kpiTop}>
              <Text style={styles.kpiLabel}>Current Streak</Text>
              <Flame size={14} color="#F59E0B" />
            </View>
            <Text style={[styles.kpiValue, { color: '#F59E0B' }]}>{currentStreak}</Text>
            <Text style={styles.kpiSub}>Best: {highestStreak}</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={styles.kpiTop}>
              <Text style={styles.kpiLabel}>Accuracy</Text>
              <Target size={14} color="#10B981" />
            </View>
            <Text style={[styles.kpiValue, { color: '#10B981' }]}>{accuracyPct}%</Text>
            <Text style={styles.kpiSub}>{totalSolved}/{totalAttempted} solved</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={styles.kpiTop}>
              <Text style={styles.kpiLabel}>Avg Time</Text>
              <Timer size={14} color="#A855F7" />
            </View>
            <Text style={[styles.kpiValue, { color: '#A855F7' }]}>{avgSolveTime}s</Text>
            <Text style={styles.kpiSub}>Fast solver</Text>
          </View>

        </View>

        {/* Category Breakdown */}
        <View style={styles.sectionHeader}>
          <TrendingUp size={16} color={colors.cyan} />
          <Text style={styles.sectionTitle}>Category Strength Breakdown</Text>
        </View>

        <View style={styles.catBreakdown}>
          {categoryStats.map((cat) => (
            <View key={cat.id} style={styles.catRow}>
              <View style={styles.catMeta}>
                <Text style={styles.catName}>{cat.icon} {cat.title}</Text>
                <Text style={styles.catScore}>{cat.solved}/{cat.attempts} ({cat.accuracy}%)</Text>
              </View>

              <View style={styles.catBarTrack}>
                <View style={[styles.catBarFill, { width: `${Math.max(5, cat.accuracy)}%` }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Recent History */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <History size={16} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Recent Pressure Attempts</Text>
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 24, marginBottom: 6 }}>⚡</Text>
            <Text style={styles.emptyTitle}>No attempts recorded yet</Text>
            <Text style={styles.emptySubtitle}>Jump into a 10s or 20s scenario to begin tracking your data.</Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {history.slice(0, 10).map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <View style={[styles.historyBadge, { backgroundColor: item.solved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
                    <Text style={{ color: item.solved ? '#10B981' : '#EF4444', fontWeight: '900' }}>
                      {item.solved ? '✓' : '✗'}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.historyTitle}>{item.puzzleTitle}</Text>
                    <Text style={styles.historySub}>
                      {item.category} • {item.mode} • {item.timeTaken}s
                    </Text>
                  </View>
                </View>

                <View style={styles.historyRight}>
                  <Text style={[styles.historyDelta, { color: item.ratingDelta >= 0 ? '#10B981' : '#EF4444' }]}>
                    {item.ratingDelta >= 0 ? `+${item.ratingDelta}` : item.ratingDelta}
                  </Text>
                  <Text style={styles.historyRatingAfter}>{item.userRatingAfter} ELO</Text>
                </View>
              </View>
            ))}
          </View>
        )}

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
    borderRadius: 5,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  trainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: colors.gold,
  },
  trainBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 20,
  },
  kpiCard: {
    width: '48.5%',
    backgroundColor: '#121212',
    padding: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderTopColor: '#383838',
    borderColor: '#242424',
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  kpiLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  kpiSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  catBreakdown: {
    backgroundColor: '#121212',
    borderRadius: 5,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderTopColor: '#383838',
    borderColor: '#242424',
  },
  catRow: {
    gap: 6,
  },
  catMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  catScore: {
    fontSize: 11,
    color: '#94A3B8',
  },
  catBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#202020',
    borderRadius: 2,
    overflow: 'hidden',
  },
  catBarFill: {
    height: '100%',
    backgroundColor: colors.gold,
  },
  emptyCard: {
    backgroundColor: '#121212',
    padding: 24,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#242424',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderTopColor: '#383838',
    borderColor: '#242424',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyBadge: {
    width: 28,
    height: 28,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  historySub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyDelta: {
    fontSize: 12,
    fontWeight: '900',
  },
  historyRatingAfter: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
});
