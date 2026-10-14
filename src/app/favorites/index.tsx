import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { FAVORITE_CATEGORIES } from '@/data/favoriteCategories';
import { useLibrary } from '@/session/LibraryProvider';
import { colors } from '@/theme/colors';

export default function FavoritesScreen() {
  const { favorites } = useLibrary();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {FAVORITE_CATEGORIES.map(({ kind, title, icon }) => {
        const count = favorites.filter((favorite) => favorite.kind === kind).length;
        return (
          <Pressable
            key={kind}
            accessibilityRole="button"
            accessibilityLabel={`${title}, ${count} favori${count > 1 ? 's' : ''}`}
            onPress={() => router.push({ pathname: '/favorites/[kind]', params: { kind } })}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <Ionicons name={icon} size={24} color={colors.accent} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.count}>{count}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
          </Pressable>
        );
      })}
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
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  count: {
    fontSize: 16,
    color: colors.secondary,
  },
});
