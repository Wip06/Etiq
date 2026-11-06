"""Relevé complet Nudie Jeans (6 nov. 2026) : tous les vêtements du plan du site en-FR, femme et homme,
un seul exemplaire par modèle (même nom de modèle, même composition, même pays, même prix).
Réutilise les fonctions de survey_nudie.py. 4 s entre chaque page.

Usage : python3 -I survey_nudie_all.py <dossier de travail> <fichier de relevé à écrire>
"""
import sys
from pathlib import Path

source = (Path(__file__).parent / 'survey_nudie.py').read_text()
exec(source[: source.index('urls = re.findall')])  # noqa: S102 — notre propre script : constantes et fonctions

GENDERS = {'male': 'homme', 'female': 'femme', 'unisex': 'mixte'}
urls = re.findall(r'<loc>([^<]+)</loc>', (WORK / 'products-fr.xml').read_text())
products, seen, fetches = [], set(), 0
for url in urls:
    slug = url.rstrip('/').split('/')[-1]
    if any(word in slug for word in SKIP):
        continue
    cached = CACHE / f'{slug}.html'
    if cached.exists():
        page = cached.read_text()
    else:
        time.sleep(DELAY)
        fetches += 1
        try:
            page = fetch(url)
        except Exception as error:  # noqa: BLE001
            print('ERREUR', url, error, flush=True)
            continue
        cached.write_text(page)
    data = product_data(page)
    if not data:
        continue
    gender = GENDERS.get((data.get('audience') or {}).get('suggestedGender', ''))
    category = category_of(data.get('name', ''), data.get('category', ''))
    composition = french_composition(data.get('material', ''))
    if not gender or not category or not composition:
        continue
    offers = data.get('offers') or [{}]
    country = COUNTRIES.get((data.get('countryOfOrigin') or {}).get('name', ''), '')
    key = (category, slug.split('-')[0], composition, country, offers[0].get('price'), gender)
    if key in seen:
        continue
    seen.add(key)
    products.append({
        'category': category, 'name': html.unescape(data.get('name', '')), 'url': data.get('url', url),
        'gender': gender, 'composition': composition, 'country': country, 'price': offers[0].get('price'),
        'currency': offers[0].get('priceCurrency'),
        'gtins': [o.get('gtin13') for o in offers if o.get('gtin13')][:3],
    })

lines = [
    'RELEVÉ NUDIE JEANS', '',
    'Date du relevé : 6 novembre 2026',
    'Relevé automatique complet : tous les vêtements du plan du site (en-FR), femme et homme, un exemplaire par',
    'modèle, d’après les données structurées des fiches (schema.org), 4 s entre chaque page. Composition traduite de l’anglais.',
    '', '===== LA MARQUE =====', '',
    'Service de réparation (oui / non) : oui',
    'Lien de la page : https://www.nudiejeans.com/en-FR/blog/free-repairs-forever', '',
    'Revente ou seconde main (oui / non) : ', 'Lien de la page : ',
]
for category in QUOTAS:
    items = [p for p in products if p['category'] == category]
    if not items:
        continue
    lines += ['', f'===== {category} =====']
    for index, item in enumerate(items, 1):
        price = item['price']
        price_text = f'{price:g} €'.replace('.', ',') if isinstance(price, (int, float)) and item['currency'] == 'EUR' else ''
        lines += ['', f'Produit {index}', f"Nom : {item['name']}", f"Lien : {item['url']}",
                  f"Rayon (femme / homme / mixte) : {item['gender']}", f"Composition : {item['composition']}",
                  f"Fabriqué en : {item['country']}", 'Tissé en : ', 'Teint en : ', f'Prix : {price_text}',
                  f"Code-barres : {', '.join(item['gtins'])}"]
OUTPUT.write_text('\n'.join(lines) + '\n')
print(f'{fetches} pages téléchargées, {len(products)} vêtements')
for category in QUOTAS:
    print(category, sum(1 for p in products if p['category'] == category))
print('rayons', {g: sum(1 for p in products if p['gender'] == g) for g in GENDERS.values()})
