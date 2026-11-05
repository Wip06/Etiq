import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { EtiqPlusBadge } from '@/components/EtiqPlusBadge';
import { ETIQ_PLUS_BENEFITS, ETIQ_PLUS_PRICE } from '@/data/etiqPlus';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

// Présentation d'Etiq+ et abonnement simulé : dans le prototype, aucun paiement n'est demandé.
export default function EtiqPlusScreen() {
  const { user, setPremium } = useSession();
  const premium = user?.premium === true;

  const confirmCancel = () =>
    Alert.alert('Résilier Etiq+ ?', 'Votre garde-robe reste enregistrée et réapparaîtra si vous vous réabonnez.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Résilier', style: 'destructive', onPress: () => setPremium(false) },
    ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <EtiqPlusBadge />
      <Text style={styles.title}>Allez plus loin avec Etiq+</Text>
      <Text style={styles.price}>{ETIQ_PLUS_PRICE}</Text>

      <View style={styles.card}>
        {ETIQ_PLUS_BENEFITS.map((benefit) => (
          <View key={benefit.title} style={styles.benefit}>
            <Ionicons name={benefit.icon} size={24} color={colors.accent} />
            <View style={styles.benefitTexts}>
              <View style={styles.benefitHeader}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                {!benefit.available && <Text style={styles.soon}>Bientôt</Text>}
              </View>
              <Text style={styles.text}>{benefit.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.note}>
        Etiq+ ne change aucun résultat : le coût environnemental, les comparaisons et les alternatives sont les mêmes
        pour tous, et aucune marque ne paie pour être mise en avant.
      </Text>

      {premium ? (
        <>
          <View style={styles.status}>
            <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
            <Text style={styles.statusText}>Vous êtes abonné à Etiq+.</Text>
          </View>
          <Button label="Voir ma garde-robe" onPress={() => router.push('/wardrobe')} />
          <Button label="Résilier (simulation)" variant="secondary" onPress={confirmCancel} />
        </>
      ) : (
        <Button label="S’abonner (simulation)" onPress={() => setPremium(true)} />
      )}

      <Text style={styles.note}>
        Prototype : aucun paiement n’est demandé. Dans l’app publiée, l’abonnement passera par l’App Store et Google
        Play.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: 14,
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  price: {
    fontSize: 15,
    color: colors.secondary,
  },
  card: {
    gap: 18,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  benefit: {
    flexDirection: 'row',
    gap: 14,
  },
  benefitTexts: {
    flex: 1,
    gap: 2,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  soon: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.secondary,
    fontSize: 12,
    color: colors.secondary,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondary,
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondary,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
