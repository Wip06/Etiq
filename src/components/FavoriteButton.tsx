import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';

import { useLibrary, type Favorite } from '@/session/LibraryProvider';
import { colors } from '@/theme/colors';

// Cœur à placer à côté du titre d'une page (pas dans l'en-tête natif : il ne s'y affiche pas
// sur Android). Invisible pour les invités.
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
      <Ionicons name={active ? 'heart' : 'heart-outline'} size={28} color={active ? colors.accent : colors.text} />
    </Pressable>
  );
}
