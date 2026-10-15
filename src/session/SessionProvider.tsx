import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

// Connexion simulée : tout est gardé sur le téléphone, aucun serveur.
// Pour passer à une vraie authentification (Supabase...), seul ce fichier change.

export type Preferences = {
  priorities: string[];
  budget: string;
};

export type User = {
  email: string;
  preferences: Preferences | null;
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
};

const STORAGE_KEY = 'etiq.session';
// Les préférences sont aussi gardées par compte, pour les retrouver à la reconnexion.
const preferencesKey = (email: string) => `etiq.preferences.${email}`;

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
      .then((raw) => setSession(raw ? (JSON.parse(raw) as StoredSession) : null))
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
        const preferences = raw ? (JSON.parse(raw) as Preferences) : null;
        update({ mode: 'user', user: { email, preferences } });
      },
      signOut: () => update(null),
      savePreferences: (preferences) => {
        if (session?.mode !== 'user') return;
        AsyncStorage.setItem(preferencesKey(session.user.email), JSON.stringify(preferences));
        update({ mode: 'user', user: { ...session.user, preferences } });
      },
    }),
    [isLoading, session, update],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
