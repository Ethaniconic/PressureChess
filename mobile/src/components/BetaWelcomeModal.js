import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { useBeta } from '../context/BetaContext';
import { colors } from '../theme/colors';
import { 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Zap, 
  Bot, 
  Swords, 
  X, 
  ArrowRight 
} from 'lucide-react-native';

export const BetaWelcomeModal = ({ navigation }) => {
  const { showWelcomeModal, closeWelcomeModal } = useBeta();

  if (!showWelcomeModal) return null;

  const handleClaim = () => {
    closeWelcomeModal();
  };

  const handleFeedback = () => {
    closeWelcomeModal();
    if (navigation) {
      navigation.navigate('Feedback');
    }
  };

  return (
    <Modal
      visible={showWelcomeModal}
      transparent
      animationType="fade"
      onRequestClose={closeWelcomeModal}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={closeWelcomeModal}>
            <X size={18} color="#94A3B8" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header Badge */}
            <View style={styles.header}>
              <View style={styles.sparkleIcon}>
                <Sparkles size={28} color={colors.gold} />
              </View>
              <View style={styles.badgeRow}>
                <Text style={styles.betaTag}>PUBLIC BETA v0.5.0</Text>
                <Text style={styles.freeTag}>100% FREE</Text>
              </View>
              <Text style={styles.modalTitle}>Welcome, Founding Tactician!</Text>
              <Text style={styles.modalSub}>
                Every lesson, puzzle scramble, coach analysis, and multiplayer game is unlocked free during public beta.
              </Text>
            </View>

            {/* 4 Pillars */}
            <View style={styles.pillarsBox}>
              <View style={styles.pillarItem}>
                <View style={[styles.pillarIcon, { backgroundColor: 'rgba(0, 229, 255, 0.15)' }]}>
                  <GraduationCap size={16} color="#00E5FF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pillarTitle}>All 17 Academy Lessons</Text>
                  <Text style={styles.pillarSub}>Master tactical fundamentals to advanced endgames</Text>
                </View>
              </View>

              <View style={styles.pillarItem}>
                <View style={[styles.pillarIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Zap size={16} color="#F59E0B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pillarTitle}>Unlimited Pressure Puzzles</Text>
                  <Text style={styles.pillarSub}>10s, 20s, 30s scrambles and championship scenarios</Text>
                </View>
              </View>

              <View style={styles.pillarItem}>
                <View style={[styles.pillarIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Bot size={16} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pillarTitle}>Full Stockfish & AI Coach</Text>
                  <Text style={styles.pillarSub}>Deep engine breakdown with Coach Orion explanations</Text>
                </View>
              </View>

              <View style={styles.pillarItem}>
                <View style={[styles.pillarIcon, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                  <Swords size={16} color="#C084FC" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pillarTitle}>Ranked Online Multiplayer</Text>
                  <Text style={styles.pillarSub}>Bullet, Blitz, Rapid & Classical with live ratings</Text>
                </View>
              </View>
            </View>

            {/* Founding Badge Promo */}
            <View style={styles.founderPerk}>
              <Text style={styles.founderPerkTitle}>✨ Lifetime Founding Player Perks</Text>
              <Text style={styles.founderPerkSub}>
                Your account is permanently assigned the Founding Beta badge and glowing cyan profile frame.
              </Text>
            </View>

            {/* CTA Buttons */}
            <TouchableOpacity style={styles.claimBtn} onPress={handleClaim}>
              <Text style={styles.claimBtnText}>Claim Founding Badge & Enter</Text>
              <ArrowRight size={16} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.feedbackBtn} onPress={handleFeedback}>
              <Text style={styles.feedbackBtnText}>Give Feedback to Founders</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalBox: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#0E0E0E',
    borderRadius: 5, // Small 4-5px round
    borderWidth: 1,
    borderColor: '#242424',
    borderTopColor: '#3D3D3D', // High contrast platinum rim
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
    borderRadius: 4, // 4-5px round
    backgroundColor: '#161616',
    borderWidth: 1,
    borderTopColor: '#333333',
    borderColor: '#222222',
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16
  },
  sparkleIcon: {
    width: 54,
    height: 54,
    borderRadius: 5, // 4-5px round
    backgroundColor: '#1A160C',
    borderWidth: 1,
    borderTopColor: '#E5A93C',
    borderColor: 'rgba(229, 169, 60, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.gold,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  betaTag: {
    color: '#E5A93C',
    backgroundColor: '#1A160C',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4, // 4-5px round
    borderWidth: 1,
    borderTopColor: '#E5A93C',
    borderColor: 'rgba(229, 169, 60, 0.4)',
  },
  freeTag: {
    color: '#22C55E',
    backgroundColor: '#0F1A12',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4, // 4-5px round
    borderWidth: 1,
    borderTopColor: '#22C55E',
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSub: {
    color: '#A1A1AA',
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  pillarsBox: {
    backgroundColor: '#141414',
    borderRadius: 5, // 4-5px round
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderTopColor: '#2A2A2A',
    borderColor: '#1E1E1E',
    marginBottom: 14
  },
  pillarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  pillarIcon: {
    width: 34,
    height: 34,
    borderRadius: 4, // 4-5px round
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderTopColor: '#333333',
    borderColor: '#202020',
    backgroundColor: '#181818',
  },
  pillarTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  pillarSub: {
    color: '#8E8E93',
    fontSize: 11,
    lineHeight: 15,
  },
  founderPerk: {
    backgroundColor: '#18150D',
    borderWidth: 1,
    borderTopColor: '#E5A93C',
    borderColor: 'rgba(229, 169, 60, 0.35)',
    borderRadius: 5, // 4-5px round
    padding: 14,
    marginBottom: 16
  },
  founderPerkTitle: {
    color: '#E5A93C',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 3
  },
  founderPerkSub: {
    color: '#D4D4D8',
    fontSize: 11.5,
    lineHeight: 16
  },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E5A93C',
    paddingVertical: 14,
    borderRadius: 5, // 4-5px round
    marginBottom: 8,
    shadowColor: colors.gold,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  claimBtnText: {
    color: '#080808',
    fontSize: 14,
    fontWeight: '900'
  },
  feedbackBtn: {
    alignItems: 'center',
    paddingVertical: 11
  },
  feedbackBtnText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '700'
  }
});

