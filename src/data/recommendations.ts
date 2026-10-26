// Marques proposées à l'accueil : celles dont le relevé répond à au moins un objectif de
// l'utilisateur. Ce n'est pas une note : chaque objectif est un filtre aux seuils publiés sur la
// page « Nos critères ». Une marque sans relevé n'est jamais proposée.
import { brands, type Brand } from '@/data/brands';
import stats from '@/data/generated/portal-stats.json';
import { BUDGETS, type GoalId } from '@/data/goals';
import type { Preferences } from '@/session/SessionProvider';

// Seuils des filtres, repris tels quels sur la page « Nos critères ».
export const CRITERIA = {
  // Moins de plastique : au plus 25 % de fibres synthétiques en moyenne.
  maxSyntheticShare: 25,
  // Fabrication proche : au moins la moitié des produits confectionnés en Europe.
  minEuropeShare: 50,
  // Réduire mon impact : au moins 60 % des produits déclarés sous la médiane de leur catégorie,
  // sur au moins 20 produits déclarés.
  minBelowMedianShare: 60,
  minDeclaredReferences: 20,
  // Budget : prix médian au plus 1,5 fois le haut de la fourchette choisie.
  budgetTolerance: 1.5,
};

type PortalBrand = { references: number; belowMedianShare?: number; durabilityMedian?: number | null };
const portalBrands = stats.brandsByReferences as unknown as Record<string, PortalBrand>;

export function portalStatsFor(brand: Brand): PortalBrand | null {
  return portalBrands[brand.portalName ?? brand.name] ?? null;
}

export function matchesGoal(brand: Brand, goal: GoalId): boolean {
  const survey = brand.survey;
  if (!survey) return false;
  switch (goal) {
    case 'materials':
      return survey.syntheticShare !== null && survey.syntheticShare <= CRITERIA.maxSyntheticShare;
    case 'local':
      return survey.europeShare !== null && survey.europeShare >= CRITERIA.minEuropeShare;
    case 'durable':
      return survey.repair === true || survey.secondHand === true;
    case 'impact': {
      const portal = portalStatsFor(brand);
      return (
        portal !== null &&
        portal.references >= CRITERIA.minDeclaredReferences &&
        (portal.belowMedianShare ?? 0) >= CRITERIA.minBelowMedianShare
      );
    }
  }
}

export type Recommendation = { brand: Brand; goals: GoalId[] };

export function recommendBrands(preferences: Preferences): Recommendation[] {
  const maxPrice = (BUDGETS.find((budget) => budget.id === preferences.budget)?.maxEuros ?? Infinity) * CRITERIA.budgetTolerance;
  return brands
    .filter((brand) => brand.survey && (brand.survey.medianPrice ?? 0) <= maxPrice)
    .map((brand) => ({ brand, goals: preferences.goals.filter((goal) => matchesGoal(brand, goal)) }))
    .filter((recommendation) => recommendation.goals.length > 0)
    .sort((a, b) => b.goals.length - a.goals.length);
}
