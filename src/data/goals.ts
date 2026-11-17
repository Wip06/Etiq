// Objectifs de consommation choisis à l'onboarding. Ils classent les marques et choisissent les
// lectures proposées à l'accueil : c'est l'utilisateur qui fixe ses critères, nous ne notons pas les marques.
import type Ionicons from '@expo/vector-icons/Ionicons';
import type { Href } from 'expo-router';
import type { ComponentProps } from 'react';

import { getArticle } from '@/data/articles';

export type GoalId = 'impact' | 'durable' | 'materials' | 'local';

export type Goal = {
  id: GoalId;
  label: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  // Lectures conseillées : articles et lexiques de l'onglet « Apprendre ».
  readings: { title: string; href: Href; articleId?: string }[];
};

// Lecture d'un article de l'onglet « Apprendre », sous son titre.
const article = (id: string) => ({
  title: getArticle(id)?.title ?? id,
  href: { pathname: '/article/[id]', params: { id } } as Href,
  articleId: id,
});

export const GOALS: Goal[] = [
  {
    id: 'impact',
    label: 'Réduire mon impact',
    description: 'Choisir des vêtements au coût environnemental plus bas.',
    icon: 'leaf-outline',
    readings: [
      article('cout-environnemental'),
      article('consommation'),
      article('greenwashing'),
      article('labels'),
      article('mode-ultra-express'),
      article('invendus'),
    ],
  },
  {
    id: 'durable',
    label: 'Des vêtements qui durent',
    description: 'Acheter moins, chez des marques qui réparent ou revendent leurs vêtements.',
    icon: 'hammer-outline',
    readings: [
      { title: 'Quel est l’impact de votre garde-robe ? (quiz)', href: '/quiz' },
      article('laver-moins'),
      article('bonus-reparation'),
      article('seconde-main'),
      article('jean'),
    ],
  },
  {
    id: 'materials',
    label: 'Plus de fibres naturelles, moins de plastique',
    description: 'Privilégier le coton, le lin ou la laine, et éviter le polyester, le nylon et l’acrylique, qui relâchent des microfibres.',
    icon: 'water-outline',
    readings: [
      article('lire-etiquette'),
      article('microfibres'),
      article('coton-bio'),
      article('lin-chanvre'),
      article('polyester-recycle'),
      article('laine'),
      article('fibres-artificielles'),
      { title: 'Lexique des matières', href: { pathname: '/lexicon/[kind]', params: { kind: 'materials' } } },
    ],
  },
  {
    id: 'local',
    label: 'Fabrication proche',
    description: 'Des vêtements confectionnés en France ou en Europe.',
    icon: 'location-outline',
    readings: [article('pays-fabrication'), article('made-in-france'), article('tracabilite'), article('lin-chanvre')],
  },
];

export type BudgetId = 'lt50' | '50-100' | '100-150' | 'gt150';

// Budget vêtements par mois, demandé à l'onboarding et repris dans « Ma situation ». Tranches calées sur
// un budget mode moyen de 82 € par mois, 116 € chez les moins de 35 ans (notre cible).
export const BUDGETS: { id: BudgetId; label: string; maxEuros: number }[] = [
  { id: 'lt50', label: 'Moins de 50 €', maxEuros: 50 },
  { id: '50-100', label: '50 à 100 €', maxEuros: 100 },
  { id: '100-150', label: '100 à 150 €', maxEuros: 150 },
  { id: 'gt150', label: 'Plus de 150 €', maxEuros: Infinity },
];

export const isBudgetId = (value: unknown): value is BudgetId => BUDGETS.some((budget) => budget.id === value);

export const getGoal = (id: GoalId) => GOALS.find((goal) => goal.id === id);

// Objectif de l'utilisateur auquel chaque article se rattache, en suivant son ordre de priorité : un
// article lié à plusieurs objectifs prend le plus prioritaire.
export function articleGoals(goals: GoalId[]): Map<string, Goal> {
  const byArticle = new Map<string, Goal>();
  for (const id of goals) {
    const goal = getGoal(id);
    for (const reading of goal?.readings ?? []) {
      if (goal && reading.articleId && !byArticle.has(reading.articleId)) byArticle.set(reading.articleId, goal);
    }
  }
  return byArticle;
}
