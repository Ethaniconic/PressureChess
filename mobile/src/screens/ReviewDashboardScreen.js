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
import { GlassCard } from '../components/GlassCard';
import { useAnalysis } from '../context/AnalysisContext';
import {
  ChevronLeft,
  Bot,
  TrendingUp,
  AlertTriangle,
  BarChart2,
  Sparkles,
  BookOpen,
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react-native';

export const ReviewDashboardScreen = ({ navigation }) => {
  const { dashboardStats, history, loadFromHistory } = useAnalysis();

  const handleReview = (id) => {
    loadFromHistory(id);
    navigation.navigate('GameReview');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={20} color="#CBD5E1" />
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <View style={styles.badgeRow}>
            <Bot size={11} color="#00E5FF" />
            <Text style={styles.badgeText}>COACH ORION ANALYTICS</Text>
          </View>
          <Text style={styles.headerTitle}>Review Dashboard</Text>
        </View>
        <TouchableOpacity
          style={styles.reviewNextBtn}
          onPress={() => navigation.navigate('GameReview')}
        >
          <Zap size={14} color="#070B14" />
          <Text style={styles.reviewNextText}>Review</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Top Metric Cards */}
        <View style={styles.kpiGrid}>
          <GlassCard style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Accuracy</Text>
              <TrendingUp size={14} color="#00E5FF" />
            </View>
            <Text style={styles.kpiValue}>{dashboardStats.overallAccuracy}%</Text>
            <Text style={styles.kpiSub}>Engine score</Text>
          </GlassCard>

          <GlassCard style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Blunder Rate</Text>
              <AlertTriangle size={14} color="#EF4444" />
            </View>
            <Text style={[styles.kpiValue, { color: '#F87171' }]}>{dashboardStats.blunderRatePct}%</Text>
            <Text style={styles.kpiSub}>&gt;200 cp loss</Text>
          </GlassCard>

          <GlassCard style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Reviewed</Text>
              <BarChart2 size={14} color="#38BDF8" />
            </View>
            <Text style={styles.kpiValue}>{dashboardStats.gamesAnalyzed}</Text>
            <Text style={styles.kpiSub}>Games analyzed</Text>
          </GlassCard>

          <GlassCard style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={styles.kpiLabel}>Brilliants</Text>
              <Sparkles size={14} color="#F59E0B" />
            </View>
            <Text style={[styles.kpiValue, { color: '#FBBF24' }]}>{dashboardStats.brilliantsTotal}</Text>
            <Text style={styles.kpiSub}>Sacrifices</Text>
          </GlassCard>
        </View>

        {/* Tactical Weaknesses */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={16} color="#F87171" />
            <Text style={styles.sectionTitle}>Tactical Vulnerabilities</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Recurring patterns spotted in your blunders & inaccuracies
          </Text>

          <View style={styles.weaknessList}>
            {dashboardStats.weaknesses.map((w, idx) => (
              <View key={idx} style={styles.weaknessItem}>
                <View style={styles.weaknessTop}>
                  <Text style={styles.weaknessTheme}>{w.theme}</Text>
                  <View style={[styles.severityPill, w.severity === 'High' ? styles.severityHigh : styles.severityMed]}>
                    <Text style={styles.severityText}>{w.severity}</Text>
                  </View>
                </View>
                <Text style={styles.weaknessDesc}>{w.description}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Opening Repertoire */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <BookOpen size={16} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Opening Repertoire</Text>
          </View>

          <View style={styles.repertoireList}>
            {dashboardStats.openingRepertoire.map((op, idx) => (
              <View key={idx} style={styles.repertoireItem}>
                <View>
                  <Text style={styles.repertoireEco}>{op.eco}</Text>
                  <Text style={styles.repertoireName}>{op.name}</Text>
                </View>
                <View style={styles.repertoireStats}>
                  <Text style={styles.repertoireWin}>{op.winRate}% Win</Text>
                  <Text style={styles.repertoireAcc}>Acc {op.avgAccuracy}%</Text>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Review History */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Clock size={16} color="#00E5FF" />
            <Text style={styles.sectionTitle}>Saved Reviews</Text>
          </View>

          {history.length === 0 ? (
            <Text style={styles.emptyText}>No saved reviews yet. Import a game to start!</Text>
          ) : (
            <View style={styles.historyList}>
              {history.map((rev) => (
                <TouchableOpacity
                  key={rev.id}
                  style={styles.historyItem}
                  onPress={() => handleReview(rev.id)}
                >
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyMatch} numberOfLines={1}>
                      {rev.headers?.white || 'White'} vs {rev.headers?.black || 'Black'}
                    </Text>
                    <Text style={styles.historyEco}>
                      {rev.opening?.eco} • {rev.opening?.name || 'Custom'}
                    </Text>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={styles.historyAcc}>Acc {rev.accuracy?.white || 80}%</Text>
                    <ArrowRight size={14} color="#00E5FF" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070B14'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)'
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitleBlock: {
    flex: 1,
    marginLeft: 10
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#00E5FF',
    letterSpacing: 1
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  reviewNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00E5FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10
  },
  reviewNextText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#070B14'
  },
  content: {
    flex: 1
  },
  contentContainer: {
    padding: 14,
    gap: 14
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  kpiCard: {
    width: '48%',
    padding: 12,
    gap: 4
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase'
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2
  },
  kpiSub: {
    fontSize: 9,
    color: '#64748B'
  },
  sectionCard: {
    padding: 14,
    gap: 10
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: -4
  },
  weaknessList: {
    gap: 8,
    marginTop: 4
  },
  weaknessItem: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 4
  },
  weaknessTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  weaknessTheme: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  severityPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  severityHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)'
  },
  severityMed: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)'
  },
  severityText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#CBD5E1'
  },
  weaknessDesc: {
    fontSize: 10,
    color: '#94A3B8',
    lineHeight: 14
  },
  repertoireList: {
    gap: 8,
    marginTop: 4
  },
  repertoireItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  repertoireEco: {
    fontSize: 10,
    fontWeight: '900',
    color: '#00E5FF'
  },
  repertoireName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  repertoireStats: {
    alignItems: 'flex-end'
  },
  repertoireWin: {
    fontSize: 12,
    fontWeight: '900',
    color: '#10B981'
  },
  repertoireAcc: {
    fontSize: 10,
    color: '#94A3B8'
  },
  historyList: {
    gap: 8,
    marginTop: 4
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)'
  },
  historyInfo: {
    flex: 1
  },
  historyMatch: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  historyEco: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  historyAcc: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00E5FF'
  },
  emptyText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 16
  }
});
