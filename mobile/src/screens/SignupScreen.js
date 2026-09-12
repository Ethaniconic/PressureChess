import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus } from 'lucide-react-native';

export const SignupScreen = ({ navigation }) => {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert('Missing Fields', 'Please complete all fields.');
      return;
    }
    setLoading(true);
    try {
      await signup(email, password, username);
    } catch (e) {
      Alert.alert('Registration Failed', e.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.header}>
          <Text style={styles.logo}>👑</Text>
          <Text style={styles.title}>Join PressureChess</Text>
          <Text style={styles.subtitle}>Create your profile and start climbing</Text>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <User size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Tactician123"
                placeholderTextColor={colors.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="tactician@pressurechess.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password (Min. 6 chars)</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.signupBtn}
            onPress={handleSignup}
            disabled={loading}
          >
            <UserPlus size={18} color="#000" />
            <Text style={styles.signupText}>
              {loading ? 'CREATING PROFILE...' : 'CREATE ACCOUNT'}
            </Text>
          </TouchableOpacity>
        </GlassCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

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
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
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
    borderColor: 'rgba(16, 185, 129, 0.3)',
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
  signupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.emerald,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  signupText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  loginLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.emerald,
  }
});
