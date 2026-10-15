import { StyleSheet, Text, View } from 'react-native';

import { InfoButton } from '@/components/InfoButton';
import { COMPARISON_EXPLANATION } from '@/data/explanations';
import type { CategoryComparison as Comparison } from '@/data/portalStats';
import { colors } from '@/theme/colors';

// Situe le vêtement parmi les références de sa catégorie déclarées sur le portail. Elle découle
// uniquement du coût officiel, sans le contredire : ce n'est pas une note maison.
// Le curseur part de la gauche (moins d'impact) vers la droite (plus d'impact) : plus à gauche = mieux.
export function CategoryComparison({ comparison }: { comparison: Comparison }) {
  const { category, lessImpactThan, references, dataDate } = comparison;
  const position = 100 - lessImpactThan;
  const sentence =
    lessImpactThan >= 50
      ? `Moins d’impact que ${lessImpactThan} % des vêtements de la catégorie « ${category} »`
      : `Plus d’impact que ${position} % des vêtements de la catégorie « ${category} »`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <InfoButton explanation={COMPARISON_EXPLANATION} />
        <Text style={styles.sentence}>{sentence}</Text>
      </View>

      <View style={styles.track}>
        <View style={styles.median} />
        <View style={[styles.marker, { left: `${position}%` }]} />
      </View>
      <View style={styles.ends}>
        <Text style={styles.end}>Moins d’impact</Text>
        <Text style={styles.end}>Médiane</Text>
        <Text style={styles.end}>Plus d’impact</Text>
      </View>

      <Text style={styles.note}>
        À poids égal (points pour 100 g), parmi {references.toLocaleString('fr-FR')} références déclarées sur le
        portail officiel au {new Date(dataDate).toLocaleDateString('fr-FR')}.
      </Text>
    </View>
  );
}

const MARKER = 18;

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sentence: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.text,
  },
  track: {
    height: 8,
    marginVertical: 6,
    marginHorizontal: MARKER / 2,
    borderRadius: 4,
    backgroundColor: colors.background,
  },
  median: {
    position: 'absolute',
    left: '50%',
    top: -4,
    width: 2,
    height: 16,
    marginLeft: -1,
    backgroundColor: colors.secondary,
  },
  marker: {
    position: 'absolute',
    top: (8 - MARKER) / 2,
    width: MARKER,
    height: MARKER,
    marginLeft: -MARKER / 2,
    borderRadius: MARKER / 2,
    borderWidth: 3,
    borderColor: colors.surface,
    backgroundColor: colors.accent,
  },
  ends: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  end: {
    fontSize: 12,
    color: colors.secondary,
  },
  note: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondary,
  },
});
