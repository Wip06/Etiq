import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Alternatives } from '@/components/Alternatives';
import { Button } from '@/components/Button';
import { CategoryComparison } from '@/components/CategoryComparison';
import { FavoriteButton } from '@/components/FavoriteButton';
import { InfoButton } from '@/components/InfoButton';
import { OfficialCostLabel } from '@/components/OfficialCostLabel';
import { ImpactEquivalents } from '@/components/ImpactEquivalents';
import { Tiko } from '@/components/Tiko';
import { StoreFinderButton } from '@/components/StoreFinderButton';
import { WardrobeButton } from '@/components/WardrobeButton';
import { findBrandByPortalName } from '@/data/brands';
import { productBubble } from '@/data/equivalents';
import { COST_EXPLANATION, DURABILITY_EXPLANATION, STAGE_EXPLANATIONS } from '@/data/explanations';
import { compareToCategory, findAlternatives } from '@/data/portalStats';
import { labelImageUrl, lookupProduct, STAGES, type PortalProduct, type Stage } from '@/services/portal';
import { useLibrary } from '@/session/LibraryProvider';
import { colors } from '@/theme/colors';

type State =
  | { status: 'loading' }
  // savedAt : date de la copie locale affichée faute de réseau, null si le portail a répondu.
  | { status: 'found'; product: PortalProduct; savedAt: string | null }
  | { status: 'notFound'; savedAt: string | null }
  | { status: 'error' };

const formatPoints = (value: number) => Math.round(value).toLocaleString('fr-FR');

export default function ProductScreen() {
  const { gtin, scanned } = useLocalSearchParams<{ gtin: string; scanned?: string }>();
  const { addScan } = useLibrary();
  const [state, setState] = useState<State>({ status: 'loading' });

  const fetchProduct = useCallback(() => {
    lookupProduct(gtin)
      .then(({ product, savedAt }) => {
        setState(product ? { status: 'found', product, savedAt } : { status: 'notFound', savedAt });
        // Seul un vrai scan entre dans l'historique, pas une ouverture depuis le profil.
        if (scanned === '1') {
          addScan({
            gtin,
            title: product ? product.reference : 'Produit non déclaré',
            subtitle: product ? product.brand : `Code ${gtin}`,
            cost: product ? product.cost : null,
            lessImpactThan:
              product && product.components === 1
                ? (compareToCategory(product.category, product.per100g)?.lessImpactThan ?? null)
                : null,
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
        <Text style={styles.message}>
          Impossible de joindre le portail officiel, et ce vêtement n’a pas encore été consulté sur ce téléphone.
          Vérifiez votre connexion.
        </Text>
        <Button label="Réessayer" onPress={retry} />
      </View>
    );
  }

  if (state.status === 'notFound') {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>Produit non déclaré</Text>
        {state.savedAt && <OfflineNotice savedAt={state.savedAt} />}
        <Tiko
          pose="deDos"
          message="La marque n’a pas déclaré ce vêtement. Montre-moi son étiquette !"
          onPress={() => router.navigate({ pathname: '/scan', params: { mode: 'label' } })}
        />
        <Text style={styles.meta}>
          Son coût environnemental n’est pas sur le portail officiel (code {gtin}). Photographiez l’étiquette de
          composition pour l’estimer.
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
  const isSingle = product.components === 1;
  const bubble = productBubble(product.climate, product.water);
  const comparison = isSingle ? compareToCategory(product.category, product.per100g) : null;
  const alternatives = isSingle
    ? findAlternatives(product.category, {
        gtin: product.gtin,
        per100g: product.per100g,
        massGrams: (product.cost / product.per100g) * 100,
      })
    : [];
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
      {state.savedAt && <OfflineNotice savedAt={state.savedAt} />}

      {/* Écart d'au moins 16 px : périmètre de protection de l'étiquette (charte graphique). */}
      <View style={styles.costLabel}>
        <InfoButton explanation={COST_EXPLANATION} />
        <OfficialCostLabel imageUrl={labelImageUrl(product.gtin)} cost={product.cost} per100g={product.per100g} />
      </View>
      <Text style={styles.costHint}>Plus le chiffre est bas, moins le vêtement a d’impact.</Text>

      {bubble && <Tiko pose="tetePenchee" message={bubble} />}

      {comparison && <CategoryComparison comparison={comparison} />}

      <ImpactEquivalents cost={product.cost} water={product.water} climate={product.climate} />

      {/* Un seul Tiko par écran : ici, celui du haut de la fiche. */}
      <Alternatives alternatives={alternatives} water={product.water} withTiko={!bubble} />

      <WardrobeButton
        item={{
          id: product.gtin,
          title: product.reference,
          subtitle: product.brand,
          category: product.category,
          cost: product.cost,
          per100g: product.per100g,
          lessImpactThan: comparison?.lessImpactThan ?? null,
          estimate: false,
        }}
      />

      {/* Le nom déclaré sur le portail est parfois celui de la société : on cherche la marque connue. */}
      <StoreFinderButton brandName={findBrandByPortalName(product.brand)?.name ?? product.brand} />

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

// Fiche affichée depuis la copie locale, faute de réseau.
function OfflineNotice({ savedAt }: { savedAt: string }) {
  const date = new Date(savedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  return (
    <View style={styles.offline}>
      <Ionicons name="cloud-offline-outline" size={18} color={colors.accent} />
      <Text style={styles.offlineText}>Hors connexion : fiche du portail enregistrée le {date}.</Text>
    </View>
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
  costHint: {
    marginTop: -4,
    fontSize: 14,
    textAlign: 'center',
    color: colors.secondary,
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
  offline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  offlineText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  source: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondary,
  },
});
