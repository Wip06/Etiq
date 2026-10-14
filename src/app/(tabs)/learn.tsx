import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { articles, type Article } from '@/data/articles';
import { searchLabels, THEMES, type Theme } from '@/data/labels';
import { FAMILIES, searchMaterials, type Family } from '@/data/materials';
import { colors } from '@/theme/colors';
import { openLink } from '@/utils/links';
import { normalize } from '@/utils/text';

type Entry = { name: string; summary: string; url: string };
type Group = { title: string; items: Entry[] };

// Regroupe les entrées d'un lexique dans l'ordre des groupes, en retirant les groupes vides.
function groupBy<K extends string>(titles: Record<K, string>, items: (Entry & Record<string, unknown>)[], key: string) {
  return (Object.keys(titles) as K[])
    .map((group) => ({ title: titles[group], items: items.filter((item) => item[key] === group) }))
    .filter(({ items: groupItems }) => groupItems.length > 0);
}

export default function LearnScreen() {
  const [query, setQuery] = useState('');
  const q = normalize(query.trim());
  const foundArticles = articles.filter((article) => normalize(article.title).includes(q));
  const materialGroups = groupBy<Family>(FAMILIES, searchMaterials(query), 'family');
  const labelGroups = groupBy<Theme>(THEMES, searchLabels(query), 'theme');
  const isEmpty = foundArticles.length === 0 && materialGroups.length === 0 && labelGroups.length === 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher un article, une matière, un label..."
        placeholderTextColor={colors.secondary}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      {foundArticles.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Nos articles</Text>
          {foundArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </>
      )}

      <LexiconSection title="Lexique des matières" groups={materialGroups} />
      <LexiconSection title="Lexique des labels" groups={labelGroups} />

      {isEmpty && <Text style={styles.empty}>Aucun résultat.</Text>}
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

function LexiconSection({ title, groups }: { title: string; groups: Group[] }) {
  if (groups.length === 0) return null;
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.credit}>Fiches de The Good Goods</Text>
      {groups.map((group) => (
        <View key={group.title} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.items.map((entry) => (
            <LexiconRow key={entry.url} entry={entry} />
          ))}
        </View>
      ))}
    </>
  );
}

function LexiconRow({ entry }: { entry: Entry }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => openLink(entry.url)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{entry.name}</Text>
        <Text style={styles.summary}>{entry.summary}</Text>
      </View>
      <Ionicons name="open-outline" size={18} color={colors.secondary} />
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
  search: {
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  sectionTitle: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent,
  },
  credit: {
    marginTop: -8,
    fontSize: 13,
    color: colors.secondary,
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
  group: {
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  groupTitle: {
    padding: 16,
    paddingBottom: 4,
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.background,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  empty: {
    marginTop: 24,
    fontSize: 15,
    textAlign: 'center',
    color: colors.secondary,
  },
});
