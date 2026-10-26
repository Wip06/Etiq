// Résume la base téléchargée par download.mjs dans src/data/generated/portal-stats.json,
// un fichier léger que l'app peut embarquer : moyennes par catégorie, alternatives les moins
// coûteuses par catégorie et nombre de références déclarées par marque.
//
// Usage : npm run data:stats (après npm run data:download)

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const PAGES_DIR = path.resolve(import.meta.dirname, '../../data/portal/pages');
const OUT_FILE = path.resolve(import.meta.dirname, '../../src/data/generated/portal-stats.json');
// Une catégorie mélange tailles bébé et adulte : on la découpe en tranches de masse, et chaque
// tranche garde ses propres alternatives, pour proposer un vêtement de poids proche.
const MASS_BANDS = 6;
const ALTERNATIVES_PER_BAND = 10;
// Pour que les alternatives ne viennent pas toutes de la même marque.
const MAX_ALTERNATIVES_PER_BRAND = 2;

const massGrams = (ref) => (ref.cost / ref.per100g) * 100;

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

function median(values) {
  return quantile(
    values.filter((value) => typeof value === 'number').sort((a, b) => a - b),
    0.5,
  );
}

const roundTo = (value, decimals) => (value === null ? null : Math.round(value * 10 ** decimals) / 10 ** decimals);

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
    const alternatives = [];
    const byMass = inCategory.filter((ref) => ref.per100g > 0).sort((a, b) => massGrams(a) - massGrams(b));
    for (let band = 0; band < MASS_BANDS; band++) {
      const inBand = byMass.slice(
        Math.floor((band * byMass.length) / MASS_BANDS),
        Math.floor(((band + 1) * byMass.length) / MASS_BANDS),
      );
      // Les moins coûteuses à poids égal (points pour 100 g), comme la comparaison de la fiche produit.
      const perBrand = new Map();
      let kept = 0;
      for (const ref of inBand.sort((a, b) => a.per100g - b.per100g)) {
        const count = perBrand.get(ref.brand) ?? 0;
        if (count >= MAX_ALTERNATIVES_PER_BRAND) continue;
        perBrand.set(ref.brand, count + 1);
        alternatives.push({
          gtin: ref.gtin,
          reference: ref.reference,
          brand: ref.brand,
          cost: Math.round(ref.cost),
          per100g: Math.round(ref.per100g),
          massGrams: Math.round(massGrams(ref)),
          water: typeof ref.water === 'number' ? Math.round(ref.water * 1000) / 1000 : null,
        });
        if (++kept === ALTERNATIVES_PER_BAND) break;
      }
    }
    categories[name] = {
      references: inCategory.length,
      cost: summarize(inCategory.map((ref) => ref.cost)),
      per100g: summarize(inCategory.map((ref) => ref.per100g)),
      per100gQuantiles: quantiles(inCategory.map((ref) => ref.per100g)),
      // Eau (m³ éq) et climat (kg CO₂e) d'un vêtement médian de la catégorie, pour le quiz.
      waterMedian: roundTo(median(inCategory.map((ref) => ref.water)), 3),
      climateMedian: roundTo(median(inCategory.map((ref) => ref.climate)), 2),
      // Masse déduite du coût total et du coût pour 100 g. Sert de masse par défaut quand
      // l'utilisateur ne connaît pas celle de son vêtement.
      medianMassGrams: summarize(inCategory.map(massGrams)).median,
      alternatives,
    };
  }

  const brands = {};
  const durabilities = {};
  for (const ref of refs) {
    const brand = (brands[ref.brand] ??= { references: 0, gtins: 0, belowMedian: 0, categories: {} });
    brand.references++;
    brand.gtins += ref.gtins;
    brand.categories[ref.category] = (brand.categories[ref.category] ?? 0) + 1;
    // Moins coûteuse que la médiane de sa catégorie, à poids égal (points pour 100 g).
    if (ref.per100g < categories[ref.category]?.per100g.median) brand.belowMedian++;
    (durabilities[ref.brand] ??= []).push(ref.durability);
  }
  // Part des références de la marque sous la médiane de leur catégorie, en %, et durabilité médiane.
  // Attention : uniquement sur les produits que la marque a choisi de déclarer.
  for (const [name, brand] of Object.entries(brands)) {
    brand.belowMedianShare = Math.round((brand.belowMedian / brand.references) * 100);
    brand.durabilityMedian = roundTo(median(durabilities[name]), 2);
    delete brand.belowMedian;
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
