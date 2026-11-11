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
  readings: { title: string; href: Href }[];
};

// Lecture d'un article de l'onglet « Apprendre », sous son titre.
const article = (id: string) => ({
  title: getArticle(id)?.title ?? id,
  href: { pathname: '/article/[id]', params: { id } } as Href,
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

export type BudgetId = 'low' | 'mid' | 'high';

export const BUDGETS: { id: BudgetId; label: string; maxEuros: number }[] = [
  { id: 'low', label: 'Moins de 30 €', maxEuros: 30 },
  { id: 'mid', label: '30 à 80 €', maxEuros: 80 },
  { id: 'high', label: 'Plus de 80 €', maxEuros: Infinity },
];

export const getGoal = (id: GoalId) => GOALS.find((goal) => goal.id === id);
