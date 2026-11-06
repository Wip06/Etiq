import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { EtiqPlusBadge } from '@/components/EtiqPlusBadge';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';
import { vintedSearchUrl } from '@/utils/secondHand';

type Props = {
  // Recherche de l'article lui-même (marque et modèle), si son nom le permet.
  article?: string | null;
  // Recherche plus large (marque et type de vêtement), toujours proposée.
  broad: string;
};

// « Trouver d'occasion » (Etiq+), sur la fiche produit, la fiche marque et l'estimation par étiquette :
// ouvre Vinted sur l'article lui-même, ou à défaut sur la marque et le type de vêtement. Lien simple,
// sans commission : aucune annonce n'est choisie ni classée par Etiq. Pour un compte sans Etiq+, le
// bouton présente l'abonnement. Invisible pour les invités.
export function SecondHandButton({ article, broad }: Props) {
  const { user } = useSession();
  const main = (article ?? broad).trim();
  if (!user || !main) return null;

  // Lien universel : l'app Vinted si elle est installée, sinon le navigateur.
  const open = (query: string) => {
    if (!user.premium) {
      router.push('/etiq-plus');
      return;
    }
    Linking.openURL(vintedSearchUrl(query));
  };
  const showBroad = Boolean(user.premium && article && broad.trim() && broad.trim() !== main);

  return (
    <View style={styles.box}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Trouver « ${main} » d’occasion sur Vinted`}
        onPress={() => open(main)}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <Ionicons name={user.premium ? 'repeat-outline' : 'lock-closed-outline'} size={22} color={colors.accent} />
        <View style={styles.texts}>
          <Text style={styles.title}>{article ? 'Trouver cet article d’occasion' : 'Trouver d’occasion'}</Text>
          <Text style={styles.note}>{user.premium ? `« ${main} » sur Vinted.` : 'Avec Etiq+.'}</Text>
        </View>
        <EtiqPlusBadge />
      </Pressable>
      {showBroad && (
        <Pressable accessibilityRole="link" hitSlop={8} onPress={() => open(broad)} style={styles.broad}>
          <Text style={styles.broadLabel}>ou tous les « {broad.trim()} »</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
    padding: 16,
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
  broad: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginTop: -8,
    marginLeft: 34,
  },
  broadLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    textDecorationLine: 'underline',
  },
});
