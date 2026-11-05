import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { EtiqPlusBadge } from '@/components/EtiqPlusBadge';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

// « Magasins à proximité » (Etiq+), sur la fiche marque et la fiche produit : ouvre Google Maps sur les
// boutiques de la marque autour de l'utilisateur, la plus proche en tête. Pour un compte sans Etiq+, le
// bouton présente l'abonnement. Invisible pour les invités.
export function StoreFinderButton({ brandName }: { brandName: string }) {
  const { user } = useSession();
  if (!user) return null;

  const onPress = () => {
    if (!user.premium) {
      router.push('/etiq-plus');
      return;
    }
    // Lien universel de Google Maps : l'app si elle est installée, sinon le navigateur.
    const query = encodeURIComponent(`${brandName} magasin`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Magasins ${brandName} à proximité`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Ionicons name={user.premium ? 'map-outline' : 'lock-closed-outline'} size={22} color={colors.accent} />
      <View style={styles.texts}>
        <Text style={styles.title}>Magasins à proximité</Text>
        <Text style={styles.note}>
          {user.premium ? `La boutique ${brandName} la plus proche, dans Google Maps.` : 'Avec Etiq+.'}
        </Text>
      </View>
      <EtiqPlusBadge />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  note: {
    fontSize: 13,
    color: colors.secondary,
  },
});
