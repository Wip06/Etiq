import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { articles } from '@/data/articles';
import { LEXICONS } from '@/data/lexicons';
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

const styles = StyleSheet.create({
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
