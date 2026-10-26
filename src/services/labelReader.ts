// Lecture d'une étiquette de composition par notre fonction Supabase (supabase/functions/read-label),
// qui interroge Gemini (offre gratuite de l'API de Google). L'adresse et la clé publique viennent de
// .env.local (voir .env.example).

export type LabelMaterial = {
  // La matière telle qu'écrite sur l'étiquette.
  text: string;
  // Identifiant Ecobalyse, ou « autre » si la méthode n'a pas d'équivalent.
  id: string;
  percent: number;
};

export type Label = {
  readable: boolean;
  materials: LabelMaterial[];
  // Code pays ou région Ecobalyse, « --- » si inconnu.
  countryOfMaking: string;
  countryText: string;
  notes: string;
};

// Sans barre oblique finale, pour ne pas construire « …supabase.co//functions ».
const URL = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, '');
const KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY?.trim();
// En offre gratuite, Gemini est parfois saturé et la fonction essaie plusieurs modèles : on laisse du
// temps, mais pas indéfiniment.
const TIMEOUT_MS = 60_000;

export class LabelReaderError extends Error {}

// image : photo JPEG encodée en Base64.
export async function readLabel(image: string): Promise<Label> {
  if (!URL || !KEY) {
    throw new LabelReaderError(
      'La lecture d’étiquette n’est pas configurée : ajoutez .env.local puis relancez Expo avec « npx expo start -c ».',
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(`${URL}/functions/v1/read-label`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: KEY },
      body: JSON.stringify({ image }),
      signal: controller.signal,
    });
  } catch {
    throw new LabelReaderError(
      controller.signal.aborted
        ? 'La lecture prend trop de temps : le service est sans doute saturé. Réessayez dans un instant.'
        : 'Impossible de joindre le service de lecture. Vérifiez votre connexion.',
    );
  } finally {
    clearTimeout(timer);
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    // En développement, le détail technique aide à comprendre l'échec.
    const detail = __DEV__ && body?.detail ? `\n\n${body.detail}` : '';
    throw new LabelReaderError(`${body?.error ?? `Service de lecture indisponible (${response.status}).`}${detail}`);
  }
  return body as Label;
}
