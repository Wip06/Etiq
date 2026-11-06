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
  // Part moyenne des fibres naturelles (coton, lin, chanvre, laine et poils, soie, et cuir), en %. Le reste
  // est surtout artificiel : viscose, lyocell, modal, issus de cellulose transformée chimiquement.
  naturalShare?: number | null;
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
    tags: ['Suède', 'Grand public', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www2.hm.com/fr_fr/' }],
  },
  {
    id: 'zara',
    name: 'Zara',
    country: 'Espagne',
    description: `Prêt-à-porter grand public, groupe Inditex. ${PENDING}`,
    tags: ['Espagne', 'Grand public', 'Inditex', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.zara.com/fr/' }],
  },
  {
    id: 'mango',
    name: 'Mango',
    country: 'Espagne',
    description: `Prêt-à-porter grand public. ${PENDING}`,
    tags: ['Espagne', 'Grand public', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://shop.mango.com/fr' }],
  },
  {
    id: 'uniqlo',
    name: 'Uniqlo',
    country: 'Japon',
    description: `Prêt-à-porter grand public, groupe Fast Retailing. ${PENDING}`,
    tags: ['Japon', 'Grand public', 'Fast Retailing', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.uniqlo.com/fr/fr/' }],
    portalName: 'UNIQLO EUROPE LTD',
    // Relevé à la main le 26 oct. 2026, en 12 minutes (le site bloque la lecture automatique).
    // Détail produit par produit : releves/uniqlo.txt.
    survey: {
      date: '2026-10-26',
      method: 'catalogue',
      products: 20,
      syntheticShare: 27,
      naturalShare: 66,
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
    tags: ['France', 'Premium', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.sezane.com/fr' }],
    // Relevé à la main le 26 oct. 2026, en 20 minutes (le site bloque la lecture automatique).
    // Détail produit par produit : releves/sezane.txt.
    survey: {
      date: '2026-10-26',
      method: 'catalogue',
      products: 20,
      syntheticShare: 11,
      naturalShare: 84,
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
    tags: ['France', 'Premium', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://fr.sessun.com/' }],
    portalName: 'Sessùn',
    // Relevé automatique le 2 nov. 2026. Détail produit par produit : releves/sessun.txt.
    survey: {
      date: '2026-11-02',
      method: 'catalogue',
      products: 20,
      syntheticShare: 18,
      naturalShare: 54,
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
    tags: ['France', 'Premium', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://ba-sh.com/fr/fr/' }],
    portalName: 'BA&SH',
    // Relevé automatique le 2 nov. 2026. Détail produit par produit : releves/bash.txt.
    survey: {
      date: '2026-11-02',
      method: 'catalogue',
      products: 20,
      syntheticShare: 46,
      naturalShare: 31,
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
    tags: ['France', 'Premium', 'SMCP', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://fr.maje.com/' }],
    portalName: 'MAJE',
    // Relevé automatique le 2 nov. 2026, pays et quelques fiches complétés à la main (pays affichés au clic sur « Traçabilité »).
    // Détail produit par produit : releves/maje.txt.
    survey: {
      date: '2026-11-02',
      method: 'catalogue',
      products: 20,
      syntheticShare: 35,
      naturalShare: 60,
      europeShare: 5,
      countries: ['Chine', 'Turquie', 'Bulgarie', 'Tunisie', 'Maroc'],
      medianPrice: 245,
      repair: true,
      secondHand: true,
      notes: [
        '20 fiches relevées : automatiquement pour les compositions, à la main pour les pays.',
        '7 produits sur 20 sont majoritairement synthétiques.',
        'Confection surtout en Chine et en Turquie : 1 produit sur 20 en Europe.',
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
    tags: ['France', 'Grand public', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.promod.fr/fr-fr/' }],
    portalName: 'PROMOD',
    // Relevé automatique le 2 nov. 2026, pays et quelques fiches complétés à la main. Détail produit par produit : releves/promod.txt.
    survey: {
      date: '2026-11-02',
      method: 'catalogue',
      products: 20,
      syntheticShare: 35,
      naturalShare: 50,
      europeShare: 0,
      countries: ['Turquie', 'Chine', 'Tunisie', 'Bangladesh', 'Cambodge', 'Inde'],
      medianPrice: 27.99,
      repair: null,
      secondHand: true,
      notes: [
        '20 fiches relevées : automatiquement pour les compositions, à la main pour les pays.',
        '8 produits sur 20 sont majoritairement synthétiques, souvent en polyester recyclé.',
        'Prix relevés le jour du relevé : certains peuvent être des prix soldés.',
        'Confection hors d’Europe sur les 19 produits dont le pays est indiqué.',
        'Seconde main : reprise et revente dans une partie des magasins seulement (Promod Reprise), relevées dans la presse et les conditions de la marque, à revérifier.',
        'Réparation non relevée.',
      ],
      sources: [
        { label: 'Fiches produits du site Promod', url: 'https://www.promod.fr/fr-fr/' },
        { label: 'Conditions de Promod Reprise (2025)', url: 'https://eu-assets.contentstack.com/v3/assets/blt2bc61eb6d63f8631/bltbd4f973d9afc28cf/688cb0486f15605d425b9d3f/PROMOD_REPRISE_CGU_version_2025_20250801.pdf' },
        { label: 'FashionUnited, boutique circulaire Promod (2024)', url: 'https://fashionunited.fr/actualite/retail/promod-ouvre-une-boutique-dediee-a-la-mode-circulaire-a-calais/2024052135048' },
      ],
    },
  },
  {
    id: 'sandro',
    name: 'Sandro',
    country: 'France',
    description: `Prêt-à-porter premium, groupe SMCP. ${PENDING}`,
    tags: ['France', 'Premium', 'SMCP', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://fr.sandro-paris.com/fr/' }],
    portalName: 'SANDRO ANDY',
    // Relevé automatique le 2 nov. 2026, pays et quelques fiches complétés à la main. Détail produit par produit : releves/sandro.txt.
    survey: {
      date: '2026-11-02',
      method: 'catalogue',
      products: 20,
      syntheticShare: 27,
      naturalShare: 48,
      europeShare: 21,
      countries: ['Chine', 'Bulgarie', 'Tunisie', 'Inde', 'Maroc'],
      medianPrice: 220,
      repair: null,
      secondHand: true,
      notes: [
        '20 fiches relevées : automatiquement pour les compositions, à la main pour les pays.',
        '2 produits sur 20 sont majoritairement synthétiques ; les blousons en cuir sont comptés sans synthétique, hors doublure.',
        'Seconde main : service relevé dans la presse (2023), à revérifier.',
        'Confection en Europe : 4 produits sur les 19 dont le pays est indiqué.',
        'Réparation non relevée.',
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
    tags: ['France', 'Premium', 'SMCP', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://fr.claudiepierlot.com/fr/' }],
    portalName: 'CLAUDIE PIERLOT',
    // Relevé automatique le 2 nov. 2026, pays et quelques fiches complétés à la main. Détail produit par produit : releves/claudiepierlot.txt.
    survey: {
      date: '2026-11-02',
      method: 'catalogue',
      products: 12,
      syntheticShare: 19,
      naturalShare: 73,
      europeShare: 8,
      countries: ['Chine', 'Inde', 'Turquie', 'Tunisie', 'Bulgarie', 'Maroc'],
      medianPrice: 255,
      repair: null,
      secondHand: true,
      notes: [
        'Seulement 12 fiches relevées : le plan du site contient peu de produits, sans t-shirt ni top repéré.',
        'Compositions et pays complétés à la main ; 1 produit sur 12 est majoritairement synthétique.',
        'Seconde main : service relevé dans la presse (2024), à revérifier.',
        'Confection en Europe : 1 produit sur 12.',
        'Réparation non relevée.',
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
    tags: ['France', 'Premium', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.balzac-paris.fr/' }],
  },

  // Marques ajoutées le 5 nov. 2026 pour le rayon homme. Les sites d'Octobre Éditions, Jules, Celio,
  // Kiabi, Faguo, Le Slip Français, Armedangels, Loom, 1083 et Atelier Tuffery bloquent la lecture
  // automatique (ou les robots de Claude) : leurs fiches produits sont à relever à la main. Les chiffres
  // affichés viennent du portail officiel (Licence Ouverte), sous le nom déclaré (portalName).
  {
    id: 'octobre',
    name: 'Octobre Éditions',
    country: 'France',
    description: `Prêt-à-porter masculin, marque sœur de Sézane. ${PENDING}`,
    tags: ['France', 'Premium', 'Homme'],
    sources: [{ label: 'Site officiel', url: 'https://www.octobre-editions.com/fr-fr' }],
  },
  {
    id: 'jules',
    name: 'Jules',
    country: 'France',
    description: `Prêt-à-porter masculin grand public. ${PENDING}`,
    tags: ['France', 'Grand public', 'Homme'],
    sources: [{ label: 'Site officiel', url: 'https://www.jules.com/fr-fr/' }],
    portalName: 'Jules',
  },
  {
    id: 'celio',
    name: 'Celio',
    country: 'France',
    description: `Prêt-à-porter masculin grand public. ${PENDING}`,
    tags: ['France', 'Grand public', 'Homme'],
    sources: [{ label: 'Site officiel', url: 'https://www.celio.com/' }],
    portalName: 'CELIO FRANCE',
  },
  {
    id: 'kiabi',
    name: 'Kiabi',
    country: 'France',
    description: `Prêt-à-porter grand public pour toute la famille. ${PENDING}`,
    tags: ['France', 'Grand public', 'Homme', 'Femme', 'Enfant'],
    sources: [{ label: 'Site officiel', url: 'https://www.kiabi.com/' }],
    portalName: 'KIABI',
  },
  {
    id: 'faguo',
    name: 'Faguo',
    country: 'France',
    description: `Prêt-à-porter, surtout masculin. ${PENDING}`,
    tags: ['France', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.faguo-store.com/' }],
    portalName: 'FAGUO',
  },
  {
    id: 'leslipfrancais',
    name: 'Le Slip Français',
    country: 'France',
    description: `Sous-vêtements et prêt-à-porter. ${PENDING}`,
    tags: ['France', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.leslipfrancais.fr/' }],
    portalName: 'LE SLIP FRANCAIS',
  },
  {
    id: 'picture',
    name: 'Picture Organic Clothing',
    country: 'France',
    description: `Vêtements de sport et d’outdoor. ${PENDING}`,
    tags: ['France', 'Outdoor', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.picture-organic-clothing.com/' }],
    portalName: 'PICTURE ORGANIC CLOTHING',
  },
  {
    id: 'loom',
    name: 'Loom',
    country: 'France',
    description: `Vêtements de base. ${PENDING}`,
    tags: ['France', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.loom.fr/' }],
    portalName: 'Loom',
  },
  {
    id: '1083',
    name: '1083',
    country: 'France',
    description: `Jeans. ${PENDING}`,
    tags: ['France', 'Jean', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.1083.fr/' }],
    portalName: '1083',
  },
  {
    id: 'tuffery',
    name: 'Atelier Tuffery',
    country: 'France',
    description: `Jeans et prêt-à-porter. ${PENDING}`,
    tags: ['France', 'Jean', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.ateliertuffery.com/' }],
    portalName: 'Atelier Tuffery',
  },
  {
    id: 'asphalte',
    name: 'Asphalte',
    country: 'France',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['France', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.asphalte.com/fr/' }],
    // Relevé automatique complet le 6 nov. 2026. Détail produit par produit : releves/asphalte.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 176,
      syntheticShare: 0,
      naturalShare: 97,
      europeShare: 100,
      countries: ['Portugal', 'Bulgarie'],
      medianPrice: 109,
      repair: null,
      secondHand: null,
      notes: [
        '176 vêtements relevés automatiquement : tout le catalogue homme et femme du site, un exemplaire par modèle (compositions incomplètes écartées).',
        'Presque uniquement des fibres naturelles : coton, souvent biologique, laine mérinos et lin ; aucun vêtement majoritairement synthétique.',
        'Pays de confection connu pour 61 vêtements sur 176, tous confectionnés en Europe : 57 au Portugal, 4 en Bulgarie (bloc « Traçabilité » des fiches) ; la confection en Europe est calculée sur ces 61 vêtements.',
        'Aucun produit déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [{ label: 'Fiches produits du site Asphalte', url: 'https://www.asphalte.com/' }],
    },
  },
  {
    id: 'nudie',
    name: 'Nudie Jeans',
    country: 'Suède',
    description: `Jeans et prêt-à-porter. ${PENDING}`,
    tags: ['Suède', 'Jean', 'Homme', 'Femme'],
    sources: [{ label: 'Site officiel', url: 'https://www.nudiejeans.com/' }],
    // Relevé automatique complet le 6 nov. 2026 (données structurées des fiches). Détail produit par
    // produit : releves/nudie.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 208,
      syntheticShare: 1,
      naturalShare: 99,
      europeShare: 43,
      countries: ['Tunisie', 'Italie', 'Inde', 'Portugal', 'Turquie', 'Lituanie'],
      medianPrice: 180,
      repair: true,
      secondHand: null,
      notes: [
        '208 vêtements relevés automatiquement : tout le catalogue du site, femme et homme, un exemplaire par modèle (dont 107 jeans).',
        'Presque uniquement du coton (la marque indique que tous ses jeans sont en coton biologique) ; aucun vêtement majoritairement synthétique.',
        'Confection en Tunisie, en Italie, en Inde, au Portugal et en Turquie : 90 vêtements sur 208 en Europe.',
        'Réparation gratuite des jeans Nudie dans les boutiques de la marque et chez ses partenaires.',
        'Aucun produit déclaré sur le portail officiel. Seconde main non vérifiée.',
      ],
      sources: [
        { label: 'Fiches produits du site Nudie Jeans', url: 'https://www.nudiejeans.com/en-FR' },
        { label: 'Réparation gratuite (Nudie Jeans)', url: 'https://www.nudiejeans.com/en-FR/blog/free-repairs-forever' },
      ],
    },
  },

  // Marques relevées automatiquement sur WeDressFair, revendeur multimarque de mode éco-responsable :
  // relevé complet du 6 nov. 2026 (scratchpad : survey_wdf.py build-all, gen_wdf_brands.js). Pays de la
  // marque : présentation de WeDressFair, ou FashionUnited quand elle ne le dit pas ; vide sinon.
  {
    id: 'aboutcompanions',
    name: 'About Companions',
    country: 'Allemagne',
    description: `Prêt-à-porter masculin. ${PENDING}`,
    tags: ['Allemagne', 'Homme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/about-companions' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/aboutcompanions.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 16,
      syntheticShare: 0,
      naturalShare: 95,
      europeShare: 100,
      countries: ['Lituanie', 'Portugal', 'Bulgarie'],
      medianPrice: 110,
      repair: null,
      secondHand: null,
      notes: [
        '16 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '0 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Lituanie, Portugal et Bulgarie ; 16 vêtements sur 16 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/about-companions' },
      ],
    },
  },
  {
    id: 'amtstudio',
    name: 'AMT Studio',
    country: 'Espagne',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Espagne', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/amt-studio' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/amtstudio.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 6,
      syntheticShare: 14,
      naturalShare: 37,
      europeShare: 100,
      countries: ['Espagne'],
      medianPrice: 81,
      repair: null,
      secondHand: null,
      notes: [
        '6 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '14 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Espagne ; 6 vêtements sur 6 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/amt-studio' },
      ],
    },
  },
  {
    id: 'armedangels',
    name: 'Armedangels',
    country: 'Allemagne',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Allemagne', 'Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/armedangels' }],
    portalName: 'ARMEDANGELS',
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/armedangels.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 79,
      syntheticShare: 2,
      naturalShare: 80,
      europeShare: 38,
      countries: ['Turquie', 'Portugal', 'Tunisie', 'Maroc'],
      medianPrice: 89,
      repair: null,
      secondHand: null,
      notes: [
        '79 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '2 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Turquie, Portugal, Tunisie et Maroc ; 29 vêtements sur 77 en Europe.',
        '63 vêtements relevés sur 79 sont déclarés sur le portail officiel (code-barres) : la recherche avec filtres renvoie vers leur coût officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/armedangels' },
      ],
    },
  },
  {
    id: 'baskinthesun',
    name: 'Bask in the Sun',
    country: '',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Homme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/bask-in-the-sun' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/baskinthesun.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 20,
      syntheticShare: 7,
      naturalShare: 92,
      europeShare: 100,
      countries: ['Portugal'],
      medianPrice: 95,
      repair: null,
      secondHand: null,
      notes: [
        '20 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '7 % de fibres synthétiques en moyenne ; 1 vêtement sur 20 majoritairement synthétique.',
        'Confection : Portugal ; 20 vêtements sur 20 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/bask-in-the-sun' },
      ],
    },
  },
  {
    id: 'bonjourdemain',
    name: 'Bonjour Demain',
    country: '',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/bonjour-demain' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/bonjourdemain.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 11,
      syntheticShare: 6,
      naturalShare: 94,
      europeShare: 100,
      countries: ['Portugal', 'Italie'],
      medianPrice: 43,
      repair: null,
      secondHand: null,
      notes: [
        '11 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '6 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Portugal et Italie ; 11 vêtements sur 11 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/bonjour-demain' },
      ],
    },
  },
  {
    id: 'bravafabrics',
    name: 'Brava Fabrics',
    country: 'Espagne',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Espagne', 'Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/brava-fabrics' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/bravafabrics.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 17,
      syntheticShare: 6,
      naturalShare: 86,
      europeShare: 88,
      countries: ['Portugal', 'Espagne', 'Inde', 'Maroc'],
      medianPrice: 53,
      repair: null,
      secondHand: null,
      notes: [
        '17 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '6 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Portugal, Espagne, Inde et Maroc ; 15 vêtements sur 17 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/brava-fabrics' },
      ],
    },
  },
  {
    id: 'colorfulstandard',
    name: 'Colorful Standard',
    country: 'Danemark',
    description: `Vêtements de base colorés. ${PENDING}`,
    tags: ['Danemark', 'Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/colorful-standard' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/colorfulstandard.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 42,
      syntheticShare: 1,
      naturalShare: 99,
      europeShare: 100,
      countries: ['Portugal'],
      medianPrice: 48,
      repair: null,
      secondHand: null,
      notes: [
        '42 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '1 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Portugal ; 42 vêtements sur 42 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/colorful-standard' },
      ],
    },
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    country: 'Suède',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Suède', 'Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/dedicated' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/dedicated.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 22,
      syntheticShare: 1,
      naturalShare: 99,
      europeShare: 0,
      countries: ['Inde'],
      medianPrice: 74,
      repair: null,
      secondHand: null,
      notes: [
        '22 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '1 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Inde ; 0 vêtement sur 22 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/dedicated' },
      ],
    },
  },
  {
    id: 'emoiemoi',
    name: 'émoi émoi',
    country: '',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/emoi-emoi' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/emoiemoi.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 11,
      syntheticShare: 29,
      naturalShare: 71,
      europeShare: 100,
      countries: ['Portugal'],
      medianPrice: 95,
      repair: null,
      secondHand: null,
      notes: [
        '11 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '29 % de fibres synthétiques en moyenne ; 3 vêtements sur 11 majoritairement synthétiques.',
        'Confection : Portugal ; 11 vêtements sur 11 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/emoi-emoi' },
      ],
    },
  },
  {
    id: 'graine',
    name: 'Graine',
    country: '',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/graine.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 7,
      syntheticShare: 3,
      naturalShare: 97,
      europeShare: 100,
      countries: ['Portugal'],
      medianPrice: 115,
      repair: null,
      secondHand: null,
      notes: [
        '7 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '3 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Portugal ; 7 vêtements sur 7 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/' },
      ],
    },
  },
  {
    id: 'jannjune',
    name: 'Jan\'n June',
    country: 'Allemagne',
    description: `Prêt-à-porter féminin. ${PENDING}`,
    tags: ['Allemagne', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/jan-n-june' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/jannjune.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 55,
      syntheticShare: 11,
      naturalShare: 54,
      europeShare: 91,
      countries: ['Portugal', 'Pologne', 'Turquie', 'Bulgarie'],
      medianPrice: 76,
      repair: null,
      secondHand: null,
      notes: [
        '55 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '11 % de fibres synthétiques en moyenne ; 5 vêtements sur 55 majoritairement synthétiques.',
        'Confection : Portugal, Pologne, Turquie et Bulgarie ; 50 vêtements sur 55 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/jan-n-june' },
      ],
    },
  },
  {
    id: 'kingsofindigo',
    name: 'Kings of Indigo',
    country: 'Pays-Bas',
    description: `Jeans et prêt-à-porter. ${PENDING}`,
    tags: ['Pays-Bas', 'Jean', 'Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/kings-of-indigo' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/kingsofindigo.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 23,
      syntheticShare: 2,
      naturalShare: 93,
      europeShare: 4,
      countries: ['Turquie', 'Bulgarie'],
      medianPrice: 140,
      repair: null,
      secondHand: null,
      notes: [
        '23 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '2 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Turquie et Bulgarie ; 1 vêtement sur 23 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/kings-of-indigo' },
        { label: 'FashionUnited, Kings of Indigo (Amsterdam)', url: 'https://fashionunited.uk/news/retail/kings-of-indigo-not-your-next-g-star-denim-label/2016031419777' },
      ],
    },
  },
  {
    id: 'knowledgecottonapparel',
    name: 'Knowledge Cotton Apparel',
    country: 'Danemark',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Danemark', 'Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/knowledge-cotton-apparel' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/knowledgecottonapparel.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 64,
      syntheticShare: 5,
      naturalShare: 93,
      europeShare: 0,
      countries: ['Inde', 'Turquie', 'Bangladesh', 'Danemark'],
      medianPrice: 60,
      repair: null,
      secondHand: null,
      notes: [
        '64 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '5 % de fibres synthétiques en moyenne ; 2 vêtements sur 64 majoritairement synthétiques.',
        'Confection : Inde, Turquie, Bangladesh et Danemark ; 0 vêtement sur 60 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/knowledge-cotton-apparel' },
      ],
    },
  },
  {
    id: 'lanius',
    name: 'Lanius',
    country: '',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/lanius.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 7,
      syntheticShare: 3,
      naturalShare: 97,
      europeShare: 14,
      countries: ['Turquie', 'Inde', 'Macédoine du Nord'],
      medianPrice: 119,
      repair: null,
      secondHand: null,
      notes: [
        '7 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '3 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Turquie, Inde et Macédoine du Nord ; 1 vêtement sur 7 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/' },
      ],
    },
  },
  {
    id: 'mademoiselleyeye',
    name: 'Mademoiselle Yéyé',
    country: '',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/mademoiselle-yeye' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/mademoiselleyeye.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 5,
      syntheticShare: 44,
      naturalShare: 56,
      europeShare: 0,
      countries: ['Turquie'],
      medianPrice: 99,
      repair: null,
      secondHand: null,
      notes: [
        '5 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '44 % de fibres synthétiques en moyenne ; 3 vêtements sur 5 majoritairement synthétiques.',
        'Confection : Turquie ; 0 vêtement sur 4 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/mademoiselle-yeye' },
      ],
    },
  },
  {
    id: 'mudjeans',
    name: 'Mud Jeans',
    country: 'Pays-Bas',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Pays-Bas', 'Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/mud-jeans' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/mudjeans.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 15,
      syntheticShare: 0,
      naturalShare: 89,
      europeShare: 0,
      countries: ['Tunisie'],
      medianPrice: 89,
      repair: null,
      secondHand: null,
      notes: [
        '15 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '0 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Tunisie ; 0 vêtement sur 14 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/mud-jeans' },
      ],
    },
  },
  {
    id: 'nitah',
    name: 'Nitah',
    country: '',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/nitah' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/nitah.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 7,
      syntheticShare: 14,
      naturalShare: 57,
      europeShare: 0,
      countries: ['Maroc', 'Turquie'],
      medianPrice: 145,
      repair: null,
      secondHand: null,
      notes: [
        '7 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '14 % de fibres synthétiques en moyenne ; 1 vêtement sur 7 majoritairement synthétique.',
        'Confection : Maroc et Turquie ; 0 vêtement sur 7 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/nitah' },
      ],
    },
  },
  {
    id: 'nwhr',
    name: 'NWHR',
    country: '',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Homme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/nwhr' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/nwhr.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 6,
      syntheticShare: 0,
      naturalShare: 100,
      europeShare: 100,
      countries: ['Espagne', 'Portugal'],
      medianPrice: 107.5,
      repair: null,
      secondHand: null,
      notes: [
        '6 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '0 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Espagne et Portugal ; 6 vêtements sur 6 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/nwhr' },
      ],
    },
  },
  {
    id: 'olow',
    name: 'Olow',
    country: 'France',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['France', 'Homme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/olow' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/olow.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 29,
      syntheticShare: 1,
      naturalShare: 89,
      europeShare: 100,
      countries: ['Portugal'],
      medianPrice: 60,
      repair: null,
      secondHand: null,
      notes: [
        '29 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '1 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Portugal ; 29 vêtements sur 29 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/olow' },
      ],
    },
  },
  {
    id: 'patagonia',
    name: 'Patagonia',
    country: 'États-Unis',
    description: `Vêtements d’outdoor. ${PENDING}`,
    tags: ['États-Unis', 'Outdoor', 'Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/patagonia' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/patagonia.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 17,
      syntheticShare: 67,
      naturalShare: 33,
      europeShare: 0,
      countries: ['Mexique', 'Salvador', 'Sri Lanka', 'Vietnam', 'Bangladesh'],
      medianPrice: 100,
      repair: null,
      secondHand: null,
      notes: [
        '17 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '67 % de fibres synthétiques en moyenne ; 12 vêtements sur 17 majoritairement synthétiques.',
        'Confection : Mexique, Salvador, Sri Lanka, Vietnam et Bangladesh ; 0 vêtement sur 17 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/patagonia' },
      ],
    },
  },
  {
    id: 'perpete',
    name: 'Perpète',
    country: '',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/perpete' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/perpete.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 7,
      syntheticShare: 0,
      naturalShare: 100,
      europeShare: 100,
      countries: ['Portugal'],
      medianPrice: 115,
      repair: null,
      secondHand: null,
      notes: [
        '7 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '0 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Portugal ; 7 vêtements sur 7 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/perpete' },
      ],
    },
  },
  {
    id: 'rifo',
    name: 'Rifò',
    country: 'Italie',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Italie', 'Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/rifo' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/rifo.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 6,
      syntheticShare: 6,
      naturalShare: 94,
      europeShare: 100,
      countries: ['Italie'],
      medianPrice: 127.5,
      repair: null,
      secondHand: null,
      notes: [
        '6 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '6 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Italie ; 6 vêtements sur 6 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/rifo' },
      ],
    },
  },
  {
    id: 'rotholz',
    name: 'Rotholz',
    country: 'Allemagne',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Allemagne', 'Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/rotholz' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/rotholz.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 34,
      syntheticShare: 3,
      naturalShare: 97,
      europeShare: 100,
      countries: ['Portugal'],
      medianPrice: 139,
      repair: null,
      secondHand: null,
      notes: [
        '34 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '3 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Portugal ; 34 vêtements sur 34 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/rotholz' },
      ],
    },
  },
  {
    id: 'samsoesamsoe',
    name: 'Samsoe Samsoe',
    country: '',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/samsoe-samsoe' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/samsoesamsoe.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 7,
      syntheticShare: 10,
      naturalShare: 71,
      europeShare: 0,
      countries: ['Turquie', 'Lettonie'],
      medianPrice: 64,
      repair: null,
      secondHand: null,
      notes: [
        '7 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '10 % de fibres synthétiques en moyenne ; 1 vêtement sur 7 majoritairement synthétique.',
        'Confection : Turquie et Lettonie ; 0 vêtement sur 7 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/samsoe-samsoe' },
      ],
    },
  },
  {
    id: 'skfk',
    name: 'SKFK',
    country: 'Espagne',
    description: `Prêt-à-porter féminin. ${PENDING}`,
    tags: ['Espagne', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/skfk' }],
    portalName: 'SKFK',
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/skfk.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 19,
      syntheticShare: 2,
      naturalShare: 84,
      europeShare: 7,
      countries: ['Inde', 'Espagne', 'Turquie'],
      medianPrice: 51,
      repair: null,
      secondHand: null,
      notes: [
        '19 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '2 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Inde, Espagne et Turquie ; 1 vêtement sur 15 en Europe.',
        '10 vêtements relevés sur 19 sont déclarés sur le portail officiel (code-barres) : la recherche avec filtres renvoie vers leur coût officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/skfk' },
        { label: 'FashionUnited, SKFK (ex-Skunkfunk), marque basque', url: 'https://fashionunited.fr/actualite/mode/skunkfunk-devient-skfk-et-mise-sur-la-mode-ethique/2018101618990' },
      ],
    },
  },
  {
    id: 'thinkingmu',
    name: 'Thinking Mu',
    country: 'Espagne',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Espagne', 'Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/thinking-mu' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/thinkingmu.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 126,
      syntheticShare: 4,
      naturalShare: 90,
      europeShare: 11,
      countries: ['Inde', 'Turquie', 'Espagne', 'Portugal'],
      medianPrice: 72,
      repair: null,
      secondHand: null,
      notes: [
        '126 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '4 % de fibres synthétiques en moyenne ; 3 vêtements sur 126 majoritairement synthétiques.',
        'Confection : Inde, Turquie, Espagne et Portugal ; 14 vêtements sur 123 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/thinking-mu' },
      ],
    },
  },
  {
    id: 'twothirds',
    name: 'Twothirds',
    country: '',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/marques/twothirds' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/twothirds.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 6,
      syntheticShare: 18,
      naturalShare: 82,
      europeShare: 100,
      countries: ['Portugal'],
      medianPrice: 77,
      repair: null,
      secondHand: null,
      notes: [
        '6 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '18 % de fibres synthétiques en moyenne ; 1 vêtement sur 6 majoritairement synthétique.',
        'Confection : Portugal ; 6 vêtements sur 6 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/marques/twothirds' },
      ],
    },
  },
  {
    id: 'wedressfair',
    name: 'WeDressFair',
    country: '',
    description: `Prêt-à-porter. ${PENDING}`,
    tags: ['Homme', 'Femme'],
    sources: [{ label: 'Présentation sur WeDressFair', url: 'https://www.wedressfair.fr/' }],
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/wedressfair.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: 51,
      syntheticShare: 3,
      naturalShare: 87,
      europeShare: 100,
      countries: ['Portugal', 'Italie'],
      medianPrice: 65,
      repair: null,
      secondHand: null,
      notes: [
        '51 vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.',
        '3 % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.',
        'Confection : Portugal et Italie ; 51 vêtements sur 51 en Europe.',
        'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
        'Services de réparation et de seconde main non vérifiés.',
      ],
      sources: [
        { label: 'Fiches produits sur WeDressFair', url: 'https://www.wedressfair.fr/' },
      ],
    },
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

// Marque de l'app qui correspond au nom déclaré sur le portail (« UNIQLO EUROPE LTD » → Uniqlo).
export function findBrandByPortalName(portalName: string): Brand | undefined {
  const name = normalize(portalName.trim());
  return brands.find((brand) => normalize(brand.portalName ?? brand.name) === name);
}
