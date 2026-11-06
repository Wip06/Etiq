import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FavoriteButton } from '@/components/FavoriteButton';
import { InfoButton } from '@/components/InfoButton';
import { StoreFinderButton } from '@/components/StoreFinderButton';
import { getBrand, type BrandSurvey } from '@/data/brands';
import { DURABILITY_EXPLANATION } from '@/data/explanations';
import { PORTAL_DATA_DATE, portalStatsFor } from '@/data/recommendations';
import { colors } from '@/theme/colors';
import { openLink } from '@/utils/links';

export default function BrandScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const brand = getBrand(id);
  const portal = brand ? portalStatsFor(brand) : null;

  if (!brand) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.description}>Marque introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: brand.name }} />
      <View style={styles.titleRow}>
        <Text style={styles.name}>{brand.name}</Text>
        <FavoriteButton favorite={{ kind: 'brand', id: brand.id, title: brand.name, subtitle: brand.country }} />
      </View>
      {brand.country !== '' && <Text style={styles.country}>{brand.country}</Text>}
      <View style={styles.tags}>
        {brand.tags.map((tag) => (
          <Text key={tag} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
      <Text style={styles.description}>{brand.description}</Text>

      <StoreFinderButton brandName={brand.name} />

      {brand.survey && <SurveyCard survey={brand.survey} portal={portal} />}
      {!brand.survey && portal && <PortalCard portal={portal} />}

      {brand.sources.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Sources</Text>
          {brand.sources.map((source) => (
            <Pressable key={source.url} accessibilityRole="link" onPress={() => openLink(source.url)}>
              <Text style={styles.link}>{source.label}</Text>
            </Pressable>
          ))}
        </>
      )}

      {/* Sur toutes les fiches, relevées ou non : la méthode explique ce que l'app montre et pourquoi. */}
      <Pressable
        accessibilityRole="link"
        onPress={() => router.push('/brand-criteria')}
        style={({ pressed }) => [styles.criteria, pressed && styles.pressed]}
      >
        <Ionicons name="help-circle-outline" size={22} color={colors.accent} />
        <Text style={styles.criteriaLabel}>Comment nous choisissons les marques</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
      </Pressable>
    </ScrollView>
  );
}

// Marque pas encore relevée : seuls les chiffres qu'elle a déclarés sur le portail officiel sont connus.
function PortalCard({ portal }: { portal: NonNullable<ReturnType<typeof portalStatsFor>> }) {
  return (
    <View style={styles.survey}>
      <Text style={styles.sectionTitle}>Sur le portail officiel</Text>
      <Text style={styles.surveyMethod}>
        Produits déclarés par la marque sur le portail de l’affichage environnemental, d’après la copie du{' '}
        {new Date(PORTAL_DATA_DATE).toLocaleDateString('fr-FR')}.
      </Text>
      <View style={styles.surveyRow}>
        <Text style={styles.surveyLabel}>Produits déclarés</Text>
        <Text style={styles.surveyValue}>{portal.references.toLocaleString('fr-FR')}</Text>
      </View>
      {portal.belowMedianShare !== undefined && (
        <View style={styles.surveyRow}>
          <Text style={styles.surveyLabel}>Sous la médiane de leur catégorie</Text>
          <Text style={styles.surveyValue}>{portal.belowMedianShare} % des produits déclarés</Text>
        </View>
      )}
      {portal.durabilityMedian != null && (
        <View style={styles.surveyRow}>
          <View style={styles.labelWithInfo}>
            <Text style={styles.surveyLabel}>Coefficient de durabilité médian</Text>
            <InfoButton explanation={DURABILITY_EXPLANATION} />
          </View>
          <Text style={styles.surveyValue}>{portal.durabilityMedian.toLocaleString('fr-FR')}</Text>
        </View>
      )}
      <Text style={styles.surveyNote}>
        Composition, pays de confection et prix pas encore relevés sur les fiches produits de la marque.
      </Text>
    </View>
  );
}

const yesNo = (value: boolean | null) => (value === null ? 'non vérifié' : value ? 'oui' : 'non');

// Critères relevés, avec la méthode et la date : ce que l'app utilise pour proposer la marque.
function SurveyCard({ survey, portal }: { survey: BrandSurvey; portal: ReturnType<typeof portalStatsFor> }) {
  const method =
    survey.method === 'catalogue'
      ? `${survey.products} fiches produits relevées sur le site de la marque`
      : 'Chiffres déclarés par la marque, non vérifiés produit par produit';
  const rows: [string, string][] = [
    ...(survey.naturalShare != null ? ([['Fibres naturelles', `${survey.naturalShare} % en moyenne`]] as [string, string][]) : []),
    ['Fibres synthétiques', survey.syntheticShare !== null ? `${survey.syntheticShare} % en moyenne` : 'non relevé'],
    ['Confection en Europe', survey.europeShare !== null ? `${survey.europeShare} % des produits` : 'non relevé'],
    ['Pays de confection', survey.countries.length > 0 ? survey.countries.join(', ') : 'non relevé'],
    ['Prix médian', survey.medianPrice !== null ? `${Math.round(survey.medianPrice)} €` : 'non relevé'],
    ['Réparation', survey.repair && survey.repairLimited ? `oui, ${survey.repairLimited}` : yesNo(survey.repair)],
    ['Seconde main', yesNo(survey.secondHand)],
  ];
  if (portal) {
    rows.push(['Produits déclarés sur le portail officiel', portal.references.toLocaleString('fr-FR')]);
    if (portal.belowMedianShare !== undefined) {
      rows.push(['Sous la médiane de leur catégorie', `${portal.belowMedianShare} % des produits déclarés`]);
    }
  }

  return (
    <View style={styles.survey}>
      <Text style={styles.sectionTitle}>Notre relevé</Text>
      <Text style={styles.surveyMethod}>
        {method}, le {new Date(survey.date).toLocaleDateString('fr-FR')}.
      </Text>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.surveyRow}>
          <Text style={styles.surveyLabel}>{label}</Text>
          <Text style={styles.surveyValue}>{value}</Text>
        </View>
      ))}
      {survey.notes.map((note) => (
        <Text key={note} style={styles.surveyNote}>
          {note}
        </Text>
      ))}
      {survey.sources.map((source) => (
        <Pressable key={source.url} accessibilityRole="link" onPress={() => openLink(source.url)}>
          <Text style={styles.link}>{source.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  labelWithInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  criteria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  criteriaLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  pressed: {
    opacity: 0.7,
  },
  survey: {
    gap: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  surveyMethod: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondary,
  },
  surveyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  surveyLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.secondary,
  },
  surveyValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    color: colors.text,
  },
  surveyNote: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.text,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    gap: 12,
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: colors.accent,
  },
  country: {
    fontSize: 15,
    color: colors.secondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
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
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  sectionTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  link: {
    fontSize: 15,
    textDecorationLine: 'underline',
    color: colors.accent,
  },
});
