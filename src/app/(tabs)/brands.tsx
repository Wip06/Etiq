import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { searchBrands, type Brand } from '@/data/brands';
import { colors } from '@/theme/colors';

export default function BrandsScreen() {
  const [query, setQuery] = useState('');
  const results = searchBrands(query);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher une marque, un pays, un groupe..."
        placeholderTextColor={colors.secondary}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      <FlatList
        data={results}
        keyExtractor={(brand) => brand.id}
        renderItem={({ item }) => <BrandCard brand={item} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={styles.empty}>Aucune marque trouvée.</Text>}
      />
    </View>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/brand/[id]', params: { id: brand.id } })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.name}>{brand.name}</Text>
      <Text style={styles.country}>{brand.country}</Text>
      <View style={styles.tags}>
        {brand.tags.map((tag) => (
          <Text key={tag} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  search: {
    margin: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  list: {
    gap: 12,
    padding: 16,
    paddingTop: 8,
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
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  country: {
    fontSize: 14,
    color: colors.secondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
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
  empty: {
    marginTop: 24,
    fontSize: 15,
    textAlign: 'center',
    color: colors.secondary,
  },
});
