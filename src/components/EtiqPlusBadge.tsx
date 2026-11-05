import { StyleSheet, Text } from 'react-native';

import { colors } from '@/theme/colors';

// Pastille « Etiq+ » qui signale une fonction réservée aux abonnés.
export function EtiqPlusBadge() {
  return <Text style={styles.badge}>Etiq+</Text>;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
    color: colors.onAccent,
    backgroundColor: colors.accent,
  },
});
