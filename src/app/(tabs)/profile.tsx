import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState, type PropsWithChildren } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoginPrompt } from '@/components/LoginPrompt';
import { pluralize, toFootprintDuration } from '@/data/equivalents';
import { BUDGETS, getGoal } from '@/data/goals';
import type { QuizResult } from '@/data/quiz';
import { useLibrary } from '@/session/LibraryProvider';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

export default function ProfileScreen() {
  const { user, signOut, saveFirstName, deleteAccount } = useSession();
  const { favorites, history } = useLibrary();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');

  if (!user) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mode invité</Text>
        <LoginPrompt message="Connectez-vous pour retrouver votre historique, vos favoris et des recommandations de marques." />
        <AboutLink />
        <PrivacyLink />
        <Button label="Quitter le mode invité" variant="secondary" onPress={signOut} />
      </ScrollView>
    );
  }

  const confirmDelete = () =>
    Alert.alert(
      'Supprimer mon compte ?',
      'Vos objectifs, votre prénom, vos favoris, votre historique et vos résultats au quiz seront effacés de ce téléphone. Cette action est définitive.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteAccount() },
      ],
    );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{user.firstName ?? user.email}</Text>
      {user.firstName ? <Text style={styles.muted}>{user.email}</Text> : null}

      <ImpactCard />

      <Card title="Mes objectifs">
        <Text style={styles.text}>
          {user.preferences?.goals.map((id) => getGoal(id)?.label).join(', ')}
        </Text>
        <Text style={styles.text}>
          Budget : {BUDGETS.find((budget) => budget.id === user.preferences?.budget)?.label}
        </Text>
        <Button label="Modifier mes objectifs" variant="secondary" onPress={() => router.push('/preferences')} />
      </Card>

      <LinkRow label="Historique" detail={String(history.length)} onPress={() => router.push('/history')} />
      <LinkRow label="Favoris" detail={String(favorites.length)} onPress={() => router.push('/favorites')} />

      <Card title="Mon compte">
        <Text style={styles.muted}>Prénom</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          onEndEditing={() => firstName.trim() && saveFirstName(firstName.trim())}
          placeholder="Votre prénom"
          placeholderTextColor={colors.secondary}
          autoComplete="given-name"
          autoCapitalize="words"
          accessibilityLabel="Prénom"
        />
      </Card>

      <LinkRow label="Nos critères pour les marques" onPress={() => router.push('/brand-criteria')} />
      <PrivacyLink />
      <AboutLink />
      <Button label="Se déconnecter" variant="secondary" onPress={signOut} />
      <Pressable accessibilityRole="button" onPress={confirmDelete} style={styles.deleteButton}>
        <Text style={styles.deleteLabel}>Supprimer mon compte</Text>
      </Pressable>
    </ScrollView>
  );
}

// L'indicateur avant/après : l'évolution du quiz garde-robe et la part des vêtements scannés qui ont
// moins d'impact que la moitié de leur catégorie.
function ImpactCard() {
  const { quizHistory, history } = useLibrary();
  const latest = quizHistory[0];
  const first = quizHistory[quizHistory.length - 1];
  const compared = history.filter((scan) => typeof scan.lessImpactThan === 'number');
  const lowImpact = compared.filter((scan) => (scan.lessImpactThan ?? 0) >= 50).length;

  return (
    <Card title="Mon impact">
      {latest ? (
        <>
          <Text style={styles.text}>
            Vos achats d’une année : autant d’impact que{' '}
            {pluralize(toFootprintDuration(latest.cost).value, toFootprintDuration(latest.cost).unit)} de l’empreinte
            d’un habitant moyen de la planète.
          </Text>
          <Text style={styles.muted}>Quiz du {formatDate(latest.completedAt)}</Text>
          {quizHistory.length > 1 && first.cost > 0 && (
            <Text style={styles.evolution}>{evolutionSentence(first, latest)}</Text>
          )}
        </>
      ) : (
        <Text style={styles.text}>Faites le quiz pour mesurer l’impact de votre garde-robe, puis suivre son évolution.</Text>
      )}
      <Button
        label={latest ? 'Refaire le quiz' : 'Faire le quiz'}
        variant="secondary"
        onPress={() => router.push('/quiz')}
      />

      <Text style={[styles.text, styles.separated]}>
        {history.length === 0
          ? 'Aucun vêtement scanné pour l’instant.'
          : `${pluralize(history.length, 'vêtement')} scanné${history.length > 1 ? 's' : ''}${
              compared.length > 0
                ? `, dont ${lowImpact} sur ${compared.length} avec moins d’impact que la moitié de leur catégorie.`
                : '.'
            }`}
      </Text>
    </Card>
  );
}

function evolutionSentence(first: QuizResult, latest: QuizResult): string {
  const change = Math.round((latest.cost / first.cost - 1) * 100);
  const since = `depuis votre premier quiz, le ${formatDate(first.completedAt)}`;
  if (change === 0) return `Impact stable ${since}.`;
  return change < 0 ? `−${-change} % d’impact ${since}.` : `+${change} % d’impact ${since}.`;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

function PrivacyLink() {
  return <LinkRow label="Confidentialité" onPress={() => router.push('/privacy')} />;
}

function Card({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function LinkRow({ label, detail, onPress }: { label: string; detail?: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}
    >
      <Text style={[styles.text, styles.linkLabel]}>{label}</Text>
      {detail !== undefined && <Text style={styles.muted}>{detail}</Text>}
      <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
    </Pressable>
  );
}

function AboutLink() {
  return <LinkRow label="À propos" onPress={() => router.push('/about')} />;
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
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  card: {
    gap: 6,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  muted: {
    fontSize: 14,
    color: colors.secondary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  linkLabel: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  evolution: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
  },
  separated: {
    marginTop: 8,
  },
  input: {
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  deleteButton: {
    alignItems: 'center',
    padding: 12,
  },
  deleteLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.impactScale[4],
  },
});
