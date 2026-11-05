// Vêtements relevés sur les fiches produits des marques (releves/, npm run data:releves), pour la
// recherche avec filtres d'Etiq+. Le portail officiel ne publie ni la composition ni le pays de
// fabrication : ces filtres portent donc sur nos relevés, pas sur le coût environnemental.
import data from '@/data/generated/surveyed-products.json';
import { getBrand } from '@/data/brands';
import { normalize } from '@/utils/text';

export type Gender = 'femme' | 'homme' | 'mixte';

export const GENDER_LABELS: Record<Gender, string> = { femme: 'Femme', homme: 'Homme', mixte: 'Mixte' };

export type SurveyedProduct = {
  id: string;
  // Identifiant de la marque dans src/data/brands.ts.
  brand: string;
  category: string;
  // Rayon : connu par la marque (un seul rayon), le code produit ou la ligne « Rayon » du relevé.
  gender: Gender | null;
  name: string;
  url: string;
  // Composition recopiée de la fiche, ex. « 94 % Coton biologique, 6 % Élasthanne ».
  composition: string;
  syntheticShare: number | null;
  naturalShare: number | null;
  // Pays de confection (« Fabriqué en »).
  countries: string[];
  // Confectionné en Europe (tous ses pays de confection y sont).
  europe: boolean;
  price: number | null;
  // Code-barres du produit s'il est déclaré sur le portail officiel : sa fiche donne le coût officiel.
  portalGtin: string | null;
  // Date du relevé (AAAA-MM-JJ).
  date: string | null;
};

export const surveyedProducts = data.products as SurveyedProduct[];

// Valeur du filtre de fabrication pour « tous les pays européens ».
export const EUROPE = 'Europe';

export type ProductFilters = {
  query: string;
  // Femme ou homme ; un vêtement mixte répond aux deux.
  gender: Exclude<Gender, 'mixte'> | null;
  category: string | null;
  // EUROPE ou un pays de confection.
  origin: string | null;
  maxSynthetic: number | null;
  maxPrice: number | null;
};

export const NO_FILTERS: ProductFilters = {
  query: '',
  gender: null,
  category: null,
  origin: null,
  maxSynthetic: null,
  maxPrice: null,
};

// Nombre de vêtements relevés par rayon (un vêtement mixte compte pour les deux).
export const genderCount = (gender: Exclude<Gender, 'mixte'>) =>
  surveyedProducts.filter((product) => product.gender === gender || product.gender === 'mixte').length;

export const SYNTHETIC_LIMITS = [0, 10, 25, 50];
export const PRICE_LIMITS = [50, 100, 200];

// Catégories dans l'ordre des relevés, pays du plus fréquent au moins fréquent.
export const PRODUCT_CATEGORIES = [...new Set(surveyedProducts.map((product) => product.category))];

export const PRODUCT_COUNTRIES = Object.entries(
  surveyedProducts
    .flatMap((product) => product.countries)
    .reduce<Record<string, number>>((counts, country) => ({ ...counts, [country]: (counts[country] ?? 0) + 1 }), {}),
)
  .sort(([, a], [, b]) => b - a)
  .map(([country]) => country);

const dates = surveyedProducts.map((product) => product.date).filter((date) => date !== null).sort();

export const SURVEY_SUMMARY = {
  products: surveyedProducts.length,
  brands: new Set(surveyedProducts.map((product) => product.brand)).size,
  from: dates[0] ?? null,
  to: dates[dates.length - 1] ?? null,
};

export const brandName = (product: SurveyedProduct) => getBrand(product.brand)?.name ?? product.brand;

export const hasFilters = (filters: ProductFilters) =>
  filters.query.trim() !== '' ||
  filters.gender !== null ||
  filters.category !== null ||
  filters.origin !== null ||
  filters.maxSynthetic !== null ||
  filters.maxPrice !== null;

// Vêtements qui remplissent tous les filtres, du moins cher au plus cher : aucun classement
// environnemental (art. D. 541-245), seulement des faits relevés sur les fiches.
export function searchProducts(filters: ProductFilters): SurveyedProduct[] {
  const query = normalize(filters.query.trim());
  return surveyedProducts
    .filter(
      (product) =>
        (filters.gender === null || product.gender === filters.gender || product.gender === 'mixte') &&
        (filters.category === null || product.category === filters.category) &&
        (filters.origin === null ||
          (filters.origin === EUROPE ? product.europe : product.countries.includes(filters.origin))) &&
        (filters.maxSynthetic === null ||
          (product.syntheticShare !== null && product.syntheticShare <= filters.maxSynthetic)) &&
        (filters.maxPrice === null || (product.price !== null && product.price <= filters.maxPrice)) &&
        (query === '' || normalize(`${product.name} ${brandName(product)} ${product.composition}`).includes(query)),
    )
    .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
}

export const formatPrice = (price: number) =>
  `${price.toLocaleString('fr-FR', { minimumFractionDigits: Number.isInteger(price) ? 0 : 2 })} €`;
