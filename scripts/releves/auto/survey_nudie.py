"""Relevé automatique Nudie Jeans (rayon homme) : premiers modèles de chaque catégorie dans le plan du
site en-FR, d'après les données structurées schema.org des fiches. 4 s entre chaque page.

Usage : python3 -I survey_nudie.py <dossier de travail> <fichier de relevé à écrire>
"""
import html
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

WORK = Path(sys.argv[1])
OUTPUT = Path(sys.argv[2])
CACHE = WORK / 'pages'
CACHE.mkdir(exist_ok=True)
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
DELAY = 4
MAX_FETCHES = 250

# Répartition pour un rayon homme (pas de robes ni de jupes) : 20 produits.
QUOTAS = {
    'T-SHIRTS ET TOPS': 5,
    'PULLS ET MAILLE': 4,
    'PANTALONS ET JEANS': 4,
    'CHEMISES ET BLOUSES': 4,
    'MANTEAUX ET VESTES': 3,
}
SKIP = ['sock', 'belt', 'bag', 'cap', 'beanie', 'hat', 'scarf', 'wallet', 'keychain', 'key-', 'patch', 'boxer',
        'brief', 'trunk', 'underwear', 'short', 'swim', 'kids', 'tote', 'bandana', 'glove', 'gift', 'poster',
        'pin', 'mug', 'card', 'repair', 'kit', 'bottle', 'towel', 'blanket', 'sticker', 'apron', 'boilersuit',
        'dungaree', 'overall', 'jumpsuit']
COUNTRIES = {
    'TN': 'Tunisie', 'IT': 'Italie', 'PT': 'Portugal', 'IN': 'Inde', 'TR': 'Turquie', 'CN': 'Chine',
    'BD': 'Bangladesh', 'RO': 'Roumanie', 'BG': 'Bulgarie', 'MK': 'Macédoine du Nord', 'PK': 'Pakistan',
    'LT': 'Lituanie', 'PL': 'Pologne', 'ES': 'Espagne', 'FR': 'France', 'SE': 'Suède', 'MA': 'Maroc',
    'VN': 'Vietnam', 'KH': 'Cambodge', 'JP': 'Japon', 'EE': 'Estonie', 'LV': 'Lettonie', 'MM': 'Myanmar',
    'ID': 'Indonésie', 'LK': 'Sri Lanka', 'EG': 'Égypte', 'HU': 'Hongrie', 'DE': 'Allemagne',
}
# Traduction des matières, pour la composition recopiée en français.
MATERIALS = [
    ('organic cotton', 'Coton biologique'), ('recycled cotton', 'Coton recyclé'), ('cotton', 'Coton'),
    ('recycled polyester', 'Polyester recyclé'), ('polyester', 'Polyester'), ('recycled wool', 'Laine recyclée'),
    ('merino wool', 'Laine mérinos'), ('wool', 'Laine'), ('linen', 'Lin'), ('hemp', 'Chanvre'),
    ('elastane', 'Élasthanne'), ('spandex', 'Élasthanne'), ('recycled polyamide', 'Polyamide recyclé'),
    ('polyamide', 'Polyamide'), ('recycled nylon', 'Nylon recyclé'), ('nylon', 'Nylon'), ('lyocell', 'Lyocell'),
    ('tencel', 'Lyocell'), ('viscose', 'Viscose'), ('modal', 'Modal'), ('cashmere', 'Cachemire'), ('silk', 'Soie'),
    ('leather', 'Cuir'), ('alpaca', 'Alpaga'), ('mohair', 'Mohair'), ('acrylic', 'Acrylique'),
    ('other fib', 'Autres fibres'),
]


def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode('utf-8', errors='replace')


