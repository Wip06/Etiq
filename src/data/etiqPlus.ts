import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

// Etiq+, l'abonnement premium prévu au modèle économique (abonnement annuel). Dans le prototype,
// l'abonnement est simulé : aucun paiement, il s'active depuis la page Etiq+.

export const STANDARD_PRICE = 'Gratuit';
// Prix fixé le 6 nov. 2026 (référence : Yuka, prix libre de 10 à 50 € par an).
export const ETIQ_PLUS_EUROS_PER_YEAR = 15;
export const ETIQ_PLUS_PRICE = `${ETIQ_PLUS_EUROS_PER_YEAR} € par an`;
// « soit 1,25 € par mois » : l'ordre de grandeur qui parle, à côté du prix annuel.
export const ETIQ_PLUS_MONTHLY = `soit ${(ETIQ_PLUS_EUROS_PER_YEAR / 12).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € par mois`;

// yes : inclus ; no : non inclus ; soon : prévu au modèle économique, pas encore dans l'app.
export type Availability = 'yes' | 'no' | 'soon';

export type PlanFeature = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
  standard: Availability;
  plus: Availability;
};

// Comparatif de la page Etiq+. Tout ce qui sert à juger un vêtement reste gratuit : Etiq+ n'ajoute que
// des outils pour suivre et choisir ses vêtements.
export const PLAN_FEATURES: PlanFeature[] = [
  {
    icon: 'barcode-outline',
    title: 'Scanner un code-barres',
    description: 'Le coût environnemental officiel, déclaré sur le portail de l’État.',
    standard: 'yes',
    plus: 'yes',
  },
  {
    icon: 'camera-outline',
    title: 'Lire une étiquette',
    description: 'Une estimation du coût à partir de la composition, si le vêtement n’est pas déclaré.',
    standard: 'yes',
    plus: 'yes',
  },
  {
    icon: 'git-compare-outline',
    title: 'Comparaison et alternatives',
    description: 'La place du vêtement dans sa catégorie, et des vêtements qui ont moins d’impact.',
    standard: 'yes',
    plus: 'yes',
  },
  {
    icon: 'pricetags-outline',
    title: 'Fiches marques',
    description: 'Nos relevés et les chiffres du portail officiel, marque par marque.',
    standard: 'yes',
    plus: 'yes',
  },
  {
    icon: 'book-outline',
    title: 'Articles, lexique et quiz',
    description: 'Comprendre les matières, les labels et l’impact de sa garde-robe.',
    standard: 'yes',
    plus: 'yes',
  },
  {
    icon: 'heart-outline',
    title: 'Favoris et historique',
    description: 'Retrouver les vêtements et les marques déjà consultés.',
    standard: 'yes',
    plus: 'yes',
  },
  {
    icon: 'cloud-offline-outline',
    title: 'Mode hors ligne',
    description: 'Les fiches déjà consultées restent lisibles sans réseau.',
    standard: 'yes',
    plus: 'yes',
  },
  {
    icon: 'shirt-outline',
    title: 'Ma garde-robe',
    description: 'Les vêtements achetés et l’impact cumulé de votre garde-robe.',
    standard: 'no',
    plus: 'yes',
  },
  {
    icon: 'options-outline',
    title: 'Recherche avec filtres',
    description: 'Des vêtements par rayon, pays de fabrication, part de synthétique et prix.',
    standard: 'no',
    plus: 'yes',
  },
  {
    icon: 'map-outline',
    title: 'Magasins à proximité',
    description: 'La boutique la plus proche d’une marque, dans Google Maps.',
    standard: 'no',
    plus: 'yes',
  },
  {
    icon: 'repeat-outline',
    title: 'Seconde main sur Vinted',
    description: 'Le même type de vêtement d’occasion, depuis une fiche produit, une marque ou une estimation.',
    standard: 'no',
    plus: 'yes',
  },
  {
    icon: 'notifications-outline',
    title: 'Alertes sur vos marques',
    description: 'Être prévenu quand une marque favorite déclare de nouveaux vêtements.',
    standard: 'no',
    plus: 'soon',
  },
];

// Ce qu'Etiq+ ajoute dès aujourd'hui : mis en avant auprès des comptes standard.
export const ETIQ_PLUS_HIGHLIGHTS = PLAN_FEATURES.filter((feature) => feature.standard === 'no' && feature.plus === 'yes');
