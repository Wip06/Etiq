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

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export class LabelReaderError extends Error {}

// image : photo JPEG encodée en Base64.
export async function readLabel(image: string): Promise<Label> {
  if (!URL || !KEY) throw new LabelReaderError('La lecture d’étiquette n’est pas encore configurée.');

  const response = await fetch(`${URL}/functions/v1/read-label`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: KEY },
    body: JSON.stringify({ image }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new LabelReaderError(body?.error ?? `Service de lecture indisponible (${response.status}).`);
  }
  return body as Label;
}
