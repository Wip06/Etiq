import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { useState, type ReactNode } from 'react';
import { Image, Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import {
  formatCount,
  pluralize,
  roundEstimate,
  toCarKilometers,
  toFootprintDuration,
  toPlasticBottles,
  toWaterEquivalent,
} from '@/data/equivalents';
import { categoryMedians } from '@/data/portalStats';
import { FRENCH_AVERAGE_PIECES } from '@/data/quiz';
import {
  brandName,
  formatPrice,
  portalCategory,
  secondHandQuery,
  type SurveyedProduct,
} from '@/data/surveyedProducts';
import { colors } from '@/theme/colors';
import { openLink } from '@/utils/links';
import { vintedSearchUrl } from '@/utils/secondHand';

// Le navigateur intégré ne s'ouvre bien qu'une fois le pop-up refermé (iOS).
const AFTER_CLOSE_MS = 350;

type Props = { product: SurveyedProduct | null; onClose: () => void };

// Choix d'un vêtement de la recherche, sur fond flouté : l'occasion d'abord (Vinted), le neuf en second
// (site de la marque). Le repère chiffré est la médiane de la catégorie sur le portail officiel, présentée
// comme telle : ce n'est pas le coût de ce vêtement.
export function SecondHandChoice({ product, onClose }: Props) {
  return (
    <Modal visible={product !== null} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <BlurView style={StyleSheet.absoluteFill} intensity={40} tint="dark" />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fermer" accessibilityRole="button" />
        {product && <ChoiceCard key={product.id} product={product} onClose={onClose} />}
      </View>
    </Modal>
  );
}

const TITLES = ['Et si tu le trouvais d’occasion ?', 'Neuf, vraiment ?', 'Et en seconde main ?', 'Avant d’acheter neuf…'];
const ALREADY_MADE = 'D’occasion, le vêtement existe déjà : rien de plus à produire.';

type Fact = { text: ReactNode; source: string };

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

// Repères possibles pour ce vêtement : un est tiré au hasard à chaque ouverture. Les chiffres sont des
// médianes de la catégorie sur le portail officiel (pas le coût de ce vêtement), ou des faits sourcés.
function factsFor(product: SurveyedProduct): Fact[] {
  const category = portalCategory(product);
  const medians = category ? categoryMedians(category.name) : null;
  const strong = (text: string) => <Text style={styles.strong}>{text}</Text>;
  const facts: Fact[] = [
    {
      text: (
        <>
          En France, on achète en moyenne {strong(`${FRENCH_AVERAGE_PIECES} vêtements neufs par an`)}. D’occasion,
          celui-ci ne s’ajoute pas à la liste.
        </>
      ),
      source: 'Baromètre Refashion, 2025.',
    },
  ];
  if (!category || !medians) return facts;

  const median = `Médiane des vêtements de cette catégorie déclarés sur le portail officiel.`;
  const footprint = toFootprintDuration(medians.cost);
  facts.push(
    {
      text: (
        <>
          {category.phrase}, c’est en médiane l’équivalent de {strong(`${formatCount(roundEstimate(toCarKilometers(medians.climate)))} km en voiture`)} et
          de {strong(pluralize(roundEstimate(toWaterEquivalent(medians.water).showers), 'douche'))}. {ALREADY_MADE}
        </>
      ),
      source: median,
    },
    {
      text: (
        <>
          {category.phrase}, c’est en médiane {strong(pluralize(footprint.value, footprint.unit))} de l’empreinte
          environnementale totale d’un habitant de la planète. {ALREADY_MADE}
        </>
      ),
      source: `${median} 1 000 000 de points = un an d’empreinte (notice officielle).`,
    },
    {
      text: (
        <>
          {category.phrase}, c’est en médiane l’équivalent de{' '}
          {strong(`${formatCount(roundEstimate(toWaterEquivalent(medians.water).bottles))} bouteilles d’eau`)} de 1,5 L,
          pondérées par la rareté de l’eau là où elle est prélevée. {ALREADY_MADE}
        </>
      ),
      source: median,
    },
  );
  // Plastique : seulement pour un vêtement en bonne partie synthétique.
  if (product.syntheticShare !== null && product.syntheticShare >= 30) {
    const bottles = toPlasticBottles((medians.massGrams * product.syntheticShare) / 100);
    if (bottles >= 1) {
      facts.push({
        text: (
          <>
            Ce vêtement est à {strong(`${product.syntheticShare} % synthétique`)} : neuf, c’est environ{' '}
            {strong(pluralize(bottles, 'bouteille'))} en plastique de fibres issues du pétrole. {ALREADY_MADE}
          </>
        ),
        source: 'Composition relevée × masse médiane de la catégorie sur le portail ; bouteille en PET de 33 g.',
      });
    }
  }
  return facts;
}

function ChoiceCard({ product, onClose }: { product: SurveyedProduct; onClose: () => void }) {
  // Tirés une fois à l'ouverture : le message change d'une ouverture à l'autre.
  const [title] = useState(() => pick(TITLES));
  const [fact] = useState(() => pick(factsFor(product)));

  const secondHand = () => {
    onClose();
    Linking.openURL(vintedSearchUrl(secondHandQuery(product)));
  };
  const brandNew = () => {
    onClose();
    setTimeout(() => openLink(product.url), AFTER_CLOSE_MS);
  };

  return (
    <View style={styles.card} accessibilityViewIsModal>
      <Pressable accessibilityRole="button" accessibilityLabel="Fermer" hitSlop={12} onPress={onClose} style={styles.close}>
        <Ionicons name="close" size={22} color={colors.secondary} />
      </Pressable>

      <View style={styles.header}>
        <Image
          source={require('../../assets/tiko/tiko-tete-penchee.png')}
          style={styles.tiko}
          resizeMode="contain"
          accessibilityLabel="Tiko, la mascotte d’Etiq"
        />
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.product} numberOfLines={2}>
        {brandName(product)} · {product.name}
      </Text>

      <View style={styles.fact}>
        <Text style={styles.factText}>{fact.text}</Text>
        <Text style={styles.factSource}>{fact.source}</Text>
      </View>

      <Button label="Le trouver d’occasion sur Vinted" onPress={secondHand} />

      <Button
        label={`Acheter neuf sur le site de la marque${product.price !== null ? ` · ${formatPrice(product.price)}` : ''}`}
        variant="secondary"
        onPress={brandNew}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    // Repli si le flou n'est pas disponible (Android sans cible de flou) : fond assombri.
    backgroundColor: 'rgba(15, 31, 26, 0.35)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    gap: 14,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.secondary,
    backgroundColor: colors.surface,
  },
  close: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 24,
  },
  tiko: {
    width: 64,
    height: 64,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  product: {
    fontSize: 14,
    color: colors.secondary,
  },
  fact: {
    gap: 6,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.background,
  },
  factText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  strong: {
    fontWeight: '700',
    color: colors.accent,
  },
  factSource: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.secondary,
  },
});
