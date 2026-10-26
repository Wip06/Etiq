import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { isCurrentResult, type QuizResult } from '@/data/quiz';
import { useSession } from '@/session/SessionProvider';
import { libraryKey } from '@/session/storageKeys';

// Favoris, historique et résultats du quiz des comptes connectés, gardés sur le téléphone et
// rattachés à l'e-mail : on les retrouve après une déconnexion. Les invités n'y ont pas accès.

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
  // Part des vêtements de sa catégorie qui ont plus d'impact, à poids égal (%). Absent des scans
  // enregistrés avant son ajout, null si le vêtement n'est pas comparable.
  lessImpactThan?: number | null;
  scannedAt: string;
};

// Résultats du quiz, du plus récent au plus ancien : ils mesurent l'évolution de l'impact.
// quizResult (un seul résultat) vient des bibliothèques enregistrées avant cet historique.
type Library = { favorites: Favorite[]; history: Scan[]; quizHistory?: QuizResult[]; quizResult?: QuizResult | null };

type LibraryValue = Omit<Library, 'quizHistory' | 'quizResult'> & {
  quizHistory: QuizResult[];
  // Dernier résultat du quiz, null s'il n'a jamais été fait.
  quizResult: QuizResult | null;
  enabled: boolean;
  isFavorite: (kind: FavoriteKind, id: string) => boolean;
  toggleFavorite: (favorite: Favorite) => void;
  addScan: (scan: Scan) => void;
  clearHistory: () => void;
  saveQuizResult: (result: QuizResult) => void;
};

const MAX_HISTORY = 50;
const MAX_QUIZ_RESULTS = 24;
const EMPTY: Library = { favorites: [], history: [], quizHistory: [] };

// Résultats du quiz au format actuel, y compris celui d'une bibliothèque d'avant l'historique.
function quizResultsOf(library: Library): QuizResult[] {
  const results = library.quizHistory ?? (library.quizResult ? [library.quizResult] : []);
  return results.filter(isCurrentResult);
}

const LibraryContext = createContext<LibraryValue | null>(null);

export function useLibrary() {
  const value = use(LibraryContext);
  if (!value) throw new Error('useLibrary doit être utilisé dans <LibraryProvider />');
  return value;
}

export function LibraryProvider({ children }: PropsWithChildren) {
  const { user } = useSession();
  const storageKey = user ? libraryKey(user.email) : null;
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

  const saveQuizResult = useCallback(
    (result: QuizResult) =>
      update(({ quizResult: _legacy, ...current }) => ({
        ...current,
        quizHistory: [result, ...quizResultsOf(current)].slice(0, MAX_QUIZ_RESULTS),
      })),
    [update],
  );

  const value = useMemo<LibraryValue>(
    () => ({
      favorites: data.favorites,
      history: data.history,
      quizHistory: quizResultsOf(data),
      quizResult: quizResultsOf(data)[0] ?? null,
      enabled,
      isFavorite: (kind, id) => data.favorites.some((item) => item.kind === kind && item.id === id),
      toggleFavorite,
      addScan,
      clearHistory,
      saveQuizResult,
    }),
    [data, enabled, toggleFavorite, addScan, clearHistory, saveQuizResult],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}
