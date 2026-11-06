import { normalize } from '@/utils/text';

// Recherche d'un article d'occasion sur Vinted, à partir du nom du vêtement : la marque et le nom du
// modèle, sans codes, couleurs ni petits mots. Quand le nom n'est qu'un code (« WD104 R BLACK »), il n'y a
// pas d'article à chercher : on revient au type de vêtement.

export const vintedSearchUrl = (query: string) =>
  `https://www.vinted.fr/catalog?search_text=${encodeURIComponent(query.trim().replace(/\s+/g, ' '))}`;

const COLORS = [
  'noir', 'black', 'blanc', 'white', 'bleu', 'blue', 'navy', 'marine', 'rouge', 'red', 'vert', 'green', 'gris',
  'grey', 'gray', 'beige', 'ecru', 'kaki', 'khaki', 'rose', 'pink', 'jaune', 'yellow', 'marron', 'brown',
  'orange', 'violet', 'purple', 'camel', 'creme', 'cream', 'olive', 'bordeaux', 'multicolore', 'multi',
  'antracite', 'anthracite', 'clair', 'fonce', 'light', 'dark', 'off', 'offwhite',
];
const STOP_WORDS = ['les', 'des', 'aux', 'avec', 'pour', 'sans', 'une', 'and', 'the', 'with'];
const MAX_WORDS = 3;

function words(text: string): string[] {
  return text
    .split(/[^\p{L}\d]+/u)
    .filter((word) => word.length >= 3 && !/\d/.test(word))
    .filter((word) => !COLORS.includes(normalize(word)) && !STOP_WORDS.includes(normalize(word)));
}

// « Polo en coton bio | bleu ciel "Maario poloshirt" » → « Armedangels Maario » ; « Le Gros Pull » →
// « Asphalte Gros Pull » ; « 30000408-VALDAA » → « Armedangels VALDAA » ; « F26BO0102 KAK30 » → null.
export function articleQuery(brandName: string, articleName: string): string | null {
  const brandWords = new Set(words(brandName).map(normalize));
  // Le nom du modèle est souvent entre guillemets, après la description et la couleur.
  const quoted = articleName.match(/"([^"]+)"/)?.[1];
  const source = quoted ? quoted.split(/\s+/)[0] : articleName;
  const kept = words(source).filter((word) => !brandWords.has(normalize(word))).slice(0, MAX_WORDS);
  return kept.length > 0 ? `${brandName} ${kept.join(' ')}` : null;
}
