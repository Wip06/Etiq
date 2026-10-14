import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { FavoriteButton } from '@/components/FavoriteButton';
import { getProduct, STAGES, type PortalProduct, type Stage } from '@/services/portal';
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
          La marque n’a pas déclaré le coût environnemental de ce vêtement (code {gtin}). Bientôt, vous pourrez
          scanner son étiquette pour l’estimer.
        </Text>
      </View>
    );
  }

  const { product } = state;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: product.brand,
          headerRight: () => (
            <FavoriteButton
              favorite={{ kind: 'product', id: product.gtin, title: product.reference, subtitle: product.brand }}
            />
          ),
        }}
      />
      <Text style={styles.brand}>{product.brand}</Text>
      <Text style={styles.title}>{product.reference}</Text>
      <Text style={styles.meta}>{product.category}</Text>

      <View style={styles.costCard}>
        <Text style={styles.costLabel}>Coût environnemental</Text>
        <Text style={styles.costValue}>{formatPoints(product.cost)}</Text>
        <Text style={styles.costUnit}>points d’impact</Text>
      </View>

      <Text style={styles.sectionTitle}>Détail par étape</Text>
      {(Object.keys(STAGES) as Stage[]).map((stage) => (
        <StageRow key={stage} label={STAGES[stage]} value={product.stages[stage]} total={product.cost} />
      ))}

      <Text style={styles.meta}>Coefficient de durabilité : {product.durability.toLocaleString('fr-FR')}</Text>
      <Text style={styles.source}>
        Source : portail officiel de l’affichage environnemental, déclaration du{' '}
        {new Date(product.declaredAt).toLocaleDateString('fr-FR')}.
      </Text>
    </ScrollView>
  );
}

function StageRow({ label, value, total }: { label: string; value: number; total: number }) {
  // Les étapes sont mesurées avant le coefficient de durabilité : on borne la barre à 100 %.
  const share = total > 0 ? Math.min(value / total, 1) : 0;
  return (
    <View style={styles.stage}>
      <View style={styles.stageHeader}>
        <Text style={styles.stageLabel}>{label}</Text>
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
  meta: {
    fontSize: 14,
    color: colors.secondary,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  costCard: {
    alignItems: 'center',
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  costLabel: {
    fontSize: 14,
    color: colors.secondary,
  },
  costValue: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.accent,
  },
  costUnit: {
    fontSize: 14,
    color: colors.text,
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
