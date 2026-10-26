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

export const WATER_EXPLANATION: Explanation = {
  title: 'Eau',
  text:
    'L’indicateur « utilisation de ressources en eau » du coût environnemental, exprimé en m³ équivalents.\n\n' +
    'L’eau y est pondérée par sa rareté là où elle est prélevée : un litre puisé dans une région sèche compte davantage. Ce n’est donc pas le volume exact consommé, mais un ordre de grandeur.\n\n' +
    'La méthode ne compte pour l’instant que l’eau de la production des matières et du fil (culture du coton, par exemple).\n\n' +
    'Une douche compte ici pour 60 litres (5 minutes).',
};

export const FOOTPRINT_EXPLANATION: Explanation = {
  title: 'Empreinte d’un habitant de la planète',
  text:
    'Le coût environnemental additionne 16 impacts (climat, eau, pollutions, ressources…). Pour pouvoir les additionner, la méthode officielle divise chacun par l’impact annuel moyen d’un habitant de la planète, puis les pondère.\n\n' +
    'Cette moyenne est celle de la méthode européenne d’empreinte environnementale : les émissions et consommations du monde entier en 2010, divisées par sa population (6,9 milliards). Pour le climat, elle vaut 7,6 tonnes de CO₂ par an.\n\n' +
    'Résultat : 1 000 000 de points correspondent à l’empreinte environnementale totale d’un habitant moyen de la planète pendant un an, tout compris (se nourrir, se déplacer, se loger, consommer…). On peut donc traduire des points en jours de cette empreinte.\n\n' +
    'Sources : notice méthodologique officielle du coût environnemental (1er octobre 2025) ; Centre commun de recherche de la Commission européenne, facteurs de normalisation EF 3.1.',
};

export const CLIMATE_EXPLANATION: Explanation = {
  title: 'Climat',
  text:
    'L’indicateur « changement climatique » du coût environnemental, en kilos d’équivalent CO₂ : les gaz à effet de serre émis sur tout le cycle de vie du vêtement, de la fibre à la fin de vie.\n\n' +
    'Repère : une voiture thermique moyenne émet environ 0,14 kg CO₂e par kilomètre, fabrication de la voiture comprise (Impact CO2, ADEME).',
};

export const PLASTIC_EXPLANATION: Explanation = {
  title: 'Plastique',
  text:
    'Polyester, nylon (polyamide), acrylique, polypropylène et élasthanne sont des plastiques fabriqués à partir de pétrole, comme les bouteilles d’eau en PET.\n\n' +
    'Le calcul multiplie la part de ces fibres sur l’étiquette par la masse du vêtement, puis la divise par le poids d’une bouteille de 1,5 L vide (33 g). Le polyester recyclé est compté aussi : il reste du plastique.\n\n' +
    'Au lavage, ces fibres relâchent des microfibres plastiques qui finissent dans l’eau.',
};

export const QUIZ_EXPLANATION: Explanation = {
  title: 'Comment est calculé ce résultat ?',
  text:
    'Pour chaque type de vêtement, on calcule le coût environnemental avec le calculateur officiel Ecobalyse, à partir de vos réponses : matière, pays de fabrication (tissage, teinture et confection) et type de marque, à la masse médiane de la catégorie sur le portail. On le multiplie ensuite par le nombre d’achats neufs.\n\n' +
    'Le type de marque compte beaucoup : la méthode juge la durabilité d’un vêtement d’après la taille de la marque, son service de réparation, le nombre de références de son catalogue et le prix. Les profils de marque et les prix sont des hypothèses de notre équipe.\n\n' +
    'Les vêtements d’occasion ne sont pas comptés : ils ne demandent pas de nouvelle production. Chaussures et accessoires ne font pas partie de la méthode officielle.\n\n' +
    'C’est un ordre de grandeur, pas une mesure. La moyenne française (43 vêtements neufs par personne en 2025) vient du baromètre Refashion.',
};

export const ALTERNATIVES_EXPLANATION: Explanation = {
  title: 'Alternatives',
  text:
    'Des vêtements de la même catégorie et de poids proche, déclarés sur le portail officiel, dont le coût environnemental pour 100 g est au moins 10 % plus bas.\n\n' +
    'Aucune marque ne paie pour apparaître ici : le classement découle uniquement du coût officiel. Le prix n’est pas encore pris en compte.',
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
