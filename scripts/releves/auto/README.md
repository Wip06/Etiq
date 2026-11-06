# Relevés automatiques (6 nov. 2026)

Scripts qui ont produit les relevés automatiques de `releves/`. Ils lisent seulement les sites qui
l'acceptent (robots.txt, et pas d'interdiction des robots d'IA), une page toutes les 3 ou 4 secondes. Les
sites qui bloquent la lecture automatique (H&M, Zara, Jules, Kiabi, Galeries Lafayette…) ne sont pas
relevés, et leur protection n'est jamais contournée.

Chaque script prend un dossier de travail (pages téléchargées, en cache) en premier argument.

| Site | Commandes |
|---|---|
| WeDressFair (multimarque) | `python3 -I survey_wdf.py download-all <dossier>` puis `build-all <dossier> ../../../releves` ; fiches du catalogue : `node gen_wdf_brands.js <dossier>/wdf-all-summary.json ../../..` |
| Nudie Jeans | `python3 -I survey_nudie_all.py <dossier> ../../../releves/nudie.txt` (sitemap `products-fr.xml` à placer dans le dossier) |
| Asphalte | `python3 -I survey_asphalte.py download-all <dossier>`, puis `nuxt_eval.js` dans Docker, puis `build-all <dossier> ../../../releves/asphalte.txt` |

**Asphalte** : les données des fiches sont dans une fonction JavaScript de la page. `nuxt_eval.js` l'exécute
uniquement dans un conteneur isolé, sans réseau ni accès aux fichiers :

```
docker run --rm --network none --read-only --cap-drop ALL --security-opt no-new-privileges \
  -v <dossier>/pages:/in:ro -v $PWD/nuxt_eval.js:/eval.js:ro -v <dossier>/json:/out \
  node:22.12.0-alpine node /eval.js /in /out
```

Ne jamais lancer `nuxt_eval.js` directement sur sa machine : il exécute du code venu d'un site tiers.

Après un relevé : `npm run data:releves` (avec la copie du portail, `npm run data:download`, pour retrouver les
codes-barres déclarés).
