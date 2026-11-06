// Les 11 catégories de vêtements de la méthode officielle. Le nom est le même sur le portail et
// dans Ecobalyse ; l'identifiant est celui de l'API Ecobalyse.
import stats from '@/data/generated/portal-stats.json';

export type Category = {
  id: string;
  name: string;
  // Masse médiane des vêtements de la catégorie déclarés sur le portail, en grammes.
  defaultMassGrams: number;
};

const CATEGORIES: { id: string; name: string }[] = [
  { id: 'tshirt', name: 'T-shirt / Polo' },
  { id: 'chemise', name: 'Chemise' },
  { id: 'pull', name: 'Pull' },
  { id: 'pantalon', name: 'Pantalon / Short' },
  { id: 'jean', name: 'Jean' },
  { id: 'jupe', name: 'Jupe / Robe' },
  { id: 'manteau', name: 'Manteau / Veste' },
  { id: 'chaussettes', name: 'Chaussettes' },
  { id: 'slip', name: 'Boxer / Slip (tricoté)' },
  { id: 'calecon', name: 'Caleçon (tissé)' },
  { id: 'maillot-de-bain', name: 'Maillot de bain' },
];

const known = stats.categories as Record<string, { medianMassGrams: number }>;

export const categories: Category[] = CATEGORIES.map((category) => ({
  ...category,
  defaultMassGrams: known[category.name]?.medianMassGrams ?? 300,
}));

// Mot de recherche d'une catégorie sur un site de seconde main (« Manteau / Veste » → « veste ») : un
// seul mot, car une recherche à deux mots ne garde que les annonces qui contiennent les deux.
const SEARCH_WORDS: Record<string, string> = {
  'T-shirt / Polo': 't-shirt',
  Chemise: 'chemise',
  Pull: 'pull',
  'Pantalon / Short': 'pantalon',
  Jean: 'jean',
  'Jupe / Robe': 'robe',
  'Manteau / Veste': 'veste',
  Chaussettes: 'chaussettes',
  'Boxer / Slip (tricoté)': 'boxer',
  'Caleçon (tissé)': 'caleçon',
  'Maillot de bain': 'maillot de bain',
};

export const searchWord = (categoryName: string) => SEARCH_WORDS[categoryName] ?? '';
