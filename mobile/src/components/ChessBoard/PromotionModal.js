import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { ChessPiece } from '../../utils/chessPieces';
import { colors } from '../../theme/colors';

export const PromotionModal = ({ visible, color, onSelectPiece }) => {
  const pieces = ['q', 'r', 'b', 'n'];

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Pawn Promotion</Text>
          <Text style={styles.subtitle}>Choose your upgrade:</Text>

          <View style={styles.grid}>
            {pieces.map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => onSelectPiece(p)}
                style={styles.pieceBtn}
                activeOpacity={0.7}
              >
                <ChessPiece type={p} color={color} size={44} />
                <Text style={styles.pieceName}>
                  {p === 'q' ? 'Queen' : p === 'r' ? 'Rook' : p === 'b' ? 'Bishop' : 'Knight'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.gold,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  pieceBtn: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    alignItems: 'center',
    minWidth: 64,
  },
  pieceName: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold,
    marginTop: 6,
    textTransform: 'uppercase',
  }
});
