// Catalogue de marques. Seuls des faits neutres pour l'instant (pays, groupe, segment, site officiel).
// L'analyse environnementale et sociale reste à rédiger par l'équipe, chaque affirmation avec sa source
// (rapport RSE, fiche produit AGEC, label...). La note maison sera ajoutée quand les critères seront définis.

import { normalize } from '@/utils/text';

export type Source = { label: string; url: string };

// Relevé des critères d'une marque, daté et sourcé (voir la page « Nos critères »).
export type BrandSurvey = {
  date: string;
  // catalogue : toutes les fiches produits du site, relevées une à une ;
  // declaration : chiffres publiés par la marque, non vérifiables produit par produit.
  method: 'catalogue' | 'declaration';
  // Nombre de fiches produits relevées (catalogue).
  products: number | null;
  // Part moyenne des fibres synthétiques dans la composition (polyester, nylon, acrylique,
  // élasthanne…), en %.
  syntheticShare: number | null;
  // Part des produits confectionnés en Europe, en %.
  europeShare: number | null;
  // Pays de confection, du plus fréquent au moins fréquent.
  countries: string[];
  medianPrice: number | null;
  repair: boolean | null;
  // Portée du service quand il n'est pas accessible à tous : l'objectif n'est rempli qu'en partie.
  repairLimited?: string;
  secondHand: boolean | null;
  // Constats utiles et limites du relevé.
  notes: string[];
  sources: Source[];
};

export type Brand = {
  id: string;
  name: string;
  country: string;
  description: string;
  tags: string[];
  sources: Source[];
  // Nom de la marque sur le portail officiel, s'il diffère.
  portalName?: string;
  survey?: BrandSurvey;
};

const PENDING = 'Analyse environnementale à compléter.';

