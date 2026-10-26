// Calculateur officiel Ecobalyse, version réglementaire 7.0.0 (public, sans authentification).
// Doc : https://ecobalyse.beta.gouv.fr/versions/v7.0.0/#/api

const SIMULATOR = 'https://ecobalyse.beta.gouv.fr/versions/v7.0.0/api/textile/simulator';

export type EstimateInput = {
  // Identifiant de catégorie Ecobalyse (tshirt, pull...).
  product: string;
  massKg: number;
  // Parts entre 0 et 1, dont la somme vaut 1.
  materials: { id: string; share: number }[];
  countryMaking: string;
  // Absents de l'étiquette : « --- » (inconnu) par défaut.
  countryFabric?: string;
  countryDyeing?: string;
  priceEuros?: number;
  // Données de marque qui entrent dans le coefficient de durabilité (quiz).
  business?: 'small-business' | 'large-business-with-services' | 'large-business-without-services';
  numberOfReferences?: number;
};

// Coût environnemental en points d'impact. Les pays de tissage et de teinture, absents de
// l'étiquette, restent « inconnus » : la méthode applique alors ses valeurs par défaut, pénalisantes.
export async function estimateCost(input: EstimateInput): Promise<number> {
  const response = await fetch(SIMULATOR, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product: input.product,
      mass: input.massKg,
      materials: input.materials,
      countryMaking: input.countryMaking,
      countryFabric: input.countryFabric ?? '---',
      countryDyeing: input.countryDyeing ?? '---',
      ...(input.priceEuros ? { price: input.priceEuros } : {}),
      ...(input.business ? { business: input.business } : {}),
      ...(input.numberOfReferences ? { numberOfReferences: input.numberOfReferences } : {}),
    }),
  });
  if (!response.ok) throw new Error(`Calculateur Ecobalyse indisponible (${response.status})`);
  const data = (await response.json()) as { impacts: { ecs: number } };
  return data.impacts.ecs;
}
