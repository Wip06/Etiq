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
