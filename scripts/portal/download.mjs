// Télécharge tous les produits publics du portail de l'affichage environnemental
// (Licence Ouverte) dans data/portal/pages/, une page de 500 codes-barres par fichier.
// Le script reprend là où il s'est arrêté : les pages déjà présentes ne sont pas retéléchargées.
//
// Usage : npm run data:download

import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const API = 'https://affichage-environnemental.ecobalyse.beta.gouv.fr/api/produits/tous';
const PAGE_SIZE = 500;
// Peu d'appels simultanés : c'est une API publique de l'État, on reste raisonnable.
const CONCURRENCY = 3;
const RETRIES = 4;
const OUT_DIR = path.resolve(import.meta.dirname, '../../data/portal/pages');

async function fetchPage(page) {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(`${API}?page=${page}&size=${PAGE_SIZE}`, {
        signal: AbortSignal.timeout(120_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt >= RETRIES) throw new Error(`page ${page} : ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 2_000 * 2 ** attempt));
    }
  }
}

// On ne garde que les champs utiles, pour diviser la taille sur disque par cinq environ.
function compact(item) {
  const score = item.score ?? {};
  return {
    gtin: item.gtin,
    reference: item.internalReference,
    brand: item.brand?.name ?? null,
    category: item.category,
    createdAt: item.createdAt,
    cost: score.score,
    per100g: score.standardized,
    durability: score.durability,
    // Utilisation de ressources en eau, en m³ éq (étapes matières et filature seulement).
    water: score.wtu,
    // Changement climatique, en kg CO₂e.
    climate: score.cch,
    declaredBy: item.upload?.createdBy?.organization?.name ?? null,
    method: item.upload?.version ?? null,
  };
}

const pageFile = (page) => path.join(OUT_DIR, `page-${String(page).padStart(5, '0')}.json`);

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const first = await fetchPage(0);
  const { total, totalPages } = first.pagination;
  console.log(`${total} codes-barres sur ${totalPages} pages.`);

  const done = new Set(await readdir(OUT_DIR));
  const todo = [];
  for (let page = 0; page < totalPages; page++) {
    if (!done.has(path.basename(pageFile(page)))) todo.push(page);
  }
  if (!done.has(path.basename(pageFile(0)))) {
    await writeFile(pageFile(0), JSON.stringify(first.data.map(compact)));
    todo.shift();
  }
  console.log(`${todo.length} pages à télécharger.`);

  let finished = 0;
  const failed = [];
  async function worker() {
    while (todo.length > 0) {
      const page = todo.shift();
      try {
        const { data } = await fetchPage(page);
        await writeFile(pageFile(page), JSON.stringify(data.map(compact)));
      } catch (error) {
        failed.push(page);
        console.error(error.message);
      }
      finished++;
      if (finished % 50 === 0) console.log(`${finished} pages faites`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  if (failed.length > 0) {
    console.error(`${failed.length} pages en échec : relancez le script pour les reprendre.`);
    process.exitCode = 1;
  } else {
    console.log('Téléchargement terminé.');
  }
}

await main();
