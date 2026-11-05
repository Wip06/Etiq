import { BlurTargetView } from 'expo-blur';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState, type ComponentRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { DidYouKnowPopup } from '@/components/DidYouKnowPopup';
import { LibraryProvider } from '@/session/LibraryProvider';
import { SessionProvider, useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SessionProvider>
      <LibraryProvider>
        <RootNavigator />
        <StatusBar style="light" />
      </LibraryProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { isLoading, isGuest, user } = useSession();

  const [hasContinued, setHasContinued] = useState(false);
  const closePopup = useCallback(() => setHasContinued(true), []);
  const appRef = useRef<ComponentRef<typeof View>>(null);

  // Le pop-up « Le savais-tu ? » prend le relais de l'écran natif, jusqu'à ce que l'utilisateur continue.
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      {/* L'app ne s'affiche, floutée derrière le pop-up, qu'une fois la session chargée. */}
      <BlurTargetView ref={appRef} style={styles.app}>
        {!isLoading && <AppStack isGuest={isGuest} user={user} />}
      </BlurTargetView>
      {!hasContinued && <DidYouKnowPopup ready={!isLoading} blurTarget={appRef} onContinue={closePopup} />}
    </>
  );
}

function AppStack({ isGuest, user }: Pick<ReturnType<typeof useSession>, 'isGuest' | 'user'>) {
  const hasChosen = isGuest || user !== null;
  const needsOnboarding = user !== null && user.preferences === null;

  // L'ordre compte : à chaque changement de session, l'app ouvre le premier écran autorisé.
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Protected guard={!hasChosen}>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={hasChosen && !needsOnboarding}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[gtin]" options={{ title: 'Résultat' }} />
        <Stack.Screen name="label" options={{ title: 'Étiquette' }} />
        <Stack.Screen name="brand/[id]" options={{ title: 'Marque' }} />
        <Stack.Screen name="articles" options={{ title: 'Nos articles' }} />
        <Stack.Screen name="article/[id]" options={{ title: 'Article' }} />
        <Stack.Screen name="lexicon/[kind]" />
        <Stack.Screen name="about" options={{ title: 'À propos' }} />
        <Stack.Screen name="favorites/index" options={{ title: 'Favoris' }} />
        <Stack.Screen name="favorites/[kind]" />
        <Stack.Screen name="history" options={{ title: 'Historique' }} />
        <Stack.Screen name="brand-criteria" options={{ title: 'Nos critères' }} />
        <Stack.Screen name="privacy" options={{ title: 'Confidentialité' }} />
      </Stack.Protected>

      {/* Réservé aux comptes connectés : le résultat est gardé dans leur bibliothèque. */}
      <Stack.Protected guard={user !== null && !needsOnboarding}>
        <Stack.Screen name="quiz" options={{ title: 'Quiz' }} />
        <Stack.Screen name="preferences" options={{ title: 'Mes objectifs' }} />
        <Stack.Screen name="etiq-plus" options={{ title: 'Etiq+' }} />
        <Stack.Screen name="wardrobe" options={{ title: 'Ma garde-robe' }} />
        <Stack.Screen name="search" options={{ title: 'Recherche avec filtres' }} />
      </Stack.Protected>

      <Stack.Protected guard={needsOnboarding}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={user === null}>
        <Stack.Screen name="login" options={{ title: 'Connexion' }} />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
