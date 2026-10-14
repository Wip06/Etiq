import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { FAVORITE_CATEGORIES } from '@/data/favoriteCategories';
import { useLibrary, type Favorite } from '@/session/LibraryProvider';
import { colors } from '@/theme/colors';

function openFavorite({ kind, id }: Favorite) {
  if (kind === 'brand') router.push({ pathname: '/brand/[id]', params: { id } });
  else if (kind === 'article') router.push({ pathname: '/article/[id]', params: { id } });
  else router.push({ pathname: '/product/[gtin]', params: { gtin: id } });
}

export default function FavoriteCategoryScreen() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  const { favorites } = useLibrary();
  const category = FAVORITE_CATEGORIES.find((item) => item.kind === kind);

  if (!category) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.empty}>Catégorie introuvable.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: category.title }} />
      <FlatList
        data={favorites.filter((favorite) => favorite.kind === category.kind)}
        keyExtractor={(favorite) => favorite.id}
        renderItem={({ item }) => <FavoriteRow favorite={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Aucun favori dans cette catégorie.</Text>}
      />
    </View>
  );
}

function FavoriteRow({ favorite }: { favorite: Favorite }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => openFavorite(favorite)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.rowText}>
        <Text style={styles.title} numberOfLines={2}>
          {favorite.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {favorite.subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
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
  list: {
    gap: 12,
    padding: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondary,
  },
  empty: {
    marginTop: 24,
    fontSize: 15,
    textAlign: 'center',
    color: colors.secondary,
  },
});
