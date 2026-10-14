import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LoginPrompt } from '@/components/LoginPrompt';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

// Accueil provisoire : pourra être remplacé.
export default function HomeScreen() {
  const { user } = useSession();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{user ? `Bonjour ${user.email}` : 'Bienvenue sur Etiq'}</Text>

      <Pressable accessibilityRole="button" onPress={() => router.navigate('/scan')} style={styles.scanCard}>
        <Ionicons name="scan" size={28} color={colors.onAccent} />
        <View style={styles.scanText}>
          <Text style={styles.scanTitle}>Scanner un vêtement</Text>
          <Text style={styles.scanSubtitle}>Code-barres ou étiquette</Text>
        </View>
      </Pressable>

      <Text style={styles.sectionTitle}>Vos recommandations</Text>
      {user ? (
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Bientôt disponibles, selon vos préférences : {user.preferences?.priorities.join(', ')}.
          </Text>
        </View>
      ) : (
        <LoginPrompt message="Connectez-vous pour recevoir des recommandations de marques adaptées à vos préférences." />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: 16,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.accent,
  },
  scanText: {
    gap: 2,
  },
  scanTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onAccent,
  },
  scanSubtitle: {
    fontSize: 14,
    color: colors.onAccent,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
});
