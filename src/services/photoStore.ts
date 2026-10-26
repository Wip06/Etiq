// Photos prises par le scanner, transmises à l'écran « Étiquette » par un simple numéro plutôt que
// par l'URL : expo-router décode les paramètres de route, ce qui abîme les chemins de fichiers
// d'Android (« %40anonymous%2Fetiq » y devient « @anonymous/etiq », un dossier qui n'existe pas).

export type Photo = { uri: string; width: number; height: number };

const photos = new Map<string, Photo>();
let lastId = 0;

export function storePhoto(photo: Photo): string {
  const id = String(++lastId);
  photos.set(id, photo);
  return id;
}

export function getPhoto(id: string | undefined): Photo | undefined {
  return id ? photos.get(id) : undefined;
}
