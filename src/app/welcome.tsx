import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

export default function WelcomeScreen() {
  const { continueAsGuest } = useSession();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Etiq</Text>
        <Text style={styles.subtitle}>Le coût environnemental de vos vêtements</Text>
      </View>
      <View style={styles.actions}>
        <Button label="Se connecter" onPress={() => router.push('/login')} />
        <Button label="Continuer en invité" variant="secondary" onPress={continueAsGuest} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.accent,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.text,
  },
  actions: {
    gap: 12,
  },
});
