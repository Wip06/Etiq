// Quiz « Quel est l'impact de votre garde-robe ? » : estime le coût environnemental des vêtements
// neufs achetés en un an avec le calculateur officiel Ecobalyse, comme le scan d'étiquette, à partir
// des habitudes déclarées (matière, pays de fabrication, type de marque). Réservé aux comptes
// connectés : le dernier résultat est gardé dans leur bibliothèque.
import { categories as allCategories } from '@/data/categories';
import { estimateCost, type EstimateInput } from '@/services/ecobalyse';

// Nombre moyen de vêtements neufs achetés par personne en France en 2025 (baromètre Refashion).
export const FRENCH_AVERAGE_PIECES = 43;

type Option = { label: string; value: string };

export type QuizQuestion = {
  id: string;
  question: string;
  hint?: string;
  options: Option[];
};

// ---------------------------------------------------------------------------------------------
// Quantités achetées par an

type CountQuestion = QuizQuestion & {
  // Identifiants Ecobalyse des catégories (moyenne s'il y en a plusieurs).
  categories: string[];
};

const count = (label: string, value: number): Option => ({ label, value: String(value) });
const FEW = [count('Aucun', 0), count('1 ou 2', 1.5), count('3 à 5', 4), count('6 ou plus', 7)];

const COUNT_QUESTIONS: CountQuestion[] = [
  {
    id: 'tshirt',
    question: 'Combien de t-shirts et polos achetez-vous par an ?',
    hint: 'Neufs ou d’occasion, sur une année habituelle.',
    categories: ['tshirt'],
    options: [count('Aucun', 0), count('1 à 3', 2), count('4 à 8', 6), count('9 ou plus', 12)],
  },
  { id: 'pull', question: 'Et de pulls ou sweats ?', categories: ['pull'], options: FEW },
  { id: 'jean', question: 'De jeans ?', categories: ['jean'], options: FEW },
  { id: 'pantalon', question: 'D’autres pantalons ou shorts ?', categories: ['pantalon'], options: FEW },
  { id: 'chemise', question: 'De chemises ou chemisiers ?', categories: ['chemise'], options: FEW },
  { id: 'robe', question: 'De robes ou jupes ?', categories: ['jupe'], options: FEW },
  {
    id: 'manteau',
    question: 'De manteaux ou vestes ?',
    categories: ['manteau'],
    options: [count('Aucun', 0), count('1', 1), count('2', 2), count('3 ou plus', 3.5)],
  },
  {
    id: 'dessous',
    question: 'De sous-vêtements et paires de chaussettes ?',
    categories: ['slip', 'chaussettes'],
    options: [count('Moins de 5', 3), count('5 à 15', 10), count('16 à 30', 22), count('Plus de 30', 35)],
  },
];

// ---------------------------------------------------------------------------------------------
// Habitudes d'achat : les mêmes paramètres que le calcul d'un vêtement

const MATERIALS: Record<string, { label: string; materials: EstimateInput['materials'] }> = {
  // Matière déduite du type de marque (UNKNOWN_MATERIALS) : la plupart des gens ne la connaissent pas.
  inconnu: { label: 'Je ne sais pas', materials: [] },
  coton: { label: 'Coton', materials: [{ id: 'ei-coton', share: 1 }] },
  'coton-bio': { label: 'Coton bio', materials: [{ id: 'ei-coton-organic', share: 1 }] },
  polyester: { label: 'Polyester', materials: [{ id: 'ei-pet', share: 1 }] },
  'polyester-recycle': { label: 'Polyester recyclé', materials: [{ id: 'ei-pet-r', share: 1 }] },
  mix: {
    label: 'Mélange coton et polyester',
    materials: [
      { id: 'ei-coton', share: 0.5 },
      { id: 'ei-pet', share: 0.5 },
    ],
  },
  laine: { label: 'Laine', materials: [{ id: 'ei-laine-par-defaut', share: 1 }] },
  lin: { label: 'Lin', materials: [{ id: 'ei-lin', share: 1 }] },
  viscose: { label: 'Viscose ou lyocell', materials: [{ id: 'ei-viscose', share: 1 }] },
};

