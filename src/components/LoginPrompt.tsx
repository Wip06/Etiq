import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';

// Affiché aux invités à la place des fonctions réservées aux comptes.
export function LoginPrompt({ message }: { message: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.message}>{message}</Text>
      <Button label="Se connecter" onPress={() => router.push('/login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
});
