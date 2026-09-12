import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useAcademy } from '../context/AcademyContext';
import { useBeta } from '../context/BetaContext';
import { BetaWelcomeModal } from '../components/BetaWelcomeModal';
import { 
  Flame, 
  Swords, 
  GraduationCap, 
  Settings as SettingsIcon, 
  Play, 
  Zap, 
  ChevronRight,
  Bot,
  Star,
  Compass,
  Trophy,
  Target,
  MessageSquarePlus,
  Sparkles
} from 'lucide-react-native';
import { ACADEMY_TIERS } from '../data/academyLessons';

export const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { openWelcomeModal } = useBeta();
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
  const progressPct = Math.round((completedLessons / totalLessons) * 100) || 0;

  // Next incomplete lesson
  const allLessons = modules.flatMap(m => m.lessons);
  const nextLesson = allLessons.find(l => !isLessonCompleted(l.id)) || allLessons[0];

  const handleResumeAcademy = () => {
    if (nextLesson) {
      setSelectedLesson(nextLesson);
      navigation.navigate('LessonPlayer');
    } else {
      navigation.navigate('AcademyCourses');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BetaWelcomeModal navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Brand Header */}
        <View style={styles.header}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.brandTitle}>
                PRESSURE<Text style={{ color: colors.cyan }}>CHESS</Text>
              </Text>
              <TouchableOpacity 
                style={styles.betaBadge}
                onPress={openWelcomeModal}
              >
                <Text style={styles.betaBadgeText}>BETA</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.welcomeText}>
              Welcome back, {user?.username || 'Player'}
            </Text>
          </View>

          <View style={styles.headerRightBadges}>
            <TouchableOpacity 
              style={styles.feedbackBadge}
              onPress={() => navigation.navigate('Feedback')}
            >
              <MessageSquarePlus size={15} color="#F59E0B" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.streakBadge}
              onPress={() => navigation.navigate('Progress')}
            >
              <Flame size={16} color="#F97316" />
              <Text style={styles.streakText}>{user?.daily_streak || 1}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.starBadge}
              onPress={() => navigation.navigate('Progress')}
            >
              <Star size={15} color={colors.gold} />
              <Text style={styles.starText}>{totalStars}</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* ==================================================== */}
        {/* 1. TOP HERO: ACADEMY SPOTLIGHT (CLEAN & MINIMALIST) */}
        {/* ==================================================== */}
        <GlassCard style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.academyTag}>
              <Text style={styles.academyTagText}>⚡ ACADEMY</Text>
            </View>
            <Text style={styles.eloText}>L{levelInfo.level} • {levelInfo.title}</Text>
          </View>

          <Text style={styles.heroTitle}>Master Tactical Vision</Text>
          <Text style={styles.heroDesc}>
            17 interactive lessons from basic piece coordinates to grandmaster forks, skewers, and endgames.
          </Text>

          {/* Clean Progress Bar */}
          <View style={styles.heroProgressBox}>
            <View style={styles.heroProgressLabels}>
              <Text style={styles.heroProgressSub}>Progress</Text>
              <Text style={styles.heroProgressVal}>{completedLessons}/{totalLessons} ({progressPct}%)</Text>
            </View>
            <View style={styles.heroProgressBarTrack}>
              <View style={[styles.heroProgressBarFill, { width: `${progressPct}%` }]} />
            </View>
          </View>

          {/* 1-Tap Launch Button */}
          <TouchableOpacity
            style={styles.resumeBtn}
            activeOpacity={0.85}
            onPress={handleResumeAcademy}
          >
            <GraduationCap size={16} color="#000" />
            <Text style={styles.resumeBtnText} numberOfLines={1}>
              RESUME: {nextLesson ? nextLesson.title : 'START LESSON'}
            </Text>
            <ChevronRight size={16} color="#000" />
          </TouchableOpacity>
        </GlassCard>

        {/* Quick Tier Pathway Chips Row (outside hero card for clean breathing room) */}
        <View style={styles.tierChipsRow}>
          {ACADEMY_TIERS.map(t => (
            <TouchableOpacity
              key={t.id}
              onPress={() => navigation.navigate('AcademyCourses')}
              style={styles.tierChip}
              activeOpacity={0.8}
            >
              <Text style={styles.tierChipIcon}>{t.icon}</Text>
              <Text style={styles.tierChipText}>{t.badge}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ==================================================== */}
        {/* 2. AI COACH ORION COMPANION PREVIEW                 */}
        {/* ==================================================== */}
        <GlassCard style={styles.coachCard}>
          <View style={styles.coachHeader}>
            <View style={styles.coachAvatar}>
              <Bot size={18} color="#000" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <View style={styles.coachTitleRow}>
                <Text style={styles.coachName}>Coach Orion</Text>
                <View style={styles.aiPill}>
                  <Text style={styles.aiPillText}>AI COACH</Text>
                </View>
              </View>
              <Text style={styles.coachSub}>Tactical Companion</Text>
            </View>
          </View>

          <View style={styles.coachBubble}>
            <Text style={styles.coachBubbleText}>
              "Remember: Look for forcing moves first — Checks, Captures, and Threats. Ready to review your games and spot blunders?"
            </Text>
          </View>

          <TouchableOpacity
            style={styles.coachActionRow}
            onPress={() => navigation.navigate('GameReview')}
          >
            <Text style={styles.coachActionText}>Review Game with Coach Orion</Text>
            <ChevronRight size={16} color={colors.cyan} />
          </TouchableOpacity>
        </GlassCard>

        {/* ==================================================== */}
        {/* ONLINE MULTIPLAYER SPOTLIGHT (PHASE 4)              */}
        {/* ==================================================== */}
        <GlassCard style={[styles.drillCard, { borderColor: 'rgba(0, 229, 255, 0.45)' }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: 'rgba(0, 229, 255, 0.2)' }]}>
              <Swords size={18} color="#00E5FF" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Online Multiplayer Arena</Text>
              <Text style={[styles.cardDesc, { marginTop: 0 }]}>Bullet • Blitz • Rapid • Classical</Text>
            </View>
          </View>
          <Text style={styles.courseTitle}>Live Ranked Chess & Realtime Elo</Text>
          <Text style={styles.cardDesc}>
            Challenge global opponents, invite friends with room codes, and climb daily, weekly, and global leaderboards with official Elo calculation.
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <TouchableOpacity
              style={[styles.actionRow, { flex: 1, backgroundColor: '#00E5FF', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, justifyContent: 'center' }]}
              onPress={() => navigation.navigate('MultiplayerLobby')}
            >
              <Text style={[styles.actionText, { color: '#000', fontWeight: '900' }]}>Play Online</Text>
              <ChevronRight size={16} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionRow, { flex: 1, backgroundColor: 'rgba(245, 158, 11, 0.15)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.4)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, justifyContent: 'center' }]}
              onPress={() => navigation.navigate('Leaderboard')}
            >
              <Text style={[styles.actionText, { color: '#F59E0B', fontWeight: 'bold' }]}>Leaderboards</Text>
              <ChevronRight size={16} color="#F59E0B" />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* ==================================================== */}
        {/* 3. AI GAME REVIEW SPOTLIGHT (PHASE 3)               */}
        {/* ==================================================== */}
        <GlassCard style={[styles.drillCard, { borderColor: 'rgba(0, 229, 255, 0.35)' }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: 'rgba(0, 229, 255, 0.15)' }]}>
              <Bot size={18} color="#00E5FF" />
            </View>
            <View>
              <Text style={styles.cardTitle}>AI Game Review Studio</Text>
              <Text style={[styles.cardDesc, { marginTop: 0 }]}>Stockfish Eval • ECO Openings • Blunders</Text>
            </View>
          </View>
          <Text style={styles.courseTitle}>Turn PGNs into Masterclasses</Text>
          <Text style={styles.cardDesc}>
            Interactive move scrubber, dynamic evaluation bar, move classifications (!!, ★, ?!), and natural English breakdown by Coach Orion.
          </Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('GameReview')}
          >
            <Text style={[styles.actionText, { color: '#00E5FF' }]}>Launch Review Studio</Text>
            <ChevronRight size={16} color="#00E5FF" />
          </TouchableOpacity>
        </GlassCard>

        {/* ==================================================== */}
        {/* 4. PRESSURE TRAINER SPOTLIGHT (PHASE 2)             */}
        {/* ==================================================== */}
        <GlassCard style={[styles.drillCard, { borderColor: 'rgba(245, 158, 11, 0.35)' }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Zap size={18} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Pressure Trainer</Text>
              <Text style={[styles.cardDesc, { marginTop: 0 }]}>10s • 20s • 30s • Sudden Death</Text>
            </View>
          </View>
          <Text style={styles.courseTitle}>Tactical Countdown Scrambles</Text>
          <Text style={styles.cardDesc}>
            Calculate with ice in your veins. Historic positions from Kasparov, Tal, Anand, and Carlsen under clock crunch.
          </Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('PressureTrainer')}
          >
            <Text style={[styles.actionText, { color: '#F59E0B' }]}>Enter Pressure Mode</Text>
            <ChevronRight size={16} color="#F59E0B" />
          </TouchableOpacity>
        </GlassCard>

        {/* ==================================================== */}
        {/* 5. QUICK LAUNCHPAD (SPACIOUS 2-COL BUBBLE TILES)     */}
        {/* ==================================================== */}
        <View style={styles.launchpadContainer}>
          <View style={styles.launchpadHeader}>
            <Sparkles size={16} color={colors.cyan} />
            <Text style={styles.launchpadSectionTitle}>QUICK ARENAS & TOOLS</Text>
          </View>
          
          <View style={styles.grid2Col}>
            {/* 1. Multiplayer Live */}
            <TouchableOpacity
              style={[styles.gridBubbleBtn, { borderColor: 'rgba(0, 229, 255, 0.35)' }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('MultiplayerLobby')}
            >
              <View style={styles.bubbleGlossSheen} pointerEvents="none" />
              <View style={[styles.bubbleIconCircle, { backgroundColor: 'rgba(0, 229, 255, 0.2)' }]}>
                <Swords size={20} color="#00E5FF" />
              </View>
              <Text style={[styles.gridBtnTitle, { color: '#00E5FF' }]}>Multiplayer</Text>
              <Text style={styles.gridBtnSub}>Ranked Live Arena</Text>
            </TouchableOpacity>

            {/* 2. AI Game Review */}
            <TouchableOpacity
              style={[styles.gridBubbleBtn, { borderColor: 'rgba(0, 229, 255, 0.3)' }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('GameReview')}
            >
              <View style={styles.bubbleGlossSheen} pointerEvents="none" />
              <View style={[styles.bubbleIconCircle, { backgroundColor: 'rgba(0, 229, 255, 0.16)' }]}>
                <Bot size={20} color="#00E5FF" />
              </View>
              <Text style={styles.gridBtnTitle}>AI Review</Text>
              <Text style={styles.gridBtnSub}>Coach Orion Breakdown</Text>
            </TouchableOpacity>

            {/* 3. Pressure Trainer */}
            <TouchableOpacity
              style={[styles.gridBubbleBtn, { borderColor: 'rgba(245, 158, 11, 0.35)' }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('PressureTrainer')}
            >
              <View style={styles.bubbleGlossSheen} pointerEvents="none" />
              <View style={[styles.bubbleIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Zap size={20} color="#F59E0B" />
              </View>
              <Text style={[styles.gridBtnTitle, { color: '#F59E0B' }]}>Pressure Mode</Text>
              <Text style={styles.gridBtnSub}>10s–30s Scramble</Text>
            </TouchableOpacity>

            {/* 4. Academy Curriculum */}
            <TouchableOpacity
              style={[styles.gridBubbleBtn, { borderColor: 'rgba(0, 229, 255, 0.25)' }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AcademyCourses')}
            >
              <View style={styles.bubbleGlossSheen} pointerEvents="none" />
              <View style={[styles.bubbleIconCircle, { backgroundColor: 'rgba(0, 229, 255, 0.16)' }]}>
                <GraduationCap size={20} color={colors.cyan} />
              </View>
              <Text style={styles.gridBtnTitle}>Academy</Text>
              <Text style={styles.gridBtnSub}>17 Interactive Units</Text>
            </TouchableOpacity>

            {/* 5. Coach Stats Dashboard */}
            <TouchableOpacity
              style={[styles.gridBubbleBtn, { borderColor: 'rgba(16, 185, 129, 0.3)' }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ReviewDashboard')}
            >
              <View style={styles.bubbleGlossSheen} pointerEvents="none" />
              <View style={[styles.bubbleIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.18)' }]}>
                <Target size={20} color="#10B981" />
              </View>
              <Text style={styles.gridBtnTitle}>Coach Stats</Text>
              <Text style={styles.gridBtnSub}>Tactics Dashboard</Text>
            </TouchableOpacity>

            {/* 6. Clock Play (2-Player) */}
            <TouchableOpacity
              style={[styles.gridBubbleBtn, { borderColor: 'rgba(168, 85, 247, 0.3)' }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('OfflineGame')}
            >
              <View style={styles.bubbleGlossSheen} pointerEvents="none" />
              <View style={[styles.bubbleIconCircle, { backgroundColor: 'rgba(168, 85, 247, 0.18)' }]}>
                <Swords size={20} color="#C084FC" />
              </View>
              <Text style={styles.gridBtnTitle}>Clock Match</Text>
              <Text style={styles.gridBtnSub}>Pass-and-Play</Text>
            </TouchableOpacity>

            {/* 7. Leaderboards */}
            <TouchableOpacity
              style={[styles.gridBubbleBtn, { borderColor: 'rgba(245, 158, 11, 0.3)' }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Leaderboard')}
            >
              <View style={styles.bubbleGlossSheen} pointerEvents="none" />
              <View style={[styles.bubbleIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.18)' }]}>
                <Trophy size={20} color="#F59E0B" />
              </View>
              <Text style={styles.gridBtnTitle}>Leaderboard</Text>
              <Text style={styles.gridBtnSub}>Global & Weekly Elo</Text>
            </TouchableOpacity>

            {/* 8. Progress & Badges */}
            <TouchableOpacity
              style={[styles.gridBubbleBtn, { borderColor: 'rgba(245, 158, 11, 0.25)' }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Progress')}
            >
              <View style={styles.bubbleGlossSheen} pointerEvents="none" />
              <View style={[styles.bubbleIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Star size={20} color={colors.gold} />
              </View>
              <Text style={styles.gridBtnTitle}>Progress Hub</Text>
              <Text style={styles.gridBtnSub}>Rank, Badges & XP</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  headerRightBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  betaBadge: {
    backgroundColor: 'rgba(0, 229, 255, 0.18)',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(0, 229, 255, 0.5)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  betaBadgeText: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  feedbackBadge: {
    padding: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(249, 115, 22, 0.18)',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderColor: 'rgba(249, 115, 22, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F97316',
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  starText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.gold,
  },
  heroCard: {
    padding: 16,
    borderRadius: 14,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  academyTag: {
    backgroundColor: 'rgba(45, 212, 191, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderColor: 'rgba(45, 212, 191, 0.35)',
  },
  academyTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.cyan,
  },
  eloText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.gold,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: 12.5,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  tierChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  tierChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8, // minimal rounded corners
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.20)',
    borderColor: colors.border,
  },
  tierChipIcon: {
    fontSize: 12,
  },
  tierChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  heroProgressBox: {
    marginBottom: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heroProgressSub: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  heroProgressVal: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.cyan,
  },
  heroProgressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  heroProgressBarFill: {
    height: '100%',
    backgroundColor: colors.cyan,
    borderRadius: 4,
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.cyan,
    paddingVertical: 12,
    borderRadius: 10, // clean minimal corners
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  resumeBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  coachCard: {
    padding: 16,
    borderRadius: 14,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  coachAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  coachTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coachName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  aiPill: {
    backgroundColor: 'rgba(45, 212, 191, 0.18)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.35)',
  },
  aiPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.cyan,
  },
  coachSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  coachBubble: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.20)',
    borderColor: colors.border,
  },
  coachBubbleText: {
    fontSize: 12,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  coachActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  coachActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.cyan,
  },
  drillCard: {
    padding: 16,
    borderRadius: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  cardIconBox: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.cyan,
  },
  launchpadContainer: {
    marginTop: 4,
  },
  launchpadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  launchpadSectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridBubbleBtn: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.cardBubble,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.30)', // subtle light reflection
    borderColor: 'rgba(255, 245, 235, 0.12)',
    borderRadius: 12, // clean minimal corners
    padding: 13,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleGlossSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bubbleIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  gridBtnTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  gridBtnSub: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 14,
  }
});

