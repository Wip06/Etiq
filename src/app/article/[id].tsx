import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FavoriteButton } from '@/components/FavoriteButton';
import { getArticle } from '@/data/articles';
import { colors } from '@/theme/colors';
import { openLink } from '@/utils/links';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = getArticle(id);

  if (!article) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.paragraph}>Article introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: article.title,
          headerRight: () => (
            <FavoriteButton
              favorite={{ kind: 'article', id: article.id, title: article.title, subtitle: article.theme }}
            />
          ),
        }}
      />
      <Text style={styles.theme}>{article.theme}</Text>
      <Text style={styles.title}>{article.title}</Text>
      {article.paragraphs.map((paragraph) => (
        <Text key={paragraph} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}

      {article.sources.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Sources</Text>
          {article.sources.map((source) => (
            <Pressable key={source.url} accessibilityRole="link" onPress={() => openLink(source.url)}>
              <Text style={styles.link}>{source.label}</Text>
            </Pressable>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    gap: 14,
    padding: 24,
  },
  theme: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: colors.secondary,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.accent,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 25,
    color: colors.text,
  },
  sectionTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  link: {
    fontSize: 15,
    textDecorationLine: 'underline',
    color: colors.accent,
  },
});