// Pays appliqué au tissage, à la teinture et à la confection. « --- » : inconnu pour la méthode,
// qui applique alors ses valeurs par défaut.
const COUNTRIES: Record<string, { label: string; code: string }> = {
  chine: { label: 'Chine', code: 'CN' },
  bangladesh: { label: 'Bangladesh', code: 'BD' },
  inde: { label: 'Inde', code: 'IN' },
  turquie: { label: 'Turquie', code: 'TR' },
  maghreb: { label: 'Maroc ou Tunisie', code: 'MA' },
  europe: { label: 'Europe (Portugal, Italie…)', code: 'REO' },
  france: { label: 'France', code: 'FR' },
  inconnu: { label: 'Je ne sais pas', code: '---' },
};

// Le type de marque entre dans le coefficient de durabilité : taille de l'entreprise, service de
// réparation, nombre de références au catalogue et prix. Ces profils sont des hypothèses de
// l'équipe, à présenter comme telles : priceFactor multiplie les prix de REFERENCE_PRICES.
type BrandProfile = {
  label: string;
  business: NonNullable<EstimateInput['business']>;
  numberOfReferences: number;
  priceFactor: number;
};

const BRANDS: Record<string, BrandProfile> = {
  ultra: {
    label: 'Sites d’ultra fast-fashion à tout petits prix',
    business: 'large-business-without-services',
    numberOfReferences: 100_000,
    priceFactor: 0.4,
  },
  enseigne: {
    label: 'Grandes enseignes de prêt-à-porter',
    business: 'large-business-without-services',
    numberOfReferences: 20_000,
    priceFactor: 1,
  },
  petite: {
    label: 'Petites marques ou créateurs',
    business: 'small-business',
    numberOfReferences: 300,
    priceFactor: 2.3,
  },
  reparation: {
    label: 'Marques qui proposent la réparation',
    business: 'large-business-with-services',
    numberOfReferences: 3_000,
    priceFactor: 2.5,
  },
};

// Matière supposée quand l'utilisateur ne la connaît pas, d'après les vêtements types publiés par
// Ecobalyse (data/textile/examples.json, version 7.0.0) : t-shirt « ultra fast fashion » en
// polyester, « fast fashion » en coton dont un quart recyclé, « traditionnel » en coton. Le profil
// « éthique » (lin, coton bio) n'est pas utilisé : rien ne garantit qu'une petite marque l'applique.
const UNKNOWN_MATERIALS: Record<string, { label: string; materials: EstimateInput['materials'] }> = {
  ultra: {
    label: 'du polyester, typique de l’ultra fast-fashion',
    materials: [
      { id: 'ei-pet', share: 0.95 },
      { id: 'ei-pp', share: 0.05 },
    ],
  },
  enseigne: {
    label: 'du coton, dont un quart recyclé, typique des grandes enseignes',
    materials: [
      { id: 'ei-coton', share: 0.75 },
      { id: 'coton-rdp', share: 0.25 },
    ],
  },
  petite: { label: 'du coton', materials: [{ id: 'ei-coton', share: 1 }] },
  reparation: { label: 'du coton', materials: [{ id: 'ei-coton', share: 1 }] },
};

const materialsFor = ({ material, brand }: Profile) =>
  material === 'inconnu' ? UNKNOWN_MATERIALS[brand].materials : MATERIALS[material].materials;

// Prix courants en grande enseigne, en euros (hypothèses de l'équipe).
const REFERENCE_PRICES: Record<string, number> = {
  tshirt: 15,
  pull: 35,
  jean: 40,
  pantalon: 35,
  chemise: 30,
  jupe: 35,
  manteau: 80,
  slip: 10,
  chaussettes: 5,
};

const toOptions = (map: Record<string, { label: string }>): Option[] =>
  Object.entries(map).map(([value, { label }]) => ({ label, value }));

