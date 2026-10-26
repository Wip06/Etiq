// Objectifs de consommation choisis à l'onboarding. Ils filtrent les marques et les lectures
// proposées à l'accueil : c'est l'utilisateur qui fixe ses critères, nous ne notons pas les marques.
import type Ionicons from '@expo/vector-icons/Ionicons';
import type { Href } from 'expo-router';
import type { ComponentProps } from 'react';

export type GoalId = 'impact' | 'durable' | 'materials' | 'local';

export type Goal = {
  id: GoalId;
  label: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  // Libellé court affiché sur une marque qui répond à l'objectif.
  badge: string;
  // Lectures conseillées : articles et lexiques de l'onglet « Apprendre ».
  readings: { title: string; href: Href }[];
};

export const GOALS: Goal[] = [
  {
    id: 'impact',
    label: 'Réduire mon impact',
    description: 'Choisir des vêtements au coût environnemental plus bas.',
    icon: 'leaf-outline',
    badge: 'Coût officiel bas',
    readings: [
      { title: 'Le coût environnemental, c’est quoi ?', href: { pathname: '/article/[id]', params: { id: 'cout-environnemental' } } },
    ],
  },
  {
    id: 'durable',
    label: 'Acheter moins, mais durable',
    description: 'Des vêtements qui durent, se réparent ou se revendent.',
    icon: 'hammer-outline',
    badge: 'Réparation ou seconde main',
    readings: [{ title: 'Quel est l’impact de votre garde-robe ? (quiz)', href: '/quiz' }],
  },
  {
    id: 'materials',
    label: 'Moins de plastique',
    description: 'Éviter le polyester, le nylon et l’acrylique, qui relâchent des microfibres.',
    icon: 'water-outline',
    badge: 'Peu de synthétique',
    readings: [
      { title: 'Lire l’étiquette de son vêtement', href: { pathname: '/article/[id]', params: { id: 'lire-etiquette' } } },
      { title: 'Lexique des matières', href: { pathname: '/lexicon/[kind]', params: { kind: 'materials' } } },
    ],
  },
  {
    id: 'local',
    label: 'Fabrication proche',
    description: 'Des vêtements confectionnés en France ou en Europe.',
    icon: 'location-outline',
    badge: 'Fabriqué en Europe',
    readings: [
      { title: 'Traçabilité : d’où vient mon vêtement ?', href: { pathname: '/article/[id]', params: { id: 'tracabilite' } } },
    ],
  },
];

export type BudgetId = 'low' | 'mid' | 'high';

export const BUDGETS: { id: BudgetId; label: string; maxEuros: number }[] = [
  { id: 'low', label: 'Moins de 30 €', maxEuros: 30 },
  { id: 'mid', label: '30 à 80 €', maxEuros: 80 },
  { id: 'high', label: 'Plus de 80 €', maxEuros: Infinity },
];

export const getGoal = (id: GoalId) => GOALS.find((goal) => goal.id === id);
