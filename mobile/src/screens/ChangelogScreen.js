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
import { useBeta } from '../context/BetaContext';
import { 
  ArrowLeft, 
  GitCommit, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  MessageSquarePlus, 
  Rocket 
} from 'lucide-react-native';

export const ChangelogScreen = ({ navigation }) => {
  const { changelog } = useBeta();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Changelog & Roadmap</Text>
          <Text style={styles.headerSub}>PressureChess Beta Evolution</Text>
        </View>
        <TouchableOpacity 
          style={styles.feedbackIconBtn}
          onPress={() => navigation.navigate('Feedback')}
        >
          <MessageSquarePlus size={18} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Beta Banner */}
        <GlassCard style={styles.bannerCard}>
          <View style={styles.bannerRow}>
            <View style={styles.bannerIconBox}>
              <Rocket size={24} color="#00E5FF" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
                <Text style={styles.badgeBeta}>PUBLIC BETA v0.5.0</Text>
                <Text style={styles.badgeFree}>100% FREE</Text>
              </View>
              <Text style={styles.bannerTitle}>Founding Release Timeline</Text>
              <Text style={styles.bannerSub}>
                Every feature is unlocked. We ship improvements weekly based on your combat and training data.
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Timeline Entries */}
        {changelog.map((entry, idx) => {
          const isLatest = idx === 0;
          return (
            <View key={entry.version} style={styles.timelineItem}>
              {/* Timeline dot & line */}
              <View style={styles.dotCol}>
                <View style={[styles.dot, isLatest && styles.dotActive]} />
                {idx < changelog.length - 1 && <View style={styles.line} />}
              </View>

              {/* Release Card */}
              <GlassCard style={[styles.entryCard, isLatest && styles.entryCardLatest]}>
                <View style={styles.entryHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.entryVersionRow}>
                      <Text style={styles.entryVersion}>{entry.version}</Text>
                      <View style={[styles.statusChip, isLatest ? styles.chipLatest : styles.chipPast]}>
                        <Text style={[styles.chipText, isLatest ? styles.chipTextLatest : styles.chipTextPast]}>
                          {entry.badge}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.entryTitle}>{entry.title}</Text>
                  </View>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                </View>

                <Text style={styles.entryDesc}>{entry.description}</Text>

                {/* Features */}
                {entry.features && entry.features.length > 0 && (
                  <View style={styles.featureSection}>
                    <Text style={styles.sectionHeader}>NEW CAPABILITIES</Text>
                    {entry.features.map((feat, fIdx) => (
                      <View key={fIdx} style={styles.featureRow}>
                        <CheckCircle2 size={13} color="#00E5FF" style={{ marginTop: 2 }} />
                        <Text style={styles.featureText}>{feat}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Fixes */}
                {entry.fixes && entry.fixes.length > 0 && (
                  <View style={styles.featureSection}>
                    <Text style={[styles.sectionHeader, { color: '#10B981' }]}>REFINEMENTS & FIXES</Text>
                    {entry.fixes.map((fix, fxIdx) => (
                      <View key={fxIdx} style={styles.featureRow}>
                        <Text style={{ color: '#10B981', fontSize: 10, marginTop: 1 }}>●</Text>
                        <Text style={styles.featureText}>{fix}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Upcoming */}
                {entry.upcoming && entry.upcoming.length > 0 && (
                  <View style={styles.featureSection}>
                    <Text style={[styles.sectionHeader, { color: '#F59E0B' }]}>UPCOMING ROADMAP</Text>
                    {entry.upcoming.map((up, uIdx) => (
                      <View key={uIdx} style={styles.featureRow}>
                        <Clock size={13} color="#F59E0B" style={{ marginTop: 2 }} />
                        <Text style={[styles.featureText, { color: '#CBD5E1' }]}>{up}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </GlassCard>
            </View>
          );
        })}

        {/* Suggest Button */}
        <TouchableOpacity 
          style={styles.suggestBtn}
          onPress={() => navigation.navigate('Feedback', { category: 'Feature Request' })}
        >
          <Sparkles size={16} color="#000" />
          <Text style={styles.suggestBtnText}>Suggest a Beta Feature</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)'
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 12
  },
  titleContainer: {
    flex: 1
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900'
  },
  headerSub: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '600'
  },
  feedbackIconBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  bannerCard: {
    padding: 16,
    marginBottom: 20,
    borderColor: 'rgba(0, 229, 255, 0.3)'
  },
  bannerRow: {
    flexDirection: 'row',
    gap: 12
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6
  },
  badgeBeta: {
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  badgeFree: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#10B981',
    fontSize: 9,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2
  },
  bannerSub: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  dotCol: {
    alignItems: 'center',
    width: 16
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#334155',
    borderWidth: 2,
    borderColor: '#64748B',
    marginTop: 16
  },
  dotActive: {
    backgroundColor: '#00E5FF',
    borderColor: '#38BDF8',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.8,
    shadowRadius: 6
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 4
  },
  entryCard: {
    flex: 1,
    padding: 14
  },
  entryCardLatest: {
    borderColor: 'rgba(0, 229, 255, 0.4)',
    backgroundColor: 'rgba(15, 23, 42, 0.85)'
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  entryVersionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2
  },
  entryVersion: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900'
  },
  statusChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  chipLatest: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)'
  },
  chipPast: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  chipText: {
    fontSize: 9,
    fontWeight: '800'
  },
  chipTextLatest: {
    color: '#00E5FF'
  },
  chipTextPast: {
    color: '#94A3B8'
  },
  entryTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700'
  },
  entryDate: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600'
  },
  entryDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10
  },
  featureSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)'
  },
  sectionHeader: {
    color: '#00E5FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 6
  },
  featureRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4
  },
  featureText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 11,
    lineHeight: 16
  },
  suggestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10
  },
  suggestBtnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '900'
  }
});
