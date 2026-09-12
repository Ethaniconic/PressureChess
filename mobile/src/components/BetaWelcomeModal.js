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
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalBox: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#0B132B',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    padding: 20,
    shadowColor: '#00E5FF',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    position: 'relative'
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)'
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16
  },
  sparkleIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  betaTag: {
    color: '#00E5FF',
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  freeTag: {
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6
  },
  modalSub: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10
  },
  pillarsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 14
  },
  pillarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  pillarIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pillarTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700'
  },
  pillarSub: {
    color: '#94A3B8',
    fontSize: 10
  },
  founderPerk: {
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.25)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16
  },
  founderPerkTitle: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 2
  },
  founderPerkSub: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16
  },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00E5FF',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 8
  },
  claimBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900'
  },
  feedbackBtn: {
    alignItems: 'center',
    paddingVertical: 10
  },
  feedbackBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600'
  }
});
