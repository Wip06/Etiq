import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { EtiqPlusBadge } from '@/components/EtiqPlusBadge';
import {
  ETIQ_PLUS_EUROS_PER_YEAR,
  ETIQ_PLUS_HIGHLIGHTS,
  ETIQ_PLUS_MONTHLY,
  ETIQ_PLUS_PRICE,
  PLAN_FEATURES,
  STANDARD_PRICE,
  type Availability,
  type PlanFeature,
} from '@/data/etiqPlus';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

const AVAILABILITY_LABELS: Record<Availability, string> = { yes: 'inclus', no: 'non inclus', soon: 'bientôt' };

// Comparatif Standard / Etiq+ et abonnement simulé : dans le prototype, aucun paiement n'est demandé.
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
      <Text style={styles.title}>Standard ou Etiq+ ?</Text>
      <Text style={styles.text}>
        Le scan et tous les résultats restent gratuits. Etiq+ ajoute des fonctionnalités premium pour suivre et choisir vos vêtements.
      </Text>

      {!premium && <OfferCard onSubscribe={() => setPremium(true)} />}

      <Text style={styles.sectionTitle}>Comparer les offres</Text>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <View style={styles.featureCell} />
          <View style={styles.planCell}>
            <Text style={styles.planName}>Standard</Text>
            <Text style={styles.planPrice}>{STANDARD_PRICE}</Text>
          </View>
          <View style={[styles.planCell, styles.plusCell]}>
            <Text style={[styles.planName, styles.plusName]}>Etiq+</Text>
            <Text style={styles.planPrice}>{ETIQ_PLUS_PRICE}</Text>
          </View>
        </View>
        {PLAN_FEATURES.map((feature, index) => (
          <FeatureRow key={feature.title} feature={feature} last={index === PLAN_FEATURES.length - 1} />
        ))}
      </View>

      {premium ? (
        <>
          <View style={styles.status}>
            <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
            <Text style={styles.statusText}>Vous êtes abonné à Etiq+</Text>
          </View>
          <Button label="Voir ma garde-robe" onPress={() => router.push('/wardrobe')} />
          <Button label="Résilier" variant="secondary" onPress={confirmCancel} />
        </>
      ) : (
        <Button label={`Passer à Etiq+ pour ${ETIQ_PLUS_PRICE}`} onPress={() => setPremium(true)} />
      )}
    </ScrollView>
  );
}

// Offre mise en avant pour un compte standard, avant le comparatif : le prix, ce qu'Etiq+ ajoute dès
// aujourd'hui, et le bouton, sans avoir à descendre sous le tableau.
function OfferCard({ onSubscribe }: { onSubscribe: () => void }) {
  return (
    <View style={styles.offer}>
      <View style={styles.offerPriceRow}>
        <Text style={styles.offerPrice}>{ETIQ_PLUS_EUROS_PER_YEAR} €</Text>
        <Text style={styles.offerPeriod}>par an</Text>
      </View>
      <Text style={styles.offerMonthly}>{ETIQ_PLUS_MONTHLY}</Text>
      <View style={styles.offerList}>
        {ETIQ_PLUS_HIGHLIGHTS.map((feature) => (
          <View key={feature.title} style={styles.offerItem}>
            <Ionicons name={feature.icon} size={22} color={colors.accent} />
            <View style={styles.offerItemTexts}>
              <Text style={styles.offerItemTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>
      <Button label="Passer à Etiq+" onPress={onSubscribe} />
    </View>
  );
}

function FeatureRow({ feature, last }: { feature: PlanFeature; last: boolean }) {
  return (
    <View
      style={[styles.row, last && styles.lastRow]}
      accessible
      accessibilityLabel={`${feature.title} : Standard ${AVAILABILITY_LABELS[feature.standard]}, Etiq+ ${AVAILABILITY_LABELS[feature.plus]}`}
    >
      <View style={styles.featureCell}>
        <View style={styles.featureTitleRow}>
          <Ionicons name={feature.icon} size={18} color={colors.accent} />
          <Text style={styles.featureTitle}>{feature.title}</Text>
        </View>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
      <View style={styles.planCell}>
        <Mark availability={feature.standard} />
      </View>
      <View style={[styles.planCell, styles.plusCell, last && styles.plusCellLast]}>
        <Mark availability={feature.plus} highlighted />
      </View>
    </View>
  );
}

function Mark({ availability, highlighted = false }: { availability: Availability; highlighted?: boolean }) {
  if (availability === 'soon') return <Text style={styles.soon}>Bientôt</Text>;
  if (availability === 'no') return <Ionicons name="remove" size={22} color={colors.secondary} />;
  return <Ionicons name="checkmark-circle" size={24} color={highlighted ? colors.accent : colors.text} />;
}

const PLAN_WIDTH = 78;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: 14,
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  offer: {
    gap: 14,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  offerPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  offerPrice: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.accent,
  },
  offerPeriod: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  offerMonthly: {
    marginTop: -10,
    fontSize: 14,
    color: colors.secondary,
  },
  offerList: {
    gap: 12,
  },
  offerItem: {
    flexDirection: 'row',
    gap: 12,
  },
  offerItemTexts: {
    flex: 1,
    gap: 2,
  },
  offerItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  table: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.secondary,
  },
  lastRow: {
    paddingBottom: 0,
  },
  featureCell: {
    flex: 1,
    gap: 2,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 8,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureTitle: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.secondary,
  },
  planCell: {
    width: PLAN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  // Colonne Etiq+ mise en avant : bande champagne discrète du haut en bas du tableau.
  plusCell: {
    backgroundColor: 'rgba(217, 192, 138, 0.12)',
  },
  plusCellLast: {
    paddingBottom: 14,
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  plusName: {
    color: colors.accent,
  },
  planPrice: {
    marginTop: 2,
    fontSize: 12,
    textAlign: 'center',
    color: colors.secondary,
  },
  soon: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.secondary,
    overflow: 'hidden',
    fontSize: 11,
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
