import AsyncStorage from '@react-native-async-storage/async-storage';

// Copie locale des réponses du portail officiel (fiches produits, étiquettes officielles), pour que
// l'app reste utilisable sans réseau sur les vêtements déjà consultés : salle de démo sans Wi-Fi,
// magasin sans réseau. Ce sont des données publiques, mais elles révèlent ce que l'utilisateur a
// consulté : elles sont effacées avec le compte.

const PREFIX = 'etiq.cache.';

// Au-delà, le réseau est jugé indisponible et l'app se rabat sur sa copie locale.
export const NETWORK_TIMEOUT_MS = 8_000;

type Entry<T> = { value: T; savedAt: string };

export async function readCache<T>(key: string): Promise<Entry<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as Entry<T>) : null;
  } catch {
    return null;
  }
}

export async function writeCache<T>(key: string, value: T): Promise<void> {
  const entry: Entry<T> = { value, savedAt: new Date().toISOString() };
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(entry)).catch(() => undefined);
}

export async function clearCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys.filter((key) => key.startsWith(PREFIX)));
  } catch {
    // Rien à faire : la copie locale n'est qu'un confort.
  }
}

// fetch qui abandonne au bout de NETWORK_TIMEOUT_MS, pour ne pas laisser l'écran attendre un réseau
// qui ne répond pas.
export async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
