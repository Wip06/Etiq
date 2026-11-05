import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import type { BudgetId, GoalId } from '@/data/goals';
import { clearCache } from '@/services/offlineCache';
import { firstNameKey, libraryKey, preferencesKey, premiumKey } from '@/session/storageKeys';

// Connexion simulée : tout est gardé sur le téléphone, aucun serveur.
// Pour passer à une vraie authentification (Supabase...), seul ce fichier change.

export type Preferences = {
  goals: GoalId[];
  budget: BudgetId;
};

// Les préférences du premier questionnaire provisoire (priorités, budget en texte) ne sont plus
// valables : le compte repasse par l'onboarding.
function readPreferences(value: unknown): Preferences | null {
  const candidate = value as Partial<Preferences> | null;
  return candidate && Array.isArray(candidate.goals) && typeof candidate.budget === 'string'
    ? (candidate as Preferences)
    : null;
}

export type User = {
  email: string;
  // Demandé à l'onboarding ; absent des comptes créés avant.
  firstName?: string | null;
  preferences: Preferences | null;
  // Abonné Etiq+. Abonnement simulé pour le prototype : aucun paiement, il s'active depuis la page
  // Etiq+. Absent des comptes créés avant.
  premium?: boolean;
};

type StoredSession = { mode: 'guest' } | { mode: 'user'; user: User };

type SessionValue = {
  isLoading: boolean;
  isGuest: boolean;
  user: User | null;
  continueAsGuest: () => void;
  signIn: (email: string) => Promise<void>;
  signOut: () => void;
  savePreferences: (preferences: Preferences) => void;
  saveFirstName: (firstName: string) => void;
  // Abonnement Etiq+ simulé : active ou résilie l'abonnement du compte connecté.
  setPremium: (premium: boolean) => void;
  // Efface tout ce que l'app garde sur ce compte : préférences, prénom, favoris, historique, garde-robe,
  // quiz, abonnement Etiq+.
  deleteAccount: () => Promise<void>;
};

// Les préférences et le prénom sont aussi gardés par compte (storageKeys), pour les retrouver à la
// reconnexion.
const STORAGE_KEY = 'etiq.session';

const SessionContext = createContext<SessionValue | null>(null);

export function useSession() {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession doit être utilisé dans <SessionProvider />');
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        const stored = raw ? (JSON.parse(raw) as StoredSession) : null;
        setSession(
          stored?.mode === 'user'
            ? { mode: 'user', user: { ...stored.user, preferences: readPreferences(stored.user.preferences) } }
            : stored,
        );
      })
      .catch(() => setSession(null))
      .finally(() => setIsLoading(false));
  }, []);

  const update = useCallback((next: StoredSession | null) => {
    setSession(next);
    if (next) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      isLoading,
      isGuest: session?.mode === 'guest',
      user: session?.mode === 'user' ? session.user : null,
      continueAsGuest: () => update({ mode: 'guest' }),
      signIn: async (email) => {
        const raw = await AsyncStorage.getItem(preferencesKey(email)).catch(() => null);
        const preferences = raw ? readPreferences(JSON.parse(raw)) : null;
        const firstName = await AsyncStorage.getItem(firstNameKey(email)).catch(() => null);
        const premium = (await AsyncStorage.getItem(premiumKey(email)).catch(() => null)) === '1';
        update({ mode: 'user', user: { email, firstName, preferences, premium } });
      },
      signOut: () => update(null),
      savePreferences: (preferences) => {
        if (session?.mode !== 'user') return;
        AsyncStorage.setItem(preferencesKey(session.user.email), JSON.stringify(preferences));
        update({ mode: 'user', user: { ...session.user, preferences } });
      },
      saveFirstName: (firstName) => {
        if (session?.mode !== 'user') return;
        AsyncStorage.setItem(firstNameKey(session.user.email), firstName);
        update({ mode: 'user', user: { ...session.user, firstName } });
      },
      setPremium: (premium) => {
        if (session?.mode !== 'user') return;
        if (premium) AsyncStorage.setItem(premiumKey(session.user.email), '1');
        else AsyncStorage.removeItem(premiumKey(session.user.email));
        update({ mode: 'user', user: { ...session.user, premium } });
      },
      deleteAccount: async () => {
        if (session?.mode !== 'user') return;
        const { email } = session.user;
        await AsyncStorage.multiRemove([
          preferencesKey(email),
          firstNameKey(email),
          libraryKey(email),
          premiumKey(email),
        ]).catch(
          () => undefined,
        );
        // Les fiches gardées pour le mode hors ligne révèlent aussi ce que l'utilisateur a consulté.
        await clearCache();
        update(null);
      },
    }),
    [isLoading, session, update],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
