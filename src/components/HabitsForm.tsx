import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import {
  HABIT_QUESTIONS,
  isAsked,
  isMinor,
  NO_ANSWER,
  SHARING_CONSENT_TEXT,
  SHARING_CONSENT_VERSION,
  type HabitQuestion,
  type HabitQuestionId,
  type Habits,
} from '@/data/habits';
import { colors } from '@/theme/colors';

// Questions « Ma situation » : toutes facultatives, et accord de partage distinct, décoché par
// défaut, refusé aux mineurs. Répondre ne vaut pas accord de partage. Utilisé à la fin de
// l'onboarding et depuis le profil.
export function HabitsForm({
  initial,
  submitLabel,
  onSubmit,
  header,
  footer,
  inOnboarding = false,
}: {
  inOnboarding?: boolean;
  initial: Habits | null;
  submitLabel: string;
  onSubmit: (habits: Habits) => void;
  header?: ReactNode;
  footer?: ReactNode;
}) {
  const [answers, setAnswers] = useState<Habits['answers']>(initial?.answers ?? {});
  const [sharing, setSharing] = useState(initial?.sharing?.granted ?? false);
  const minor = isMinor({ answers });

  const choose = (question: HabitQuestion, option: string) =>
    setAnswers((current) => {
      const selected = current[question.id] ?? [];
      if (!question.multiple || option === NO_ANSWER) return { ...current, [question.id]: selected.includes(option) ? [] : [option] };
      const others = selected.filter((id) => id !== NO_ANSWER);
      return {
        ...current,
        [question.id]: others.includes(option) ? others.filter((id) => id !== option) : [...others, option],
      };
    });

  const submit = () => {
    const granted = sharing && !minor;
    // La date de l'accord ne change que si l'accord change : c'est la preuve du consentement donné.
    const keepDate = initial?.sharing?.granted === granted ? initial.sharing.date : null;
    // Une réponse à une question qui n'est plus posée (profession d'une personne qui n'est plus en activité)
    // n'est pas gardée.
    const asked = Object.fromEntries(
      HABIT_QUESTIONS.filter((question) => isAsked(question, answers)).map((question) => [question.id, answers[question.id]]),
    ) as Habits['answers'];
    onSubmit({
      answers: asked,
      sharing: { granted, version: SHARING_CONSENT_VERSION, date: keepDate ?? new Date().toISOString() },
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {header}
      <Text style={styles.intro}>
        Toutes les questions sont facultatives. Elles nous aident à comprendre comment on achète des vêtements, pour
        améliorer Etiq et, si vous l’acceptez plus bas, pour des études partagées avec nos partenaires.
      </Text>

      {HABIT_QUESTIONS.filter((question) => isAsked(question, answers)).map((question) => (
        <View key={question.id} style={styles.question}>
          <Text style={styles.questionTitle}>
            {question.question}
            {question.multiple ? <Text style={styles.hint}> · plusieurs choix possibles</Text> : null}
          </Text>
          <View style={styles.chips}>
            {question.options.map((option) => {
              const selected = (answers[question.id as HabitQuestionId] ?? []).includes(option.id);
              return (
                <Pressable
                  key={option.id}
                  accessibilityRole={question.multiple ? 'checkbox' : 'radio'}
                  accessibilityState={{ checked: selected }}
                  onPress={() => choose(question, option.id)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      <View style={styles.consent}>
        <Text style={styles.consentTitle}>Partage avec nos partenaires</Text>
        {minor ? (
          <Text style={styles.consentText}>Aucun partage n’est proposé aux moins de 18 ans.</Text>
        ) : (
          <View style={styles.consentRow}>
            <Text style={[styles.consentText, styles.flex]}>{SHARING_CONSENT_TEXT}</Text>
            <Switch
              value={sharing}
              onValueChange={setSharing}
              accessibilityLabel="Accepter le partage anonyme et regroupé de mes réponses"
              trackColor={{ true: colors.accent, false: colors.background }}
              thumbColor={colors.text}
            />
          </View>
        )}
        <Text style={styles.meta}>
          Jamais votre e-mail ni votre prénom. Sans votre accord, vos réponses ne servent qu’à Etiq. Dans le prototype,
          rien n’est envoyé : tout reste sur votre téléphone.
        </Text>
        {/* Pendant l'onboarding, la page n'est pas ouverte : elle reste accessible depuis le profil. */}
        {inOnboarding ? (
          <Text style={styles.meta}>Notre politique de confidentialité est disponible dans votre profil.</Text>
        ) : (
          <Pressable accessibilityRole="link" onPress={() => router.push('/privacy')}>
            <Text style={styles.link}>Politique de confidentialité</Text>
          </Pressable>
        )}
      </View>

      <Button label={submitLabel} onPress={submit} />
      {footer}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: 20,
    padding: 24,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  question: {
    gap: 10,
  },
  questionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  hint: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.secondary,
  },
  chips: {
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
  consent: {
    gap: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  consentText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondary,
  },
  link: {
    fontSize: 14,
    color: colors.accent,
    textDecorationLine: 'underline',
  },
});
