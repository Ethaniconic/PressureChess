import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMultiplayer } from '../context/MultiplayerContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { MULTIPLAYER_MODES, COUNTRIES } from '../data/multiplayerData';
import { 
  ChevronLeft, 
  Trophy, 
  Medal, 
  Flame, 
  Globe, 
  Calendar, 
  Users, 
  TrendingUp,
  Zap,
  Sparkles,
  Swords
} from 'lucide-react-native';

const METRICS = [
  { id: 'elo', name: 'Multiplayer Elo', icon: Swords },
  { id: 'weekly_xp', name: 'Weekly XP', icon: Zap },
  { id: 'monthly_xp', name: 'Monthly XP', icon: Calendar },
  { id: 'puzzle_streak', name: 'Tactics Streak', icon: Flame },
  { id: 'beta_founders', name: 'Beta Founders', icon: Sparkles }
];

export const LeaderboardScreen = ({ navigation }) => {
  const { getLeaderboard, userRatings } = useMultiplayer();
  const [activeMetric, setActiveMetric] = useState('elo');
  const [activeTimeframe, setActiveTimeframe] = useState('global'); // 'global' | 'weekly' | 'daily' | 'friends'
  const [activeMode, setActiveMode] = useState('blitz');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async (isMounted = true) => {
    setIsLoading(true);
    try {
      if (activeMetric === 'elo') {
        const data = await getLeaderboard(activeTimeframe, activeMode);
        if (isMounted) {
          setLeaderboardData(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      } else if (activeMetric === 'beta_founders') {
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase
            .from('profiles')
            .select('id, username, country, avatar_url, supporter_title, is_founding_player')
            .eq('is_founding_player', true)
            .order('created_at', { ascending: true })
            .limit(50);

          if (isMounted) {
            setLeaderboardData((data || []).map((p, i) => ({
              rank: i + 1,
              id: p.id,
              username: p.username || `Founder_${p.id.slice(0, 4)}`,
              country: p.country || 'US',
              avatar: p.avatar_url || '✨',
              rating: `Founder #${String(i + 1).padStart(3, '0')}`,
              tier: p.supporter_title || 'Founding Beta Player',
              wins: '✨',
              losses: '-'
            })));
            setIsLoading(false);
          }
        } else if (isMounted) {
          setLeaderboardData([]);
          setIsLoading(false);
        }
      } else if (activeMetric === 'puzzle_streak') {
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase
            .from('user_puzzle_stats')
            .select('user_id, highest_streak, current_streak, puzzle_rating')
            .order('highest_streak', { ascending: false })
            .limit(50);

          if (isMounted) {
            setLeaderboardData((data || []).map((p, i) => ({
              rank: i + 1,
              id: p.user_id,
              username: `Tactician_${p.user_id.slice(0, 4)}`,
              country: 'US',
              avatar: '⚡',
              rating: `${p.highest_streak || 0} Streak`,
              tier: `Rating ${p.puzzle_rating || 1200}`,
              wins: `${p.highest_streak || 0}`,
              losses: '-'
            })));
            setIsLoading(false);
          }
        } else if (isMounted) {
          setLeaderboardData([]);
          setIsLoading(false);
        }
      } else {
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase
            .from('profiles')
            .select('id, username, country, avatar_url, elo_rating, daily_streak')
            .order('elo_rating', { ascending: false })
            .limit(50);

          if (isMounted) {
            setLeaderboardData((data || []).map((p, i) => ({
              rank: i + 1,
              id: p.id,
              username: p.username || `Player_${p.id.slice(0, 4)}`,
              country: p.country || 'US',
              avatar: p.avatar_url || '♟️',
              rating: `${(p.elo_rating || 1200) * 3} XP`,
              tier: `${p.daily_streak || 1}d Streak`,
              wins: `${(p.elo_rating || 1200) * 3}`,
              losses: '-'
            })));
            setIsLoading(false);
          }
        } else if (isMounted) {
          setLeaderboardData([]);
          setIsLoading(false);
        }
      }
    } catch (err) {
      if (isMounted) {
        setLeaderboardData([]);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    loadData(isMounted);

    let sub = null;
    if (isSupabaseConfigured && supabase) {
      sub = supabase
        .channel('mobile_leaderboard_feed')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
          if (isMounted) loadData(isMounted);
        })
        .subscribe();
    }

    return () => {
      isMounted = false;
      if (sub) sub.unsubscribe();
    };
  }, [activeMetric, activeTimeframe, activeMode]);

  const topThree = leaderboardData.slice(0, 3);
  const remaining = leaderboardData.slice(3);


  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={22} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>PRESSURE LEADERBOARDS</Text>
          <Text style={styles.subtitle}>Global Rankings & Elo Tiers</Text>
        </View>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Metric Selector Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricScrollRow}>
          {METRICS.map((m) => {
            const isSelected = activeMetric === m.id;
            const Icon = m.icon;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.metricChip, isSelected && styles.metricChipSelected]}
                onPress={() => setActiveMetric(m.id)}
              >
                <Icon size={14} color={isSelected ? '#000' : '#00E5FF'} />
                <Text style={[styles.metricChipText, isSelected && styles.metricChipTextSelected]}>
                  {m.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Timeframe & Mode Filters (Only for Elo metric) */}
        {activeMetric === 'elo' && (
          <>
            <View style={styles.timeframeTabsRow}>
              {[
                { id: 'global', name: 'Global', icon: Globe },
                { id: 'weekly', name: 'Weekly', icon: Calendar },
                { id: 'daily', name: 'Daily', icon: Flame },
                { id: 'friends', name: 'Friends', icon: Users }
              ].map((tab) => {
                const isSelected = activeTimeframe === tab.id;
                const Icon = tab.icon;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[styles.timeframeTab, isSelected && styles.timeframeTabSelected]}
                    onPress={() => setActiveTimeframe(tab.id)}
                  >
                    <Icon size={13} color={isSelected ? '#000' : '#94A3B8'} />
                    <Text style={[styles.timeframeTabText, isSelected && styles.timeframeTabTextSelected]}>
                      {tab.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modeChipsRow}>
              {Object.values(MULTIPLAYER_MODES).map((m) => {
                const isSelected = activeMode === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.modeChip,
                      isSelected && { borderColor: m.accentColor, backgroundColor: `${m.accentColor}20` }
                    ]}
                    onPress={() => setActiveMode(m.id)}
                  >
                    <Text style={{ fontSize: 12 }}>{m.icon}</Text>
                    <Text style={[styles.modeChipText, isSelected && { color: m.accentColor, fontWeight: 'bold' }]}>
                      {m.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}


        {isLoading ? (
          <View style={{ padding: 60, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#E5A93C" />
            <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 12 }}>Connecting to live leaderboards...</Text>
          </View>
        ) : leaderboardData.length === 0 ? (
          <View style={{ padding: 48, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>♟️</Text>
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>No Ranked Players Yet</Text>
            <Text style={{ color: '#888', fontSize: 13, textAlign: 'center', marginTop: 6, maxWidth: 260 }}>
              Play matches and solve tactical challenges to claim the #1 spot!
            </Text>
          </View>
        ) : (
          <>
            {/* TOP 3 PODIUM */}
            {topThree.length > 0 && (
              <View style={styles.podiumContainer}>
                {/* Rank 2 - Silver */}
                {topThree[1] && (
                  <View style={[styles.podiumCol, styles.podiumColSilver]}>
                    <View style={[styles.podiumAvatar, styles.silverBorder]}>
                      <Text style={{ fontSize: 20 }}>🥈</Text>
                      <Text style={styles.podiumFlag}>{COUNTRIES[topThree[1].country]?.flag || '🌐'}</Text>
                    </View>
                    <Text style={styles.podiumUsername} numberOfLines={1}>{topThree[1].username}</Text>
                    <Text style={styles.podiumRating}>{topThree[1].rating}</Text>
                    <View style={styles.podiumStepSilver}>
                      <Text style={styles.podiumStepNum}>#2</Text>
                    </View>
                  </View>
                )}

                {/* Rank 1 - Gold */}
                {topThree[0] && (
                  <View style={[styles.podiumCol, styles.podiumColGold]}>
                    <View style={[styles.podiumAvatar, styles.goldBorder]}>
                      <Text style={{ fontSize: 24 }}>👑</Text>
                      <Text style={styles.podiumFlag}>{COUNTRIES[topThree[0].country]?.flag || '🌐'}</Text>
                    </View>
                    <Text style={[styles.podiumUsername, { color: '#F59E0B' }]} numberOfLines={1}>
                      {topThree[0].username}
                    </Text>
                    <Text style={[styles.podiumRating, { color: '#FFF' }]}>{topThree[0].rating}</Text>
                    <View style={styles.podiumStepGold}>
                      <Text style={[styles.podiumStepNum, { color: '#000' }]}>#1</Text>
                    </View>
                  </View>
                )}

                {/* Rank 3 - Bronze */}
                {topThree[2] && (
                  <View style={[styles.podiumCol, styles.podiumColBronze]}>
                    <View style={[styles.podiumAvatar, styles.bronzeBorder]}>
                      <Text style={{ fontSize: 18 }}>🥉</Text>
                      <Text style={styles.podiumFlag}>{COUNTRIES[topThree[2].country]?.flag || '🌐'}</Text>
                    </View>
                    <Text style={styles.podiumUsername} numberOfLines={1}>{topThree[2].username}</Text>
                    <Text style={styles.podiumRating}>{topThree[2].rating}</Text>
                    <View style={styles.podiumStepBronze}>
                      <Text style={styles.podiumStepNum}>#3</Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* RANKED LIST (Remaining) */}
            {remaining.length > 0 && (
              <View style={styles.listCard}>
                <View style={styles.listHeaderRow}>
                  <Text style={[styles.listHeaderCol, { width: 44 }]}>RANK</Text>
                  <Text style={[styles.listHeaderCol, { flex: 1 }]}>PLAYER</Text>
                  <Text style={[styles.listHeaderCol, { width: 70, textAlign: 'right' }]}>ELO</Text>
                  <Text style={[styles.listHeaderCol, { width: 64, textAlign: 'right' }]}>W/L</Text>
                </View>

                {remaining.map((item, idx) => {
                  const countryData = COUNTRIES[item.country] || COUNTRIES['US'];
                  const isMe = item.isCurrentUser;

                  return (
                    <View 
                      key={idx} 
                      style={[
                        styles.listRow,
                        isMe && styles.listRowMe
                      ]}
                    >
                      <View style={{ width: 44, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.rankNum, isMe && { color: '#00E5FF' }]}>
                          #{item.rank}
                        </Text>
                      </View>

                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontSize: 16 }}>{countryData.flag}</Text>
                        <View>
                          <Text style={[styles.rowUsername, isMe && { color: '#00E5FF', fontWeight: 'bold' }]}>
                            {item.username}
                          </Text>
                          {item.tier && (
                            <Text style={styles.rowTier}>{item.tier}</Text>
                          )}
                        </View>
                      </View>

                      <View style={{ width: 70, alignItems: 'flex-end' }}>
                        <Text style={[styles.rowRating, isMe && { color: '#00E5FF' }]}>
                          {item.rating}
                        </Text>
                      </View>

                      <View style={{ width: 64, alignItems: 'flex-end' }}>
                        <Text style={styles.rowStats}>
                          {item.wins}W / {item.losses}L
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#242424'
  },
  backBtn: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424'
  },
  titleContainer: {
    alignItems: 'center'
  },
  title: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1
  },
  subtitle: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  metricScrollRow: {
    gap: 8,
    paddingBottom: 12
  },
  metricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424'
  },
  metricChipSelected: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B'
  },
  metricChipText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '800'
  },
  metricChipTextSelected: {
    color: '#080808'
  },
  timeframeTabsRow: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 5,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#242424',
    marginBottom: 12
  },
  timeframeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 4
  },
  timeframeTabSelected: {
    backgroundColor: '#F59E0B'
  },
  timeframeTabText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 'bold'
  },
  timeframeTabTextSelected: {
    color: '#080808',
    fontWeight: '900'
  },
  modeChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20
  },
  modeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#242424'
  },
  modeChipText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600'
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    paddingTop: 16
  },
  podiumCol: {
    alignItems: 'center',
    width: 96
  },
  podiumColGold: {
    zIndex: 2
  },
  podiumColSilver: {
    zIndex: 1
  },
  podiumColBronze: {
    zIndex: 1
  },
  podiumAvatar: {
    position: 'relative',
    width: 52,
    height: 52,
    borderRadius: 5,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  goldBorder: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#F59E0B',
    backgroundColor: '#1C190E'
  },
  silverBorder: {
    borderWidth: 2,
    borderColor: '#94A3B8',
    backgroundColor: '#181818'
  },
  bronzeBorder: {
    borderWidth: 2,
    borderColor: '#D97706',
    backgroundColor: '#1A140A'
  },
  podiumFlag: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    fontSize: 13
  },
  podiumUsername: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2
  },
  podiumRating: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginBottom: 6
  },
  podiumStepGold: {
    width: '100%',
    height: 72,
    backgroundColor: '#F59E0B',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  podiumStepSilver: {
    width: '100%',
    height: 52,
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  podiumStepBronze: {
    width: '100%',
    height: 38,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  podiumStepNum: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900'
  },
  listCard: {
    borderRadius: 5,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderTopColor: '#383838',
    borderColor: '#242424',
    overflow: 'hidden'
  },
  listHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#202020',
    backgroundColor: '#161616'
  },
  listHeaderCol: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A'
  },
  listRowMe: {
    backgroundColor: '#1C190E',
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B'
  },
  rankNum: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  rowUsername: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600'
  },
  rowTier: {
    color: '#8E8E93',
    fontSize: 9
  },
  rowRating: {
    color: '#CBD5E1',
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  rowStats: {
    color: '#8E8E93',
    fontSize: 11
  }
});
