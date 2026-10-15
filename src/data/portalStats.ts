// Statistiques tirées de la base complète du portail officiel (npm run data:download puis
// npm run data:stats). Le fichier généré est embarqué dans l'app : aucun appel réseau.
import stats from '@/data/generated/portal-stats.json';

type CategoryStats = {
  references: number;
  per100gQuantiles: number[];
};

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
