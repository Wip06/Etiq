import { StyleSheet, Text, View } from 'react-native';

import { InfoButton } from '@/components/InfoButton';
import { COMPARISON_EXPLANATION } from '@/data/explanations';
import type { CategoryComparison as Comparison } from '@/data/portalStats';
import { colors } from '@/theme/colors';

// Situe le vêtement parmi les références de sa catégorie déclarées sur le portail. Le niveau et sa
// couleur découlent uniquement du coût officiel, sans le contredire : ce n'est pas une note maison.
// L'étiquette officielle, elle, reste en noir et blanc, sans modification.

// Du moins au plus impactant ; « min » = part minimale des vêtements de la catégorie qui ont plus d'impact.
const LEVELS = [
  { min: 80, label: 'Très faible impact' },
  { min: 60, label: 'Faible impact' },
  { min: 40, label: 'Impact moyen' },
  { min: 20, label: 'Impact élevé' },
  { min: 0, label: 'Très fort impact' },
];

export function CategoryComparison({ comparison }: { comparison: Comparison }) {
  const { category, lessImpactThan, references, dataDate } = comparison;
  const position = 100 - lessImpactThan;
  const levelIndex = LEVELS.findIndex((level) => lessImpactThan >= level.min);
  const level = LEVELS[levelIndex];
  const levelColor = colors.impactScale[levelIndex];
  const sentence =
    lessImpactThan >= 50
      ? `Moins d’impact que ${lessImpactThan} % des vêtements « ${category} »`
      : `Plus d’impact que ${position} % des vêtements « ${category} »`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <InfoButton explanation={COMPARISON_EXPLANATION} />
        <Text style={[styles.level, { backgroundColor: levelColor }]}>{level.label}</Text>
      </View>
      <Text style={styles.sentence}>{sentence}</Text>

      <View style={styles.track}>
        {colors.impactScale.map((color) => (
          <View key={color} style={[styles.segment, { backgroundColor: color }]} />
        ))}
        <View style={[styles.marker, { left: `${position}%` }]} />
      </View>
      <View style={styles.ends}>
        <Text style={styles.end}>Moins d’impact</Text>
        <Text style={styles.end}>Plus d’impact</Text>
      </View>

      <Text style={styles.note}>
        À poids égal (points pour 100 g), parmi {references.toLocaleString('fr-FR')} références déclarées sur le
        portail officiel au {new Date(dataDate).toLocaleDateString('fr-FR')}.
      </Text>
    </View>
  );
}

const MARKER = 22;

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
  level: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 15,
    fontWeight: '700',
    color: colors.onImpact,
  },
  sentence: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.text,
  },
  track: {
    flexDirection: 'row',
    gap: 2,
    height: 10,
    marginVertical: 8,
    marginHorizontal: MARKER / 2,
  },
  segment: {
    flex: 1,
    borderRadius: 3,
  },
  marker: {
    position: 'absolute',
    top: (10 - MARKER) / 2,
    width: MARKER,
    height: MARKER,
    marginLeft: -MARKER / 2,
    borderRadius: MARKER / 2,
    borderWidth: 4,
    borderColor: colors.surface,
    backgroundColor: colors.text,
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
