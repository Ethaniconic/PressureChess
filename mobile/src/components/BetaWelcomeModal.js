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
                <Sparkles size={28} color="#00E5FF" />
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
    backgroundColor: 'rgba(10, 16, 30, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalBox: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderTopColor: 'rgba(255, 255, 255, 0.45)', // Top specular reflection
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
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
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16
  },
  sparkleIcon: {
    width: 58,
    height: 58,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(0, 229, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.cyan,
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
    color: '#00E5FF',
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  freeTag: {
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  modalTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSub: {
    color: colors.textSecondary,
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  pillarsBox: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: colors.border,
    marginBottom: 14
  },
  pillarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  pillarIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  pillarTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800'
  },
  pillarSub: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  founderPerk: {
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(0, 229, 255, 0.3)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16
  },
  founderPerkTitle: {
    color: '#00E5FF',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 3
  },
  founderPerkSub: {
    color: colors.textSecondary,
    fontSize: 11.5,
    lineHeight: 16
  },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00E5FF',
    paddingVertical: 14,
    borderRadius: 18,
    marginBottom: 8,
    shadowColor: colors.cyan,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  claimBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900'
  },
  feedbackBtn: {
    alignItems: 'center',
    paddingVertical: 11
  },
  feedbackBtnText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700'
  }
});

