// Fonction Supabase : lit la photo d'une étiquette de composition avec Gemini (offre gratuite de
// l'API de Google) et renvoie la composition et le pays de confection, déjà traduits dans les
// identifiants Ecobalyse. La clé d'API reste ici, côté serveur : elle n'est jamais dans l'app.
//
// Déploiement :
//   npx supabase secrets set GEMINI_API_KEY=...
//   npx supabase functions deploy read-label --no-verify-jwt

import { ApiError, GoogleGenAI, MediaResolution, ThinkingLevel } from '@google/genai';

// Modèles Gemini gratuits qui acceptent les images (ai.google.dev/gemini-api/docs/pricing), essayés
// dans l'ordre : en offre gratuite, un modèle peut être saturé, à court de quota ou fermé aux
// nouveaux comptes. Les Flash-Lite passent en premier : plus rapides et moins saturés, ils lisent
// aussi bien une étiquette. Le secret GEMINI_MODEL, s'il existe, est essayé en premier.
const MODELS = [
  ...(Deno.env.get('GEMINI_MODEL') ? [Deno.env.get('GEMINI_MODEL') as string] : []),
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.8-flash',
];
// Modèle introuvable, quota épuisé ou serveur saturé : on passe au modèle suivant.
const TRY_NEXT_MODEL = [404, 429, 500, 503];
// Au-delà, un modèle est considéré comme saturé : on passe au suivant plutôt que de l'attendre.
const MODEL_TIMEOUT_MS = 10_000;

// Matières et pays acceptés par Ecobalyse 7.0.0 (/textile/materials et /textile/countries).
const MATERIALS = [
  'elasthane',
  'ei-acrylique',
  'ei-jute-kenaf',
  'ei-pp',
  'ei-pet',
  'ei-pet-r',
  'ei-pa',
  'ei-lin',
  'ei-laine-par-defaut',
  'ei-laine-nouvelle-filiere',
  'ei-coton',
  'ei-coton-organic',
  'ei-chanvre',
  'ei-viscose',
  'coton-rdpc',
  'coton-rdp',
  // Matière sans équivalent : le vêtement ne peut pas être calculé si elle pèse 20 % ou plus.
  'autre',
];
const COUNTRIES = [
  '---',
  'REO',
  'REE',
  'RAS',
  'RAF',
  'RME',
  'RLA',
  'RNA',
  'ROC',
  'MM',
  'BD',
  'CN',
  'FR',
  'IN',
  'KH',
  'MA',
  'PK',
  'TN',
  'TR',
  'VN',
];

const SYSTEM = `Tu lis la photo d'une étiquette de composition cousue dans un vêtement, pour calculer son coût environnemental avec la méthode officielle française Ecobalyse.

Composition : relève chaque matière du tissu principal et son pourcentage. Si l'étiquette détaille plusieurs parties (doublure, bord-côte, garnissage), ne garde que le tissu principal et signale les autres dans "notes". Les étiquettes sont souvent multilingues : une même matière apparaît dans plusieurs langues, ne la compte qu'une fois.

Correspondance vers les identifiants Ecobalyse :
- coton → ei-coton ; coton biologique → ei-coton-organic ; coton recyclé → coton-rdp, ou coton-rdpc si l'étiquette précise des déchets post-consommation
- polyester → ei-pet ; polyester recyclé → ei-pet-r ; polyamide ou nylon → ei-pa ; acrylique → ei-acrylique ; polypropylène → ei-pp ; élasthanne (lycra, spandex) → elasthane
- lin → ei-lin ; chanvre → ei-chanvre ; jute → ei-jute-kenaf
- viscose, lyocell, modal, cupro → ei-viscose
- laine, cachemire, mohair, alpaga → ei-laine-par-defaut
- soie → ei-laine-par-defaut si elle fait moins de 20 % du vêtement, sinon → autre (la méthode ne sait pas calculer un vêtement surtout en soie)
- toute autre matière → autre

Pays de confection : la mention « Made in », « Fabriqué en » ou équivalent. Utilise le code du pays s'il est dans la liste (BD Bangladesh, KH Cambodge, CN Chine, FR France, IN Inde, MA Maroc, MM Myanmar, PK Pakistan, TN Tunisie, TR Turquie, VN Vietnam). Sinon, sa région : REO Europe de l'Ouest (Portugal, Italie, Espagne...), REE Europe de l'Est (Roumanie, Bulgarie, Pologne...), RAS Asie, RAF Afrique, RME Moyen-Orient, RLA Amérique latine, RNA Amérique du Nord, ROC Océanie. Pays absent ou illisible → ---.

Ne devine jamais : si l'image n'est pas une étiquette de composition ou si elle est illisible, mets readable à false et laisse les listes vides.`;

