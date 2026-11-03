import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CriterionStatus, Recommendation } from '@/data/recommendations';
import { colors } from '@/theme/colors';

const STATUS: Record<CriterionStatus, { icon: ComponentProps<typeof Ionicons>['name']; color: string; label: string }> = {
  met: { icon: 'checkmark-circle', color: colors.impactScale[0], label: 'oui' },
  partial: { icon: 'contrast', color: colors.impactScale[2], label: 'en partie' },
  unmet: { icon: 'close-circle-outline', color: colors.impactScale[4], label: 'non' },
  unknown: { icon: 'help-circle-outline', color: colors.secondary, label: 'pas de données' },
};

// Une marque proposée : sa correspondance avec les critères de l'utilisateur, dans son ordre de priorité,
// et ce qui correspond ou non à chacun, avec le fait relevé.
export function BrandMatchCard({ recommendation: { brand, criteria, match } }: { recommendation: Recommendation }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/brand/[id]', params: { id: brand.id } })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{brand.name}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
      </View>
      <Text style={styles.summary}>
        {match} % de correspondance avec vos critères
      </Text>
      {criteria.map(({ id, label, status, reason }) => (
        <View key={id} style={styles.criterion} accessible accessibilityLabel={`${label} : ${STATUS[status].label}. ${reason}`}>
          <Ionicons name={STATUS[status].icon} size={18} color={STATUS[status].color} />
          <View style={styles.criterionText}>
            <Text style={styles.label}>
              {label} : {STATUS[status].label}
            </Text>
            <Text style={styles.reason}>{reason}</Text>
          </View>
        </View>
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  summary: {
    marginTop: -6,
    fontSize: 14,
    color: colors.accent,
  },
  criterion: {
    flexDirection: 'row',
    gap: 10,
  },
  criterionText: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reason: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.secondary,
  },
});
