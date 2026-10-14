import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LoginPrompt } from '@/components/LoginPrompt';
import { useLibrary, type Favorite, type FavoriteKind, type Scan } from '@/session/LibraryProvider';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

const FAVORITE_GROUPS: { kind: FavoriteKind; title: string }[] = [
  { kind: 'brand', title: 'Marques' },
  { kind: 'article', title: 'Articles' },
  { kind: 'product', title: 'Produits' },
];

export default function ProfileScreen() {
  const { user, signOut } = useSession();
  const { favorites, history, clearHistory } = useLibrary();

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

  const confirmClearHistory = () =>
    Alert.alert('Effacer l’historique ?', 'Tous vos scans seront supprimés.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Effacer', style: 'destructive', onPress: clearHistory },
    ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{user.email}</Text>

      <Card title="Mes préférences">
        <Text style={styles.text}>Priorités : {user.preferences?.priorities.join(', ')}</Text>
        <Text style={styles.text}>Budget : {user.preferences?.budget}</Text>
      </Card>

      <Card title="Historique">
        {history.length === 0 ? (
          <Text style={styles.muted}>Aucun scan pour l’instant.</Text>
        ) : (
          <>
            {history.map((scan) => (
              <ScanRow key={scan.gtin} scan={scan} />
            ))}
            <Pressable accessibilityRole="button" onPress={confirmClearHistory} style={styles.clear}>
              <Text style={styles.clearLabel}>Effacer l’historique</Text>
            </Pressable>
          </>
        )}
      </Card>

      <Card title="Favoris">
        {favorites.length === 0 ? (
          <Text style={styles.muted}>
            Touchez le cœur sur une marque, un article ou un produit pour le retrouver ici.
          </Text>
        ) : (
          FAVORITE_GROUPS.map(({ kind, title }) => {
            const items = favorites.filter((favorite) => favorite.kind === kind);
            if (items.length === 0) return null;
            return (
              <View key={kind} style={styles.group}>
                <Text style={styles.groupTitle}>{title}</Text>
                {items.map((favorite) => (
                  <FavoriteRow key={favorite.id} favorite={favorite} />
                ))}
              </View>
            );
          })
        )}
      </Card>

      <AboutLink />
      <Button label="Se déconnecter" variant="secondary" onPress={signOut} />
    </ScrollView>
  );
}

function openFavorite({ kind, id }: Favorite) {
  if (kind === 'brand') router.push({ pathname: '/brand/[id]', params: { id } });
  else if (kind === 'article') router.push({ pathname: '/article/[id]', params: { id } });
  else router.push({ pathname: '/product/[gtin]', params: { gtin: id } });
}

function ScanRow({ scan }: { scan: Scan }) {
  const date = new Date(scan.scannedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/product/[gtin]', params: { gtin: scan.gtin } })}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.rowText}>
        <Text style={styles.text} numberOfLines={1}>
          {scan.title}
        </Text>
        <Text style={styles.muted} numberOfLines={1}>
          {scan.subtitle} · {date}
        </Text>
      </View>
      <Text style={scan.cost === null ? styles.muted : styles.cost}>
        {scan.cost === null ? 'Non déclaré' : `${Math.round(scan.cost).toLocaleString('fr-FR')} pts`}
      </Text>
    </Pressable>
  );
}

function FavoriteRow({ favorite }: { favorite: Favorite }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => openFavorite(favorite)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.rowText}>
        <Text style={styles.text} numberOfLines={1}>
          {favorite.title}
        </Text>
        <Text style={styles.muted} numberOfLines={1}>
          {favorite.subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
    </Pressable>
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

function AboutLink() {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push('/about')}
      style={({ pressed }) => [styles.aboutRow, pressed && styles.pressed]}
    >
      <Text style={styles.text}>À propos</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
    </Pressable>
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
  cost: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  group: {
    gap: 2,
    marginTop: 6,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: colors.secondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  rowText: {
    flex: 1,
  },
  clear: {
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  clearLabel: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: colors.secondary,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
});
