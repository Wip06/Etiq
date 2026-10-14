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
  signIn: (email: string) => void;
  signOut: () => void;
  savePreferences: (preferences: Preferences) => void;
};

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
      signIn: (email) => update({ mode: 'user', user: { email, preferences: null } }),
      signOut: () => update(null),
      savePreferences: (preferences) => {
        if (session?.mode === 'user') update({ mode: 'user', user: { ...session.user, preferences } });
      },
    }),
    [isLoading, session, update],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
