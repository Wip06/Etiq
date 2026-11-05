// Transforme les relevés de fiches produits (releves/*.txt) en données pour la recherche avec filtres
// de l'app (src/data/generated/surveyed-products.json). Seules les marques relevées sont gardées.
//
// Usage : npm run data:releves
// La part de synthétique et la confection en Europe suivent les mêmes règles que les moyennes des fiches
// marques (src/data/brands.ts) : `--check` affiche ces moyennes, à comparer.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const surveysDir = join(root, 'releves');
const output = join(root, 'src', 'data', 'generated', 'surveyed-products.json');
// Copie locale du portail (npm run data:download), pour retrouver les codes-barres relevés.
const portalPages = join(root, 'data', 'portal', 'pages');

const CATEGORIES = {
  'T-SHIRTS ET TOPS': 'T-shirts et tops',
  'PULLS ET MAILLE': 'Pulls et maille',
  'ROBES ET JUPES': 'Robes et jupes',
  'PANTALONS ET JEANS': 'Pantalons et jeans',
  'CHEMISES ET BLOUSES': 'Chemises et blouses',
  'MANTEAUX ET VESTES': 'Manteaux et vestes',
};

// Familles de fibres (comme dans src/data/brands.ts) : le reste (fibres métallisées, « autres fibres »)
// n'est compté ni synthétique ni naturel.
const SYNTHETIC = ['polyester', 'polyamide', 'nylon', 'elasthanne', 'elastane', 'spandex', 'acrylique', 'polypropylene', 'polyurethane', 'elastomultiester'];
const NATURAL = ['coton', 'lin', 'chanvre', 'laine', 'merinos', 'cachemire', 'mohair', 'alpaga', 'yack', 'soie', 'cuir', 'angora', 'ramie'];
const ARTIFICIAL = ['viscose', 'modal', 'lyocell', 'cupro', 'acetate'];

// Pays européens rencontrés dans les relevés (la Turquie et le Maghreb n'en font pas partie).
const EUROPE = ['portugal', 'bulgarie', 'italie', 'roumanie', 'france', 'espagne', 'pologne', 'grece', 'lituanie', 'macedoine du nord', 'albanie', 'serbie', 'bosnie', 'croatie', 'slovenie', 'hongrie', 'republique tcheque', 'slovaquie', 'belgique', 'allemagne', 'ukraine', 'moldavie'];

// Rayon des marques qui ne vendent qu'aux femmes ou qu'aux hommes. Pour une marque mixte, c'est la ligne
// « Rayon : » de chaque produit qui fait foi.
const BRAND_GENDER = {
  sezane: 'femme',
  sessun: 'femme',
  bash: 'femme',
  maje: 'femme',
  claudiepierlot: 'femme',
  promod: 'femme',
  etam: 'femme',
  jules: 'homme',
  // Marque mixte relevée avant l'ajout de la ligne « Rayon » : rayon femme d'après les produits relevés le
  // 26 oct. 2026 (robes, blouses, top à brassière intégrée). À confirmer par la personne qui l'a fait.
  uniqlo: 'femme',
};

function parseGender(text) {
  const value = normalize(text);
  if (value.startsWith('f')) return 'femme';
  if (value.startsWith('h')) return 'homme';
  if (value.startsWith('m') || value.startsWith('u')) return 'mixte';
  return null;
}

function genderOf(brand, url, declared) {
  if (declared) return declared;
  // Références Sandro du rayon femme : SFP… (ex. SFPPU02874).
  if (brand === 'sandro' && /\/SFP[A-Z]{2}\d/.test(url)) return 'femme';
  return BRAND_GENDER[brand] ?? null;
}

// Même pays, orthographes différentes selon les sites : une seule pour les filtres de l'app.
const COUNTRY_ALIASES = { 'viet nam': 'Vietnam', egypte: 'Égypte', 'etats-unis': 'États-Unis', usa: 'États-Unis' };
const countryName = (country) => COUNTRY_ALIASES[normalize(country)] ?? country;

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

const normalize = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

function family(material) {
  const name = normalize(material);
  if (SYNTHETIC.some((key) => name.includes(key))) return 'synthetic';
  if (ARTIFICIAL.some((key) => name.includes(key))) return 'artificial';
  if (NATURAL.some((key) => name.includes(key))) return 'natural';
  return 'other';
}

// « 94% Coton biologique, 6% Élasthanne » → parts. Les précisions sans pourcentage en tête
// (« *dont 20% de Polyamide recyclé ») sont ignorées.
function parseComposition(text) {
  const parts = [];
  for (const chunk of text.split(',')) {
    const match = chunk.trim().match(/^(\d+(?:[.,]\d+)?)\s*%\s*(.+)$/);
    if (!match) continue;
    const name = match[2].replace(/\*/g, '').trim();
    parts.push({ name, percent: Number(match[1].replace(',', '.')), family: family(name) });
  }
  return parts;
}

function share(parts, wanted) {
  const total = parts.reduce((sum, part) => sum + part.percent, 0);
  if (total === 0) return null;
  const value = parts.filter((part) => part.family === wanted).reduce((sum, part) => sum + part.percent, 0);
  return Math.round((value / total) * 100);
}

