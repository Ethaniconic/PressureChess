import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { useSettings } from '../context/SettingsContext';
import { Palette, Volume2, Sparkles, Eye, Check, ChevronLeft } from 'lucide-react-native';

export const SettingsScreen = ({ navigation }) => {
  const {
    boardTheme,
    setBoardTheme,
    pieceStyle,
    setPieceStyle,
    soundEnabled,
    setSoundEnabled,
    animationEnabled,
    setAnimationEnabled,
    showCoordinates,
    setShowCoordinates,
  } = useSettings();

  const themes = [
    { id: 'emerald', name: 'Emerald Forest', light: '#E2E8F0', dark: '#059669' },
    { id: 'midnight', name: 'Midnight Dark', light: '#334155', dark: '#0F172A' },
    { id: 'wood', name: 'Classic Wood', light: '#F0D9B5', dark: '#B58863' },
    { id: 'gold', name: 'Gold Pressure', light: '#FEF3C7', dark: '#B45309' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Board Colors */}
        <GlassCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Palette size={18} color={colors.emerald} />
            <Text style={styles.sectionTitle}>Board Colors</Text>
          </View>

          <View style={styles.themeGrid}>
            {themes.map((t) => {
              const isSelected = boardTheme === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.themeOption, isSelected && styles.themeSelected]}
                  onPress={() => setBoardTheme(t.id)}
                >
                  <View style={styles.themePreview}>
                    <View style={[styles.previewHalf, { backgroundColor: t.light }]} />
                    <View style={[styles.previewHalf, { backgroundColor: t.dark }]} />
                  </View>
                  <Text style={styles.themeName}>{t.name}</Text>
                  {isSelected && <Check size={16} color={colors.gold} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

        {/* Piece Style Selector */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Piece Sets</Text>
          <View style={styles.pieceRow}>
            {['neo', 'classic'].map((styleKey) => {
              const isSelected = pieceStyle === styleKey;
              return (
                <TouchableOpacity
                  key={styleKey}
                  style={[styles.pieceOption, isSelected && styles.pieceSelected]}
                  onPress={() => setPieceStyle(styleKey)}
                >
                  <Text style={styles.pieceName}>
                    {styleKey === 'neo' ? 'Neo Modern' : 'Staunton'}
                  </Text>
                  {isSelected && <Check size={16} color={colors.gold} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

        {/* Toggles */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          {/* Sound */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelGroup}>
              <Volume2 size={18} color={colors.textMuted} />
              <View>
                <Text style={styles.toggleTitle}>Sound Effects</Text>
                <Text style={styles.toggleDesc}>Moves and capture audio</Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: colors.surfaceLight, true: colors.emerald }}
              thumbColor="#FFF"
            />
          </View>

          {/* Animation */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelGroup}>
              <Sparkles size={18} color={colors.gold} />
              <View>
                <Text style={styles.toggleTitle}>Animations</Text>
                <Text style={styles.toggleDesc}>Smooth piece movements</Text>
              </View>
            </View>
            <Switch
              value={animationEnabled}
              onValueChange={setAnimationEnabled}
              trackColor={{ false: colors.surfaceLight, true: colors.emerald }}
              thumbColor="#FFF"
            />
          </View>

          {/* Coordinates */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelGroup}>
              <Eye size={18} color={colors.textMuted} />
              <View>
                <Text style={styles.toggleTitle}>Board Coordinates</Text>
                <Text style={styles.toggleDesc}>Show A-H and 1-8 rank labels</Text>
              </View>
            </View>
            <Switch
              value={showCoordinates}
              onValueChange={setShowCoordinates}
              trackColor={{ false: colors.surfaceLight, true: colors.emerald }}
              thumbColor="#FFF"
            />
          </View>
        </GlassCard>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  sectionCard: {
    gap: 12,
    padding: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    textTransform: 'uppercase',
  },
  themeGrid: {
    gap: 8,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeSelected: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  themePreview: {
    flexDirection: 'row',
    width: 24,
    height: 24,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  previewHalf: {
    flex: 1,
    height: '100%',
  },
  themeName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  pieceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pieceOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pieceSelected: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  pieceName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  toggleLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  toggleDesc: {
    fontSize: 11,
    color: colors.textMuted,
  }
});
