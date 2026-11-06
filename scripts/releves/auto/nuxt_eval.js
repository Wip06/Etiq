// Exécuté UNIQUEMENT dans un conteneur Docker sans réseau (--network none), pages montées en lecture
// seule : évalue la fonction window.__NUXT__ de chaque page Asphalte et écrit les données en JSON.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const [inputDir, outputDir] = process.argv.slice(2);
for (const file of fs.readdirSync(inputDir).filter((name) => name.endsWith('.html'))) {
  const page = fs.readFileSync(path.join(inputDir, file), 'utf8');
  const match = page.match(/<script[^>]*>\s*window\.__NUXT__\s*=([\s\S]*?)<\/script>/);
  if (!match) continue;
  try {
    const data = vm.runInNewContext(`(${match[1]})`, {}, { timeout: 2000 });
    fs.writeFileSync(path.join(outputDir, file.replace(/\.html$/, '.json')), JSON.stringify(data));
  } catch (error) {
    console.error(file, String(error).slice(0, 200));
  }
}