const SCHEMA = {
  type: 'object',
  properties: {
    readable: { type: 'boolean' },
    materials: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: { type: 'string', description: 'La matière telle qu’écrite sur l’étiquette' },
          id: { type: 'string', enum: MATERIALS },
          percent: { type: 'number' },
        },
        required: ['text', 'id', 'percent'],
        additionalProperties: false,
      },
    },
    countryOfMaking: { type: 'string', enum: COUNTRIES },
    countryText: { type: 'string', description: 'Le pays tel qu’écrit, ou une chaîne vide' },
    notes: { type: 'string', description: 'Autres parties du vêtement ou remarque, ou une chaîne vide' },
  },
  required: ['readable', 'materials', 'countryOfMaking', 'countryText', 'notes'],
  additionalProperties: false,
};

type Label = {
  readable: boolean;
  materials: { text: string; id: string; percent: number }[];
  countryOfMaking: string;
  countryText: string;
  notes: string;
};

// Une photo de téléphone redimensionnée par l'app fait quelques centaines de Ko.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

// Par défaut, le SDK réessaie jusqu'à 5 fois un modèle saturé, avec des attentes croissantes
// (jusqu'à plus d'une minute) : on préfère passer tout de suite au modèle suivant.
const client = new GoogleGenAI({
  apiKey: Deno.env.get('GEMINI_API_KEY') ?? '',
  httpOptions: { retryOptions: { attempts: 1 } },
});

function error(status: number, message: string) {
  return Response.json({ error: message }, { status });
}

// La clé publique de l'app limite les appels à l'app elle-même (elle n'est pas secrète :
// une limite de débit sera à ajouter avant une vraie mise en ligne).
function isAppRequest(req: Request): boolean {
  const key = req.headers.get('apikey');
  if (!key) return false;
  const publishable = Object.values(JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') ?? '{}'));
  return publishable.includes(key) || key === Deno.env.get('SUPABASE_ANON_KEY');
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return error(405, 'Méthode non autorisée');
  if (!isAppRequest(req)) return error(401, 'Clé de l’app manquante ou invalide');

  let image: string;
  try {
    ({ image } = await req.json());
  } catch {
    return error(400, 'Corps de requête invalide');
  }
  if (typeof image !== 'string' || image.length === 0) return error(400, 'Image manquante');
  if ((image.length * 3) / 4 > MAX_IMAGE_BYTES) return error(413, 'Image trop lourde');

  // Statut HTTP du dernier échec, ou « timeout » si le modèle n'a pas répondu à temps.
  let lastStatus: number | 'timeout' | null = null;
  let lastDetail = '';
  for (const model of MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [{ inlineData: { mimeType: 'image/jpeg', data: image } }, { text: 'Lis cette étiquette.' }],
          },
        ],
        config: {
          systemInstruction: SYSTEM,
          temperature: 0,
          responseMimeType: 'application/json',
          responseJsonSchema: SCHEMA,
          // Lire une étiquette ne demande pas de raisonnement : la réflexion du modèle ne fait que
          // ralentir la réponse. Une résolution moyenne suffit pour un texte imprimé gros.
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
          abortSignal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
        },
      });

      const text = response.text;
      if (!text) return error(502, 'Réponse vide');
      const label = JSON.parse(text) as Label;
      return Response.json({ ...label, model });
    } catch (caught) {
      // Le détail de Google part dans les logs Supabase et dans la réponse, pour le diagnostic.
      // Il ne contient jamais la clé.
      if (caught instanceof ApiError) {
        console.error('Gemini', model, caught.status, caught.message);
        lastStatus = caught.status;
        lastDetail = caught.message.slice(0, 300);
        if (!TRY_NEXT_MODEL.includes(caught.status)) break;
      } else if (caught instanceof DOMException && (caught.name === 'TimeoutError' || caught.name === 'AbortError')) {
        console.error('Gemini', model, `pas de réponse en ${MODEL_TIMEOUT_MS} ms`);
        lastStatus = 'timeout';
        lastDetail = `${model} : pas de réponse en ${MODEL_TIMEOUT_MS / 1000} s`;
      } else {
        console.error(caught);
        return error(500, 'Erreur inattendue');
      }
    }
  }

  if (lastStatus === 429 || lastStatus === 503 || lastStatus === 'timeout') {
    return Response.json(
      { error: 'Service de lecture saturé, réessayez dans un instant', detail: lastDetail },
      { status: 503 },
    );
  }
  return Response.json(
    { error: `Service de lecture indisponible (${lastStatus})`, detail: lastDetail },
    { status: 502 },
  );
});
