// Ignore les accents et la casse pour la recherche : « sezane » trouve « Sézane ».
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
