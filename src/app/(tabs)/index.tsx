import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LoginPrompt } from '@/components/LoginPrompt';
import { getGoal } from '@/data/goals';
import { recommendBrands } from '@/data/recommendations';
import { useSession, type Preferences } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

// Accueil provisoire : pourra être remplacé.
export default function HomeScreen() {
  const { user } = useSession();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{user?.firstName ? `Bonjour ${user.firstName}` : 'Bienvenue sur Etiq'}</Text>

      <Pressable accessibilityRole="button" onPress={() => router.navigate('/scan')} style={styles.scanCard}>
        <Ionicons name="scan" size={28} color={colors.onAccent} />
        <View style={styles.scanText}>
          <Text style={styles.scanTitle}>Scanner un vêtement</Text>
          <Text style={styles.scanSubtitle}>Code-barres ou étiquette</Text>
        </View>
      </Pressable>

      {user?.preferences ? (
        <ForYou preferences={user.preferences} />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Pour vous</Text>
          <LoginPrompt message="Connectez-vous pour recevoir des marques et des lectures adaptées à vos objectifs." />
        </>
      )}
    </ScrollView>
  );
}

// Marques et lectures choisies d'après les objectifs de l'utilisateur.
function ForYou({ preferences }: { preferences: Preferences }) {
  const recommendations = recommendBrands(preferences);
  const readings = preferences.goals.flatMap((id) => getGoal(id)?.readings ?? []);

  return (
    <>
      <Text style={styles.sectionTitle}>Marques pour vous</Text>
      {recommendations.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Aucune marque relevée ne correspond encore à vos objectifs. Nous en ajoutons régulièrement.
          </Text>
        </View>
      ) : (
        recommendations.map(({ brand, goals }) => (
          <Pressable
            key={brand.id}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/brand/[id]', params: { id: brand.id } })}
            style={({ pressed }) => [styles.card, styles.row, pressed && styles.pressed]}
          >
            <View style={styles.rowText}>
              <Text style={styles.brandName}>{brand.name}</Text>
              <View style={styles.badges}>
                {goals.map((goal) => (
                  <Text key={goal} style={styles.badge}>
                    {getGoal(goal)?.badge}
                  </Text>
                ))}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
          </Pressable>
        ))
      )}
      <Pressable accessibilityRole="link" onPress={() => router.push('/brand-criteria')}>
        <Text style={styles.link}>Comment nous choisissons les marques</Text>
      </Pressable>

      {readings.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>À lire pour vous</Text>
          {readings.map((reading) => (
            <Pressable
              key={reading.title}
              accessibilityRole="button"
              onPress={() => router.push(reading.href)}
              style={({ pressed }) => [styles.card, styles.row, pressed && styles.pressed]}
            >
              <Text style={[styles.cardText, styles.rowText]}>{reading.title}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
            </Pressable>
          ))}
        </>
      )}
    </>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  rowText: {
    flex: 1,
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  brandName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '600',
    color: colors.onAccent,
    backgroundColor: colors.secondary,
  },
  link: {
    fontSize: 14,
    color: colors.accent,
    textDecorationLine: 'underline',
  },
});
