import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

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

  if (isLoading) return null;
  SplashScreen.hide();

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
        <Stack.Screen name="brand/[id]" options={{ title: 'Marque' }} />
        <Stack.Screen name="article/[id]" options={{ title: 'Article' }} />
        <Stack.Screen name="about" options={{ title: 'À propos' }} />
        <Stack.Screen name="favorites/index" options={{ title: 'Favoris' }} />
        <Stack.Screen name="favorites/[kind]" />
        <Stack.Screen name="history" options={{ title: 'Historique' }} />
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
