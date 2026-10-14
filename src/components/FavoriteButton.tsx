import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';

import { useLibrary, type Favorite } from '@/session/LibraryProvider';
import { colors } from '@/theme/colors';

// Cœur à placer dans l'en-tête d'une page. Invisible pour les invités.
export function FavoriteButton({ favorite }: { favorite: Favorite }) {
  const { enabled, isFavorite, toggleFavorite } = useLibrary();
  if (!enabled) return null;

  const active = isFavorite(favorite.kind, favorite.id);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      hitSlop={12}
      onPress={() => toggleFavorite(favorite)}
    >
      <Ionicons name={active ? 'heart' : 'heart-outline'} size={24} color={active ? colors.accent : colors.text} />
    </Pressable>
  );
}
