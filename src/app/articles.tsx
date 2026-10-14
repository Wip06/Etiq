import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { SearchInput } from '@/components/SearchInput';
import { articles, type Article } from '@/data/articles';
import { colors } from '@/theme/colors';
import { normalize } from '@/utils/text';

export default function ArticlesScreen() {
  const [query, setQuery] = useState('');
  const q = normalize(query.trim());
  const found = articles.filter((article) => normalize(article.title).includes(q));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <SearchInput value={query} onChangeText={setQuery} placeholder="Rechercher un article..." />
      {found.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
      {found.length === 0 && <Text style={styles.empty}>Aucun résultat.</Text>}
    </ScrollView>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/article/[id]', params: { id: article.id } })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.theme}>{article.theme}</Text>
      <Text style={styles.cardTitle}>{article.title}</Text>
      <Text style={styles.summary}>{article.summary}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: 12,
    padding: 16,
  },
  card: {
    gap: 4,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  theme: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: colors.secondary,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    opacity: 0.85,
  },
  empty: {
    marginTop: 24,
    fontSize: 15,
    textAlign: 'center',
    color: colors.secondary,
  },
});
