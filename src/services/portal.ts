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
  // Coût environnemental, en points d'impact.
  cost: number;
  durability: number;
  stages: Record<Stage, number>;
  declaredAt: string;
};

type ApiProduct = {
  internalReference: string;
  brand: { name: string };
  createdAt: string;
  score: number;
  informations: {
    categorySlug: string;
    score: Record<Stage | 'durability', number>;
  }[];
};

// Renvoie null si le vêtement n'est pas déclaré sur le portail (404).
export async function getProduct(gtin: string): Promise<PortalProduct | null> {
  const response = await fetch(`${BASE_URL}/produits/${encodeURIComponent(gtin)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Portail indisponible (${response.status})`);

  const data = (await response.json()) as ApiProduct;
  const info = data.informations[0];
  const stages = Object.fromEntries(
    (Object.keys(STAGES) as Stage[]).map((stage) => [stage, info?.score[stage] ?? 0]),
  ) as Record<Stage, number>;

  return {
    gtin,
    reference: data.internalReference,
    brand: data.brand.name,
    category: info?.categorySlug ?? '',
    cost: data.score,
    durability: info?.score.durability ?? 0,
    stages,
    declaredAt: data.createdAt,
  };
}
