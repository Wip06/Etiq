// Marques proposées à l'accueil, classées selon les objectifs et le budget de l'utilisateur. Ce n'est
// pas une note : chaque critère est comparé aux seuils publiés sur la page « Nos critères », et l'app
// affiche ce qui correspond ou non, avec le fait relevé, sans pourcentage ni score global.
import { brands, type Brand, type BrandSurvey } from '@/data/brands';
import stats from '@/data/generated/portal-stats.json';
import { BUDGETS, getGoal, type BudgetId, type GoalId } from '@/data/goals';
import type { Preferences } from '@/session/SessionProvider';

// Seuils des filtres, repris tels quels sur la page « Nos critères ».
export const CRITERIA = {
  // Moins de plastique : au plus 25 % de fibres synthétiques en moyenne, en partie jusqu'à 50 %.
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
};

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
      return { status, reason: `${share} % de fibres synthétiques en moyenne` };
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
  // Au moins un objectif rempli, même en partie. Sinon, la marque n'est proposée qu'à défaut.
  matchesGoal: boolean;
};

const points = (criteria: Criterion[]) =>
  criteria.reduce((sum, { status }) => sum + (status === 'met' ? 1 : status === 'partial' ? 0.5 : 0), 0);

// Toutes les marques relevées, de la plus proche à la moins proche des critères de l'utilisateur :
// le budget compte comme un critère de plus et départage les égalités. Une marque sans relevé n'est
// jamais proposée.
export function recommendBrands(preferences: Preferences): Recommendation[] {
  const scored = brands.flatMap((brand) => {
    const { survey } = brand;
    if (!survey) return [];
    const goals: Criterion[] = preferences.goals.map((id) => ({
      id,
      label: getGoal(id)?.label ?? id,
      ...goalCriterion(brand, survey, id),
    }));
    return [{ brand, goals, budget: budgetCriterion(survey, preferences.budget) }];
  });
  return scored
    .sort(
      (a, b) =>
        points([...b.goals, b.budget]) - points([...a.goals, a.budget]) || points([b.budget]) - points([a.budget]),
    )
    .map(({ brand, goals, budget }) => ({
      brand,
      criteria: [...goals, budget],
      matchesGoal: points(goals) > 0,
    }));
}
