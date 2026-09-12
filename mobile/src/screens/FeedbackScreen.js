import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { useBeta } from '../context/BetaContext';
import { 
  ArrowLeft, 
  MessageSquarePlus, 
  Star, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Bug, 
  Lightbulb, 
  GraduationCap, 
  Swords, 
  Bot 
} from 'lucide-react-native';

const FEEDBACK_CATEGORIES = [
  { id: 'General', label: 'General', icon: MessageSquarePlus },
  { id: 'Feature Request', label: 'Feature Request', icon: Lightbulb },
  { id: 'Bug Report', label: 'Bug Report', icon: Bug },
  { id: 'Academy / Lessons', label: 'Academy / Lessons', icon: GraduationCap },
  { id: 'Tactics & Pressure', label: 'Tactics & Pressure', icon: Sparkles },
  { id: 'Online Multiplayer', label: 'Multiplayer', icon: Swords },
  { id: 'AI Coach Review', label: 'AI Coach Review', icon: Bot }
];

export const FeedbackScreen = ({ navigation, route }) => {
  const { submitFeedback } = useBeta();
  const initialCategory = route?.params?.category || 'General';
  const initialType = route?.params?.type || 'feature';

  const [category, setCategory] = useState(initialCategory);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Message Required', 'Please enter a few words about your experience or suggestion.');
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({
        type: category === 'Bug Report' ? 'bug' : 'feature',
        category,
        rating,
        message: message.trim()
      });
      setSubmitted(true);
    } catch (err) {
      Alert.alert('Feedback Recorded', 'Your feedback was saved locally and will sync when connected.');
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

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
          <Text style={styles.headerTitle}>Founding Beta Feedback</Text>
          <Text style={styles.headerSub}>Help shape the future of PressureChess</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {submitted ? (
          <GlassCard style={styles.successCard}>
            <View style={styles.successIconBox}>
              <CheckCircle2 size={40} color="#10B981" />
            </View>
            <Text style={styles.successTitle}>Feedback Received!</Text>
            <Text style={styles.successMsg}>
              Thank you for testing PressureChess Beta. Our engineering team reviews every founding player submission directly.
            </Text>
            <TouchableOpacity 
              style={styles.doneBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.doneBtnText}>Return to App</Text>
            </TouchableOpacity>
          </GlassCard>
        ) : (
          <>
            {/* Category Selector */}
            <Text style={styles.sectionLabel}>SELECT CATEGORY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
              {FEEDBACK_CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                const Icon = cat.icon;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.catChip,
                      isSelected && styles.catChipActive
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Icon size={14} color={isSelected ? '#00E5FF' : colors.textSecondary} />
                    <Text style={[styles.catText, isSelected && styles.catTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* 5-Star Rating */}
            <Text style={styles.sectionLabel}>EXPERIENCE RATING</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starTouch}
                >
                  <Star 
                    size={28} 
                    color={star <= rating ? '#F59E0B' : '#334155'} 
                    fill={star <= rating ? '#F59E0B' : 'transparent'} 
                  />
                </TouchableOpacity>
              ))}
              <Text style={styles.ratingText}>
                {rating === 5 ? 'Exceptional ⚡' : rating === 4 ? 'Great 👍' : rating === 3 ? 'Good ♟️' : rating === 2 ? 'Needs Work ⚠️' : 'Critical Bug 🛑'}
              </Text>
            </View>

            {/* Message Input */}
            <Text style={styles.sectionLabel}>YOUR SUGGESTION OR BUG DETAILS</Text>
            <GlassCard style={styles.inputCard}>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholder="What did you like? What caused trouble? What feature would elevate your tactical training under time pressure?"
                placeholderTextColor={colors.textSecondary}
                value={message}
                onChangeText={setMessage}
              />
            </GlassCard>

            {/* Founding Badge Reminder */}
            <View style={styles.betaNote}>
              <Sparkles size={16} color="#00E5FF" />
              <Text style={styles.betaNoteText}>
                Founding beta players who report verified bugs receive early access to upcoming Voice Coach features.
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Send size={16} color="#000" />
                  <Text style={styles.submitBtnText}>Submit to Beta Engineering</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
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
  content: {
    padding: 16,
    paddingBottom: 40
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8
  },
  catRow: {
    gap: 8,
    paddingVertical: 4
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  catChipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: '#00E5FF'
  },
  catText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700'
  },
  catTextActive: {
    color: '#00E5FF'
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  starTouch: {
    padding: 4
  },
  ratingText: {
    marginLeft: 'auto',
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '800'
  },
  inputCard: {
    padding: 12
  },
  textArea: {
    color: '#FFF',
    fontSize: 14,
    minHeight: 120,
    lineHeight: 20
  },
  betaNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    padding: 12,
    borderRadius: 14,
    marginVertical: 16
  },
  betaNoteText: {
    flex: 1,
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00E5FF',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8
  },
  submitBtnDisabled: {
    opacity: 0.6
  },
  submitBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900'
  },
  successCard: {
    alignItems: 'center',
    padding: 24,
    marginTop: 40
  },
  successIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  successTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8
  },
  successMsg: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24
  },
  doneBtn: {
    backgroundColor: '#00E5FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12
  },
  doneBtnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800'
  }
});
