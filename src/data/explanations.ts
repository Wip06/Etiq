// Textes des boutons « i » de la fiche produit. Source : notice méthodologique officielle du coût
// environnemental (1er oct. 2025) et arrêté du 6 septembre 2025.

import type { Stage } from '@/services/portal';

export type Explanation = { title: string; text: string };

export const COST_EXPLANATION: Explanation = {
  title: 'Coût environnemental',
  text:
    'L’indicateur officiel de l’impact d’un vêtement, en points d’impact : plus le chiffre est élevé, plus l’impact est fort.\n\n' +
    'Il additionne les impacts sur le climat, l’eau, la biodiversité, les ressources et les pollutions, sur tout le cycle de vie, et tient compte de la durabilité du vêtement.\n\n' +
    'Le chiffre dans le cartouche gris ramène ce coût à 100 g de vêtement, pour comparer des vêtements de tailles différentes.',
};

export const COMPARISON_EXPLANATION: Explanation = {
  title: 'Comparaison',
  text:
    'Situe ce vêtement parmi ceux de la même catégorie déclarés sur le portail officiel, à poids égal (points pour 100 g).\n\n' +
    'Ce n’est pas une note : la position découle uniquement du coût officiel. Plus le curseur est à gauche, moins le vêtement a d’impact.',
};

export const DURABILITY_EXPLANATION: Explanation = {
  title: 'Coefficient de durabilité',
  text:
    'Estime combien de temps le vêtement sera porté, sur une échelle de 0,67 à 1,45.\n\n' +
    'Il dépend de la largeur de gamme de la marque (son nombre de références) et de son incitation à la réparation (prix, taille de l’entreprise, service de réparation).\n\n' +
    'Plus il est élevé, plus le vêtement est censé durer, et plus son coût environnemental est réduit.',
};

export const STAGE_EXPLANATIONS: Record<Stage, Explanation> = {
  materials: {
    title: 'Matières',
    text: 'Production des fibres : culture du coton ou du lin, élevage pour la laine, fabrication du polyester à partir du pétrole…',
  },
  spinning: {
    title: 'Filature',
    text: 'Transformation des fibres en fil.',
  },
  fabric: {
    title: 'Tissage / tricotage',
    text: 'Fabrication du tissu à partir du fil.',
  },
  dyeing: {
    title: 'Teinture',
    text: 'Étape dite d’ennoblissement : préparation du tissu, teinture, impression et finitions. Elle consomme beaucoup d’eau, d’énergie et de produits chimiques.',
  },
  making: {
    title: 'Confection',
    text: 'Découpe et assemblage du vêtement.',
  },
  trims: {
    title: 'Accessoires',
    text: 'Boutons, fermetures éclair et autres accessoires du vêtement.',
  },
  transport: {
    title: 'Transport',
    text: 'Acheminement entre les étapes de fabrication jusqu’au magasin, y compris la part éventuelle de transport en avion.',
  },
  usage: {
    title: 'Usage',
    text: 'Lavages, séchages et repassages pendant toute la durée de vie du vêtement.',
  },
  endOfLife: {
    title: 'Fin de vie',
    text: 'Ce que devient le vêtement une fois jeté : recyclage, incinération ou mise en décharge.',
  },
};
