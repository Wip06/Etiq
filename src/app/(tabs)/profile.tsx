import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoginPrompt } from '@/components/LoginPrompt';
import { useLibrary } from '@/session/LibraryProvider';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

export default function ProfileScreen() {
  const { user, signOut } = useSession();
  const { favorites, history } = useLibrary();

  if (!user) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mode invité</Text>
        <LoginPrompt message="Connectez-vous pour retrouver votre historique, vos favoris et des recommandations de marques." />
        <AboutLink />
        <Button label="Quitter le mode invité" variant="secondary" onPress={signOut} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{user.email}</Text>

      <Card title="Mes préférences">
        <Text style={styles.text}>Priorités : {user.preferences?.priorities.join(', ')}</Text>
        <Text style={styles.text}>Budget : {user.preferences?.budget}</Text>
      </Card>

      <LinkRow label="Historique" detail={String(history.length)} onPress={() => router.push('/history')} />
      <LinkRow label="Favoris" detail={String(favorites.length)} onPress={() => router.push('/favorites')} />
      <AboutLink />
      <Button label="Se déconnecter" variant="secondary" onPress={signOut} />
    </ScrollView>
  );
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
});
