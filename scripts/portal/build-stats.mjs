// Résume la base téléchargée par download.mjs dans src/data/generated/portal-stats.json,
// un fichier léger que l'app peut embarquer : moyennes par catégorie, alternatives les moins
// coûteuses par catégorie et nombre de références déclarées par marque.
//
// Usage : npm run data:stats (après npm run data:download)

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const PAGES_DIR = path.resolve(import.meta.dirname, '../../data/portal/pages');
const OUT_FILE = path.resolve(import.meta.dirname, '../../src/data/generated/portal-stats.json');
const ALTERNATIVES_PER_CATEGORY = 20;
// Pour que les alternatives ne viennent pas toutes de la même marque.
const MAX_ALTERNATIVES_PER_BRAND = 2;

function quantile(sorted, q) {
  if (sorted.length === 0) return null;
  const position = (sorted.length - 1) * q;
  const below = Math.floor(position);
  const above = Math.ceil(position);
  return sorted[below] + (sorted[above] - sorted[below]) * (position - below);
}

// Seuils tous les 5 % (de 0 à 100 %), pour situer un vêtement dans sa catégorie depuis l'app.
function quantiles(values) {
  const sorted = values.filter((value) => typeof value === 'number').sort((a, b) => a - b);
  return Array.from({ length: 21 }, (_, index) => Math.round(quantile(sorted, index / 20) * 10) / 10);
}

function summarize(values) {
  const sorted = values.filter((value) => typeof value === 'number').sort((a, b) => a - b);
  const round = (value) => (value === null ? null : Math.round(value));
  return {
    p25: round(quantile(sorted, 0.25)),
    median: round(quantile(sorted, 0.5)),
    p75: round(quantile(sorted, 0.75)),
    mean: round(sorted.reduce((sum, value) => sum + value, 0) / (sorted.length || 1)),
  };
}

async function loadItems() {
  const files = (await readdir(PAGES_DIR)).filter((file) => file.endsWith('.json')).sort();
  const items = [];
  for (const file of files) items.push(...JSON.parse(await readFile(path.join(PAGES_DIR, file), 'utf8')));
  return { items, pages: files.length };
}

async function main() {
  const { items, pages } = await loadItems();

  // Un même code-barres peut apparaître deux fois si la base a bougé pendant le téléchargement.
  const byGtin = new Map();
  for (const item of items) {
    if (typeof item.cost !== 'number') continue;
    const known = byGtin.get(item.gtin);
    if (!known || item.createdAt > known.createdAt) byGtin.set(item.gtin, item);
  }

  // Une référence (même produit, toutes tailles et tous codes-barres confondus) = marque + référence interne.
  const references = new Map();
  for (const item of byGtin.values()) {
    const key = `${item.brand}\u0000${item.reference}`;
    const known = references.get(key);
    if (!known) references.set(key, { ...item, gtins: 1 });
    else {
      known.gtins++;
      if (item.createdAt > known.createdAt) Object.assign(known, { ...item, gtins: known.gtins });
    }
  }
  const refs = [...references.values()];

  const categories = {};
  for (const name of [...new Set(refs.map((ref) => ref.category))].sort()) {
    const inCategory = refs.filter((ref) => ref.category === name);
    const perBrand = new Map();
    const alternatives = [];
    for (const ref of [...inCategory].sort((a, b) => a.cost - b.cost)) {
      const count = perBrand.get(ref.brand) ?? 0;
      if (count >= MAX_ALTERNATIVES_PER_BRAND) continue;
      perBrand.set(ref.brand, count + 1);
      alternatives.push({
        gtin: ref.gtin,
        reference: ref.reference,
        brand: ref.brand,
        cost: Math.round(ref.cost),
        per100g: Math.round(ref.per100g),
      });
      if (alternatives.length === ALTERNATIVES_PER_CATEGORY) break;
    }
    categories[name] = {
      references: inCategory.length,
      cost: summarize(inCategory.map((ref) => ref.cost)),
      per100g: summarize(inCategory.map((ref) => ref.per100g)),
      per100gQuantiles: quantiles(inCategory.map((ref) => ref.per100g)),
      alternatives,
    };
  }

  const brands = {};
  for (const ref of refs) {
    const brand = (brands[ref.brand] ??= { references: 0, gtins: 0, categories: {} });
    brand.references++;
    brand.gtins += ref.gtins;
    brand.categories[ref.category] = (brand.categories[ref.category] ?? 0) + 1;
  }
  const sortedBrands = Object.fromEntries(
    Object.entries(brands).sort(([, a], [, b]) => b.references - a.references),
  );

  const stats = {
    source: 'Portail de l’affichage environnemental (Licence Ouverte)',
    latestDeclaration: items.reduce((latest, item) => (item.createdAt > latest ? item.createdAt : latest), ''),
    generatedAt: new Date().toISOString(),
    pages,
    gtins: byGtin.size,
    references: refs.length,
    brands: Object.keys(brands).length,
    categories,
    brandsByReferences: sortedBrands,
  };

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(stats, null, 2)}\n`);
  console.log(`${stats.gtins} codes-barres, ${stats.references} références, ${stats.brands} marques → ${OUT_FILE}`);
}

await main();
