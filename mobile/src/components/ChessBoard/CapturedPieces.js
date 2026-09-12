import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChessPiece } from '../../utils/chessPieces';
import { colors } from '../../theme/colors';

export const CapturedPieces = ({ capturedPieces = [], color = 'w', advantage = 0 }) => {
  const counts = capturedPieces.reduce((acc, p) => {
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  const order = ['q', 'r', 'b', 'n', 'p'];

  return (
    <View style={styles.container}>
      <View style={styles.piecesRow}>
        {order.map((type) => {
          const count = counts[type];
          if (!count) return null;
          return (
            <View key={type} style={styles.pieceItem}>
              <ChessPiece type={type} color={color} size={18} />
              {count > 1 && (
                <Text style={styles.countText}>×{count}</Text>
              )}
            </View>
          );
        })}
      </View>

      {advantage > 0 && (
        <View style={styles.advBadge}>
          <Text style={styles.advText}>+{advantage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 28,
  },
  piecesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    marginLeft: 1,
  },
  advBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  advText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.emerald,
  }
});
