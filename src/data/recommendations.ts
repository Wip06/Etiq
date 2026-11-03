// Marques proposées à l'accueil, classées selon les objectifs de l'utilisateur, dans son ordre de
// priorité, et son budget. Le pourcentage mesure la correspondance avec SES critères : ce n'est pas une
// note de la marque, il change d'une personne à l'autre. Il est toujours affiché avec le détail de chaque
// critère, et les seuils et poids sont publiés sur la page « Nos critères ».
import { brands, type Brand, type BrandSurvey } from '@/data/brands';
import stats from '@/data/generated/portal-stats.json';
import { BUDGETS, getGoal, type BudgetId, type GoalId } from '@/data/goals';
import type { Preferences } from '@/session/SessionProvider';

// Seuils des filtres, repris tels quels sur la page « Nos critères ».
export const CRITERIA = {
  // Plus de fibres naturelles, moins de plastique : au plus 25 % de fibres synthétiques en moyenne, en partie jusqu'à 50 %.
  maxSyntheticShare: 25,
  partialSyntheticShare: 50,
  // Fabrication proche : au moins 50 % des produits confectionnés en Europe, en partie dès 25 %.
  minEuropeShare: 50,
  partialEuropeShare: 25,
  // Réduire mon impact : au moins 60 % des produits déclarés sous la médiane de leur catégorie, en
  // partie dès 40 %, sur au moins 20 produits déclarés.
  minBelowMedianShare: 60,
  partialBelowMedianShare: 40,
  minDeclaredReferences: 20,
  // Budget : prix médian dans la fourchette choisie, en partie jusqu'à 1,5 fois son haut.
  budgetTolerance: 1.5,
  // Poids du budget. Le dernier objectif pèse 2, et chaque rang au-dessus 1 de plus (3 objectifs : 4, 3, 2).
  budgetWeight: 1,
};

// goals est dans l'ordre de priorité de l'utilisateur.
const goalWeight = (rank: number, count: number) => count - rank + 1;

type PortalBrand = { references: number; belowMedianShare?: number; durabilityMedian?: number | null };
const portalBrands = stats.brandsByReferences as unknown as Record<string, PortalBrand>;

export function portalStatsFor(brand: Brand): PortalBrand | null {
  return portalBrands[brand.portalName ?? brand.name] ?? null;
}

export type CriterionStatus = 'met' | 'partial' | 'unmet' | 'unknown';

export type Criterion = {
  id: GoalId | 'budget';
  label: string;
  status: CriterionStatus;
  // Le fait relevé qui justifie le statut, affiché tel quel.
  reason: string;
};

function goalCriterion(brand: Brand, survey: BrandSurvey, goal: GoalId): Omit<Criterion, 'id' | 'label'> {
  switch (goal) {
    case 'materials': {
      const share = survey.syntheticShare;
      if (share === null) return { status: 'unknown', reason: 'Composition non relevée' };
      const status = share <= CRITERIA.maxSyntheticShare ? 'met' : share <= CRITERIA.partialSyntheticShare ? 'partial' : 'unmet';
      const natural = survey.naturalShare != null ? `${survey.naturalShare} % de fibres naturelles, ` : '';
      return { status, reason: `${natural}${share} % de synthétique en moyenne` };
    }
    case 'local': {
      const share = survey.europeShare;
      if (share === null) return { status: 'unknown', reason: 'Pays de confection non relevés' };
      const status = share >= CRITERIA.minEuropeShare ? 'met' : share >= CRITERIA.partialEuropeShare ? 'partial' : 'unmet';
      return { status, reason: `${share} % des produits confectionnés en Europe` };
    }
    case 'durable':
      if (survey.secondHand === true) return { status: 'met', reason: 'Service de seconde main' };
      if (survey.repair === true) {
        return survey.repairLimited
          ? { status: 'partial', reason: `Réparation, ${survey.repairLimited}` }
          : { status: 'met', reason: 'Service de réparation' };
      }
      return survey.repair === false && survey.secondHand === false
        ? { status: 'unmet', reason: 'Ni réparation ni seconde main' }
        : { status: 'unknown', reason: 'Services non vérifiés' };
    case 'impact': {
      const portal = portalStatsFor(brand);
      if (!portal) return { status: 'unknown', reason: 'Aucun produit déclaré sur le portail officiel' };
      if (portal.references < CRITERIA.minDeclaredReferences) {
        return { status: 'unknown', reason: `Trop peu de produits déclarés sur le portail officiel (${portal.references})` };
      }
      const share = portal.belowMedianShare ?? 0;
      const status = share >= CRITERIA.minBelowMedianShare ? 'met' : share >= CRITERIA.partialBelowMedianShare ? 'partial' : 'unmet';
      return { status, reason: `${share} % des produits déclarés sous la médiane de leur catégorie` };
    }
  }
}

function budgetCriterion(survey: BrandSurvey, budget: BudgetId): Criterion {
  const base = { id: 'budget', label: 'Votre budget' } as const;
  if (survey.medianPrice === null) return { ...base, status: 'unknown', reason: 'Prix non relevés' };
  const max = BUDGETS.find((option) => option.id === budget)?.maxEuros ?? Infinity;
  const status = survey.medianPrice <= max ? 'met' : survey.medianPrice <= max * CRITERIA.budgetTolerance ? 'partial' : 'unmet';
  return { ...base, status, reason: `Prix médian de ${Math.round(survey.medianPrice)} €` };
}

export type Recommendation = {
  brand: Brand;
  criteria: Criterion[];
  // Correspondance avec les critères de l'utilisateur, de 0 à 100 %.
  match: number;
  // Au moins un objectif rempli, même en partie. Sinon, la marque n'est proposée qu'à défaut.
  matchesGoal: boolean;
};

// Un critère rempli vaut 1, en partie 0,5. Sans données, il vaut 0, comme un critère non rempli.
const points = ({ status }: Criterion) => (status === 'met' ? 1 : status === 'partial' ? 0.5 : 0);

// Toutes les marques relevées, de la plus proche à la moins proche des critères de l'utilisateur. Le
// budget départage les égalités. Une marque sans relevé n'est jamais proposée.
export function recommendBrands(preferences: Preferences): Recommendation[] {
  const count = preferences.goals.length;
  const totalWeight = preferences.goals.reduce((sum, _, rank) => sum + goalWeight(rank, count), CRITERIA.budgetWeight);
  const recommendations = brands.flatMap((brand) => {
    const { survey } = brand;
    if (!survey) return [];
    const goals: Criterion[] = preferences.goals.map((id) => ({
      id,
      label: getGoal(id)?.label ?? id,
      ...goalCriterion(brand, survey, id),
    }));
    const budget = budgetCriterion(survey, preferences.budget);
    const score = goals.reduce((sum, goal, rank) => sum + points(goal) * goalWeight(rank, count), points(budget) * CRITERIA.budgetWeight);
    return [
      {
        brand,
        criteria: [...goals, budget],
        match: Math.round((score / totalWeight) * 100),
        matchesGoal: goals.some((goal) => points(goal) > 0),
        budgetPoints: points(budget),
      },
    ];
  });
  return recommendations
    .sort((a, b) => b.match - a.match || b.budgetPoints - a.budgetPoints)
    .map(({ budgetPoints: _budgetPoints, ...recommendation }) => recommendation);
}
