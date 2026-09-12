import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  Switch,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useMultiplayer } from '../context/MultiplayerContext';
import { useAnalysis } from '../context/AnalysisContext';
import { useBeta } from '../context/BetaContext';
import { fetchGameHistory } from '../services/api';
import { COUNTRIES } from '../data/multiplayerData';
import { 
  Trophy, 
  Flame, 
  Swords, 
  LogOut, 
  User, 
  ShieldAlert, 
  ShieldCheck,
  Zap, 
  Globe, 
  Bot, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Bell, 
  DownloadCloud, 
  Edit3, 
  MessageSquarePlus, 
  GitCommit 
} from 'lucide-react-native';

export const ProfileScreen = ({ navigation }) => {
  const { user, isGuest, logout } = useAuth();
  const { 
    userCountry, 
    updateProfileCountry, 
    userRatings, 
    userStats, 
    matchHistory 
  } = useMultiplayer();
  const { analyzePgn } = useAnalysis();

  const {
    isFoundingPlayer,
    supporterTitle,
    profileFrame,
    updateProfileFrame,
    profileFrames,
    avatarId,
    updateAvatar,
    avatarOptions,
    bio,
    updateBio,
    favoriteOpening,
    updateFavoriteOpening,
    favoriteOpenings,
    notificationPreferences,
    updateNotificationPreferences,
    openWelcomeModal
  } = useBeta();

  const [offlineGames, setOfflineGames] = useState([]);
  const [activeTab, setActiveTab] = useState('online'); // 'online' | 'offline'
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showFrameModal, setShowFrameModal] = useState(false);
  const [showOpeningModal, setShowOpeningModal] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(bio);

  useEffect(() => {
    fetchGameHistory(user?.id).then((data) => setOfflineGames(data || []));
  }, [user]);

  useEffect(() => {
    setBioInput(bio);
  }, [bio]);

  const currentCountry = COUNTRIES[userCountry] || COUNTRIES['US'];
  const currentAvatar = avatarOptions.find((a) => a.id === avatarId) || avatarOptions[0];
  const currentFrame = profileFrames.find((f) => f.id === profileFrame) || profileFrames[0];

  const handleReviewMatch = (pgn) => {
    if (pgn && analyzePgn) {
      analyzePgn(pgn);
      navigation.navigate('GameReview');
    }
  };

  const handleSaveBio = () => {
    updateBio(bioInput.trim() || 'Founding Beta Player exploring tactical pressure.');
    setIsEditingBio(false);
  };

  const totalMatches = (userStats.wins || 0) + (userStats.losses || 0) + (userStats.draws || 0);
  const winRate = totalMatches > 0 ? Math.round((userStats.wins / totalMatches) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Guest alert if applicable */}
        {isGuest && (
          <View style={styles.guestBanner}>
            <ShieldAlert size={18} color={colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.guestTitle}>Guest Mode Active</Text>
              <Text style={styles.guestSub}>Ratings saved locally. Sign up to sync across devices!</Text>
            </View>
            <TouchableOpacity 
              style={styles.guestBtn}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.guestBtnText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Profile Header Card with Glowing Beta Frame */}
        <GlassCard style={[styles.profileCard, { borderColor: currentFrame.color || '#00E5FF' }]}>
          <View style={styles.avatarRow}>
            <TouchableOpacity 
              style={[
                styles.avatarBox, 
                { borderColor: currentFrame.color || '#00E5FF' }
              ]}
              onPress={() => setShowAvatarModal(true)}
            >
              <Text style={styles.avatarIcon}>{currentAvatar.emoji}</Text>
              <TouchableOpacity 
                style={styles.flagBadgeTouch}
                onPress={() => setShowCountryModal(true)}
              >
                <Text style={{ fontSize: 16 }}>{currentCountry.flag}</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <View style={styles.usernameRow}>
                <Text style={styles.username}>{user?.username || 'Tactician'}</Text>
                <TouchableOpacity 
                  style={styles.countryBtn}
                  onPress={() => setShowCountryModal(true)}
                >
                  <Text style={styles.countryBtnText}>{currentCountry.flag} {userCountry}</Text>
                </TouchableOpacity>
              </View>

              {/* Founding Beta Badge */}
              <View style={styles.founderTagRow}>
                <View style={styles.founderBadge}>
                  <Sparkles size={11} color="#00E5FF" />
                  <Text style={styles.founderBadgeText}>FOUNDING BETA PLAYER</Text>
                </View>
              </View>

              <Text style={styles.tierText}>{supporterTitle}</Text>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.bioContainer}>
            {isEditingBio ? (
              <View style={styles.bioEditRow}>
                <TextInput
                  style={styles.bioInput}
                  value={bioInput}
                  onChangeText={setBioInput}
                  placeholder="Enter your player motto or tactical goals..."
                  placeholderTextColor="#64748B"
                  multiline
                />
                <TouchableOpacity style={styles.saveBioBtn} onPress={handleSaveBio}>
                  <Text style={styles.saveBioBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.bioDisplayRow}
                onPress={() => setIsEditingBio(true)}
              >
                <Text style={styles.bioText}>{bio}</Text>
                <Edit3 size={13} color="#00E5FF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            )}
          </View>

          {/* Favorite Opening Chip */}
          <TouchableOpacity 
            style={styles.openingChip}
            onPress={() => setShowOpeningModal(true)}
          >
            <Text style={styles.openingLabel}>FAVORITE OPENING:</Text>
            <Text style={styles.openingVal}>{favoriteOpening}</Text>
            <ChevronRight size={13} color="#CBD5E1" />
          </TouchableOpacity>

          {/* Quick Overall Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.badgeItem}>
              <Trophy size={16} color="#00E5FF" />
              <Text style={[styles.badgeNum, { color: '#00E5FF' }]}>{userRatings.overall || 1340}</Text>
              <Text style={styles.badgeLabel}>OVERALL ELO</Text>
            </View>

            <View style={styles.badgeItem}>
              <Flame size={16} color="#F59E0B" />
              <Text style={[styles.badgeNum, { color: '#F59E0B' }]}>{user?.daily_streak || 1}d</Text>
              <Text style={styles.badgeLabel}>STREAK</Text>
            </View>

            <View style={styles.badgeItem}>
              <Swords size={16} color="#10B981" />
              <Text style={styles.badgeNum}>{totalMatches}</Text>
              <Text style={styles.badgeLabel}>MATCHES</Text>
            </View>
          </View>
        </GlassCard>

        {/* Beta Perks & Customization Hub */}
        <Text style={styles.sectionTitle}>BETA CUSTOMIZATION & PERKS</Text>
        <GlassCard style={styles.settingsGroupCard}>
          <TouchableOpacity 
            style={styles.settingsRow}
            onPress={() => setShowAvatarModal(true)}
          >
            <View style={styles.settingsIconBox}>
              <Text style={{ fontSize: 18 }}>{currentAvatar.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsRowTitle}>Tactical Avatar Persona</Text>
              <Text style={styles.settingsRowSub}>{currentAvatar.name} ({currentAvatar.category})</Text>
            </View>
            <ChevronRight size={16} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          <TouchableOpacity 
            style={styles.settingsRow}
            onPress={() => setShowFrameModal(true)}
          >
            <View style={[styles.settingsIconBox, { borderColor: currentFrame.color || '#00E5FF', borderWidth: 2 }]}>
              <Sparkles size={16} color={currentFrame.color || '#00E5FF'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsRowTitle}>Profile Frame Aura</Text>
              <Text style={styles.settingsRowSub}>{currentFrame.name} • {currentFrame.badge}</Text>
            </View>
            <ChevronRight size={16} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          <TouchableOpacity 
            style={styles.settingsRow}
            onPress={openWelcomeModal}
          >
            <View style={styles.settingsIconBox}>
              <ShieldCheck size={16} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsRowTitle}>View Founding Beta Perks</Text>
              <Text style={styles.settingsRowSub}>Permanent lifetime founder privileges & free access</Text>
            </View>
            <ChevronRight size={16} color="#64748B" />
          </TouchableOpacity>
        </GlassCard>

        {/* Notification Preferences */}
        <Text style={styles.sectionTitle}>SMART NOTIFICATION PREFERENCES</Text>
        <GlassCard style={styles.settingsGroupCard}>
          <View style={styles.notifRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsRowTitle}>Daily Tactics Reminder</Text>
              <Text style={styles.settingsRowSub}>Daily alert to train tactical vision under pressure</Text>
            </View>
            <Switch
              value={notificationPreferences.dailyReminder}
              onValueChange={(val) => updateNotificationPreferences({ ...notificationPreferences, dailyReminder: val })}
              trackColor={{ false: '#1E293B', true: '#00E5FF' }}
              thumbColor={notificationPreferences.dailyReminder ? '#000' : '#64748B'}
            />
          </View>

          <View style={styles.settingsDivider} />

          <View style={styles.notifRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsRowTitle}>Puzzle Scramble Reminders</Text>
              <Text style={styles.settingsRowSub}>Alerts when new championship tactical scrambles land</Text>
            </View>
            <Switch
              value={notificationPreferences.puzzleReminder}
              onValueChange={(val) => updateNotificationPreferences({ ...notificationPreferences, puzzleReminder: val })}
              trackColor={{ false: '#1E293B', true: '#00E5FF' }}
              thumbColor={notificationPreferences.puzzleReminder ? '#000' : '#64748B'}
            />
          </View>

          <View style={styles.settingsDivider} />

          <View style={styles.notifRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsRowTitle}>Streak Protection Alerts</Text>
              <Text style={styles.settingsRowSub}>Warning 3 hours before your daily streak expires</Text>
            </View>
            <Switch
              value={notificationPreferences.streakReminder}
              onValueChange={(val) => updateNotificationPreferences({ ...notificationPreferences, streakReminder: val })}
              trackColor={{ false: '#1E293B', true: '#00E5FF' }}
              thumbColor={notificationPreferences.streakReminder ? '#000' : '#64748B'}
            />
          </View>

          <View style={styles.settingsDivider} />

          <View style={styles.notifRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingsRowTitle}>Beta Updates & Patch Notes</Text>
              <Text style={styles.settingsRowSub}>Instant updates when engine analysis or features deploy</Text>
            </View>
            <Switch
              value={notificationPreferences.betaUpdates}
              onValueChange={(val) => updateNotificationPreferences({ ...notificationPreferences, betaUpdates: val })}
              trackColor={{ false: '#1E293B', true: '#00E5FF' }}
              thumbColor={notificationPreferences.betaUpdates ? '#000' : '#64748B'}
            />
          </View>
        </GlassCard>

        {/* Offline Cache Status */}
        <Text style={styles.sectionTitle}>OFFLINE CONTENT CACHING</Text>
        <GlassCard style={styles.cacheCard}>
          <View style={styles.cacheHeader}>
            <View style={styles.cacheIconBox}>
              <DownloadCloud size={20} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cacheTitle}>Offline Training Cache Active</Text>
              <Text style={styles.cacheSub}>Zero-latency tactical practice with zero data connection</Text>
            </View>
          </View>
          <View style={styles.cacheGrid}>
            <View style={styles.cachePill}>
              <CheckCircle2 size={12} color="#10B981" />
              <Text style={styles.cachePillText}>17 Academy Lessons</Text>
            </View>
            <View style={styles.cachePill}>
              <CheckCircle2 size={12} color="#10B981" />
              <Text style={styles.cachePillText}>20 Pressure Puzzles</Text>
            </View>
            <View style={styles.cachePill}>
              <CheckCircle2 size={12} color="#10B981" />
              <Text style={styles.cachePillText}>Local Elo Sync</Text>
            </View>
          </View>
        </GlassCard>

        {/* Beta Feedback & Changelog Navigation */}
        <Text style={styles.sectionTitle}>COMMUNITY & BETA FEEDBACK</Text>
        <View style={styles.feedbackRow}>
          <TouchableOpacity 
            style={styles.feedbackBtnPrimary}
            onPress={() => navigation.navigate('Feedback')}
          >
            <MessageSquarePlus size={16} color="#000" />
            <Text style={styles.feedbackBtnPrimaryText}>Send Beta Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.changelogBtnSecondary}
            onPress={() => navigation.navigate('Changelog')}
          >
            <GitCommit size={16} color="#00E5FF" />
            <Text style={styles.changelogBtnSecondaryText}>v0.5.0 Changelog</Text>
          </TouchableOpacity>
        </View>

        {/* Mode Ratings 4-Grid */}
        <Text style={styles.sectionTitle}>COMPETITIVE MODE RATINGS</Text>
        <View style={styles.modeRatingsGrid}>
          <View style={[styles.modeRatingCard, { borderColor: 'rgba(255, 107, 0, 0.3)' }]}>
            <Text style={styles.modeCardIcon}>⚡</Text>
            <Text style={styles.modeCardName}>Bullet</Text>
            <Text style={styles.modeCardVal}>{userRatings.bullet || 1300}</Text>
          </View>

          <View style={[styles.modeRatingCard, { borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
            <Text style={styles.modeCardIcon}>🔥</Text>
            <Text style={styles.modeCardName}>Blitz</Text>
            <Text style={styles.modeCardVal}>{userRatings.blitz || 1340}</Text>
          </View>

          <View style={[styles.modeRatingCard, { borderColor: 'rgba(0, 229, 255, 0.3)' }]}>
            <Text style={styles.modeCardIcon}>⏱️</Text>
            <Text style={styles.modeCardName}>Rapid</Text>
            <Text style={styles.modeCardVal}>{userRatings.rapid || 1400}</Text>
          </View>

          <View style={[styles.modeRatingCard, { borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
            <Text style={styles.modeCardIcon}>🏛️</Text>
            <Text style={styles.modeCardName}>Classical</Text>
            <Text style={styles.modeCardVal}>{userRatings.classical || 1440}</Text>
          </View>
        </View>

        {/* W/L/D Stats Row */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.miniCard}>
            <Text style={[styles.miniVal, { color: '#10B981' }]}>{userStats.wins || 0}</Text>
            <Text style={styles.miniLabel}>Wins ({winRate}%)</Text>
          </GlassCard>

          <GlassCard style={styles.miniCard}>
            <Text style={[styles.miniVal, { color: '#EF4444' }]}>{userStats.losses || 0}</Text>
            <Text style={styles.miniLabel}>Losses</Text>
          </GlassCard>

          <GlassCard style={styles.miniCard}>
            <Text style={[styles.miniVal, { color: '#94A3B8' }]}>{userStats.draws || 0}</Text>
            <Text style={styles.miniLabel}>Draws</Text>
          </GlassCard>
        </View>

        {/* Match History Tabs */}
        <GlassCard style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Match History & PGN Archive</Text>
            <View style={styles.subTabsRow}>
              <TouchableOpacity
                style={[styles.subTab, activeTab === 'online' && styles.subTabActive]}
                onPress={() => setActiveTab('online')}
              >
                <Text style={[styles.subTabText, activeTab === 'online' && styles.subTabTextActive]}>
                  Online ({matchHistory.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subTab, activeTab === 'offline' && styles.subTabActive]}
                onPress={() => setActiveTab('offline')}
              >
                <Text style={[styles.subTabText, activeTab === 'offline' && styles.subTabTextActive]}>
                  Offline ({offlineGames.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ONLINE MATCHES */}
          {activeTab === 'online' && (
            matchHistory.length === 0 ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 28, marginBottom: 8 }}>⚔️</Text>
                <Text style={styles.noGamesText}>No online matches played yet.</Text>
                <TouchableOpacity
                  style={styles.enterLobbyBtn}
                  onPress={() => navigation.navigate('MultiplayerLobby')}
                >
                  <Text style={styles.enterLobbyBtnText}>Enter Multiplayer Lobby</Text>
                </TouchableOpacity>
              </View>
            ) : (
              matchHistory.map((m) => {
                const oppC = COUNTRIES[m.opponent_country] || COUNTRIES['US'];
                const isWin = m.result === 'win';
                const isLoss = m.result === 'loss';

                return (
                  <View key={m.id} style={styles.matchRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ fontSize: 14 }}>{oppC.flag}</Text>
                        <Text style={styles.oppNameText}>{m.opponent_name}</Text>
                        <Text style={styles.modeBadgeText}>
                          {m.mode} • {m.moves_count || 0} moves
                        </Text>
                      </View>
                      <Text style={styles.matchSubText}>
                        Played as {m.player_color} • {m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Today'}
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={[
                          styles.resultPill,
                          isWin ? styles.winPill : (isLoss ? styles.lossPill : styles.drawPill)
                        ]}>
                          <Text style={[
                            styles.resultPillText,
                            isWin ? { color: '#10B981' } : (isLoss ? { color: '#EF4444' } : { color: '#94A3B8' })
                          ]}>
                            {m.result?.toUpperCase()}
                          </Text>
                        </View>
                        {m.pgn && (
                          <TouchableOpacity
                            style={styles.coachReviewBtn}
                            onPress={() => handleReviewMatch(m.pgn)}
                          >
                            <Bot size={13} color="#00E5FF" />
                            <Text style={styles.coachReviewBtnText}>Coach</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            )
          )}

          {/* OFFLINE MATCHES */}
          {activeTab === 'offline' && (
            offlineGames.length === 0 ? (
              <Text style={styles.noGamesText}>No offline matches saved.</Text>
            ) : (
              offlineGames.map((g) => (
                <View key={g.id} style={styles.matchRow}>
                  <View>
                    <Text style={styles.oppNameText}>{g.opponent_name || 'Pass & Play'}</Text>
                    <Text style={styles.matchSubText}>{g.moves_count || 0} moves • {g.created_at ? new Date(g.created_at).toLocaleDateString() : 'Today'}</Text>
                  </View>

                  <View style={[styles.resultPill, g.result === '1-0' ? styles.winPill : styles.drawPill]}>
                    <Text style={[styles.resultPillText, g.result === '1-0' ? { color: '#10B981' } : { color: '#94A3B8' }]}>
                      {g.result}
                    </Text>
                  </View>
                </View>
              ))
            )
          )}
        </GlassCard>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut size={16} color={colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Country Selection Modal */}
      <Modal visible={showCountryModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.countryModalCard}>
            <Text style={styles.modalTitle}>Select Your Country</Text>
            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
              {Object.entries(COUNTRIES).map(([code, data]) => {
                const isSelected = userCountry === code;
                return (
                  <TouchableOpacity
                    key={code}
                    style={[styles.countryRow, isSelected && styles.countryRowSelected]}
                    onPress={() => {
                      updateProfileCountry(code);
                      setShowCountryModal(false);
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Text style={{ fontSize: 20 }}>{data.flag}</Text>
                      <Text style={[styles.countryName, isSelected && { color: '#00E5FF', fontWeight: 'bold' }]}>
                        {data.name}
                      </Text>
                    </View>
                    {isSelected && <Text style={{ color: '#00E5FF', fontWeight: 'bold' }}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowCountryModal(false)}
            >
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal visible={showAvatarModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.countryModalCard}>
            <Text style={styles.modalTitle}>Choose Tactical Avatar</Text>
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              <View style={styles.avatarGrid}>
                {avatarOptions.map((av) => {
                  const isSelected = avatarId === av.id;
                  return (
                    <TouchableOpacity
                      key={av.id}
                      style={[styles.avatarPickCard, isSelected && styles.avatarPickCardSelected]}
                      onPress={() => {
                        updateAvatar(av.id);
                        setShowAvatarModal(false);
                      }}
                    >
                      <Text style={{ fontSize: 28 }}>{av.emoji}</Text>
                      <Text style={[styles.avatarPickName, isSelected && { color: '#00E5FF', fontWeight: 'bold' }]}>
                        {av.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowAvatarModal(false)}
            >
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Frame Selection Modal */}
      <Modal visible={showFrameModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.countryModalCard}>
            <Text style={styles.modalTitle}>Choose Profile Frame Aura</Text>
            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
              {profileFrames.map((frame) => {
                const isSelected = profileFrame === frame.id;
                return (
                  <TouchableOpacity
                    key={frame.id}
                    style={[styles.frameRow, isSelected && styles.countryRowSelected]}
                    onPress={() => {
                      updateProfileFrame(frame.id);
                      setShowFrameModal(false);
                    }}
                  >
                    <View style={[styles.frameIndicator, { borderColor: frame.color }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.countryName, isSelected && { color: frame.color, fontWeight: 'bold' }]}>
                        {frame.name}
                      </Text>
                      <Text style={styles.frameBadgeText}>{frame.badge}</Text>
                    </View>
                    {isSelected && <Text style={{ color: frame.color, fontWeight: 'bold' }}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowFrameModal(false)}
            >
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Favorite Opening Picker Modal */}
      <Modal visible={showOpeningModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.countryModalCard}>
            <Text style={styles.modalTitle}>Select Favorite Opening</Text>
            <ScrollView style={{ maxHeight: 340 }} showsVerticalScrollIndicator={false}>
              {favoriteOpenings.map((op, idx) => {
                const isSelected = favoriteOpening === op;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.countryRow, isSelected && styles.countryRowSelected]}
                    onPress={() => {
                      updateFavoriteOpening(op);
                      setShowOpeningModal(false);
                    }}
                  >
                    <Text style={[styles.countryName, isSelected && { color: '#00E5FF', fontWeight: 'bold' }]}>
                      {op}
                    </Text>
                    {isSelected && <Text style={{ color: '#00E5FF', fontWeight: 'bold' }}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowOpeningModal(false)}
            >
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1C190E',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.35)',
    borderRadius: 5,
    padding: 12,
  },
  guestTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
  guestSub: {
    fontSize: 10,
    color: '#94A3B8',
  },
  guestBtn: {
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  guestBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#080808',
  },
  profileCard: {
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderTopColor: '#383838',
    borderColor: '#242424'
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  avatarBox: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#2E2E2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 28,
  },
  flagBadgeTouch: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#121212',
    borderRadius: 3,
    padding: 2
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  username: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
  },
  founderTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 2
  },
  founderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1C190E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.4)'
  },
  founderBadgeText: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  countryBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#2C2C2C'
  },
  countryBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#CBD5E1'
  },
  tierText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  },
  bioContainer: {
    marginTop: 12,
    backgroundColor: '#181818',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#262626'
  },
  bioDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bioText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 17
  },
  bioEditRow: {
    gap: 8
  },
  bioInput: {
    color: '#FFF',
    fontSize: 12,
    minHeight: 40,
    backgroundColor: '#111111',
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#2C2C2C'
  },
  saveBioBtn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4
  },
  saveBioBtnText: {
    color: '#080808',
    fontSize: 11,
    fontWeight: '900'
  },
  openingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#262626'
  },
  openingLabel: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '900'
  },
  openingVal: {
    flex: 1,
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600'
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#242424'
  },
  badgeItem: {
    alignItems: 'center'
  },
  badgeNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 4
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8E8E93',
    marginTop: 2
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8E8E93',
    letterSpacing: 1.5,
    marginTop: 4,
    marginBottom: -6
  },
  settingsGroupCard: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderTopColor: '#383838',
    borderColor: '#242424'
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8
  },
  settingsIconBox: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center'
  },
  settingsRowTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700'
  },
  settingsRowSub: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 1
  },
  settingsDivider: {
    height: 1,
    backgroundColor: '#242424',
    marginVertical: 4
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  cacheCard: {
    padding: 14,
    borderRadius: 5,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderTopColor: '#383838',
    borderColor: '#242424'
  },
  cacheHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10
  },
  cacheIconBox: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cacheTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800'
  },
  cacheSub: {
    color: '#94A3B8',
    fontSize: 10
  },
  cacheGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  cachePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  cachePillText: {
    color: '#A7F3D0',
    fontSize: 10,
    fontWeight: '700'
  },
  feedbackRow: {
    flexDirection: 'row',
    gap: 10
  },
  feedbackBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    paddingVertical: 12,
    borderRadius: 5
  },
  feedbackBtnPrimaryText: {
    color: '#080808',
    fontSize: 12,
    fontWeight: '900'
  },
  changelogBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#262626',
    paddingVertical: 12,
    borderRadius: 5
  },
  changelogBtnSecondaryText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '900'
  },
  modeRatingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeRatingCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#121212',
    borderRadius: 5,
    borderWidth: 1,
    borderTopColor: '#333333',
    borderColor: '#242424',
    padding: 12,
    alignItems: 'center'
  },
  modeCardIcon: {
    fontSize: 22,
    marginBottom: 4
  },
  modeCardName: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  modeCardVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 2
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  miniCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderTopColor: '#333333',
    borderColor: '#242424'
  },
  miniVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  miniLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2
  },
  historyCard: {
    padding: 16,
    borderRadius: 5,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderTopColor: '#383838',
    borderColor: '#242424'
  },
  historyHeader: {
    marginBottom: 12
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 8
  },
  subTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#181818',
    borderRadius: 4,
    padding: 2,
    borderWidth: 1,
    borderColor: '#242424'
  },
  subTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 3
  },
  subTabActive: {
    backgroundColor: colors.gold
  },
  subTabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94A3B8'
  },
  subTabTextActive: {
    color: '#080808'
  },
  noGamesText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 8
  },
  enterLobbyBtn: {
    backgroundColor: colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 8
  },
  enterLobbyBtnText: {
    color: '#080808',
    fontSize: 11,
    fontWeight: '900'
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#202020'
  },
  oppNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF'
  },
  modeBadgeText: {
    fontSize: 10,
    color: '#94A3B8'
  },
  matchSubText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2
  },
  resultPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3
  },
  winPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)'
  },
  lossPill: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)'
  },
  drawPill: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)'
  },
  resultPillText: {
    fontSize: 9,
    fontWeight: '900'
  },
  coachReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1C190E',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3
  },
  coachReviewBtnText: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: '800'
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  logoutText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: 'bold'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  countryModalCard: {
    width: '100%',
    backgroundColor: '#121212',
    borderRadius: 5,
    borderWidth: 1,
    borderTopColor: '#383838',
    borderColor: '#242424',
    padding: 16
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 14,
    textAlign: 'center'
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4
  },
  countryRowSelected: {
    backgroundColor: '#1C190E',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.4)'
  },
  countryName: {
    fontSize: 13,
    color: '#CBD5E1'
  },
  closeModalBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 5
  },
  closeModalBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center'
  },
  avatarPickCard: {
    width: '30%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#262626'
  },
  avatarPickCardSelected: {
    borderColor: colors.gold,
    backgroundColor: '#1C190E'
  },
  avatarPickName: {
    color: '#8E8E93',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center'
  },
  frameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4
  },
  frameIndicator: {
    width: 24,
    height: 24,
    borderRadius: 3,
    borderWidth: 2,
    backgroundColor: '#181818'
  },
  frameBadgeText: {
    color: '#8E8E93',
    fontSize: 10,
    marginTop: 1
  }
});
