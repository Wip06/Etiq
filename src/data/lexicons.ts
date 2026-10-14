import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import { labels, searchLabels, THEMES } from '@/data/labels';
import { FAMILIES, materials, searchMaterials } from '@/data/materials';

export type LexiconKind = 'materials' | 'labels';

export type LexiconEntry = { name: string; summary: string; url: string };
export type LexiconGroup = { title: string; items: LexiconEntry[] };

// Regroupe les entrées dans l'ordre des groupes, en retirant les groupes vides.
function groupBy<T extends LexiconEntry, K extends string>(titles: Record<K, string>, items: T[], groupOf: (item: T) => K) {
  return (Object.keys(titles) as K[])
    .map((group) => ({ title: titles[group], items: items.filter((item) => groupOf(item) === group) }))
    .filter(({ items: groupItems }) => groupItems.length > 0);
}

// Lexiques de l'onglet « Apprendre », dans l'ordre d'affichage.
export const LEXICONS: Record<
  LexiconKind,
  {
    title: string;
    icon: ComponentProps<typeof Ionicons>['name'];
    count: number;
    placeholder: string;
    search: (query: string) => LexiconGroup[];
  }
> = {
  materials: {
    title: 'Lexique des matières',
    icon: 'leaf-outline',
    count: materials.length,
    placeholder: 'Rechercher une matière...',
    search: (query) => groupBy(FAMILIES, searchMaterials(query), (material) => material.family),
  },
  labels: {
    title: 'Lexique des labels',
    icon: 'ribbon-outline',
    count: labels.length,
    placeholder: 'Rechercher un label...',
    search: (query) => groupBy(THEMES, searchLabels(query), (label) => label.theme),
  },
};
