import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Tiko } from '@/components/Tiko';
import { BUDGETS, GOALS, type BudgetId, type GoalId } from '@/data/goals';
import type { Preferences } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

// Questionnaire des objectifs de consommation, en deux étapes : à l'onboarding et depuis le profil.
export function PreferencesQuiz({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Preferences | null;
  submitLabel: string;
  onSubmit: (preferences: Preferences) => void;
}) {
  const [step, setStep] = useState<0 | 1>(0);
  const [goals, setGoals] = useState<GoalId[]>(initial?.goals ?? []);
  const [budget, setBudget] = useState<BudgetId | null>(initial?.budget ?? null);

  const toggleGoal = (id: GoalId) =>
    setGoals((current) => (current.includes(id) ? current.filter((goal) => goal !== id) : [...current, id]));

  return (
    <View style={styles.container}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: step === 0 ? '50%' : '100%' }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 0 ? (
          <>
            <Tiko pose="tetePenchee" message="Qu’est-ce qui compte le plus pour toi quand tu achètes un vêtement ?" />
            <Text style={styles.hint}>
              Touchez vos objectifs du plus important au moins important : ils se numérotent. Vos réponses servent à
              vous proposer des marques et des lectures : aucune marque ne paie pour apparaître.
            </Text>
            {GOALS.map((goal) => {
              const rank = goals.indexOf(goal.id);
              const selected = rank >= 0;
              return (
                <Pressable
                  key={goal.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  accessibilityValue={selected ? { text: `Priorité ${rank + 1}` } : undefined}
                  onPress={() => toggleGoal(goal.id)}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <Ionicons name={goal.icon} size={24} color={selected ? colors.onAccent : colors.accent} />
                  <View style={styles.optionText}>
                    <Text style={[styles.optionLabel, selected && styles.onAccent]}>{goal.label}</Text>
                    <Text style={[styles.optionDescription, selected && styles.onAccent]}>{goal.description}</Text>
                  </View>
                  {selected ? (
                    <Text style={styles.rank}>{rank + 1}</Text>
                  ) : (
                    <Ionicons name="ellipse-outline" size={26} color={colors.secondary} />
                  )}
                </Pressable>
              );
            })}
          </>
        ) : (
          <>
            <Tiko pose="assisRegard" message="Quel budget pour un vêtement, en général ?" />
            <Text style={styles.hint}>Pour vous proposer des marques dans vos prix.</Text>
            {BUDGETS.map((option) => {
              const selected = budget === option.id;
              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  onPress={() => setBudget(option.id)}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <Text style={[styles.optionLabel, styles.optionText, selected && styles.onAccent]}>
                    {option.label}
                  </Text>
                  <Ionicons
                    name={selected ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={selected ? colors.onAccent : colors.secondary}
                  />
                </Pressable>
              );
            })}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step === 0 ? (
          <Button label="Continuer" disabled={goals.length === 0} onPress={() => setStep(1)} />
        ) : (
          <>
            <Button label={submitLabel} disabled={budget === null} onPress={() => budget && onSubmit({ goals, budget })} />
            <Button label="Retour" variant="secondary" onPress={() => setStep(0)} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surface,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  content: {
    gap: 12,
    paddingBottom: 16,
  },
  hint: {
    marginBottom: 4,
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondary,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    backgroundColor: colors.accent,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondary,
  },
  // Numéro de priorité d'un objectif sélectionné.
  rank: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: 'hidden',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
    color: colors.accent,
    backgroundColor: colors.onAccent,
  },
  onAccent: {
    color: colors.onAccent,
  },
  footer: {
    gap: 10,
  },
});
