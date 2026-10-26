// Portail officiel de l'affichage environnemental (données publiques, sans authentification).
// Doc : https://affichage-environnemental.ecobalyse.beta.gouv.fr/documentation/api

const BASE_URL = 'https://affichage-environnemental.ecobalyse.beta.gouv.fr/api';

// Étapes du cycle de vie présentes dans le détail public du coût.
export const STAGES = {
  materials: 'Matières',
  spinning: 'Filature',
  fabric: 'Tissage / tricotage',
  dyeing: 'Teinture',
  making: 'Confection',
  trims: 'Accessoires',
  transport: 'Transport',
  usage: 'Usage',
  endOfLife: 'Fin de vie',
} as const;

export type Stage = keyof typeof STAGES;

export type PortalProduct = {
  gtin: string;
  reference: string;
  brand: string;
  category: string;
  // Coût environnemental, en points d'impact, total et pour 100 g.
  cost: number;
  per100g: number;
  durability: number;
  // Plus d'un composant pour un lot ou un produit multi-composants.
  components: number;
  // Part de chaque étape dans le coût, en points : leur somme redonne le coût.
  stages: Record<Stage, number>;
  // Utilisation de ressources en eau pour fabriquer le vêtement, en m³ éq (indicateur « wtu »
  // d'Ecobalyse, étapes matières et filature seulement). null si le portail ne la donne pas.
  water: number | null;
  // Changement climatique, en kg CO₂e (indicateur « cch »). null si le portail ne le donne pas.
  climate: number | null;
  declaredAt: string;
};

type ApiProduct = {
  internalReference: string;
  brand: { name: string };
  createdAt: string;
  score: number;
  standardized: number;
  informations: {
    categorySlug: string;
    score: Record<Stage | 'durability', number> & Partial<Record<Indicator, number>>;
  }[];
};

// Indicateurs physiques du détail public, traduits en repères du quotidien par l'app.
type Indicator = 'wtu' | 'cch';

// Somme sur les composants d'un indicateur, en valeur physique : contrairement aux étapes, il n'est
// pas divisé par le coefficient de durabilité. null si un composant ne le donne pas.
function sumIndicator(informations: ApiProduct['informations'], indicator: Indicator): number | null {
  if (!informations.every((info) => typeof info.score[indicator] === 'number')) return null;
  return informations.reduce((sum, info) => sum + (info.score[indicator] ?? 0), 0);
}

// Étiquette officielle (SVG) générée par le portail pour ce code-barres.
export function labelImageUrl(gtin: string): string {
  return `${BASE_URL}/image?type=gtin&gtin=${encodeURIComponent(gtin)}`;
}

// Étiquette officielle (SVG) générée par le portail pour un coût calculé par nos soins.
export function scoreLabelImageUrl(cost: number, massKg: number): string {
  return `${BASE_URL}/image?type=score&score=${Math.round(cost)}&masse=${massKg}`;
}

// Renvoie null si le vêtement n'est pas déclaré sur le portail (404).
export async function getProduct(gtin: string): Promise<PortalProduct | null> {
  const response = await fetch(`${BASE_URL}/produits/${encodeURIComponent(gtin)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Portail indisponible (${response.status})`);

  const data = (await response.json()) as ApiProduct;
  // Le portail donne les étapes avant le coefficient de durabilité : on les divise par ce
  // coefficient pour que leur somme corresponde au coût affiché. Un lot ou un produit à
  // plusieurs composants a une entrée par composant : on les additionne.
  const stages = Object.fromEntries(
    (Object.keys(STAGES) as Stage[]).map((stage) => [
      stage,
      data.informations.reduce((sum, info) => sum + (info.score[stage] ?? 0) / (info.score.durability || 1), 0),
    ]),
  ) as Record<Stage, number>;
  const main = data.informations[0];

  return {
    gtin,
    reference: data.internalReference,
    brand: data.brand.name,
    category: main?.categorySlug ?? '',
    cost: data.score,
    per100g: data.standardized,
    durability: main?.score.durability ?? 0,
    components: data.informations.length,
    stages,
    water: sumIndicator(data.informations, 'wtu'),
    climate: sumIndicator(data.informations, 'cch'),
    declaredAt: data.createdAt,
  };
}