def product_data(page):
    for match in re.finditer(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', page, flags=re.S):
        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            continue
        if isinstance(data, dict) and data.get('@type') == 'Product':
            return data
    return None


def category_of(name, taxonomy):
    text = name.lower()
    has = lambda *words: any(re.search(rf'\b{re.escape(word)}', text) for word in words)
    if has('jacket', 'coat', 'parka', 'blazer') or 'Outerwear' in taxonomy:
        return 'MANTEAUX ET VESTES'
    if has('sweater', 'sweatshirt', 'sweat', 'hoodie', 'cardigan', 'knit', 'jumper', 'fleece'):
        return 'PULLS ET MAILLE'
    if has('tee', 't-shirt', 'tank', 'polo', 'henley'):
        return 'T-SHIRTS ET TOPS'
    if has('shirt', 'overshirt'):
        return 'CHEMISES ET BLOUSES'
    if 'Pants' in taxonomy or 'Jeans' in taxonomy or has('jeans', 'pants', 'trousers', 'chino'):
        return 'PANTALONS ET JEANS'
    return None


def french_composition(material):
    # « 86% Wool 14% Polyamide » ou « 70% Wool, 15% Polyester » : chaque part chiffrée, virgule ou non.
    parts = []
    for percent, name in re.findall(r'(\d+(?:[.,]\d+)?)\s*%\s*([^\d%,]+)', material):
        name = name.strip()
        translated = next((fr for en, fr in MATERIALS if en in name.lower()), name)
        parts.append(f'{percent}% {translated}')
    return ', '.join(parts)


urls = re.findall(r'<loc>([^<]+)</loc>', (WORK / 'products-fr.xml').read_text())
chosen = {category: [] for category in QUOTAS}
models = set()
fetches = 0
log = []

for url in urls:
    if all(len(chosen[c]) >= q for c, q in QUOTAS.items()):
        break
    slug = url.rstrip('/').split('/')[-1]
    if any(word in slug for word in SKIP):
        continue
    cached = CACHE / f'{slug}.html'
    if cached.exists():
        page = cached.read_text()
    else:
        if fetches >= MAX_FETCHES:
            break
        time.sleep(DELAY)
        fetches += 1
        try:
            page = fetch(url)
        except Exception as error:  # noqa: BLE001
            log.append(f'ERREUR {url} {error}')
            continue
        cached.write_text(page)
    data = product_data(page)
    if not data:
        log.append(f'sans données {url}')
        continue
    gender = (data.get('audience') or {}).get('suggestedGender', '')
    if gender not in ('male', 'unisex'):
        continue
    category = category_of(data.get('name', ''), data.get('category', ''))
    if not category or len(chosen[category]) >= QUOTAS[category]:
        continue
    # Un modèle = le premier mot du nom (« Koffe », « Arvid »…) : une seule variante par modèle.
    model = (category, slug.split('-')[0])
    if model in models:
        continue
    models.add(model)
    offers = data.get('offers') or [{}]
    price = offers[0].get('price')
    country = (data.get('countryOfOrigin') or {}).get('name', '')
    chosen[category].append({
        'name': html.unescape(data.get('name', '')),
        'url': data.get('url', url),
        'gender': 'mixte' if gender == 'unisex' else 'homme',
        'composition': french_composition(data.get('material', '')),
        'material': data.get('material', ''),
        'country': COUNTRIES.get(country, country),
        'price': price,
        'currency': offers[0].get('priceCurrency'),
    })

lines = [
    'RELEVÉ NUDIE JEANS',
    '',
    'Date du relevé : 5 novembre 2026',
    'Relevé automatique (rayon homme) : premiers modèles de chaque catégorie dans le plan du site (en-FR),',
    'd’après les données structurées des fiches (schema.org), 4 s entre chaque page. Composition traduite de l’anglais.',
    '',
    '===== LA MARQUE =====',
    '',
    'Service de réparation (oui / non) : oui',
    'Lien de la page : https://www.nudiejeans.com/en-FR/blog/free-repairs-forever',
    '',
    'Revente ou seconde main (oui / non) : ',
    'Lien de la page : ',
]
for category, items in chosen.items():
    lines += ['', f'===== {category} =====']
    for index, item in enumerate(items, 1):
        price = item['price']
        price_text = f"{price:g} €".replace('.', ',') if isinstance(price, (int, float)) and item['currency'] == 'EUR' else ''
        lines += [
            '',
            f'Produit {index}',
            f"Nom : {item['name']}",
            f"Lien : {item['url']}",
            f"Rayon (femme / homme / mixte) : {item['gender']}",
            f"Composition : {item['composition']}",
            f"Fabriqué en : {item['country']}",
            'Tissé en : ',
            'Teint en : ',
            f'Prix : {price_text}',
        ]
OUTPUT.write_text('\n'.join(lines) + '\n')

print(f'{fetches} pages lues')
for category, items in chosen.items():
    print(f'{category}: {len(items)}/{QUOTAS[category]}')
    for item in items:
        print(f"   {item['name']} | {item['material']} → {item['composition']} | {item['country']} | {item['price']} {item['currency']} | {item['gender']}")
for entry in log[:20]:
    print(entry)
