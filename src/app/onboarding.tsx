import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

// Questions provisoires, à remplacer par le questionnaire définitif.
const PRIORITIES = [
  'Environnement',
  'Conditions de travail',
  'Bien-être animal',
  'Transparence',
  'Fabrication locale',
];
const BUDGETS = ['Moins de 30 €', '30 à 80 €', 'Plus de 80 €'];

export default function OnboardingScreen() {
  const { savePreferences } = useSession();
  const [priorities, setPriorities] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);

  const togglePriority = (option: string) =>
    setPriorities((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Vos préférences</Text>
        <Text style={styles.intro}>
          Vos réponses nous servent à vous recommander des marques qui vous correspondent.
        </Text>

        <Text style={styles.question}>Qu’est-ce qui compte le plus pour vous ?</Text>
        <Text style={styles.hint}>Plusieurs choix possibles</Text>
        <View style={styles.options}>
          {PRIORITIES.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={priorities.includes(option)}
              onPress={() => togglePriority(option)}
            />
          ))}
        </View>

        <Text style={styles.question}>Quel budget pour un vêtement ?</Text>
        <View style={styles.options}>
          {BUDGETS.map((option) => (
            <Chip key={option} label={option} selected={budget === option} onPress={() => setBudget(option)} />
          ))}
        </View>
      </ScrollView>

      <Button
        label="Terminer"
        disabled={priorities.length === 0 || budget === null}
        onPress={() => budget && savePreferences({ priorities, budget })}
      />
    </SafeAreaView>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  content: {
    gap: 12,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.accent,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  question: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  hint: {
    fontSize: 13,
    color: colors.secondary,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  chipSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  chipLabel: {
    fontSize: 14,
    color: colors.text,
  },
  chipLabelSelected: {
    color: colors.onAccent,
  },
});
