import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { Mail, ArrowLeft, Send } from 'lucide-react-native';

export const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleReset = () => {
    if (!email) {
      Alert.alert('Missing Email', 'Please provide your account email.');
      return;
    }
    Alert.alert(
      'Recovery Sent',
      `If an account exists for ${email}, password reset instructions have been sent.`,
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.text} />
          <Text style={styles.backText}>Back to Sign In</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your email to receive recovery instructions</Text>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Email</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="player@pressurechess.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleReset}
          >
            <Send size={18} color="#000" />
            <Text style={styles.sendText}>SEND RECOVERY LINK</Text>
          </TouchableOpacity>
        </GlassCard>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  backText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  card: {
    gap: 16,
    padding: 20,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 48,
    color: colors.text,
    fontSize: 14,
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  sendText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000',
  }
});