function parseDate(text) {
  const match = text.match(/(\d{1,2})\s+(\S+)\s+(\d{4})/);
  if (!match) return null;
  const month = MONTHS.indexOf(match[2].toLowerCase()) + 1;
  if (month === 0) return null;
  return `${match[3]}-${String(month).padStart(2, '0')}-${match[1].padStart(2, '0')}`;
}

function parseSurvey(file) {
  const brand = basename(file, '.txt');
  const lines = readFileSync(file, 'utf8').split('\n');
  const date = parseDate(lines.find((line) => line.startsWith('Date du relevé')) ?? '');
  const products = [];
  let category = null;
  let current = null;

  const field = (line, name) => (line.startsWith(name) ? line.slice(line.indexOf(':') + 1).trim() : null);
  const flush = () => {
    if (current && current.name && current.composition.length > 0) products.push(current);
    current = null;
  };

  for (const line of lines) {
    const header = line.match(/^=====\s*(.+?)\s*=====/);
    if (header) {
      flush();
      category = CATEGORIES[header[1]] ?? null;
      continue;
    }
    if (/^Produit \d+/.test(line)) {
      flush();
      if (category) current = { brand, category, name: '', url: '', gender: null, composition: [], countries: [], price: null, gtins: [] };
      continue;
    }
    if (!current) continue;

    const name = field(line, 'Nom');
    const url = field(line, 'Lien');
    const gender = field(line, 'Rayon');
    const composition = field(line, 'Composition');
    const madeIn = field(line, 'Fabriqué en');
    const price = field(line, 'Prix');
    const gtins = field(line, 'Code-barres');
    if (gtins !== null) current.gtins = gtins.split(',').map((gtin) => gtin.trim()).filter((gtin) => /^\d{8,14}$/.test(gtin));
    else if (name !== null) current.name = name;
    else if (url !== null) current.url = url;
    else if (gender !== null) current.gender = parseGender(gender);
    else if (composition !== null) current.composition = parseComposition(composition);
    else if (madeIn !== null) current.countries = madeIn.split(',').map((country) => countryName(country.trim())).filter(Boolean);
    else if (price !== null) {
      const match = price.replace(/\s/g, '').match(/(\d+(?:[.,]\d+)?)/);
      current.price = match ? Number(match[1].replace(',', '.')) : null;
    }
  }
  flush();

  return products.map((product, index) => ({
    id: `${brand}-${index + 1}`,
    brand: product.brand,
    category: product.category,
    gender: genderOf(product.brand, product.url, product.gender),
    name: product.name,
    url: product.url,
    composition: product.composition.map(({ name, percent }) => `${percent} % ${name}`).join(', '),
    syntheticShare: share(product.composition, 'synthetic'),
    naturalShare: share(product.composition, 'natural'),
    countries: product.countries,
    // Un produit fabriqué dans plusieurs pays n'est « en Europe » que s'ils y sont tous.
    europe: product.countries.length > 0 && product.countries.every((country) => EUROPE.includes(normalize(country))),
    price: product.price,
    gtins: product.gtins,
    date,
  }));
}

const surveyed = readdirSync(surveysDir)
  .filter((file) => file.endsWith('.txt'))
  .flatMap((file) => parseSurvey(join(surveysDir, file)));

// Code-barres déclaré sur le portail officiel : la fiche de l'app affichera son coût officiel.
const wanted = new Set(surveyed.flatMap((product) => product.gtins));
const declared = new Set();
if (wanted.size > 0 && existsSync(portalPages)) {
  for (const file of readdirSync(portalPages).filter((name) => name.endsWith('.json'))) {
    for (const item of JSON.parse(readFileSync(join(portalPages, file), 'utf8'))) {
      if (wanted.has(item.gtin)) declared.add(item.gtin);
    }
  }
} else if (wanted.size > 0) {
  console.warn('Copie du portail absente (npm run data:download) : codes-barres non rapprochés du portail.');
}
const products = surveyed.map(({ gtins, ...product }) => ({
  ...product,
  portalGtin: gtins.find((gtin) => declared.has(gtin)) ?? null,
}));
if (wanted.size > 0) {
  const withGtin = surveyed.filter((product) => product.gtins.length > 0).length;
  const matched = products.filter((product) => product.portalGtin).length;
  console.log(`${matched} produits déclarés sur le portail, sur ${withGtin} avec code-barres`);
}

if (process.argv.includes('--check')) {
  const byBrand = Object.groupBy(products, (product) => product.brand);
  for (const [brand, list] of Object.entries(byBrand)) {
    const mean = (values) => Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
    console.log(
      brand.padEnd(16),
      `${list.length} produits`,
      `synthétique ${mean(list.map((product) => product.syntheticShare ?? 0))} %`,
      `naturel ${mean(list.map((product) => product.naturalShare ?? 0))} %`,
      // Comme sur les fiches marques : sur les seuls produits dont le pays est indiqué.
      `Europe ${Math.round((list.filter((product) => product.europe).length / list.filter((product) => product.countries.length > 0).length) * 100)} %`,
      `rayon ${[...new Set(list.map((product) => product.gender ?? 'inconnu'))].join(', ')}`,
    );
  }
}

writeFileSync(
  output,
  `${JSON.stringify({ source: 'Relevés Etiq des fiches produits des marques (releves/)', generatedAt: new Date().toISOString(), products }, null, 1)}\n`,
);
console.log(`${products.length} produits écrits dans ${output}`);
