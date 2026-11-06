import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { EtiqPlusBadge } from '@/components/EtiqPlusBadge';
import { SearchInput } from '@/components/SearchInput';
import { SecondHandChoice } from '@/components/SecondHandChoice';
import { pluralize } from '@/data/equivalents';
import {
  brandName,
  EUROPE,
  formatPrice,
  GENDER_LABELS,
  genderCount,
  hasFilters,
  NO_FILTERS,
  PRICE_LIMITS,
  PRODUCT_CATEGORIES,
  PRODUCT_COUNTRIES,
  searchProducts,
  secondHandQuery,
  SURVEY_SUMMARY,
  SYNTHETIC_LIMITS,
  type ProductFilters,
  type SurveyedProduct,
} from '@/data/surveyedProducts';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';
import { vintedSearchUrl } from '@/utils/secondHand';

type Option<T> = { value: T; label: string };

const GENDER_OPTIONS: Option<ProductFilters['gender']>[] = [
  { value: null, label: 'Tous' },
  { value: 'femme', label: 'Femme' },
  { value: 'homme', label: 'Homme' },
];
const CATEGORY_OPTIONS: Option<string | null>[] = [
  { value: null, label: 'Toutes' },
  ...PRODUCT_CATEGORIES.map((category) => ({ value: category, label: category })),
];
const ORIGIN_OPTIONS: Option<string | null>[] = [
  { value: null, label: 'Partout' },
  { value: EUROPE, label: 'En Europe' },
  ...PRODUCT_COUNTRIES.map((country) => ({ value: country, label: country })),
];
const SYNTHETIC_OPTIONS: Option<number | null>[] = [
  { value: null, label: 'Peu importe' },
  ...SYNTHETIC_LIMITS.map((limit) => ({ value: limit, label: limit === 0 ? 'Aucune' : `${limit} % max.` })),
];
const PRICE_OPTIONS: Option<number | null>[] = [
  { value: null, label: 'Peu importe' },
  ...PRICE_LIMITS.map((limit) => ({ value: limit, label: `${limit} € max.` })),
];

const shortDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

// Recherche avec filtres (Etiq+) : les vêtements relevés sur les fiches produits des marques, filtrés
// par catégorie, pays de fabrication, part de fibres synthétiques et prix.
export default function SearchScreen() {
  const { user } = useSession();
  const [filters, setFilters] = useState<ProductFilters>(NO_FILTERS);
  // Vêtement touché : le pop-up propose l'occasion avant le neuf.
  const [choice, setChoice] = useState<SurveyedProduct | null>(null);
  const results = useMemo(() => searchProducts(filters), [filters]);

  if (!user?.premium) {
    return (
      <View style={[styles.container, styles.centered]}>
        <EtiqPlusBadge />
        <Text style={styles.gateTitle}>La recherche avec filtres fait partie d’Etiq+</Text>
        <Text style={styles.text}>
          Trouvez un vêtement selon son pays de fabrication, sa part de fibres synthétiques et son prix.
        </Text>
        <Button label="Découvrir Etiq+" onPress={() => router.replace('/etiq-plus')} />
      </View>
    );
  }

  const update = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));

  return (
    <>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={results}
        keyExtractor={(product) => product.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.text}>
              Parmi les {SURVEY_SUMMARY.products} vêtements relevés sur les fiches produits de{' '}
              {SURVEY_SUMMARY.brands} marques, du {shortDate(SURVEY_SUMMARY.from)} au {shortDate(SURVEY_SUMMARY.to)}.
            </Text>
            <SearchInput
              value={filters.query}
              onChangeText={(query) => update('query', query)}
              placeholder="Nom, marque ou matière (ex. lin)"
            />
            <FilterRow title="Rayon" options={GENDER_OPTIONS} selected={filters.gender} onChoose={(value) => update('gender', value)} />
            <FilterRow title="Catégorie" options={CATEGORY_OPTIONS} selected={filters.category} onChoose={(value) => update('category', value)} />
            <FilterRow title="Fabriqué" options={ORIGIN_OPTIONS} selected={filters.origin} onChoose={(value) => update('origin', value)} />
            <FilterRow
              title="Fibres synthétiques"
              options={SYNTHETIC_OPTIONS}
              selected={filters.maxSynthetic}
              onChoose={(value) => update('maxSynthetic', value)}
            />
            <FilterRow title="Prix" options={PRICE_OPTIONS} selected={filters.maxPrice} onChoose={(value) => update('maxPrice', value)} />
            <View style={styles.countRow}>
              <Text style={styles.count}>
                {pluralize(results.length, 'vêtement')}
                {results.length > 1 ? ', du moins cher au plus cher' : ''}
              </Text>
              {hasFilters(filters) && (
                <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setFilters(NO_FILTERS)}>
                  <Text style={styles.reset}>Effacer les filtres</Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => <ProductRow product={item} onOpen={() => setChoice(item)} />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {filters.gender !== null && genderCount(filters.gender) === 0
              ? `Aucun vêtement ${GENDER_LABELS[filters.gender].toLowerCase()} relevé pour l’instant : les marques relevées jusqu’ici sont des rayons ${filters.gender === 'homme' ? 'femme' : 'homme'}.`
              : 'Aucun vêtement ne correspond à ces filtres.'}
          </Text>
        }
        ListFooterComponent={
          <Text style={styles.note}>
            Le portail officiel ne publie ni la composition ni le pays de fabrication des vêtements : ces filtres
            portent sur nos relevés des fiches produits, à la date du relevé (prix et disponibilité ont pu changer
            depuis). Aucun classement environnemental : les vêtements sont seulement triés par prix.
          </Text>
        }
      />
      <SecondHandChoice product={choice} onClose={() => setChoice(null)} />
    </>
  );
}

