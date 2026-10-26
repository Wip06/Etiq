import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { InfoButton } from '@/components/InfoButton';
import {
  formatCount,
  pluralize,
  toCarKilometers,
  toFootprintDuration,
  toPlasticBottles,
  toWaterEquivalent,
} from '@/data/equivalents';
import {
  CLIMATE_EXPLANATION,
  FOOTPRINT_EXPLANATION,
  PLASTIC_EXPLANATION,
  WATER_EXPLANATION,
  type Explanation,
} from '@/data/explanations';
import { colors } from '@/theme/colors';

// Quelques indicateurs du coût environnemental en repères du quotidien. Ils l'illustrent sans le
// remplacer : l'étiquette officielle reste affichée au-dessus.
// cost : coût environnemental en points ; water : m³ éq ; climate : kg CO₂e ; plastic : grammes de
// fibres synthétiques. Une valeur absente ou nulle masque sa ligne. plural : les valeurs portent sur
// plusieurs vêtements.
export function ImpactEquivalents({
  cost = null,
  water = null,
  climate = null,
  plastic = null,
  plural = false,
}: {
  cost?: number | null;
  water?: number | null;
  climate?: number | null;
  plastic?: number | null;
  plural?: boolean;
}) {
  const rows: RowProps[] = [];
  const subject = plural ? 'ces vêtements' : 'ce vêtement';

  if (cost !== null && cost > 0) {
    const { value, unit } = toFootprintDuration(cost);
    rows.push({
      icon: 'person-outline',
      label: 'Empreinte',
      explanation: FOOTPRINT_EXPLANATION,
      headline: `Autant d’impact que ${pluralize(value, unit)} de l’empreinte d’un habitant moyen de la planète`,
      note: 'Son empreinte environnementale totale : se nourrir, se déplacer, se loger, consommer…',
    });
  }

  if (plastic !== null && toPlasticBottles(plastic) >= 1) {
    rows.push({
      icon: 'flask-outline',
      label: 'Plastique',
      explanation: PLASTIC_EXPLANATION,
      headline: `Autant de plastique que ${pluralize(toPlasticBottles(plastic), 'bouteille')} d’eau de 1,5 L`,
      note: `${formatCount(Math.round(plastic))} g de fibres synthétiques, des plastiques fabriqués à partir de pétrole.`,
    });
  }

  if (climate !== null && climate > 0) {
    const km = toCarKilometers(climate);
    rows.push({
      icon: 'car-outline',
      label: 'Climat',
      explanation: CLIMATE_EXPLANATION,
      headline: km >= 1 ? `Autant de CO₂ que ${formatCount(km)} km en voiture` : 'Moins de CO₂ qu’un kilomètre en voiture',
      note: `${climate.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} kg CO₂e, sur tout le cycle de vie de ${subject}.`,
    });
  }

  if (water !== null && water > 0) {
    const { liters, showers, bottles } = toWaterEquivalent(water);
    rows.push({
      icon: 'water-outline',
      label: 'Eau',
      explanation: WATER_EXPLANATION,
      headline:
        showers >= 1
          ? `L’équivalent de ${pluralize(showers, 'douche')}`
          : `L’équivalent de ${pluralize(bottles, 'bouteille')} d’eau`,
      note: `${formatCount(Math.round(liters))} litres équivalents${
        showers >= 1 ? `, soit ${pluralize(bottles, 'bouteille')} de 1,5 L` : ''
      }, pour produire les matières et le fil de ${subject}.`,
    });
  }

  if (rows.length === 0) return null;

  return (
    <View style={styles.card}>
      {rows.map((row) => (
        <Row key={row.label} {...row} />
      ))}
    </View>
  );
}

type RowProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  explanation: Explanation;
  headline: string;
  note: string;
};

function Row({ icon, label, explanation, headline, note }: RowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <InfoButton explanation={explanation} />
        <Ionicons name={icon} size={18} color={colors.accent} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.headline}>{headline}</Text>
      <Text style={styles.note}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  row: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  headline: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondary,
  },
});
