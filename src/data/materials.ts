// Lexique des matières : chaque entrée renvoie vers la fiche de The Good Goods.
// Les résumés d'une ligne sont rédigés par nous (faits de base sur l'origine de la fibre), à faire relire.

import { normalize } from '@/utils/text';

export const FAMILIES = {
  vegetal: 'Fibres végétales',
  animal: 'Fibres animales',
  artificial: 'Fibres artificielles',
  synthetic: 'Fibres synthétiques',
  recycled: 'Recyclées et upcyclées',
  innovative: 'Matières innovantes',
} as const;

export type Family = keyof typeof FAMILIES;

export type Material = {
  name: string;
  family: Family;
  summary: string;
  url: string;
};

const BASE_URL = 'https://www.thegoodgoods.fr/matieres';

export const materials: Material[] = [
  // Végétales
  { name: 'Coton', family: 'vegetal', summary: 'Fibre naturelle issue des graines du cotonnier, la fibre végétale la plus utilisée.', url: `${BASE_URL}/coton/` },
  { name: 'Lin', family: 'vegetal', summary: 'Fibre naturelle tirée de la tige du lin.', url: `${BASE_URL}/lin/` },
  { name: 'Chanvre', family: 'vegetal', summary: 'Fibre naturelle tirée de la tige du chanvre, une plante peu exigeante en eau et en pesticides.', url: `${BASE_URL}/chanvre/` },
  { name: 'Jute', family: 'vegetal', summary: 'Fibre végétale tirée de la tige du jute, surtout utilisée pour la toile et les sacs.', url: `${BASE_URL}/jute/` },
  { name: 'Ortie (ou ramie)', family: 'vegetal', summary: 'Fibres tirées de la tige de l’ortie ou de la ramie, une plante de la même famille.', url: `${BASE_URL}/lortie-ou-la-ramie/` },

  // Animales
  { name: 'Laine', family: 'animal', summary: 'Fibre issue de la toison du mouton.', url: `${BASE_URL}/laine/` },
  { name: 'Cachemire', family: 'animal', summary: 'Fibre très fine issue du duvet de la chèvre cachemire.', url: `${BASE_URL}/cachemire/` },
  { name: 'Mohair', family: 'animal', summary: 'Fibre issue de la toison de la chèvre angora.', url: `${BASE_URL}/mohair/` },
  { name: 'Angora', family: 'animal', summary: 'Fibre issue du poil du lapin angora.', url: `${BASE_URL}/angora/` },
  { name: 'Alpaga ou poils de lama', family: 'animal', summary: 'Fibres issues de la toison de l’alpaga et du lama.', url: `${BASE_URL}/poils-de-lamas/` },
  { name: 'Laine de chameau', family: 'animal', summary: 'Fibre issue du duvet du chameau.', url: `${BASE_URL}/poil-de-chameau/` },
  { name: 'Soie', family: 'animal', summary: 'Fibre produite par la chenille du bombyx (ver à soie) pour former son cocon.', url: `${BASE_URL}/soie/` },
  { name: 'Cuir', family: 'animal', summary: 'Peau animale traitée par tannage pour la rendre souple et imputrescible.', url: `${BASE_URL}/cuir/` },
  { name: 'Tannage végétal', family: 'animal', summary: 'Tannage du cuir avec des tanins végétaux plutôt qu’avec des sels de chrome.', url: `${BASE_URL}/tannage-vegetal/` },

  // Artificielles (cellulose transformée chimiquement)
  { name: 'Viscose ou rayonne', family: 'artificial', summary: 'Fibre fabriquée à partir de cellulose de bois, dissoute puis filée par procédé chimique.', url: `${BASE_URL}/fibranne-la-rayonne/` },
  { name: 'Viscose de bambou', family: 'artificial', summary: 'Viscose dont la cellulose provient du bambou. Le procédé chimique reste celui de la viscose.', url: `${BASE_URL}/viscose-de-bambou/` },
  { name: 'Modal', family: 'artificial', summary: 'Variante de la viscose, le plus souvent fabriquée à partir de bois de hêtre.', url: `${BASE_URL}/modal/` },
  { name: 'Lyocell (Tencel)', family: 'artificial', summary: 'Fibre de cellulose filée avec un solvant recyclé en circuit fermé. Tencel est une marque de Lenzing.', url: `${BASE_URL}/lyocell-lyocell/` },
  { name: 'Cupro (Bemberg)', family: 'artificial', summary: 'Fibre artificielle à partir de la cellulose de coton, alternative à la soie naturelle.', url: `${BASE_URL}/bemberg-ou-cupro/` },
  { name: 'Acétate de cellulose', family: 'artificial', summary: 'Fibre obtenue en transformant la cellulose avec des dérivés de l’acide acétique et de l’anhydre acétique.', url: `${BASE_URL}/acetate-de-cellulose-2/` },
  { name: 'Lenzing Ecovero', family: 'artificial', summary: 'Marque de viscose du groupe autrichien Lenzing.', url: `${BASE_URL}/lenzing-ecovero/` },

  // Synthétiques (issues du pétrole)
  { name: 'Polyester', family: 'synthetic', summary: 'Fibre synthétique issue du pétrole, la fibre la plus produite au monde.', url: `${BASE_URL}/polyester/` },
  { name: 'Polyamide et nylon', family: 'synthetic', summary: 'Fibres synthétiques issues du pétrole, très résistantes. Le nylon est un polyamide.', url: `${BASE_URL}/polyamide/` },
  { name: 'Élasthanne', family: 'synthetic', summary: 'Fibre synthétique très élastique, ajoutée en petite quantité pour rendre un tissu extensible.', url: `${BASE_URL}/elasthanne/` },
  { name: 'Acrylique', family: 'synthetic', summary: 'Fibre synthétique issue du pétrole, souvent utilisée pour imiter la laine.', url: `${BASE_URL}/acrylique/` },
  { name: 'Aramide', family: 'synthetic', summary: 'Fibre chimique et synthétique très résistante à la chaleur et aux chocs, utilisée dans les vêtements de protection.', url: `${BASE_URL}/aramide/` },
  { name: 'PTFE ou ePTFE', family: 'synthetic', summary: 'Polymère fluoré (famille des PFAS) utilisé dans les membranes imperméables et respirantes.', url: `${BASE_URL}/fluorofibres/` },
  { name: 'Latex ou caoutchouc', family: 'synthetic', summary: 'Matière élastique issue de la sève de l’hévéa (naturelle) ou du pétrole (synthétique).', url: `${BASE_URL}/latex-ou-caoutchouc/` },

  // Recyclées et upcyclées
  { name: 'Coton recyclé', family: 'recycled', summary: 'Coton obtenu en effilochant des chutes de production ou des vêtements usagés.', url: `${BASE_URL}/coton-recycle/` },
  { name: 'Polyester recyclé', family: 'recycled', summary: 'Polyester fabriqué à partir de plastique recyclé, le plus souvent des bouteilles en PET.', url: `${BASE_URL}/polyester-recycle/` },
  { name: 'Nylon recyclé', family: 'recycled', summary: 'Polyamide fabriqué à partir de déchets plastiques ou textiles recyclés.', url: `${BASE_URL}/nylon-recycle/` },
  { name: 'Econyl', family: 'recycled', summary: 'Marque de nylon recyclé, fabriqué notamment à partir de filets de pêche usagés.', url: `${BASE_URL}/econyl/` },
  { name: 'Matière upcyclée', family: 'recycled', summary: 'Matière réutilisée telle quelle, sans être refondue ni effilochée : chutes, stocks dormants, vêtements transformés.', url: `${BASE_URL}/matiere-upcyclee/` },

  // Innovantes
  { name: 'Alternatives végétales au cuir', family: 'innovative', summary: 'Matières imitant le cuir à partir de plantes (pomme, cactus, ananas...), souvent avec un liant plastique.', url: `${BASE_URL}/cuir-vegan/` },
  { name: 'Q-Nova', family: 'innovative', summary: 'Marque de polyamide recyclé du fabricant italien Fulgar.', url: `${BASE_URL}/q-nova/` },
  { name: 'Bloom Foam', family: 'innovative', summary: 'Mousse souple fabriquée en partie à partir d’algues, utilisée notamment dans les semelles.', url: `${BASE_URL}/bloom-foam/` },
  { name: 'Fibre de maïs', family: 'innovative', summary: 'Fibre issue de l’amidon de maïs, transformé en polymère d’origine végétale (PLA).', url: `${BASE_URL}/amidon-de-mais/` },
  { name: 'Milk Fiber', family: 'innovative', summary: 'Fibre fabriquée à partir de la caséine, une protéine du lait.', url: `${BASE_URL}/milk-fiber/` },
  { name: 'Soie d’araignée', family: 'innovative', summary: 'Fibre imitant la soie d’araignée, produite en laboratoire par fermentation.', url: `${BASE_URL}/soie-daraignee/` },
];

export function searchMaterials(query: string): Material[] {
  const q = normalize(query.trim());
  if (!q) return materials;
  return materials.filter((material) => normalize(material.name).includes(q));
}
