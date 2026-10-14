import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { useSession } from '@/session/SessionProvider';

// Favoris et historique des comptes connectés, gardés sur le téléphone et rattachés à l'e-mail :
// on les retrouve après une déconnexion. Les invités n'y ont pas accès.

export type FavoriteKind = 'brand' | 'article' | 'product';

export type Favorite = {
  kind: FavoriteKind;
  id: string;
  title: string;
  subtitle: string;
};

export type Scan = {
  gtin: string;
  title: string;
  subtitle: string;
  // Coût environnemental en points, null si le produit n'est pas déclaré.
  cost: number | null;
  scannedAt: string;
};

type Library = { favorites: Favorite[]; history: Scan[] };

type LibraryValue = Library & {
  enabled: boolean;
  isFavorite: (kind: FavoriteKind, id: string) => boolean;
  toggleFavorite: (favorite: Favorite) => void;
  addScan: (scan: Scan) => void;
  clearHistory: () => void;
};

const MAX_HISTORY = 50;
const EMPTY: Library = { favorites: [], history: [] };

const LibraryContext = createContext<LibraryValue | null>(null);

export function useLibrary() {
  const value = use(LibraryContext);
  if (!value) throw new Error('useLibrary doit être utilisé dans <LibraryProvider />');
  return value;
}

export function LibraryProvider({ children }: PropsWithChildren) {
  const { user } = useSession();
  const storageKey = user ? `etiq.library.${user.email}` : null;
  const [library, setLibrary] = useState<{ key: string | null; data: Library }>({ key: null, data: EMPTY });

  useEffect(() => {
    if (!storageKey) return;
    AsyncStorage.getItem(storageKey)
      .then((raw) => setLibrary({ key: storageKey, data: raw ? (JSON.parse(raw) as Library) : EMPTY }))
      .catch(() => setLibrary({ key: storageKey, data: EMPTY }));
  }, [storageKey]);

  // Tant que la bibliothèque du compte actuel n'est pas chargée, on part de listes vides.
  const data = library.key === storageKey ? library.data : EMPTY;
  const enabled = storageKey !== null && library.key === storageKey;

  const update = useCallback(
    (change: (current: Library) => Library) => {
      if (!enabled || !storageKey) return;
      setLibrary((current) => {
        const next = change(current.data);
        AsyncStorage.setItem(storageKey, JSON.stringify(next));
        return { key: storageKey, data: next };
      });
    },
    [enabled, storageKey],
  );

  // Actions stables (recréées seulement au changement de compte) : les écrans peuvent les
  // utiliser dans un useEffect sans relancer leur chargement à chaque mise à jour des listes.
  const toggleFavorite = useCallback(
    (favorite: Favorite) =>
      update((current) => {
        const exists = current.favorites.some((item) => item.kind === favorite.kind && item.id === favorite.id);
        const favorites = exists
          ? current.favorites.filter((item) => !(item.kind === favorite.kind && item.id === favorite.id))
          : [favorite, ...current.favorites];
        return { ...current, favorites };
      }),
    [update],
  );

  const addScan = useCallback(
    (scan: Scan) =>
      update((current) => ({
        ...current,
        history: [scan, ...current.history.filter((item) => item.gtin !== scan.gtin)].slice(0, MAX_HISTORY),
      })),
    [update],
  );

  const clearHistory = useCallback(() => update((current) => ({ ...current, history: [] })), [update]);

  const value = useMemo<LibraryValue>(
    () => ({
      ...data,
      enabled,
      isFavorite: (kind, id) => data.favorites.some((item) => item.kind === kind && item.id === id),
      toggleFavorite,
      addScan,
      clearHistory,
    }),
    [data, enabled, toggleFavorite, addScan, clearHistory],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}
