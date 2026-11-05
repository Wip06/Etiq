import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { COUNTRY_NAMES, MATERIAL_NAMES } from '@/data/ecobalyse';
import type { Label, LabelMaterial } from '@/services/labelReader';
import { colors } from '@/theme/colors';

// Saisie à la main de la composition et du pays de confection : pour corriger une lecture
// d'étiquette, ou tout saisir quand la lecture échoue. Les choix sont limités aux matières et aux pays
// d'Ecobalyse, les seuls que le calcul officiel accepte.

const MATERIAL_IDS = Object.keys(MATERIAL_NAMES);
const COUNTRY_CODES = Object.keys(COUNTRY_NAMES);

// Total accepté : l'arrondi des pourcentages sur une étiquette peut donner 99 ou 101 %.
const MIN_TOTAL = 99;
const MAX_TOTAL = 101;

export const EMPTY_LABEL: Label = {
  readable: true,
  materials: [{ text: '', id: '', percent: 100 }],
  countryOfMaking: '---',
  countryText: '',
  notes: '',
};

export function compositionTotal(materials: LabelMaterial[]): number {
  return materials.reduce((sum, material) => sum + (Number.isFinite(material.percent) ? material.percent : 0), 0);
}

// Une composition complète : chaque ligne a une matière et un pourcentage, et le total fait 100 %.
export function isCompositionValid(materials: LabelMaterial[]): boolean {
  const total = compositionTotal(materials);
  return (
    materials.length > 0 &&
    materials.every((material) => material.id !== '' && material.percent > 0) &&
    total >= MIN_TOTAL &&
    total <= MAX_TOTAL
  );
}

const materialLabel = (id: string) =>
  id === 'autre' ? 'Autre matière (non calculable)' : (MATERIAL_NAMES[id] ?? 'Choisir une matière');

type Props = {
  label: Label;
  onChange: (label: Label) => void;
  onDone: () => void;
};