const SECOND_HAND = [
  { label: 'Aucune', value: '0' },
  { label: 'Quelques-uns', value: '0.25' },
  { label: 'La moitié', value: '0.5' },
  { label: 'La plupart', value: '0.75' },
];

export const QUESTIONS: QuizQuestion[] = [
  ...COUNT_QUESTIONS,
  // Le type de marque avant la matière : il sert à la déduire quand elle est inconnue.
  { id: 'marque', question: 'Où achetez-vous le plus souvent vos vêtements ?', options: toOptions(BRANDS) },
  {
    id: 'matiere',
    question: 'Dans quelle matière sont la plupart de vos vêtements ?',
    hint: 'On ne le sait pas toujours : dans ce cas, nous partons des vêtements types de la méthode officielle.',
    options: toOptions(MATERIALS),
  },
  { id: 'pays', question: 'Où sont fabriqués la plupart de vos vêtements ?', options: toOptions(COUNTRIES) },
  { id: 'occasion', question: 'Quelle part de vos vêtements achetez-vous d’occasion ?', options: SECOND_HAND },
];

// ---------------------------------------------------------------------------------------------
// Calcul

type Profile = { material: string; country: string; brand: string };

export type Lever = { id: 'marque' | 'matiere' | 'pays' | 'occasion'; label: string; gain: number };

export type QuizResult = {
  // Version du format : un résultat d'une version précédente n'est pas réaffiché.
  version: 3;
  // Vêtements achetés neufs en un an.
  newPieces: number;
  // Matière supposée si l'utilisateur ne la connaissait pas (« du polyester, typique de… »).
  assumedMaterial: string | null;
  // Coût environnemental de ces vêtements neufs, en points.
  cost: number;
  // Question dont les achats pèsent le plus dans le coût, et sa part en %.
  biggest: { id: string; share: number } | null;
  // Changements possibles, du plus efficace au moins efficace, avec la baisse du coût en %.
  levers: Lever[];
  completedAt: string;
};

// Cibles proposées pour chaque levier, et réponses qui les rendent sans objet.
const BETTER_BRAND = 'petite';
const BETTER_MATERIAL = 'coton-bio';
const BETTER_COUNTRY = 'europe';
const SECOND_HAND_TARGET = 0.5;
// En dessous de 3 % de baisse, un levier n'est pas proposé.
const MIN_GAIN = 3;

const massKg = (categoryId: string) =>
  (allCategories.find((category) => category.id === categoryId)?.defaultMassGrams ?? 300) / 1000;

// Coût d'un vêtement de la catégorie, à la masse médiane du portail, pour un profil d'achat.
function itemCost(categoryId: string, profile: Profile): Promise<number> {
  const countryCode = COUNTRIES[profile.country].code;
  const brandProfile = BRANDS[profile.brand];
  return estimateCost({
    product: categoryId,
    massKg: massKg(categoryId),
    materials: materialsFor(profile),
    countryMaking: countryCode,
    countryFabric: countryCode,
    countryDyeing: countryCode,
    business: brandProfile.business,
    numberOfReferences: brandProfile.numberOfReferences,
    priceEuros: REFERENCE_PRICES[categoryId] * brandProfile.priceFactor,
  });
}

// Lance les appels au calculateur quelques-uns à la fois, pour ménager l'API publique.
async function runLimited<T>(tasks: (() => Promise<T>)[], limit = 4): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let next = 0;
  const worker = async () => {
    while (next < tasks.length) {
      const index = next++;
      results[index] = await tasks[index]();
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));
  return results;
}

// Coût annuel par question de quantité, pour un profil. counts : vêtements neufs par question.
async function annualCosts(counts: Record<string, number>, profile: Profile): Promise<Record<string, number>> {
  const asked = COUNT_QUESTIONS.filter((question) => counts[question.id] > 0);
  const pairs = asked.flatMap((question) => question.categories.map((categoryId) => ({ question, categoryId })));
  const costs = await runLimited(pairs.map(({ categoryId }) => () => itemCost(categoryId, profile)));

  const byQuestion: Record<string, number> = {};
  pairs.forEach(({ question }, index) => {
    // Plusieurs catégories pour une question : on prend la moyenne de leurs coûts.
    const share = costs[index] / question.categories.length;
    byQuestion[question.id] = (byQuestion[question.id] ?? 0) + share * counts[question.id];
  });
  return byQuestion;
}

