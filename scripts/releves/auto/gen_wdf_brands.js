// Génère le bloc des marques WeDressFair de src/data/brands.ts à partir du résumé du relevé complet
// (wdf-all-summary.json) et des produits générés par npm run data:releves.
// Usage : node gen_wdf_brands.js <wdf-all-summary.json> <racine du projet> > bloc.ts
const fs = require('fs');
const path = require('path');

const [summaryPath, root] = process.argv.slice(2);
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const products = JSON.parse(fs.readFileSync(path.join(root, 'src/data/generated/surveyed-products.json'), 'utf8')).products;
const portal = JSON.parse(fs.readFileSync(path.join(root, 'src/data/generated/portal-stats.json'), 'utf8')).brandsByReferences;
const plain = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const portalNames = Object.fromEntries(Object.keys(portal).map((key) => [plain(key), key]));

const KINDS = {
  colorfulstandard: 'Vêtements de base colorés', jannjune: 'Prêt-à-porter féminin', patagonia: 'Vêtements d’outdoor',
  skfk: 'Prêt-à-porter féminin', kingsofindigo: 'Jeans et prêt-à-porter', aboutcompanions: 'Prêt-à-porter masculin',
};
const TAGS = { patagonia: ['Outdoor'], kingsofindigo: ['Jean'] };
const COUNTRY_SOURCES = {
  skfk: { label: 'FashionUnited, SKFK (ex-Skunkfunk), marque basque', url: 'https://fashionunited.fr/actualite/mode/skunkfunk-devient-skfk-et-mise-sur-la-mode-ethique/2018101618990' },
  kingsofindigo: { label: 'FashionUnited, Kings of Indigo (Amsterdam)', url: 'https://fashionunited.uk/news/retail/kings-of-indigo-not-your-next-g-star-denim-label/2016031419777' },
};

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const list = (a) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} et ${a[a.length - 1]}`);
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
const median = (values) => {
  const v = values.filter((x) => x != null).sort((a, b) => a - b);
  if (v.length === 0) return null;
  return v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
};

const entries = [];
for (const [id, brand] of Object.entries(summary).sort((a, b) => a[1].name.localeCompare(b[1].name))) {
  const items = products.filter((p) => p.brand === id);
  if (items.length < 5) continue;
  const n = items.length;
  const mean = (key) => Math.round(items.reduce((sum, p) => sum + (p[key] ?? 0), 0) / n);
  const known = items.filter((p) => p.countries.length > 0);
  const europe = known.filter((p) => p.europe).length;
  const counts = {};
  items.forEach((p) => p.countries.forEach((c) => { counts[c] = (counts[c] ?? 0) + 1; }));
  const countries = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([c]) => c);
  const majority = items.filter((p) => (p.syntheticShare ?? 0) > 50).length;
  const declared = items.filter((p) => p.portalGtin).length;
  const genders = new Set(items.map((p) => p.gender));
  const rayons = [...(genders.has('homme') || genders.has('mixte') ? ['Homme'] : []), ...(genders.has('femme') || genders.has('mixte') ? ['Femme'] : [])];
  const country = brand.country ?? '';
  const portalName = portalNames[id];
  const wdf = brand.slug ? `https://www.wedressfair.fr/marques/${brand.slug}` : 'https://www.wedressfair.fr/';
  const extra = COUNTRY_SOURCES[id];
  const notes = [
    `${n} vêtements relevés automatiquement sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la marque, un exemplaire par modèle.`,
    majority === 0
      ? `${mean('syntheticShare')} % de fibres synthétiques en moyenne ; aucun vêtement majoritairement synthétique.`
      : `${mean('syntheticShare')} % de fibres synthétiques en moyenne ; ${plural(majority, 'vêtement')} sur ${n} majoritairement synthétique${majority > 1 ? 's' : ''}.`,
    known.length > 0
      ? `Confection : ${list(countries.slice(0, 6))}${countries.length > 6 ? '…' : ''} ; ${europe} vêtement${europe > 1 ? 's' : ''} sur ${known.length} en Europe.`
      : 'Pays de confection non indiqués.',
    declared > 0
      ? `${plural(declared, 'vêtement')} relevé${declared > 1 ? 's' : ''} sur ${n} ${declared > 1 ? 'sont déclarés' : 'est déclaré'} sur le portail officiel (code-barres) : la recherche avec filtres renvoie vers leur coût officiel.`
      : 'Aucun vêtement relevé n’est déclaré sur le portail officiel.',
    'Services de réparation et de seconde main non vérifiés.',
  ];
  const sources = [`{ label: 'Fiches produits sur WeDressFair', url: ${q(wdf)} }`];
  if (extra) sources.push(`{ label: ${q(extra.label)}, url: ${q(extra.url)} }`);
  entries.push(`  {
    id: ${q(id)},
    name: ${q(brand.name)},
    country: ${q(country)},
    description: \`${KINDS[id] ?? 'Prêt-à-porter'}. \${PENDING}\`,
    tags: [${[...(country ? [country] : []), ...(TAGS[id] ?? []), ...rayons].map(q).join(', ')}],
    sources: [{ label: 'Présentation sur WeDressFair', url: ${q(wdf)} }],${portalName ? `\n    portalName: ${q(portalName)},` : ''}
    // Relevé automatique complet sur WeDressFair le 6 nov. 2026. Détail produit par produit : releves/${id}.txt.
    survey: {
      date: '2026-11-06',
      method: 'catalogue',
      products: ${n},
      syntheticShare: ${mean('syntheticShare')},
      naturalShare: ${mean('naturalShare')},
      europeShare: ${known.length > 0 ? Math.round((europe / known.length) * 100) : null},
      countries: [${countries.map(q).join(', ')}],
      medianPrice: ${median(items.map((p) => p.price))},
      repair: null,
      secondHand: null,
      notes: [
${notes.map((note) => `        ${q(note)},`).join('\n')}
      ],
      sources: [
${sources.map((source) => `        ${source},`).join('\n')}
      ],
    },
  },`);
}
process.stdout.write(`${entries.join('\n')}\n`);
process.stderr.write(`${entries.length} marques générées\n`);
