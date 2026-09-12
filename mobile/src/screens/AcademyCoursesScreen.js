import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  LayoutAnimation,
  Platform,
  UIManager 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { useAcademy } from '../context/AcademyContext';
import { 
  GraduationCap, 
  Star, 
  CheckCircle, 
  Play, 
  ChevronRight, 
  ChevronLeft,
  Zap, 
  Award,
  BookOpen,
  TrendingUp,
  Bot
} from 'lucide-react-native';
import { ACADEMY_TIERS } from '../data/academyLessons';

if (
  Platform.OS === 'android' &&
  !global.nativeFabricUIManager &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const AcademyCoursesScreen = ({ navigation }) => {
  const { 
    modules, 
    totalXp, 
    levelInfo, 
    totalStars, 
    isLessonCompleted, 
    getLessonStars,
    setSelectedLesson 
  } = useAcademy();

  const [activeTierFilter, setActiveTierFilter] = useState('all');
  const [expandedModuleId, setExpandedModuleId] = useState('board-basics');

  const filteredModules = activeTierFilter === 'all' 
    ? modules 
    : modules.filter(m => m.tier === activeTierFilter);

  const totalLessonsCount = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessonsCount = modules.reduce((acc, m) => {
    return acc + m.lessons.filter(l => isLessonCompleted(l.id)).length;
  }, 0);
  const overallProgressPct = Math.round((completedLessonsCount / totalLessonsCount) * 100) || 0;

  const toggleExpand = (modId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedModuleId(expandedModuleId === modId ? null : modId);
  };

  const handleStartLesson = (lesson) => {
    setSelectedLesson(lesson);
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

        <Text style={styles.screenTitle}>Academy Courses</Text>

        <View style={styles.headerRightActions}>
          <TouchableOpacity 
            style={styles.headerIconBtn}
            onPress={() => navigation.navigate('Progress')}
          >
            <TrendingUp size={18} color={colors.cyan} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIconBtn}
            onPress={() => navigation.navigate('Achievements')}
          >
            <Award size={18} color={colors.gold} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Academy Hero Card */}
        <GlassCard style={styles.heroCard} glow>
          <View style={styles.heroHeader}>
            <View style={styles.badgePill}>
              <GraduationCap size={14} color={colors.cyan} />
              <Text style={styles.badgePillText}>17 Progressive Units</Text>
            </View>

            <View style={styles.statPillsRow}>
              <View style={styles.statPill}>
                <Star size={13} color={colors.gold} />
                <Text style={styles.statPillGold}>{totalStars}</Text>
              </View>
              <View style={styles.statPill}>
                <Zap size={13} color={colors.cyan} />
                <Text style={styles.statPillCyan}>{totalXp} XP</Text>
              </View>
            </View>
          </View>

          <Text style={styles.heroTitle}>Mastery Curriculum</Text>
          <Text style={styles.heroDesc}>
            Step-by-step training from beginner movement rules to advanced forks, skewers, pins, and endgames.
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressSub}>Overall Academy Progress</Text>
              <Text style={styles.progressPct}>{completedLessonsCount}/{totalLessonsCount} ({overallProgressPct}%)</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${overallProgressPct}%` }]} />
            </View>
          </View>
        </GlassCard>

        {/* Tier Filter Horizontal Bar */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tierFilterScroll}
        >
          <TouchableOpacity
            onPress={() => setActiveTierFilter('all')}
            style={[styles.tierFilterBtn, activeTierFilter === 'all' && styles.tierFilterBtnActive]}
          >
            <Text style={[styles.tierFilterBtnText, activeTierFilter === 'all' && styles.tierFilterBtnTextActive]}>
              All ({modules.length})
            </Text>
          </TouchableOpacity>

          {ACADEMY_TIERS.map(tier => {
            const isActive = activeTierFilter === tier.id;
            const count = modules.filter(m => m.tier === tier.id).length;

            return (
              <TouchableOpacity
                key={tier.id}
                onPress={() => setActiveTierFilter(tier.id)}
                style={[styles.tierFilterBtn, isActive && styles.tierFilterBtnActive]}
              >
                <Text style={{ marginRight: 4 }}>{tier.icon}</Text>
                <Text style={[styles.tierFilterBtnText, isActive && styles.tierFilterBtnTextActive]}>
                  {tier.badge} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Modules Header */}
        <View style={styles.modulesHeaderRow}>
          <BookOpen size={16} color={colors.cyan} />
          <Text style={styles.modulesSectionTitle}>
            {activeTierFilter === 'all' ? 'All Modules' : ACADEMY_TIERS.find(t => t.id === activeTierFilter)?.title}
          </Text>
        </View>

        {/* Module Cards Accordion */}
        {filteredModules.map((mod, idx) => {
          const isExpanded = expandedModuleId === mod.id;
          const completedInModule = mod.lessons.filter(l => isLessonCompleted(l.id)).length;
          const isModuleComplete = completedInModule === mod.lessons.length;

          return (
            <GlassCard key={mod.id} style={[styles.moduleCard, isExpanded && styles.moduleCardExpanded]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleExpand(mod.id)}
                style={styles.moduleHeader}
              >
                <View style={styles.moduleHeaderLeft}>
                  <View style={[styles.moduleNumberBox, isModuleComplete && styles.moduleNumberBoxComplete]}>
                    <Text style={[styles.moduleNumberText, isModuleComplete && styles.moduleNumberTextComplete]}>
                      {isModuleComplete ? '✓' : `0${idx + 1}`}
                    </Text>
                  </View>

                  <View style={{ flex: 1, marginRight: 8 }}>
                    <View style={styles.moduleTitleRow}>
                      <Text style={styles.moduleTitle}>{mod.title}</Text>
                      <View style={styles.moduleTag}>
                        <Text style={styles.moduleTagText}>{mod.badge}</Text>
                      </View>
                    </View>
                    <Text style={styles.moduleDesc} numberOfLines={isExpanded ? undefined : 2}>
                      {mod.description}
                    </Text>
                    {mod.coachTip && isExpanded && (
                      <View style={styles.coachTipRow}>
                        <Bot size={13} color={colors.cyan} />
                        <Text style={styles.coachTipText} numberOfLines={2}>
                          "{mod.coachTip}"
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.moduleHeaderRight}>
                  <Text style={styles.moduleCountText}>{completedInModule}/{mod.lessons.length}</Text>
                  <ChevronRight 
                    size={18} 
                    color={isExpanded ? colors.cyan : colors.textMuted} 
                    style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                  />
                </View>
              </TouchableOpacity>

              {/* Lessons Sublist */}
              {isExpanded && (
                <View style={styles.lessonsContainer}>
                  {mod.lessons.map((lesson, lIdx) => {
                    const completed = isLessonCompleted(lesson.id);
                    const stars = getLessonStars(lesson.id);

                    return (
                      <View 
                        key={lesson.id} 
                        style={[styles.lessonRow, completed && styles.lessonRowCompleted]}
                      >
                        <View style={styles.lessonInfo}>
                          <View style={[styles.lessonIndexBadge, completed && styles.lessonIndexCompleted]}>
                            {completed ? (
                              <CheckCircle size={14} color={colors.emerald} />
                            ) : (
                              <Text style={styles.lessonIndexText}>{lIdx + 1}</Text>
                            )}
                          </View>

                          <View style={{ flex: 1, marginRight: 6 }}>
                            <Text style={styles.lessonTitle}>{lesson.title}</Text>
                            <View style={styles.lessonMetaRow}>
                              <Text style={styles.lessonXp}>+{lesson.xp} XP</Text>
                              {completed && (
                                <View style={styles.starsRow}>
                                  {[1, 2, 3].map(s => (
                                    <Star 
                                      key={s} 
                                      size={11} 
                                      color={s <= stars ? colors.gold : '#334155'} 
                                      style={{ marginRight: 1 }}
                                    />
                                  ))}
                                </View>
                              )}
                            </View>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={[styles.playLessonBtn, completed && styles.reviewLessonBtn]}
                          onPress={() => handleStartLesson(lesson)}
                          activeOpacity={0.8}
                        >
                          <Play size={12} color={completed ? colors.text : '#000'} />
                          <Text style={[styles.playLessonBtnText, completed && styles.reviewLessonBtnText]}>
                            {completed ? 'Review' : 'Play'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
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
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  heroCard: {
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderColor: 'rgba(0, 229, 255, 0.25)',
    padding: 16,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.cyan,
    textTransform: 'uppercase',
  },
  statPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statPillGold: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.gold,
  },
  statPillCyan: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.cyan,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  progressSection: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressSub: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  progressPct: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.cyan,
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.cyan,
    borderRadius: 4,
  },
  tierFilterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  tierFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tierFilterBtnActive: {
    backgroundColor: colors.cyan,
    borderColor: colors.cyan,
  },
  tierFilterBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  tierFilterBtnTextActive: {
    color: '#000',
    fontWeight: '900',
  },
  modulesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  modulesSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  moduleCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 0,
    overflow: 'hidden',
  },
  moduleCardExpanded: {
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  moduleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  moduleNumberBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  moduleNumberBoxComplete: {
    backgroundColor: colors.emerald,
    borderColor: colors.emerald,
  },
  moduleNumberText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.cyan,
  },
  moduleNumberTextComplete: {
    color: '#000',
  },
  moduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  moduleTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  moduleTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
  },
  moduleDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  coachTipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  coachTipText: {
    fontSize: 10,
    color: colors.cyan,
    fontStyle: 'italic',
    flex: 1,
  },
  moduleHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moduleCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  lessonsContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lessonRowCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  lessonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  lessonIndexBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIndexCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  lessonIndexText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  lessonTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  lessonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  lessonXp: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.cyan,
  },
  starsRow: {
    flexDirection: 'row',
  },
  playLessonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.cyan,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  playLessonBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
  },
  reviewLessonBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewLessonBtnText: {
    color: colors.text,
  },
});
