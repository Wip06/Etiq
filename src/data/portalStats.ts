// Statistiques tirées de la base complète du portail officiel (npm run data:download puis
// npm run data:stats). Le fichier généré est embarqué dans l'app : aucun appel réseau.
import stats from '@/data/generated/portal-stats.json';

type CategoryStats = {
  references: number;
  per100gQuantiles: number[];
  alternatives: StoredAlternative[];
};

type StoredAlternative = {
  gtin: string;
  reference: string;
  brand: string;
  cost: number;
  per100g: number;
  // Absents d'un fichier généré avant l'ajout de l'eau et des tranches de masse.
  massGrams?: number;
  water?: number | null;
};

export type Alternative = StoredAlternative & {
  massGrams: number;
  // Part de coût en moins à poids égal, en %.
  lessImpact: number;
};

// Au moins 10 % de moins pour 100 g : en dessous, la différence n'est pas parlante.
const MIN_GAIN = 0.1;
// Poids proche : entre 75 % et 133 % de celui du vêtement scanné.
const MASS_RATIO = 4 / 3;

const categories = stats.categories as Record<string, CategoryStats>;

export type CategoryComparison = {
  category: string;
  // Part des références de la catégorie qui ont plus d'impact (à poids égal), en %.
  lessImpactThan: number;
  references: number;
  dataDate: string;
};

// Position d'un vêtement dans sa catégorie, à poids égal (points pour 100 g) : on compare au
// coût pour 100 g plutôt qu'au coût total, car une catégorie mélange tailles bébé et adulte.
export function compareToCategory(category: string, per100g: number): CategoryComparison | null {
  const known = categories[category];
  if (!known || known.references < 30) return null;

  const thresholds = known.per100gQuantiles;
  const step = 100 / (thresholds.length - 1);
  let rank = 100;
  for (let index = 0; index < thresholds.length - 1; index++) {
    const [low, high] = [thresholds[index], thresholds[index + 1]];
    if (per100g <= high) {
      rank = index * step + (high > low ? ((Math.max(per100g, low) - low) / (high - low)) * step : 0);
      break;
    }
  }
  // Jamais « 0 % » ni « 100 % » : on parle d'un échantillon, pas d'un classement exact.
  const lessImpactThan = Math.min(99, Math.max(1, Math.round(100 - rank)));

  return { category, lessImpactThan, references: known.references, dataDate: stats.generatedAt };
}

// Vêtements de la même catégorie, de poids proche et moins coûteux à poids égal, du meilleur au
// moins bon. Le classement découle uniquement du coût officiel déclaré sur le portail.
export function findAlternatives(
  category: string,
  product: { gtin?: string; per100g: number; massGrams: number },
  limit = 3,
): Alternative[] {
  const known = categories[category];
  if (!known || product.per100g <= 0) return [];

  return known.alternatives
    .map((alternative) => ({
      ...alternative,
      massGrams: alternative.massGrams ?? (alternative.cost / alternative.per100g) * 100,
      lessImpact: Math.round((1 - alternative.per100g / product.per100g) * 100),
    }))
    .filter(
      (alternative) =>
        alternative.gtin !== product.gtin &&
        alternative.per100g <= product.per100g * (1 - MIN_GAIN) &&
        alternative.massGrams <= product.massGrams * MASS_RATIO &&
        alternative.massGrams >= product.massGrams / MASS_RATIO,
    )
    .sort((a, b) => a.per100g - b.per100g)
    .slice(0, limit);
}
