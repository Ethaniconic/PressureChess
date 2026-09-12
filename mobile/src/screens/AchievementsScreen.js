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
import { 
  ChevronLeft, 
  Award, 
  CheckCircle2, 
  Lock, 
  Zap 
} from 'lucide-react-native';

export const AchievementsScreen = ({ navigation }) => {
  const { unlockedAchievements, achievements, totalXp } = useAcademy();

  const unlockedCount = achievements.filter(a => unlockedAchievements.includes(a.id)).length;

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

        <Text style={styles.screenTitle}>Badges & Trophies</Text>

        <View style={styles.unlockedCountBadge}>
          <Text style={styles.unlockedCountText}>{unlockedCount}/{achievements.length}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Badges Hero Banner */}
        <GlassCard style={styles.heroCard} glow>
          <View style={styles.heroHeader}>
            <View style={styles.awardIconBox}>
              <Award size={22} color={colors.gold} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.heroTitle}>Academy Milestones</Text>
              <Text style={styles.heroDesc}>
                Unlock badges and bonus XP rewards as you conquer chess concepts.
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Badges List */}
        <View style={styles.badgesList}>
          {achievements.map((ach) => {
            const isUnlocked = unlockedAchievements.includes(ach.id);

            return (
              <GlassCard 
                key={ach.id} 
                style={[styles.badgeCard, isUnlocked && styles.badgeCardUnlocked]}
              >
                <View style={styles.badgeTopRow}>
                  <View style={[styles.badgeIconBox, isUnlocked && styles.badgeIconBoxUnlocked]}>
                    <Text style={styles.badgeEmoji}>{ach.icon}</Text>
                  </View>

                  <View style={{ flex: 1, marginHorizontal: 12 }}>
                    <Text style={styles.badgeTitle}>{ach.title}</Text>
                    <Text style={styles.badgeDesc}>{ach.description}</Text>
                  </View>

                  <View style={[styles.statusPill, isUnlocked ? styles.statusPillUnlocked : styles.statusPillLocked]}>
                    {isUnlocked ? (
                      <CheckCircle2 size={13} color={colors.emerald} />
                    ) : (
                      <Lock size={13} color={colors.textMuted} />
                    )}
                    <Text style={[styles.statusPillText, isUnlocked ? styles.statusPillTextUnlocked : styles.statusPillTextLocked]}>
                      {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </Text>
                  </View>
                </View>

                {/* Footer reward */}
                <View style={styles.badgeFooter}>
                  <Text style={styles.rewardLabel}>Reward:</Text>
                  <View style={styles.rewardXpRow}>
                    <Zap size={13} color={colors.gold} />
                    <Text style={styles.rewardXpText}>+{ach.xpReward} XP</Text>
                  </View>
                </View>
              </GlassCard>
            );
          })}
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
  unlockedCountBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  unlockedCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.gold,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  heroCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    padding: 16,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  awardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  heroDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  badgesList: {
    gap: 12,
  },
  badgeCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    padding: 14,
    gap: 10,
    opacity: 0.65,
  },
  badgeCardUnlocked: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
    opacity: 1,
  },
  badgeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeIconBoxUnlocked: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  badgeDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 15,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillUnlocked: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusPillLocked: {
    backgroundColor: colors.surfaceLight,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  statusPillTextUnlocked: {
    color: colors.emerald,
  },
  statusPillTextLocked: {
    color: colors.textMuted,
  },
  badgeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  rewardLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  rewardXpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardXpText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.gold,
  },
});
