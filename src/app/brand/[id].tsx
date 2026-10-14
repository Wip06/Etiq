import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FavoriteButton } from '@/components/FavoriteButton';
import { getBrand } from '@/data/brands';
import { colors } from '@/theme/colors';
import { openLink } from '@/utils/links';

export default function BrandScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const brand = getBrand(id);

  if (!brand) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.description}>Marque introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: brand.name }} />
      <View style={styles.titleRow}>
        <Text style={styles.name}>{brand.name}</Text>
        <FavoriteButton favorite={{ kind: 'brand', id: brand.id, title: brand.name, subtitle: brand.country }} />
      </View>
      <Text style={styles.country}>{brand.country}</Text>
      <View style={styles.tags}>
        {brand.tags.map((tag) => (
          <Text key={tag} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
      <Text style={styles.description}>{brand.description}</Text>

      {brand.sources.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Sources</Text>
          {brand.sources.map((source) => (
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
    gap: 12,
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: colors.accent,
  },
  country: {
    fontSize: 15,
    color: colors.secondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    color: colors.onAccent,
    backgroundColor: colors.secondary,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
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
