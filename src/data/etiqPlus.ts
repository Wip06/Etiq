import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

// Etiq+, l'abonnement premium prévu au modèle économique (abonnement annuel). Dans le prototype,
// l'abonnement est simulé : aucun paiement, il s'active depuis la page Etiq+.

// Prix pas encore décidé par l'équipe (référence : Yuka, prix libre de 10 à 50 € par an).
export const ETIQ_PLUS_PRICE = 'Abonnement annuel, prix à définir';

type Benefit = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
  // false : prévu au modèle économique, pas encore dans l'app.
  available: boolean;
};

export const ETIQ_PLUS_BENEFITS: Benefit[] = [
  {
    icon: 'shirt-outline',
    title: 'Ma garde-robe',
    description: 'Ajoutez les vêtements que vous achetez et suivez l’impact cumulé de votre garde-robe.',
    available: true,
  },
  {
    icon: 'map-outline',
    title: 'Magasins à proximité',
    description: 'Trouvez les boutiques d’une marque autour de vous, depuis sa fiche.',
    available: true,
  },
  {
    icon: 'options-outline',
    title: 'Recherche avec filtres',
    description: 'Trouvez un vêtement par pays de fabrication, part de fibres synthétiques et prix, depuis l’onglet Marques.',
    available: true,
  },
  {
    icon: 'notifications-outline',
    title: 'Alertes sur vos marques',
    description: 'Être prévenu quand une marque favorite déclare de nouveaux vêtements sur le portail.',
    available: false,
  },
  {
    icon: 'repeat-outline',
    title: 'Alternatives en seconde main',
    description: 'Des vêtements d’occasion proposés à côté des alternatives neuves.',
    available: false,
  },
];
