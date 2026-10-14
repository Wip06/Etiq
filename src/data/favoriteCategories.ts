import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import type { FavoriteKind } from '@/session/LibraryProvider';

// Catégories de l'écran Favoris, dans l'ordre d'affichage.
export const FAVORITE_CATEGORIES: {
  kind: FavoriteKind;
  title: string;
  icon: ComponentProps<typeof Ionicons>['name'];
}[] = [
  { kind: 'brand', title: 'Marques', icon: 'pricetags-outline' },
  { kind: 'article', title: 'Articles', icon: 'book-outline' },
  { kind: 'product', title: 'Produits', icon: 'shirt-outline' },
];