// Une ligne de filtres : un seul choix, défilant à l'horizontale.
function FilterRow<T>({
  title,
  options,
  selected,
  onChoose,
}: {
  title: string;
  options: Option<T>[];
  selected: T;
  onChoose: (value: T) => void;
}) {
  return (
    <View style={styles.filter}>
      <Text style={styles.filterTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <Pressable
              key={option.label}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${title} : ${option.label}`}
              onPress={() => onChoose(option.value)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function ProductRow({ product, onOpen }: { product: SurveyedProduct; onOpen: () => void }) {
  const madeIn = product.countries.length > 0 ? `Fabriqué en ${product.countries.join(', ')}` : 'Pays non indiqué';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Propose de le trouver d’occasion ou de l’acheter neuf"
      onPress={onOpen}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.rowHeader}>
        <Text style={styles.rowBrand} numberOfLines={1}>
          {[brandName(product), product.gender && GENDER_LABELS[product.gender], product.category]
            .filter(Boolean)
            .join(' · ')}
        </Text>
        {product.price !== null && <Text style={styles.rowPrice}>{formatPrice(product.price)}</Text>}
      </View>
      <Text style={styles.rowName}>{product.name}</Text>
      <Text style={styles.rowDetail}>{product.composition}</Text>
      <Text style={styles.rowDetail}>
        {madeIn}
        {product.syntheticShare !== null ? ` · ${product.syntheticShare} % de synthétique` : ''}
      </Text>
      <Pressable
        accessibilityRole="link"
        hitSlop={8}
        onPress={() => Linking.openURL(vintedSearchUrl(secondHandQuery(product)))}
        style={({ pressed }) => [styles.rowLink, pressed && styles.pressed]}
      >
      </Pressable>
      {/* Le coût officiel ne s'affiche que sur la fiche, avec l'étiquette officielle (charte graphique). */}
      {product.portalGtin && (
        <Pressable
          accessibilityRole="link"
          hitSlop={8}
          onPress={() => router.push({ pathname: '/product/[gtin]', params: { gtin: product.portalGtin as string } })}
          style={({ pressed }) => [styles.rowLink, pressed && styles.pressed]}
        >
          <Ionicons name="leaf-outline" size={14} color={colors.accent} />
          <Text style={styles.rowLinkLabel}>Voir son coût environnemental officiel</Text>
        </Pressable>
      )}
    </Pressable>
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
    padding: 16,
  },
  header: {
    gap: 14,
  },
  gateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  filter: {
    gap: 8,
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  chips: {
    gap: 6,
    paddingRight: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  chipSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  chipLabel: {
    fontSize: 13,
    color: colors.text,
  },
  chipLabelSelected: {
    color: colors.onAccent,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  count: {
    flex: 1,
    fontSize: 14,
    color: colors.secondary,
  },
  reset: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    textDecorationLine: 'underline',
  },
  row: {
    gap: 4,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowBrand: {
    flex: 1,
    fontSize: 13,
    color: colors.secondary,
  },
  rowPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  rowName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  rowDetail: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondary,
  },
  rowLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  rowLinkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  empty: {
    marginTop: 24,
    fontSize: 15,
    textAlign: 'center',
    color: colors.secondary,
  },
  note: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondary,
  },
});