const sum = (values: Record<string, number>) => Object.values(values).reduce((total, value) => total + value, 0);
const gainPercent = (before: number, after: number) => (before > 0 ? Math.round((1 - after / before) * 100) : 0);

// answers : valeur de l'option choisie pour chaque question, par identifiant.
export async function computeResult(answers: Record<string, string>): Promise<QuizResult> {
  const secondHandShare = Number(answers.occasion ?? 0);
  // Un vêtement d'occasion ne demande pas de nouvelle production : seuls les neufs comptent.
  const counts = Object.fromEntries(
    COUNT_QUESTIONS.map((question) => [question.id, Number(answers[question.id] ?? 0) * (1 - secondHandShare)]),
  );
  const profile: Profile = { material: answers.matiere, country: answers.pays, brand: answers.marque };

  const alternatives: { id: Lever['id']; label: string; profile: Profile }[] = [];
  if (!['petite', 'reparation'].includes(profile.brand)) {
    alternatives.push({
      id: 'marque',
      label: 'Acheter auprès de petites marques ou de marques qui réparent',
      profile: { ...profile, brand: BETTER_BRAND },
    });
  }
  if (profile.material !== BETTER_MATERIAL) {
    alternatives.push({
      id: 'matiere',
      label: 'Choisir du coton bio',
      profile: { ...profile, material: BETTER_MATERIAL },
    });
  }
  if (!['europe', 'france'].includes(profile.country)) {
    alternatives.push({
      id: 'pays',
      label: 'Choisir des vêtements fabriqués en Europe',
      profile: { ...profile, country: BETTER_COUNTRY },
    });
  }

  const [current, ...alternativeCosts] = await Promise.all([
    annualCosts(counts, profile),
    ...alternatives.map((alternative) => annualCosts(counts, alternative.profile)),
  ]);
  const cost = sum(current);

  const levers: Lever[] = alternatives.map((alternative, index) => ({
    id: alternative.id,
    label: alternative.label,
    gain: gainPercent(cost, sum(alternativeCosts[index])),
  }));
  if (secondHandShare < SECOND_HAND_TARGET) {
    // L'impact est proportionnel à la part de neuf.
    levers.push({
      id: 'occasion',
      label: 'Acheter la moitié de vos vêtements d’occasion',
      gain: gainPercent(1 - secondHandShare, 1 - SECOND_HAND_TARGET),
    });
  }

  const biggestId = Object.keys(current).sort((a, b) => current[b] - current[a])[0];

  return {
    version: 3,
    newPieces: Math.round(sum(counts)),
    assumedMaterial: profile.material === 'inconnu' ? UNKNOWN_MATERIALS[profile.brand].label : null,
    cost,
    biggest: biggestId && cost > 0 ? { id: biggestId, share: Math.round((current[biggestId] / cost) * 100) } : null,
    levers: levers.filter((lever) => lever.gain >= MIN_GAIN).sort((a, b) => b.gain - a.gain),
    completedAt: new Date().toISOString(),
  };
}

// Un résultat enregistré avec un format précédent du quiz n'est pas réutilisable.
export function isCurrentResult(result: QuizResult | null | undefined): result is QuizResult {
  return result?.version === 3;
}

// Nom court de chaque catégorie de question, pour le résultat (« vos jeans »).
export const QUESTION_SUBJECTS: Record<string, string> = {
  tshirt: 'vos t-shirts et polos',
  pull: 'vos pulls et sweats',
  jean: 'vos jeans',
  pantalon: 'vos pantalons et shorts',
  chemise: 'vos chemises',
  robe: 'vos robes et jupes',
  manteau: 'vos manteaux et vestes',
  dessous: 'vos sous-vêtements et chaussettes',
};
