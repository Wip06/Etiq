// « Ma situation » : questions facultatives sur la situation personnelle et les achats, pour comprendre la consommation de vêtements des
// utilisateurs. Elles peuvent alimenter des études partagées avec des partenaires (modèle économique
// B2B), mais seulement avec l'accord explicite de la personne, et sous forme anonyme et regroupée.
// Minimisation (RGPD) : des tranches plutôt que des valeurs exactes, et rien de sensible.

import { BUDGETS } from '@/data/goals';

export type HabitQuestionId =
  | 'age'
  | 'department'
  | 'occupation'
  | 'profession'
  | 'place'
  | 'budget'
  | 'frequency'
  | 'channels';

export type HabitQuestion = {
  id: HabitQuestionId;
  question: string;
  multiple?: boolean;
  // Question posée seulement après cette réponse à une autre question.
  showIf?: { question: HabitQuestionId; answer: string };
  options: { id: string; label: string }[];
};

// Réponse « Je préfère ne pas répondre », proposée partout.
export const NO_ANSWER = 'na';
const noAnswer = { id: NO_ANSWER, label: 'Je préfère ne pas répondre' };
export const MINOR = 'under18';
export const WORKING = 'working';

export const HABIT_QUESTIONS: HabitQuestion[] = [
  {
    id: 'age',
    question: 'Votre âge',
    options: [
      { id: MINOR, label: 'Moins de 18 ans' },
      { id: '18-24', label: '18 à 24 ans' },
      { id: '25-34', label: '25 à 34 ans' },
      { id: '35-44', label: '35 à 44 ans' },
      { id: '45+', label: '45 ans et plus' },
      noAnswer,
    ],
  },
  {
    id: 'department',
    question: 'Le rayon où vous achetez le plus',
    options: [
      { id: 'femme', label: 'Femme' },
      { id: 'homme', label: 'Homme' },
      { id: 'both', label: 'Les deux' },
      noAnswer,
    ],
  },
  {
    id: 'occupation',
    question: 'Votre situation',
    options: [
      { id: 'student', label: 'Étudiant ou étudiante' },
      { id: WORKING, label: 'En activité' },
      { id: 'job-seeker', label: 'En recherche d’emploi' },
      { id: 'retired', label: 'Retraité ou retraitée' },
      { id: 'inactive', label: 'Sans activité professionnelle' },
      noAnswer,
    ],
  },
  {
    // Inspirée des catégories socioprofessionnelles de l'Insee, avec les professions libérales à part.
    id: 'profession',
    question: 'Votre profession',
    showIf: { question: 'occupation', answer: WORKING },
    options: [
      { id: 'employee', label: 'Employé ou employée' },
      { id: 'worker', label: 'Ouvrier ou ouvrière' },
      { id: 'intermediate', label: 'Profession intermédiaire (technicien, agent de maîtrise…)' },
      { id: 'manager', label: 'Cadre' },
      { id: 'senior-manager', label: 'Cadre supérieur ou dirigeant' },
      { id: 'liberal', label: 'Profession libérale' },
      { id: 'business-owner', label: 'Artisan, commerçant ou chef d’entreprise' },
      { id: 'farmer', label: 'Agriculteur ou agricultrice' },
      { id: 'other', label: 'Autre' },
      noAnswer,
    ],
  },
  {
    id: 'place',
    question: 'Où vous vivez',
    options: [
      { id: 'big-city', label: 'Une grande ville' },
      { id: 'medium-city', label: 'Une ville moyenne' },
      { id: 'small-town', label: 'Une petite ville ou à la campagne' },
      noAnswer,
    ],
  },
  {
    id: 'budget',
    question: 'Votre budget vêtements, par mois',
    options: [
      // Mêmes tranches qu'à l'onboarding.
      ...BUDGETS.map(({ id, label }) => ({ id, label })),
      noAnswer,
    ],
  },
  {
    id: 'frequency',
    question: 'Vous achetez des vêtements',
    options: [
      { id: 'monthly-plus', label: 'Plusieurs fois par mois' },
      { id: 'monthly', label: 'Environ une fois par mois' },
      { id: 'few-yearly', label: 'Quelques fois par an' },
      { id: 'rarely', label: 'Rarement' },
      noAnswer,
    ],
  },
  {
    id: 'channels',
    question: 'Où vous les achetez',
    multiple: true,
    options: [
      { id: 'stores', label: 'En magasin' },
      { id: 'brand-sites', label: 'Sur les sites des marques' },
      { id: 'marketplaces', label: 'Sur des sites multimarques' },
      { id: 'ultra-fast', label: 'Sur des sites d’ultra fast-fashion' },
      { id: 'second-hand', label: 'D’occasion (Vinted, friperies…)' },
      noAnswer,
    ],
  },
];

// Accord de partage, gardé avec sa date et la version du texte accepté (preuve du consentement).
export const SHARING_CONSENT_VERSION = '2026-11-16';
export const SHARING_CONSENT_TEXT =
  'J’accepte que mes réponses soient partagées avec des partenaires d’Etiq (marques, instituts d’études) pour des études sur la consommation de vêtements, uniquement anonymes et regroupées avec celles d’au moins 50 autres personnes. Je peux retirer mon accord à tout moment.';
// Taille minimale d'un groupe dans une étude partagée : en dessous, une personne pourrait être reconnue.
export const MIN_GROUP_SIZE = 50;

export type Habits = {
  answers: Partial<Record<HabitQuestionId, string[]>>;
  sharing: { granted: boolean; version: string; date: string } | null;
  updatedAt: string;
};

// Une question conditionnelle n'est posée que si la réponse attendue est choisie.
export const isAsked = (question: HabitQuestion, answers: Habits['answers']) =>
  !question.showIf || (answers[question.showIf.question] ?? []).includes(question.showIf.answer);

export const isMinor = (habits: Pick<Habits, 'answers'> | null | undefined) => habits?.answers.age?.includes(MINOR) ?? false;
