import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { CategoryComparison } from '@/components/CategoryComparison';
import { FavoriteButton } from '@/components/FavoriteButton';
import { InfoButton } from '@/components/InfoButton';
import { OfficialCostLabel } from '@/components/OfficialCostLabel';
import { COST_EXPLANATION, DURABILITY_EXPLANATION, STAGE_EXPLANATIONS } from '@/data/explanations';
import { compareToCategory } from '@/data/portalStats';
import { getProduct, labelImageUrl, STAGES, type PortalProduct, type Stage } from '@/services/portal';
import { useLibrary } from '@/session/LibraryProvider';
import { colors } from '@/theme/colors';

type State =
  | { status: 'loading' }
  | { status: 'found'; product: PortalProduct }
  | { status: 'notFound' }
  | { status: 'error' };

const formatPoints = (value: number) => Math.round(value).toLocaleString('fr-FR');

export default function ProductScreen() {
  const { gtin, scanned } = useLocalSearchParams<{ gtin: string; scanned?: string }>();
  const { addScan } = useLibrary();
  const [state, setState] = useState<State>({ status: 'loading' });

  const fetchProduct = useCallback(() => {
    getProduct(gtin)
      .then((product) => {
        setState(product ? { status: 'found', product } : { status: 'notFound' });
        // Seul un vrai scan entre dans l'historique, pas une ouverture depuis le profil.
        if (scanned === '1') {
          addScan({
            gtin,
            title: product ? product.reference : 'Produit non déclaré',
            subtitle: product ? product.brand : `Code ${gtin}`,
            cost: product ? product.cost : null,
            scannedAt: new Date().toISOString(),
          });
        }
      })
      .catch(() => setState({ status: 'error' }));
  }, [gtin, scanned, addScan]);

  useEffect(fetchProduct, [fetchProduct]);

  const retry = () => {
    setState({ status: 'loading' });
    fetchProduct();
  };

  if (state.status === 'loading') {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (state.status === 'error') {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.message}>Impossible de joindre le portail officiel. Vérifiez votre connexion.</Text>
        <Button label="Réessayer" onPress={retry} />
      </View>
    );
  }

  if (state.status === 'notFound') {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>Produit non déclaré</Text>
        <Text style={styles.message}>
          La marque n’a pas déclaré le coût environnemental de ce vêtement (code {gtin}). Photographiez son étiquette
          de composition pour l’estimer.
        </Text>
        <Button
          label="Scanner l’étiquette"
          onPress={() => router.navigate({ pathname: '/scan', params: { mode: 'label' } })}
        />
      </View>
    );
  }

  const { product } = state;
  // Un lot n'est pas comparable à des vêtements vendus à l'unité.
  const comparison = product.components === 1 ? compareToCategory(product.category, product.per100g) : null;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: product.brand }} />
      <Text style={styles.brand}>{product.brand}</Text>
      <View style={styles.titleRow}>
        <Text style={[styles.title, styles.titleFlex]}>{product.reference}</Text>
        <FavoriteButton
          favorite={{ kind: 'product', id: product.gtin, title: product.reference, subtitle: product.brand }}
        />
      </View>
      <Text style={styles.meta}>{product.category}</Text>

      {/* Écart d'au moins 16 px : périmètre de protection de l'étiquette (charte graphique). */}
      <View style={styles.costLabel}>
        <InfoButton explanation={COST_EXPLANATION} />
        <OfficialCostLabel imageUrl={labelImageUrl(product.gtin)} cost={product.cost} per100g={product.per100g} />
      </View>

      {comparison && <CategoryComparison comparison={comparison} />}

      <Text style={styles.sectionTitle}>Détail par étape</Text>
      {(Object.keys(STAGES) as Stage[]).map((stage) => (
        <StageRow key={stage} stage={stage} value={product.stages[stage]} total={product.cost} />
      ))}

      <View style={styles.infoRow}>
        <InfoButton explanation={DURABILITY_EXPLANATION} />
        <Text style={styles.meta}>Coefficient de durabilité : {product.durability.toLocaleString('fr-FR')}</Text>
      </View>
      <Text style={styles.source}>
        Source : portail officiel de l’affichage environnemental, déclaration du{' '}
        {new Date(product.declaredAt).toLocaleDateString('fr-FR')}.
      </Text>
    </ScrollView>
  );
}

function StageRow({ stage, value, total }: { stage: Stage; value: number; total: number }) {
  const share = total > 0 ? Math.min(value / total, 1) : 0;
  return (
    <View style={styles.stage}>
      <View style={styles.stageHeader}>
        <View style={styles.infoRow}>
          <InfoButton explanation={STAGE_EXPLANATIONS[stage]} />
          <Text style={styles.stageLabel}>{STAGES[stage]}</Text>
        </View>
        <Text style={styles.stageValue}>{formatPoints(value)} pts</Text>
      </View>
      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${share * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  content: {
    gap: 12,
    padding: 24,
  },
  brand: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: colors.secondary,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  // Le titre seul sert aussi à l'écran « Produit non déclaré » : flex uniquement dans la ligne.
  titleFlex: {
    flex: 1,
  },
  meta: {
    fontSize: 14,
    color: colors.secondary,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  costLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  stage: {
    gap: 6,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stageLabel: {
    fontSize: 14,
    color: colors.text,
  },
  stageValue: {
    fontSize: 14,
    color: colors.secondary,
  },
  bar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surface,
  },
  barFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
  },
  source: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondary,
  },
});
