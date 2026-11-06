import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandMatchCard } from '@/components/BrandMatchCard';
import { EtiqPlusBadge } from '@/components/EtiqPlusBadge';
import { LoginPrompt } from '@/components/LoginPrompt';
import { Tiko } from '@/components/Tiko';
import { ETIQ_PLUS_HIGHLIGHTS, ETIQ_PLUS_PRICE } from '@/data/etiqPlus';
import { getGoal } from '@/data/goals';
import { QUESTIONS } from '@/data/quiz';
import { recommendBrands } from '@/data/recommendations';
import { useLibrary } from '@/session/LibraryProvider';
import { useSession, type Preferences } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

// Accueil provisoire : pourra être remplacé.
export default function HomeScreen() {
  const { user } = useSession();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Tiko
        pose="assisSourire"
        message={`${user?.firstName ? `Bonjour ${user.firstName} !` : 'Bienvenue !'} Scanne un vêtement pour commencer.`}
        onPress={() => router.navigate('/scan')}
      />

      <Pressable accessibilityRole="button" onPress={() => router.navigate('/scan')} style={styles.scanCard}>
        <Ionicons name="scan" size={28} color={colors.onAccent} />
        <View style={styles.scanText}>
          <Text style={styles.scanTitle}>Scanner un vêtement</Text>
          <Text style={styles.scanSubtitle}>Code-barres ou étiquette</Text>
        </View>
      </Pressable>

      <QuizInvite />
      <EtiqPlusInvite />

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

// Invitation au quiz garde-robe, pour un compte qui ne l'a jamais fait : c'est l'écran sur lequel
// arrive l'utilisateur après l'onboarding. Le quiz est réservé aux comptes connectés.
function QuizInvite() {
  const { user } = useSession();
  const { enabled, quizHistory } = useLibrary();
  if (!user?.preferences || !enabled || quizHistory.length > 0) return null;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push('/quiz')}
      style={({ pressed }) => [styles.quizCard, pressed && styles.pressed]}
    >
      <Ionicons name="shirt-outline" size={28} color={colors.accent} />
      <View style={styles.quizText}>
        <Text style={styles.quizTitle}>Quel est l’impact de votre garde-robe ?</Text>
        <Text style={styles.quizSubtitle}>Quiz · {QUESTIONS.length} questions, 2 minutes</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
    </Pressable>
  );
}

// Offre Etiq+ pour un compte standard (un invité n'a pas de compte à abonner) : ce qu'elle ajoute et
// son prix, vers le comparatif.
function EtiqPlusInvite() {
  const { user } = useSession();
  if (!user || user.premium) return null;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push('/etiq-plus')}
      style={({ pressed }) => [styles.plusCard, pressed && styles.pressed]}
    >
      <View style={styles.quizText}>
        <EtiqPlusBadge />
        <Text style={styles.quizTitle}>Passez à Etiq+</Text>
        <Text style={styles.quizSubtitle}>
          {ETIQ_PLUS_HIGHLIGHTS.map((feature) => feature.title).join(', ')} · {ETIQ_PLUS_PRICE}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.accent} />
    </Pressable>
  );
}

// Marques et lectures choisies d'après les objectifs de l'utilisateur.
function ForYou({ preferences }: { preferences: Preferences }) {
  const recommendations = recommendBrands(preferences);
  const matching = recommendations.filter((recommendation) => recommendation.matchesGoal);
  const others = recommendations.filter((recommendation) => !recommendation.matchesGoal);
  const readings = preferences.goals.flatMap((id) => getGoal(id)?.readings ?? []);

  return (
    <>
      <Text style={styles.sectionTitle}>Marques pour vous</Text>
      {matching.length === 0 && (
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Aucune marque relevée ne répond encore à vos objectifs. En voici d’autres, à défaut : nous en ajoutons
            régulièrement.
          </Text>
        </View>
      )}
      {matching.map((recommendation) => (
        <BrandMatchCard key={recommendation.brand.id} recommendation={recommendation} />
      ))}
      {others.length > 0 && matching.length > 0 && <Text style={styles.subsection}>À défaut</Text>}
      {others.map((recommendation) => (
        <BrandMatchCard key={recommendation.brand.id} recommendation={recommendation} />
      ))}
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
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  quizText: {
    flex: 1,
    gap: 2,
  },
  plusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: 'rgba(217, 192, 138, 0.12)',
  },
  quizTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  quizSubtitle: {
    fontSize: 14,
    color: colors.secondary,
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
  subsection: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondary,
  },
  link: {
    fontSize: 14,
    color: colors.accent,
    textDecorationLine: 'underline',
  },
});