export const brands: Brand[] = [
  {
    id: 'hm',
    name: 'H&M',
    country: 'Suède',
    description: `Prêt-à-porter grand public. ${PENDING}`,
    tags: ['Suède', 'Grand public'],
    sources: [{ label: 'Site officiel', url: 'https://www2.hm.com/fr_fr/' }],
  },
  {
    id: 'zara',
    name: 'Zara',
    country: 'Espagne',
    description: `Prêt-à-porter grand public, groupe Inditex. ${PENDING}`,
    tags: ['Espagne', 'Grand public', 'Inditex'],
    sources: [{ label: 'Site officiel', url: 'https://www.zara.com/fr/' }],
  },
  {
    id: 'mango',
    name: 'Mango',
    country: 'Espagne',
    description: `Prêt-à-porter grand public. ${PENDING}`,
    tags: ['Espagne', 'Grand public'],
    sources: [{ label: 'Site officiel', url: 'https://shop.mango.com/fr' }],
  },
  {
    id: 'uniqlo',
    name: 'Uniqlo',
    country: 'Japon',
    description: `Prêt-à-porter grand public, groupe Fast Retailing. ${PENDING}`,
    tags: ['Japon', 'Grand public', 'Fast Retailing'],
    sources: [{ label: 'Site officiel', url: 'https://www.uniqlo.com/fr/fr/' }],
    portalName: 'UNIQLO EUROPE LTD',
    // Relevé à la main le 26 oct. 2026, en 12 minutes (le site bloque la lecture automatique).
    // Détail produit par produit : releves/uniqlo.txt.
    survey: {
      date: '2026-10-26',
      method: 'catalogue',
      products: 20,
      syntheticShare: 27,
      europeShare: 0,
      countries: ['Chine', 'Vietnam', 'Cambodge', 'Bangladesh', 'Indonésie', 'Inde', 'Égypte'],
      medianPrice: 39.9,
      repair: true,
      repairLimited: 'dans quelques magasins parisiens',
      secondHand: null,
      notes: [
        '20 fiches relevées à la main : les premiers produits affichés dans six catégories.',
        'Coton, laine et cachemire pour les t-shirts et les pulls ; 5 produits sur 20 sont majoritairement synthétiques, surtout les robes, blouses et vestes.',
        'Une partie du polyester et du polyamide est recyclée (indiquée sur les fiches).',
        'Réparation : ateliers RE.UNIQLO dans quelques magasins parisiens seulement.',
        'Un seul produit déclaré sur le portail officiel.',
      ],
      sources: [
        { label: 'Fiches produits du site Uniqlo', url: 'https://www.uniqlo.com/fr/fr/' },
        { label: 'Studio de réparation RE.UNIQLO', url: 'https://www.uniqlo.com/fr/fr/news/topics/2023072101/' },
      ],
    },
  },
  {
    id: 'sezane',
    name: 'Sézane',
    country: 'France',
    description: `Prêt-à-porter premium. ${PENDING}`,
    tags: ['France', 'Premium'],
    sources: [{ label: 'Site officiel', url: 'https://www.sezane.com/fr' }],
    // Relevé à la main le 26 oct. 2026, en 20 minutes (le site bloque la lecture automatique).
    // Détail produit par produit : releves/sezane.txt.
    survey: {
      date: '2026-10-26',
      method: 'catalogue',
      products: 20,
      syntheticShare: 11,
      europeShare: 75,
      countries: ['Portugal', 'Chine', 'Italie', 'Bulgarie', 'Roumanie', 'Turquie'],
      medianPrice: 132.5,
      repair: false,
      secondHand: false,
      notes: [
        '20 fiches relevées à la main : les premiers produits affichés dans six catégories.',
        'Coton biologique pour les t-shirts et les chemises ; laine pour la plupart des pulls, pantalons et manteaux.',
        'Un seul produit sur 20 est majoritairement synthétique (un pantalon à 53 % de polyester recyclé).',
        'Aucun produit déclaré sur le portail officiel.',
      ],
      sources: [{ label: 'Fiches produits du site Sézane', url: 'https://www.sezane.com/fr-fr' }],
    },
  },
  {
    id: 'sessun',
    name: 'Sessùn',
    country: 'France',
    description: `Prêt-à-porter féminin, marque née à Marseille. ${PENDING}`,
    tags: ['France', 'Premium'],
    sources: [{ label: 'Site officiel', url: 'https://fr.sessun.com/' }],
    portalName: 'Sessùn',
    // Relevé automatique le 2 nov. 2026. Détail produit par produit : releves/sessun.txt.
    survey: {
      date: '2026-11-02',
      method: 'catalogue',
      products: 20,
      syntheticShare: 18,
      europeShare: 30,
      countries: ['Tunisie', 'Chine', 'Maroc', 'Italie', 'Portugal', 'Bulgarie', 'Turquie'],
      medianPrice: 175,
      repair: null,
      secondHand: null,
      notes: [
        '20 fiches relevées automatiquement : les premiers modèles de six catégories dans le plan du site.',
        'Beaucoup de fibres naturelles et artificielles ; 2 produits sur 20 sont majoritairement synthétiques.',
        'Confection surtout au Maghreb et en Chine : 6 produits sur 20 en Europe.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [{ label: 'Fiches produits du site Sessùn', url: 'https://fr.sessun.com/' }],
    },
  },
  {
    id: 'bash',
    name: 'Ba&sh',
    country: 'France',
    description: `Prêt-à-porter féminin premium. ${PENDING}`,
    tags: ['France', 'Premium'],
    sources: [{ label: 'Site officiel', url: 'https://ba-sh.com/fr/fr/' }],
    portalName: 'BA&SH',
    // Relevé automatique le 2 nov. 2026. Détail produit par produit : releves/bash.txt.
    survey: {
      date: '2026-11-02',
      method: 'catalogue',
      products: 20,
      syntheticShare: 46,
      europeShare: 16,
      countries: ['Chine', 'Portugal', 'Maroc', 'Turquie', 'Tunisie', 'Italie', 'Inde'],
      medianPrice: 190,
      repair: null,
      secondHand: true,
      notes: [
        '20 fiches relevées automatiquement : les premiers modèles de six catégories dans le plan du site.',
        '8 produits sur 20 sont majoritairement synthétiques, une partie du polyamide étant recyclée.',
        'Confection en Europe : 3 produits sur les 19 dont le pays est indiqué.',
        'Seconde main : programme de revente relevé dans la presse en 2023, à revérifier.',
      ],
      sources: [
        { label: 'Fiches produits du site Ba&sh', url: 'https://ba-sh.com/fr/fr/' },
        { label: 'FashionUnited, seconde main Ba&sh (2023)', url: 'https://fashionunited.ca/news/business/ba-sh-launches-second-hand-offering-in-us/2023020727666' },
      ],
    },
  },
  {
    id: 'maje',
    name: 'Maje',
    country: 'France',
    description: `Prêt-à-porter féminin premium, groupe SMCP. ${PENDING}`,
    tags: ['France', 'Premium', 'SMCP'],
    sources: [{ label: 'Site officiel', url: 'https://fr.maje.com/' }],
    portalName: 'MAJE',
    // Relevé automatique le 2 nov. 2026, sans les pays (chargés au clic sur « Traçabilité »).
    // Détail produit par produit : releves/maje.txt.
    survey: {
      date: '2026-11-02',
      method: 'catalogue',
      products: 20,
      syntheticShare: 43,
      europeShare: null,
      countries: [],
      medianPrice: 245,
      repair: true,
      secondHand: true,
      notes: [
        '20 fiches relevées automatiquement : les premiers modèles de six catégories dans le plan du site.',
        '9 produits sur 20 sont majoritairement synthétiques.',
        'Pays de confection non relevés : ils ne s’affichent qu’au clic sur la fiche.',
        'Réparation et seconde main : services relevés dans la presse (2022 et 2024), à revérifier.',
      ],
      sources: [
        { label: 'Fiches produits du site Maje', url: 'https://fr.maje.com/' },
        { label: 'FashionUnited, réparation et seconde main Maje', url: 'https://fashionunited.fr/actualite/business/apres-la-seconde-main-maje-lance-son-service-de-reparation/2024050334945' },
      ],
    },
  },
  {
    id: 'promod',
    name: 'Promod',
    country: 'France',
    description: `Prêt-à-porter féminin grand public. ${PENDING}`,
    tags: ['France', 'Grand public'],
    sources: [{ label: 'Site officiel', url: 'https://www.promod.fr/fr-fr/' }],
    portalName: 'PROMOD',
    // Relevé automatique le 2 nov. 2026, sans les pays. Détail produit par produit : releves/promod.txt.
    survey: {
      date: '2026-11-02',
      method: 'catalogue',
      products: 20,
      syntheticShare: 35,
      europeShare: null,
      countries: [],
      medianPrice: 15.5,
      repair: null,
      secondHand: null,
      notes: [
        '20 fiches relevées automatiquement : les premiers modèles de six catégories dans le plan du site.',
        '8 produits sur 20 sont majoritairement synthétiques, souvent en polyester recyclé.',
        'Prix relevés le jour du relevé : certains peuvent être des prix soldés.',
        'Pays de confection, réparation et seconde main non relevés.',
      ],
      sources: [
        { label: 'Fiches produits du site Promod', url: 'https://www.promod.fr/fr-fr/' },
      ],
    },
  },
  {
    id: 'sandro',
    name: 'Sandro',
    country: 'France',
    description: `Prêt-à-porter premium, groupe SMCP. ${PENDING}`,
    tags: ['France', 'Premium', 'SMCP'],
    sources: [{ label: 'Site officiel', url: 'https://fr.sandro-paris.com/fr/' }],
    portalName: 'SANDRO ANDY',
    // Relevé automatique le 2 nov. 2026, sans les pays. Détail produit par produit : releves/sandro.txt.
    survey: {
      date: '2026-11-02',
      method: 'catalogue',
      products: 20,
      syntheticShare: 27,
      europeShare: null,
      countries: [],
      medianPrice: 220,
      repair: null,
      secondHand: true,
      notes: [
        '20 fiches relevées automatiquement : les premiers modèles de six catégories dans le plan du site.',
        '2 produits sur 20 sont majoritairement synthétiques ; les blousons en cuir sont comptés sans synthétique, hors doublure.',
        'Seconde main : service relevé dans la presse (2023), à revérifier.',
        'Pays de confection et réparation non relevés.',
      ],
      sources: [
        { label: 'Fiches produits du site Sandro', url: 'https://fr.sandro-paris.com/fr/' },
        { label: 'FashionUnited, seconde main Sandro (2023)', url: 'https://fashionunited.fr/actualite/business/sandro-etend-son-offre-de-seconde-main-aux-pays-bas/2023071432606' },
      ],
    },
  },
  {
    id: 'claudiepierlot',
    name: 'Claudie Pierlot',
    country: 'France',
    description: `Prêt-à-porter féminin premium, groupe SMCP. ${PENDING}`,
    tags: ['France', 'Premium', 'SMCP'],
    sources: [{ label: 'Site officiel', url: 'https://fr.claudiepierlot.com/fr/' }],
    portalName: 'CLAUDIE PIERLOT',
    // Relevé automatique le 2 nov. 2026, sans les pays. Détail produit par produit : releves/claudiepierlot.txt.
    survey: {
      date: '2026-11-02',
      method: 'catalogue',
      products: 12,
      syntheticShare: 27,
      europeShare: null,
      countries: [],
      medianPrice: 235,
      repair: null,
      secondHand: true,
      notes: [
        'Seulement 12 fiches relevées : le plan du site contient peu de produits, sans t-shirt ni top repéré.',
        'Composition lue sur 11 de ces 12 fiches ; 2 produits sont majoritairement synthétiques.',
        'Seconde main : service relevé dans la presse (2024), à revérifier.',
        'Pays de confection et réparation non relevés.',
      ],
      sources: [
        { label: 'Fiches produits du site Claudie Pierlot', url: 'https://fr.claudiepierlot.com/fr/' },
        { label: 'Modaes, seconde main Claudie Pierlot (2024)', url: 'https://www.modaes.com/empresas/claudie-pierlot-se-lanza-a-la-segunda-mano' },
      ],
    },
  },
  {
    id: 'balzac',
    name: 'Balzac Paris',
    country: 'France',
    description: `Prêt-à-porter premium. ${PENDING}`,
    tags: ['France', 'Premium'],
    sources: [{ label: 'Site officiel', url: 'https://www.balzac-paris.fr/' }],
  },
];

export function searchBrands(query: string): Brand[] {
  const q = normalize(query.trim());
  if (!q) return brands;
  return brands.filter(
    (brand) => normalize(brand.name).includes(q) || brand.tags.some((tag) => normalize(tag).includes(q)),
  );
}

export function getBrand(id: string): Brand | undefined {
  return brands.find((brand) => brand.id === id);
}
