import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { articles } from '@/data/articles';
import { formatCount, pluralize, toFootprintDuration } from '@/data/equivalents';
import { LEXICONS } from '@/data/lexicons';
import { isCurrentResult, QUESTIONS, type QuizResult } from '@/data/quiz';
import { useLibrary } from '@/session/LibraryProvider';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

type Section = {
  title: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  count: number;
  href: Href;
};

const SECTIONS: Section[] = [
  {
    title: 'Nos articles',
    description: 'Réglementation, étiquette, traçabilité : l’essentiel pour bien acheter.',
    icon: 'book-outline',
    count: articles.length,
    href: '/articles',
  },
  {
    title: LEXICONS.materials.title,
    description: 'D’où viennent les fibres de vos vêtements.',
    icon: LEXICONS.materials.icon,
    count: LEXICONS.materials.count,
    href: { pathname: '/lexicon/[kind]', params: { kind: 'materials' } },
  },
  {
    title: LEXICONS.labels.title,
    description: 'Ce que garantit chaque label, et ce qu’il ne garantit pas.',
    icon: LEXICONS.labels.icon,
    count: LEXICONS.labels.count,
    href: { pathname: '/lexicon/[kind]', params: { kind: 'labels' } },
  },
];

export default function LearnScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <QuizCard />
      {SECTIONS.map(({ title, description, icon, count, href }) => (
        <Pressable
          key={title}
          accessibilityRole="button"
          accessibilityLabel={`${title}, ${count} fiches`}
          onPress={() => router.push(href)}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <Ionicons name={icon} size={28} color={colors.accent} />
          <View style={styles.rowText}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <Text style={styles.count}>{count}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

// Mise en avant du quiz, en haut de l'onglet. Les invités la voient aussi, avec une invitation à se
// connecter : le quiz est réservé aux comptes.
function QuizCard() {
  const { user } = useSession();
  const { quizResult: saved } = useLibrary();
  const quizResult = isCurrentResult(saved) ? saved : null;
  const isConnected = user !== null;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(isConnected ? '/quiz' : '/login')}
      style={({ pressed }) => [styles.quiz, pressed && styles.pressed]}
    >
      <View style={styles.quizBadge}>
        <Ionicons name="sparkles" size={14} color={colors.accent} />
        <Text style={styles.quizBadgeLabel}>Quiz · {QUESTIONS.length} questions, 2 minutes</Text>
      </View>
      <Text style={styles.quizTitle}>Quel est l’impact de votre garde-robe ?</Text>
      <Text style={styles.quizText}>
        {quizResult ? lastResultSentence(quizResult) : 'Estimez l’impact des vêtements que vous achetez en un an.'}
      </Text>
      <View style={styles.quizButton}>
        <Text style={styles.quizButtonLabel}>
          {!isConnected ? 'Se connecter pour faire le quiz' : quizResult ? 'Voir mon résultat' : 'Faire le quiz'}
        </Text>
        <Ionicons name="arrow-forward" size={18} color={colors.accent} />
      </View>
    </Pressable>
  );
}

function lastResultSentence({ newPieces, cost }: QuizResult): string {
  if (cost <= 0) return `Votre dernier résultat : ${formatCount(newPieces)} vêtements neufs par an.`;
  const { value, unit } = toFootprintDuration(cost);
  return `Votre dernier résultat : vos achats d’une année ont autant d’impact que ${pluralize(value, unit)} de l’empreinte d’un habitant moyen de la planète.`;
}

const styles = StyleSheet.create({
  quiz: {
    gap: 10,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  quizBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.onAccent,
  },
  quizBadgeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  quizTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    color: colors.onAccent,
  },
  quizText: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.onAccent,
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.onAccent,
  },
  quizButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: 12,
    padding: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondary,
  },
  count: {
    fontSize: 16,
    color: colors.secondary,
  },
});
