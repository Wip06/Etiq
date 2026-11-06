import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { EtiqPlusBadge } from '@/components/EtiqPlusBadge';
import { searchBrands, type Brand } from '@/data/brands';
import { SURVEY_SUMMARY } from '@/data/surveyedProducts';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';
import { requestBrandByEmail } from '@/utils/links';

export default function BrandsScreen() {
  const [query, setQuery] = useState('');
  const results = searchBrands(query);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher une marque, un pays, un groupe..."
        placeholderTextColor={colors.secondary}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      <FlatList
        data={results}
        keyExtractor={(brand) => brand.id}
        renderItem={({ item }) => <BrandCard brand={item} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={<FilteredSearchCard />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.empty}>Aucune marque trouvée.</Text>
            <Button
              label={query.trim() ? `Demander l’ajout de « ${query.trim()} »` : 'Demander l’ajout d’une marque'}
              onPress={() => openBrandRequest(query)}
            />
          </View>
        }
        ListFooterComponent={
          results.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => openBrandRequest(query)}
              style={({ pressed }) => [styles.requestLink, pressed && styles.pressed]}
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.accent} />
              <Text style={styles.requestLabel}>Il manque une marque ? Demander son ajout</Text>
            </Pressable>
          ) : undefined
        }
      />
    </View>
  );
}

// Ouvre un e-mail déjà rédigé, avec le nom cherché s'il y en a un.
const openBrandRequest = (query: string) => requestBrandByEmail(query);

// Entrée de la recherche avec filtres (Etiq+). Sans Etiq+, elle présente l'abonnement ; invisible pour
// les invités, qui n'ont pas de compte à abonner.
function FilteredSearchCard() {
  const { user } = useSession();
  if (!user) return null;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(user.premium ? '/search' : '/etiq-plus')}
      style={({ pressed }) => [styles.searchCard, pressed && styles.pressed]}
    >
      <Ionicons name={user.premium ? 'options-outline' : 'lock-closed-outline'} size={24} color={colors.accent} />
      <View style={styles.searchCardTexts}>
        <Text style={styles.searchCardTitle}>Recherche avec filtres</Text>
        <Text style={styles.country}>
          {SURVEY_SUMMARY.products} vêtements relevés : pays de fabrication, part de synthétique, prix.
        </Text>
      </View>
      <EtiqPlusBadge />
    </Pressable>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/brand/[id]', params: { id: brand.id } })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.name}>{brand.name}</Text>
      {brand.country !== '' && <Text style={styles.country}>{brand.country}</Text>}
      <View style={styles.tags}>
        {brand.tags.map((tag) => (
          <Text key={tag} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  search: {
    margin: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  list: {
    gap: 12,
    padding: 16,
    paddingTop: 8,
  },
  card: {
    gap: 4,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  searchCardTexts: {
    flex: 1,
    gap: 2,
  },
  searchCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  country: {
    fontSize: 14,
    color: colors.secondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    color: colors.onAccent,
    backgroundColor: colors.secondary,
  },
  empty: {
    marginTop: 24,
    fontSize: 15,
    textAlign: 'center',
    color: colors.secondary,
  },
  emptyBox: {
    gap: 16,
  },
  requestLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    marginTop: 4,
  },
  requestLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
});
