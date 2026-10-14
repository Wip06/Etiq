import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SearchInput } from '@/components/SearchInput';
import { LEXICONS, type LexiconEntry, type LexiconKind } from '@/data/lexicons';
import { colors } from '@/theme/colors';
import { openLink } from '@/utils/links';

export default function LexiconScreen() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  const [query, setQuery] = useState('');
  const lexicon = kind in LEXICONS ? LEXICONS[kind as LexiconKind] : undefined;

  if (!lexicon) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.empty}>Lexique introuvable.</Text>
      </View>
    );
  }

  const groups = lexicon.search(query);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: lexicon.title }} />
      <SearchInput value={query} onChangeText={setQuery} placeholder={lexicon.placeholder} />
      <Text style={styles.credit}>Fiches de The Good Goods</Text>
      {groups.map((group) => (
        <View key={group.title} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.items.map((entry) => (
            <LexiconRow key={entry.url} entry={entry} />
          ))}
        </View>
      ))}
      {groups.length === 0 && <Text style={styles.empty}>Aucun résultat.</Text>}
    </ScrollView>
  );
}

function LexiconRow({ entry }: { entry: LexiconEntry }) {
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
  centered: {
    justifyContent: 'center',
  },
  content: {
    gap: 12,
    padding: 16,
  },
  credit: {
    fontSize: 13,
    color: colors.secondary,
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
  pressed: {
    opacity: 0.7,
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
