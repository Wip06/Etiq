import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EtiqPlusBadge } from '@/components/EtiqPlusBadge';
import { useLibrary, type WardrobeItem } from '@/session/LibraryProvider';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

// « Je l'ai acheté » : ajoute le vêtement à « Ma garde-robe » (Etiq+). Pour un compte sans Etiq+, le
// bouton présente l'abonnement. Invisible pour les invités, qui n'ont pas de bibliothèque.
export function WardrobeButton({ item }: { item: Omit<WardrobeItem, 'addedAt'> }) {
  const { user } = useSession();
  const { enabled, isInWardrobe, toggleWardrobe } = useLibrary();
  if (!user || !enabled) return null;

  const owned = isInWardrobe(item.id);
  const onPress = () => {
    if (!user.premium) router.push('/etiq-plus');
    else toggleWardrobe({ ...item, addedAt: new Date().toISOString() });
  };

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={owned ? 'Retirer de ma garde-robe' : 'Je l’ai acheté : ajouter à ma garde-robe'}
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <Ionicons
          name={owned ? 'checkmark-circle' : user.premium ? 'bag-add-outline' : 'lock-closed-outline'}
          size={24}
          color={colors.accent}
        />
        <View style={styles.texts}>
          <Text style={styles.title}>{owned ? 'Dans ma garde-robe' : 'Je l’ai acheté'}</Text>
          <Text style={styles.note}>
            {owned
              ? 'Appuyez pour le retirer.'
              : user.premium
                ? 'Ajoutez-le à votre garde-robe pour suivre son impact.'
                : 'Suivez l’impact de vos achats avec Etiq+.'}
          </Text>
        </View>
        <EtiqPlusBadge />
      </Pressable>
      {owned && (
        <Pressable accessibilityRole="link" onPress={() => router.push('/wardrobe')} style={styles.link}>
          <Text style={styles.linkLabel}>Voir ma garde-robe</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.accent} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 4,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
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
    fontWeight: '700',
    color: colors.text,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.secondary,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 44,
    paddingLeft: 36,
  },
  linkLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
});
