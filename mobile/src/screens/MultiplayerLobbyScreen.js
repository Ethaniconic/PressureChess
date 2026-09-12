import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMultiplayer } from '../context/MultiplayerContext';
import { useAuth } from '../context/AuthContext';
import { MULTIPLAYER_MODES, COUNTRIES } from '../data/multiplayerData';
import { colors } from '../theme/colors';
import { 
  ChevronLeft, 
  Swords, 
  Trophy, 
  Users, 
  Clock, 
  ArrowRight 
} from 'lucide-react-native';

export const MultiplayerLobbyScreen = ({ navigation }) => {
  const { user } = useAuth();
  const {
    selectedMode,
    setSelectedMode,
    selectedTimeControl,
    setSelectedTimeControl,
    startQuickMatch,
    createPrivateRoom,
    joinPrivateRoom,
    userCountry,
    userRatings
  } = useMultiplayer();

  const [inputCode, setInputCode] = useState('');

  const activeModeConfig = MULTIPLAYER_MODES[selectedMode] || MULTIPLAYER_MODES.blitz;
  const currentCountry = COUNTRIES[userCountry] || COUNTRIES['US'];

  const handleStartSearch = () => {
    startQuickMatch(selectedMode, selectedTimeControl);
    navigation.navigate('MultiplayerGame');
  };

  const handleCreateRoom = () => {
    createPrivateRoom(selectedMode, selectedTimeControl);
    navigation.navigate('MultiplayerGame');
  };

  const handleJoinByCode = () => {
    const trimmed = inputCode.trim().toUpperCase();
    if (!trimmed) {
      Alert.alert('Invalid Code', 'Please enter a valid 6-character room code.');
      return;
    }
    joinPrivateRoom(trimmed);
    navigation.navigate('MultiplayerGame');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>MULTIPLAYER ARENA</Text>
          <Text style={styles.subtitle}>Ranked • Clocks • Global Elo</Text>
        </View>

        <TouchableOpacity 
          style={styles.leaderboardIconBtn}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <Trophy size={20} color={colors.gold} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Rating Banner */}
        <View style={styles.userBanner}>
          <View style={styles.userLeft}>
            <View style={styles.avatarPill}>
              <Text style={styles.avatarEmoji}>♟️</Text>
              <Text style={styles.flagBadge}>{currentCountry.flag}</Text>
            </View>
            <View>
              <Text style={styles.usernameText}>{user?.username || 'Tactician'}</Text>
              <Text style={styles.userModeRating}>
                {activeModeConfig.name} Rating: <Text style={{ color: colors.gold, fontWeight: 'bold' }}>{userRatings[selectedMode] || 1200}</Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.leaderboardChip}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <Trophy size={14} color={colors.gold} />
            <Text style={styles.leaderboardChipText}>Top 100</Text>
          </TouchableOpacity>
        </View>

        {/* Mode Selector Tabs */}
        <Text style={styles.sectionHeading}>SELECT MULTIPLAYER MODE</Text>
        <View style={styles.modeTabsRow}>
          {Object.values(MULTIPLAYER_MODES).map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeTab,
                  isSelected && styles.modeTabSelected
                ]}
                onPress={() => {
                  setSelectedMode(mode.id);
                  setSelectedTimeControl(mode.timeControls[0].id);
                }}
              >
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                <Text style={[styles.modeName, isSelected && { color: colors.gold, fontWeight: 'bold' }]}>
                  {mode.name}
                </Text>
                <Text style={[styles.modeRatingBadge, isSelected && { color: colors.goldLight }]}>
                  {userRatings[mode.id] || 1200}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Time Control Cards */}
        <Text style={styles.sectionHeading}>TIME CONTROLS ({activeModeConfig.name.toUpperCase()})</Text>
        <View style={styles.timeControlsGrid}>
          {activeModeConfig.timeControls.map((tc) => {
            const isSelected = selectedTimeControl === tc.id;
            return (
              <TouchableOpacity
                key={tc.id}
                style={[
                  styles.timeCard,
                  isSelected && styles.timeCardSelected
                ]}
                onPress={() => setSelectedTimeControl(tc.id)}
              >
                <View style={styles.timeCardHeader}>
                  <Clock size={16} color={isSelected ? colors.gold : '#94A3B8'} />
                  <Text style={[styles.timeTag, isSelected && { color: colors.gold, borderColor: colors.gold }]}>
                    {tc.tag}
                  </Text>
                </View>
                <Text style={[styles.timeDuration, isSelected && { color: '#FFF' }]}>{tc.name}</Text>
                <Text style={styles.timeControlDesc}>
                  {tc.seconds / 60} min {tc.increment > 0 ? `+ ${tc.increment}s` : 'no increment'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Match Action Button */}
        <View style={styles.actionCard}>
          <View style={styles.actionCardInfo}>
            <Text style={styles.actionTitle}>Ranked Matchmaking</Text>
            <Text style={styles.actionDesc}>
              Pair against a live opponent around your Elo rating ({userRatings[selectedMode] || 1200}).
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryLaunchBtn}
            onPress={handleStartSearch}
          >
            <Swords size={20} color="#080808" />
            <Text style={styles.primaryLaunchBtnText}>FIND OPPONENT ({selectedTimeControl})</Text>
          </TouchableOpacity>
        </View>

        {/* Private Room / Challenge Friend */}
        <View style={styles.privateRoomCard}>
          <View style={styles.privateHeader}>
            <Users size={18} color={colors.gold} />
            <Text style={styles.privateTitle}>Play with a Friend</Text>
          </View>

          <Text style={styles.privateDesc}>
            Generate a private 6-character room code to invite a friend, or enter an invite code below.
          </Text>

          <View style={styles.privateActionsRow}>
            <TouchableOpacity
              style={styles.createRoomBtn}
              onPress={handleCreateRoom}
            >
              <Text style={styles.createRoomBtnText}>Create Private Room</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.joinInputRow}>
            <TextInput
              style={styles.codeInput}
              placeholder="ENTER ROOM CODE (e.g. PR-8291)"
              placeholderTextColor="#64748B"
              value={inputCode}
              onChangeText={setInputCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.joinBtn}
              onPress={handleJoinByCode}
            >
              <Text style={styles.joinBtnText}>Join</Text>
              <ArrowRight size={16} color="#080808" />
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
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1
  },
  subtitle: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 1
  },
  leaderboardIconBtn: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  userBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 5,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderTopColor: '#383838',
    borderColor: '#242424',
    marginBottom: 20
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatarPill: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: 4,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarEmoji: {
    fontSize: 20
  },
  flagBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    fontSize: 13
  },
  usernameText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold'
  },
  userModeRating: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2
  },
  leaderboardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#1C190E',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.4)'
  },
  leaderboardChipText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: 'bold'
  },
  sectionHeading: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4
  },
  modeTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20
  },
  modeTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 5,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderTopColor: '#333333',
    borderColor: '#242424'
  },
  modeTabSelected: {
    backgroundColor: '#1C190E',
    borderColor: 'rgba(229, 169, 60, 0.5)',
    borderTopColor: colors.gold
  },
  modeIcon: {
    fontSize: 20,
    marginBottom: 4
  },
  modeName: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600'
  },
  modeRatingBadge: {
    color: '#8E8E93',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2
  },
  timeControlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20
  },
  timeCard: {
    width: '48%',
    padding: 14,
    borderRadius: 5,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderTopColor: '#333333',
    borderColor: '#242424'
  },
  timeCardSelected: {
    borderColor: 'rgba(229, 169, 60, 0.6)',
    borderTopColor: colors.gold,
    backgroundColor: '#1A170F'
  },
  timeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  timeTag: {
    color: '#8E8E93',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#303030'
  },
  timeDuration: {
    color: '#CBD5E1',
    fontSize: 18,
    fontWeight: '900'
  },
  timeControlDesc: {
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 3
  },
  actionCard: {
    padding: 16,
    borderRadius: 5,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderTopColor: '#383838',
    borderColor: '#242424',
    marginBottom: 20
  },
  actionCardInfo: {
    marginBottom: 14
  },
  actionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  actionDesc: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16
  },
  primaryLaunchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    paddingVertical: 14,
    borderRadius: 5,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4
  },
  primaryLaunchBtnText: {
    color: '#080808',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  privateRoomCard: {
    padding: 16,
    borderRadius: 5,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderTopColor: '#383838',
    borderColor: '#242424'
  },
  privateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  privateTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold'
  },
  privateDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14
  },
  privateActionsRow: {
    marginBottom: 12
  },
  createRoomBtn: {
    backgroundColor: '#1A170F',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.4)',
    borderTopColor: colors.gold,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center'
  },
  createRoomBtnText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: 'bold'
  },
  joinInputRow: {
    flexDirection: 'row',
    gap: 8
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace'
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.gold,
    paddingHorizontal: 16,
    borderRadius: 5,
    justifyContent: 'center'
  },
  joinBtnText: {
    color: '#080808',
    fontSize: 12,
    fontWeight: 'bold'
  }
});
