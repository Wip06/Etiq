import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoButton } from '@/components/InfoButton';
import { ALTERNATIVES_EXPLANATION } from '@/data/explanations';
import type { Alternative } from '@/data/portalStats';
import { pluralize, toWaterEquivalent } from '@/data/equivalents';
import { colors } from '@/theme/colors';

// Propose des vêtements de la même catégorie qui ont moins d'impact. Un appui ouvre leur fiche,
// avec leur étiquette officielle. `water` : l'eau du vêtement comparé, en m³ éq, si on la connaît.
export function Alternatives({ alternatives, water }: { alternatives: Alternative[]; water?: number | null }) {
  if (alternatives.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <InfoButton explanation={ALTERNATIVES_EXPLANATION} />
        <Text style={styles.title}>Moins d’impact, même type de vêtement</Text>
      </View>
      {alternatives.map((alternative) => {
        const savedShowers =
          typeof water === 'number' && typeof alternative.water === 'number'
            ? toWaterEquivalent(water - alternative.water).showers
            : 0;
        return (
          <Pressable
            key={alternative.gtin}
            accessibilityRole="button"
            accessibilityHint="Ouvre la fiche de ce vêtement"
            onPress={() => router.push({ pathname: '/product/[gtin]', params: { gtin: alternative.gtin } })}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <View style={styles.rowText}>
              <Text style={styles.brand}>{alternative.brand}</Text>
              <Text style={styles.reference} numberOfLines={1}>
                {alternative.reference}
              </Text>
              {savedShowers >= 1 && (
                <Text style={styles.water}>{pluralize(savedShowers, 'douche')} d’eau en moins</Text>
              )}
            </View>
            <Text style={styles.gain}>−{alternative.lessImpact} %</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
          </Pressable>
        );
      })}
      <Text style={styles.note}>Coût environnemental à poids égal, pour un vêtement de poids proche.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  brand: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: colors.secondary,
  },
  reference: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  water: {
    fontSize: 13,
    color: colors.secondary,
  },
  gain: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 14,
    fontWeight: '700',
    color: colors.onImpact,
    backgroundColor: colors.impactScale[0],
  },
  note: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondary,
  },
});