export function CompositionEditor({ label, onChange, onDone }: Props) {
  // Liste de choix ouverte : l'index d'une matière, « country » pour le pays, ou aucune.
  const [open, setOpen] = useState<number | 'country' | null>(null);
  const total = compositionTotal(label.materials);
  const valid = isCompositionValid(label.materials);

  const updateMaterial = (index: number, change: Partial<LabelMaterial>) =>
    onChange({
      ...label,
      materials: label.materials.map((material, i) => (i === index ? { ...material, ...change } : material)),
    });

  const chooseMaterial = (index: number, id: string) => {
    updateMaterial(index, { id, text: id === 'autre' ? 'Autre matière' : MATERIAL_NAMES[id] });
    setOpen(null);
  };

  const removeMaterial = (index: number) =>
    onChange({ ...label, materials: label.materials.filter((_, i) => i !== index) });

  // La nouvelle ligne reprend ce qui manque pour atteindre 100 %.
  const addMaterial = () =>
    onChange({
      ...label,
      materials: [...label.materials, { text: '', id: '', percent: Math.max(0, 100 - total) }],
    });

  const chooseCountry = (code: string) => {
    onChange({ ...label, countryOfMaking: code, countryText: code === '---' ? '' : COUNTRY_NAMES[code] });
    setOpen(null);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Composition</Text>
      {label.materials.map((material, index) => (
        <View key={index} style={styles.material}>
          <View style={styles.row}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Matière ${index + 1} : ${materialLabel(material.id)}`}
              onPress={() => setOpen(open === index ? null : index)}
              style={[styles.select, styles.flex]}
            >
              <Text style={[styles.selectText, material.id === '' && styles.placeholder]} numberOfLines={1}>
                {materialLabel(material.id)}
              </Text>
              <Ionicons name={open === index ? 'chevron-up' : 'chevron-down'} size={16} color={colors.secondary} />
            </Pressable>
            <TextInput
              style={styles.percent}
              value={material.percent > 0 ? String(material.percent) : ''}
              onChangeText={(text) => updateMaterial(index, { percent: Number(text.replace(',', '.')) || 0 })}
              keyboardType="number-pad"
              placeholder="%"
              placeholderTextColor={colors.secondary}
              accessibilityLabel={`Pourcentage de la matière ${index + 1}`}
            />
            <Text style={styles.unit}>%</Text>
            {label.materials.length > 1 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Retirer la matière ${index + 1}`}
                hitSlop={12}
                onPress={() => removeMaterial(index)}
              >
                <Ionicons name="trash-outline" size={20} color={colors.secondary} />
              </Pressable>
            )}
          </View>
          {open === index && (
            <Choices
              options={MATERIAL_IDS}
              selected={material.id}
              labelOf={materialLabel}
              onChoose={(id) => chooseMaterial(index, id)}
            />
          )}
        </View>
      ))}

      <Pressable accessibilityRole="button" onPress={addMaterial} style={styles.add}>
        <Ionicons name="add-circle-outline" size={20} color={colors.accent} />
        <Text style={styles.addLabel}>Ajouter une matière</Text>
      </Pressable>
      <Text style={[styles.total, !valid && styles.totalWarning]}>
        Total : {total} %{total < MIN_TOTAL || total > MAX_TOTAL ? ' (il faut 100 %)' : ''}
      </Text>

      <Text style={styles.cardTitle}>Pays de confection</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Pays de confection : ${COUNTRY_NAMES[label.countryOfMaking] ?? 'inconnu'}`}
        onPress={() => setOpen(open === 'country' ? null : 'country')}
        style={styles.select}
      >
        <Text style={[styles.selectText, styles.flex]}>{COUNTRY_NAMES[label.countryOfMaking] ?? 'Inconnu'}</Text>
        <Ionicons name={open === 'country' ? 'chevron-up' : 'chevron-down'} size={16} color={colors.secondary} />
      </Pressable>
      {open === 'country' && (
        <Choices
          options={COUNTRY_CODES}
          selected={label.countryOfMaking}
          labelOf={(code) => COUNTRY_NAMES[code]}
          onChoose={chooseCountry}
        />
      )}
      <Text style={styles.hint}>
        Un pays absent de la liste se rattache à sa région (Portugal : Europe de l’Ouest). « Inconnu » applique la
        valeur par défaut de la méthode, défavorable.
      </Text>

      <Button label="Valider la composition" onPress={onDone} disabled={!valid} />
    </View>
  );
}

function Choices({
  options,
  selected,
  labelOf,
  onChoose,
}: {
  options: string[];
  selected: string;
  labelOf: (option: string) => string;
  onChoose: (option: string) => void;
}) {
  return (
    <View style={styles.choices}>
      {options.map((option) => (
        <Pressable
          key={option}
          accessibilityRole="radio"
          accessibilityState={{ checked: option === selected }}
          onPress={() => onChoose(option)}
          style={[styles.chip, option === selected && styles.chipSelected]}
        >
          <Text style={[styles.chipLabel, option === selected && styles.chipLabelSelected]}>{labelOf(option)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  cardTitle: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  material: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flex: {
    flex: 1,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  selectText: {
    flexShrink: 1,
    fontSize: 15,
    color: colors.text,
  },
  placeholder: {
    color: colors.secondary,
  },
  percent: {
    width: 56,
    minHeight: 44,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 15,
    textAlign: 'right',
    color: colors.text,
    backgroundColor: colors.background,
  },
  unit: {
    fontSize: 15,
    color: colors.secondary,
  },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
  },
  addLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  total: {
    fontSize: 14,
    color: colors.secondary,
  },
  totalWarning: {
    color: colors.impactScale[3],
  },
  hint: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondary,
  },
  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  chipSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  chipLabel: {
    fontSize: 13,
    color: colors.text,
  },
  chipLabelSelected: {
    color: colors.onAccent,
  },
});
