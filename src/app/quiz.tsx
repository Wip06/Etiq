import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { InfoButton } from '@/components/InfoButton';
import { formatCount, pluralize, toFootprintDuration, toFootprintShare } from '@/data/equivalents';
import { FOOTPRINT_EXPLANATION, QUIZ_EXPLANATION } from '@/data/explanations';
import {
  computeResult,
  FRENCH_AVERAGE_PIECES,
  isCurrentResult,
  QUESTION_SUBJECTS,
  QUESTIONS,
  type QuizResult,
} from '@/data/quiz';
import { useLibrary } from '@/session/LibraryProvider';
import { colors } from '@/theme/colors';

type State =
  | { name: 'question'; step: number }
  | { name: 'computing' }
  | { name: 'error' }
  | { name: 'result'; result: QuizResult };

export default function QuizScreen() {
  const { quizResult, saveQuizResult } = useLibrary();
  // Un compte qui a déjà fait le quiz retrouve son résultat, avec la possibilité de le refaire.
  const [state, setState] = useState<State>(
    isCurrentResult(quizResult) ? { name: 'result', result: quizResult } : { name: 'question', step: 0 },
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const compute = (final: Record<string, string>) => {
    setState({ name: 'computing' });
    computeResult(final)
      .then((result) => {
        saveQuizResult(result);
        setState({ name: 'result', result });
      })
      .catch(() => setState({ name: 'error' }));
  };

  const restart = () => {
    setAnswers({});
    setState({ name: 'question', step: 0 });
  };

  if (state.name === 'computing') {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.text}>Calcul avec la méthode officielle…</Text>
      </View>
    );
  }

  if (state.name === 'error') {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.text}>Le calculateur officiel ne répond pas. Vérifiez votre connexion.</Text>
        <Button label="Réessayer" onPress={() => compute(answers)} />
      </View>
    );
  }

  if (state.name === 'result') return <Result result={state.result} onRestart={restart} />;

  const { step } = state;
  const question = QUESTIONS[step];
  const choose = (value: string) => {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) setState({ name: 'question', step: step + 1 });
    else compute(next);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.questionContent}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((step + 1) / QUESTIONS.length) * 100}%` }]} />
      </View>
      <Text style={styles.counter}>
        Question {step + 1} sur {QUESTIONS.length}
      </Text>
      <Text style={styles.question}>{question.question}</Text>
      {question.hint && <Text style={styles.hint}>{question.hint}</Text>}

      <View style={styles.options}>
        {question.options.map((option) => (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            onPress={() => choose(option.value)}
            style={({ pressed }) => [
              styles.option,
              (pressed || answers[question.id] === option.value) && styles.optionActive,
            ]}
          >
            <Text style={styles.optionLabel}>{option.label}</Text>
          </Pressable>
        ))}
      </View>

      {step > 0 && (
        <Button
          label="Question précédente"
          variant="secondary"
          onPress={() => setState({ name: 'question', step: step - 1 })}
        />
      )}
    </ScrollView>
  );
}

function Result({ result, onRestart }: { result: QuizResult; onRestart: () => void }) {
  const { newPieces, cost, biggest, levers, assumedMaterial } = result;
  const footprint = toFootprintDuration(cost);
  const share = toFootprintShare(cost).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
  const gap = newPieces - FRENCH_AVERAGE_PIECES;
  const comparison =
    Math.abs(gap) <= 3
      ? `C’est proche de la moyenne française (${FRENCH_AVERAGE_PIECES}).`
      : gap > 0
        ? `C’est ${gap} de plus que la moyenne française (${FRENCH_AVERAGE_PIECES}).`
        : `C’est ${-gap} de moins que la moyenne française (${FRENCH_AVERAGE_PIECES}).`;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.resultContent}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, styles.flex]}>Votre garde-robe sur un an</Text>
        <InfoButton explanation={QUIZ_EXPLANATION} />
      </View>

      {cost > 0 && (
        <>
          <View style={styles.hero}>
            <View style={styles.heroInfo}>
              <InfoButton explanation={FOOTPRINT_EXPLANATION} />
            </View>
            <Text style={styles.heroNote}>Vos achats d’une année ont autant d’impact que</Text>
            <Text style={styles.heroNumber}>{pluralize(footprint.value, footprint.unit)}</Text>
            <Text style={styles.heroLabel}>de l’empreinte environnementale d’un habitant moyen de la planète</Text>
            <Text style={styles.heroNote}>
              Soit {share} % de tout ce qu’il émet, consomme et pollue en un an pour se nourrir, se déplacer, se
              loger…
            </Text>
          </View>
          <Text style={styles.meta}>
            {formatCount(Math.round(cost))} points de coût environnemental, calculés avec la méthode officielle.
            {biggest ? ` ${capitalize(QUESTION_SUBJECTS[biggest.id])} en représentent ${biggest.share} %.` : ''}
          </Text>
        </>
      )}

      {levers.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Vos leviers</Text>
          {levers.map((lever) => (
            <View key={lever.id} style={styles.lever}>
              <Text style={[styles.text, styles.flex]}>{lever.label}</Text>
              <Text style={styles.gain}>−{lever.gain} %</Text>
            </View>
          ))}
          <Text style={styles.meta}>Baisse de votre impact si vous changiez seulement ce point.</Text>
        </>
      )}

      {assumedMaterial && (
        <View style={styles.tip}>
          <Text style={styles.cardTitle}>Vous ne connaissez pas la matière de vos vêtements ?</Text>
          <Text style={styles.text}>
            C’est le cas de la plupart des gens. Nous avons supposé {assumedMaterial}. Pour le savoir vraiment,
            scannez l’étiquette cousue d’un vêtement que vous portez : l’app la lit pour vous.
          </Text>
          <Button
            label="Scanner une étiquette"
            variant="secondary"
            onPress={() => router.navigate({ pathname: '/scan', params: { mode: 'label' } })}
          />
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vos achats</Text>
        <Text style={styles.text}>
          {pluralize(newPieces, 'vêtement')} acheté{newPieces > 1 ? 's' : ''} neuf{newPieces > 1 ? 's' : ''} par an.{' '}
          {comparison}
        </Text>
      </View>

      <Button label="Scanner un vêtement" onPress={() => router.navigate('/scan')} />
      <Button label="Refaire le quiz" variant="secondary" onPress={onRestart} />
      <Text style={styles.source}>
        Estimation avec le calculateur officiel Ecobalyse (version 7.0.0), à la masse médiane de chaque catégorie
        déclarée sur le portail. Moyenne française : baromètre Refashion 2025.
      </Text>
    </ScrollView>
  );
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 24,
    backgroundColor: colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  questionContent: {
    gap: 16,
    padding: 24,
  },
  resultContent: {
    gap: 16,
    padding: 24,
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
  counter: {
    fontSize: 13,
    color: colors.secondary,
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 31,
    color: colors.text,
  },
  hint: {
    marginTop: -8,
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondary,
  },
  options: {
    gap: 10,
    marginVertical: 8,
  },
  option: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surface,
    backgroundColor: colors.surface,
  },
  optionActive: {
    borderColor: colors.accent,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  hero: {
    alignItems: 'center',
    gap: 4,
    padding: 24,
    borderRadius: 16,
    backgroundColor: colors.accent,
  },
  heroInfo: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  heroNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.onAccent,
  },
  heroLabel: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 23,
    textAlign: 'center',
    color: colors.onAccent,
  },
  heroNote: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
    color: colors.onAccent,
  },
  card: {
    gap: 6,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  costValue: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 29,
    color: colors.text,
  },
  tip: {
    gap: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  lever: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
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
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondary,
  },
  source: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondary,
  },
});
