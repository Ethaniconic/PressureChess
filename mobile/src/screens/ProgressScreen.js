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
import { useAcademy } from '../context/AcademyContext';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronLeft, 
  Star, 
  CheckCircle, 
  Flame, 
  Play, 
  TrendingUp, 
  Zap 
} from 'lucide-react-native';

export const ProgressScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { 
    modules, 
    totalXp, 
    levelInfo, 
    totalStars, 
    isLessonCompleted,
    setSelectedLesson 
  } = useAcademy();

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = modules.reduce((sum, m) => {
    return sum + m.lessons.filter(l => isLessonCompleted(l.id)).length;
  }, 0);

  // Level XP progress percentage
  const currentBase = levelInfo.currentBase;
  const nextXp = levelInfo.nextXp;
  const xpInLevel = totalXp - currentBase;
  const levelSpan = nextXp - currentBase;
  const levelProgressPct = Math.min(100, Math.max(0, Math.round((xpInLevel / levelSpan) * 100))) || 0;

  // Find next incomplete lesson
  const allLessons = modules.flatMap(m => m.lessons);
  const nextIncomplete = allLessons.find(l => !isLessonCompleted(l.id)) || allLessons[0];

  const handleResume = () => {
    setSelectedLesson(nextIncomplete);
    navigation.navigate('LessonPlayer');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Progress & Stats</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Rank & Level Card */}
        <GlassCard style={styles.rankCard} glow>
          <View style={styles.rankHeader}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankBadgeText}>L{levelInfo.level}</Text>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.rankSub}>CURRENT RANK</Text>
              <Text style={styles.rankTitle}>{levelInfo.title}</Text>
              <Text style={styles.rankXpText}>{totalXp} Total XP</Text>
            </View>
          </View>

          {/* Level Progress Bar */}
          <View style={styles.levelBarSection}>
            <View style={styles.levelLabels}>
              <Text style={styles.levelProgressLabel}>Next Rank</Text>
              <Text style={styles.levelProgressVal}>{xpInLevel} / {levelSpan} XP ({levelProgressPct}%)</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${levelProgressPct}%` }]} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.resumeBtn}
            onPress={handleResume}
            activeOpacity={0.8}
          >
            <Play size={16} color="#000" />
            <Text style={styles.resumeBtnText}>RESUME LEARNING</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Stats 3-Grid */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statBox}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Mastered</Text>
              <CheckCircle size={14} color={colors.emerald} />
            </View>
            <Text style={styles.statNumber}>{completedLessons}/{totalLessons}</Text>
            <Text style={styles.statSub}>
              {Math.round((completedLessons / totalLessons) * 100) || 0}% Complete
            </Text>
          </GlassCard>

          <GlassCard style={styles.statBox}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Stars</Text>
              <Star size={14} color={colors.gold} />
            </View>
            <Text style={[styles.statNumber, { color: colors.gold }]}>{totalStars} ★</Text>
            <Text style={styles.statSub}>Academy</Text>
          </GlassCard>

          <GlassCard style={styles.statBox}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Streak</Text>
              <Flame size={14} color="#F97316" />
            </View>
            <Text style={[styles.statNumber, { color: '#F97316' }]}>{user?.daily_streak || 1}d</Text>
            <Text style={styles.statSub}>Active</Text>
          </GlassCard>
        </View>

        {/* Module Breakdown List */}
        <View style={styles.modulesHeader}>
          <TrendingUp size={16} color={colors.emerald} />
          <Text style={styles.sectionHeaderTitle}>Module Progress Breakdown</Text>
        </View>

        {modules.map((m) => {
          const done = m.lessons.filter(l => isLessonCompleted(l.id)).length;
          const pct = Math.round((done / m.lessons.length) * 100) || 0;

          return (
            <GlassCard key={m.id} style={styles.moduleProgressCard}>
              <View style={styles.moduleProgressTop}>
                <Text style={styles.moduleProgressTitle}>{m.title}</Text>
                <Text style={styles.moduleProgressCount}>{done} / {m.lessons.length} ({pct}%)</Text>
              </View>
              <View style={styles.moduleProgressTrack}>
                <View style={[styles.moduleProgressFill, { width: `${pct}%` }]} />
              </View>
            </GlassCard>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  rankCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    padding: 16,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rankBadge: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  rankSub: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.gold,
    textTransform: 'uppercase',
  },
  rankTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
    marginTop: 1,
  },
  rankXpText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  levelBarSection: {
    marginBottom: 16,
  },
  levelLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  levelProgressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  levelProgressVal: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.gold,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 4,
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    paddingVertical: 12,
    borderRadius: 5,
  },
  resumeBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 12,
    borderColor: colors.border,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  statSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  modulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  moduleProgressCard: {
    backgroundColor: colors.surface,
    padding: 14,
    borderColor: colors.border,
    gap: 8,
  },
  moduleProgressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleProgressTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  moduleProgressCount: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  moduleProgressTrack: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  moduleProgressFill: {
    height: '100%',
    backgroundColor: colors.emerald,
    borderRadius: 3,
  },
});
