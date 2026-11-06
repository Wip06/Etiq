"""Relevé automatique sur WeDressFair (revendeur multimarque de mode éco-responsable), en deux temps :
  download <dossier>          : télécharge les pages marques et les fiches candidates (3 s entre chaque page) ;
  build <dossier> <releves/>  : écrit un relevé par marque au format de releves/ et un résumé JSON.
Par marque : les premières fiches de chaque catégorie dans le plan du site (femme et homme confondus),
20 produits répartis comme dans le protocole, les catégories manquantes complétées par les autres.
"""
import html
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
BASE = 'https://www.wedressfair.fr'
DELAY = 3
CANDIDATES = 28

BRANDS = ['armedangels', 'thinking-mu', 'colorful-standard', 'knowledge-cotton-apparel', 'jan-n-june', 'patagonia',
          'rotholz', 'nenes-paris', 'dedicated', 'brava-fabrics', 'organic-basics', 'olow', 'chou', 'skfk', 'rifo',
          'kings-of-indigo', 'about-companions', 'bonjour-demain']
QUOTAS = {
    'T-SHIRTS ET TOPS': 5,
    'PULLS ET MAILLE': 4,
    'ROBES ET JUPES': 3,
    'PANTALONS ET JEANS': 3,
    'CHEMISES ET BLOUSES': 3,
    'MANTEAUX ET VESTES': 2,
}
SKIP = ['basket', 'sneaker', 'chaussure', 'sandale', 'botte', 'derby', 'mocassin', 'sac-', 'pochette', 'banane',
        'sacoche', 'chaussette', 'socquette', 'bonnet', 'echarpe', 'casquette', 'ceinture', 'culotte', 'soutien',
        'brassiere', 'boxer', 'calecon', 'slip', 'string', 'lingerie', 'maillot', 'bikini', 'pyjama', 'gourde',
        'tote', 'portefeuille', 'collant', 'short', 'bob-', 'gants', 'legging', 'brief', 'trunk', 'bra-']
NATIONALITIES = {
    'française': 'France', 'espagnole': 'Espagne', 'danoise': 'Danemark', 'allemande': 'Allemagne',
    'suédoise': 'Suède', 'néerlandaise': 'Pays-Bas', 'hollandaise': 'Pays-Bas', 'américaine': 'États-Unis',
    'italienne': 'Italie', 'suisse': 'Suisse', 'portugaise': 'Portugal', 'belge': 'Belgique',
    'britannique': 'Royaume-Uni', 'anglaise': 'Royaume-Uni', 'norvégienne': 'Norvège', 'finlandaise': 'Finlande',
    'autrichienne': 'Autriche', 'australienne': 'Australie', 'canadienne': 'Canada', 'irlandaise': 'Irlande',
    'californienne': 'États-Unis', 'berlinoise': 'Allemagne', 'munichoise': 'Allemagne', 'barcelonaise': 'Espagne',
    'catalane': 'Espagne', 'madrilène': 'Espagne', 'parisienne': 'France', 'lyonnaise': 'France',
    'bordelaise': 'France', 'nantaise': 'France', 'marseillaise': 'France', 'lilloise': 'France',
    'bretonne': 'France', 'londonienne': 'Royaume-Uni', 'amstellodamoise': 'Pays-Bas', 'copenhaguoise': 'Danemark',
}


def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'fr-FR,fr;q=0.9'})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode('utf-8', errors='replace')


def product_urls(work):
    urls = [line.strip() for line in (work / 'wdf-urls.txt').read_text().splitlines()]
    return [u for u in urls if '/collections/' in u]


def brand_products(urls, brand):
    return [u for u in urls if u.endswith('-' + brand) and not any(word in u.split('/collections/')[1] for word in SKIP)]


def download(work):
    pages = work / 'wdf-pages'
    pages.mkdir(exist_ok=True)
    urls = product_urls(work)
    for brand in BRANDS:
        targets = [f'{BASE}/marques/{brand}'] + brand_products(urls, brand)[:CANDIDATES]
        for url in targets:
            name = ('marque-' + brand) if '/marques/' in url else url.split('/collections/')[1]
            path = pages / f'{name}.html'
            if path.exists():
                continue
            time.sleep(DELAY)
            try:
                path.write_text(fetch(url))
            except Exception as error:  # noqa: BLE001
                print('ERREUR', url, error, flush=True)
        print(brand, 'ok', flush=True)


def visible_text(page):
    body = re.sub(r'<script.*?</script>|<style.*?</style>', '', page, flags=re.S)
    body = html.unescape(re.sub(r'<[^>]+>', ' | ', body))
    return re.sub(r'(\s*\|\s*)+', ' | ', body)


def product_group(page):
    for match in re.finditer(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', page, flags=re.S):
        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            continue
        if isinstance(data, dict) and data.get('@type') in ('ProductGroup', 'Product'):
            return data
    return None


# Catégories de WeDressFair (fil d'Ariane) : seuls les vêtements du périmètre sont gardés.
SITE_CATEGORIES = {
    'tops & t-shirts': 'T-SHIRTS ET TOPS', 't-shirts & polos': 'T-SHIRTS ET TOPS',
    'chemises & blouses': 'CHEMISES ET BLOUSES', 'chemises & surchemises': 'CHEMISES ET BLOUSES',
    'pulls & sweats': 'PULLS ET MAILLE', 'vestes & manteaux': 'MANTEAUX ET VESTES',
    'pantalons': 'PANTALONS ET JEANS', 'jeans': 'PANTALONS ET JEANS',
    'jupes': 'ROBES ET JUPES', 'robes': 'ROBES ET JUPES',
}


def category_of(label):
    return SITE_CATEGORIES.get(label.strip().lower())


def breadcrumb(page):
    for match in re.finditer(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', page, flags=re.S):
        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            continue
        if isinstance(data, dict) and data.get('@type') == 'BreadcrumbList':
            return [item.get('name', '') for item in data.get('itemListElement', [])]
    return []


def parse_product(path, brand):
    page = path.read_text()
    data = product_group(page)
    if not data or not data.get('material'):
        return None
    text = visible_text(page)
    country = re.search(r'Pays de confection \| ([^|]+?) \|', text)
    description = data.get('description', '')
    # Rayon : le fil d'Ariane (Accueil › Femme › …), sinon la description.
    trail = ' '.join(breadcrumb(page)[1:2]).lower()
    gender = re.search(r'\b(femme|homme|unisexe|mixte)\b', trail) or re.search(r'\b(femme|homme|unisexe|mixte)\b', description.lower())
    variants = data.get('hasVariant') or [data]
    offers = [v.get('offers') or {} for v in variants]
    price = next((o.get('price') for o in offers if o.get('price') is not None), None)
    brand_name = (data.get('brand') or {}).get('name', '')
    name = re.sub(rf'\s*{re.escape(brand_name)}\s*$', '', html.unescape(data.get('name', ''))).strip(' |')
    return {
        'brand_slug': brand,
        'brand_name': brand_name,
        'name': re.sub(r'\s+', ' ', name),
        'url': data.get('url') or '',
        'category': category_of(data.get('category', '')),
        'site_category': data.get('category', ''),
        'gender': {'unisexe': 'mixte'}.get(gender.group(1), gender.group(1)) if gender else '',
        'composition': data['material'],
        'country': country.group(1).strip() if country else '',
        'price': price,
        'gtins': [v.get('gtin') or v.get('gtin13') for v in variants if v.get('gtin') or v.get('gtin13')],
    }


def brand_facts(work, brand):
    path = work / 'wdf-pages' / f'marque-{brand}.html'
    if not path.exists():
        return {}
    text = visible_text(path.read_text())
    sentence = re.search(r'\| ([^|]{3,60}? est une marque[^|]{0,240}?\.)', text)
    # Nationalité : le premier adjectif connu qui suit « marque », dans la présentation de WeDressFair.
    adjectives = '|'.join(sorted(map(re.escape, NATIONALITIES), key=len, reverse=True))
    found = re.search(rf'marque[^|.]{{0,80}}?\b({adjectives})\b', text, flags=re.I)
    return {
        'sentence': sentence.group(1).strip() if sentence else '',
        'country': NATIONALITIES[found.group(1).lower()] if found else None,
        'evidence': text[max(0, found.start() - 40):found.end() + 40] if found else '',
    }


def build(work, releves):
    urls = product_urls(work)
    summary = {}
    for brand in BRANDS:
        products = []
        for url in brand_products(urls, brand)[:CANDIDATES]:
            path = work / 'wdf-pages' / f"{url.split('/collections/')[1]}.html"
            if path.exists():
                product = parse_product(path, brand)
                if product and product['category']:
                    products.append(product)
        # Quotas du protocole, puis les places restantes dans l'ordre du plan du site.
        chosen, rest = [], []
        counts = {category: 0 for category in QUOTAS}
        for product in products:
            if counts[product['category']] < QUOTAS[product['category']]:
                counts[product['category']] += 1
                chosen.append(product)
            else:
                rest.append(product)
        chosen += rest[: max(0, 20 - len(chosen))]
        facts = brand_facts(work, brand)
        summary[brand] = {'facts': facts, 'products': chosen}
        if len(chosen) < 10:
            print(f'{brand}: seulement {len(chosen)} vêtements, marque écartée')
            continue
        brand_id = brand.replace('-', '')
        name = chosen[0]['brand_name'] or brand
        lines = [
            f'RELEVÉ {name.upper()}',
            '',
            'Date du relevé : 5 novembre 2026',
            'Relevé automatique sur WeDressFair (revendeur multimarque) : premières fiches de la marque dans le plan',
            'du site, par catégorie, 3 s entre chaque page. Composition, pays de confection, prix et rayon tels',
            'qu’affichés par WeDressFair ; codes-barres (GTIN) des tailles en vente.',
            '',
            '===== LA MARQUE =====',
            '',
            'Service de réparation (oui / non) : ',
            'Lien de la page : ',
            '',
            'Revente ou seconde main (oui / non) : ',
            'Lien de la page : ',
        ]
        for category in QUOTAS:
            items = [p for p in chosen if p['category'] == category]
            if not items:
                continue
            lines += ['', f'===== {category} =====']
            for index, item in enumerate(items, 1):
                price = item['price']
                lines += [
                    '', f'Produit {index}', f"Nom : {item['name']}", f"Lien : {item['url']}",
                    f"Rayon (femme / homme / mixte) : {item['gender']}", f"Composition : {item['composition']}",
                    f"Fabriqué en : {item['country']}", 'Tissé en : ', 'Teint en : ',
                    f"Prix : {price:g} €".replace('.', ',') if isinstance(price, (int, float)) else 'Prix : ',
                    f"Code-barres : {', '.join(item['gtins'][:3])}",
                ]
        (releves / f'{brand_id}.txt').write_text('\n'.join(lines) + '\n')
        genders = sorted({p['gender'] or '?' for p in chosen})
        print(f"{brand_id}: {len(chosen)} vêtements, rayons {genders}, pays de la marque {facts.get('country')}, "
              f"pays de confection connus {sum(1 for p in chosen if p['country'])}/{len(chosen)}")
    (work / 'wdf-summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=1))




# ---------------------------------------------------------------------------------------------------------
# Relevé complet (6 nov. 2026) : toutes les fiches de vêtements de toutes les marques, un modèle par nom.
# ---------------------------------------------------------------------------------------------------------

def all_brand_slugs(work):
    urls = [line.strip() for line in (work / 'wdf-urls.txt').read_text().splitlines()]
    return sorted({u.split('/marques/')[1].strip('/') for u in urls if '/marques/' in u and u.split('/marques/')[1].strip('/')})


def download_all(work):
    pages = work / 'wdf-pages'
    pages.mkdir(exist_ok=True)
    targets = [(f'marque-{slug}', f'{BASE}/marques/{slug}') for slug in all_brand_slugs(work)]
    targets += [(u.split('/collections/')[1], u) for u in product_urls(work)
                if not any(word in u.split('/collections/')[1] for word in SKIP)]
    todo = [(name, url) for name, url in targets if not (pages / f'{name}.html').exists()]
    print(f'{len(targets)} pages visées, {len(todo)} à télécharger', flush=True)
    for index, (name, url) in enumerate(todo, 1):
        time.sleep(DELAY)
        try:
            (pages / f'{name}.html').write_text(fetch(url))
        except Exception as error:  # noqa: BLE001
            print('ERREUR', url, error, flush=True)
        if index % 100 == 0:
            print(f'{index}/{len(todo)}', flush=True)
    print('terminé', flush=True)


# Marques relevées sur leur propre site : leurs fiches WeDressFair ne sont pas reprises.
DIRECT = {'nudiejeans'}
# Pays absent de la présentation de WeDressFair, vérifié ailleurs (FashionUnited, 5 nov. 2026).
COUNTRY_OVERRIDES = {'skfk': 'Espagne', 'kingsofindigo': 'Pays-Bas', 'mudjeans': 'Pays-Bas'}  # Mud Jeans : « D’origine néerlandaise » (WeDressFair)
MIN_PRODUCTS = 5


def brand_id(name):
    import unicodedata
    plain = unicodedata.normalize('NFD', name).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]', '', plain)


def model_key(product):
    # Le modèle est le premier mot entre guillemets du nom (« noir "alaania black" » → alaania).
    quoted = re.search(r'"([^"]+)"', product['name'])
    model = quoted.group(1).split()[0].lower() if quoted else product['name'].split(' | ')[0].lower()
    return (product['category'], model, product['composition'], product['price'], product['gender'])


def build_all(work, releves):
    pages = work / 'wdf-pages'
    by_brand = {}
    for path in sorted(pages.glob('*.html')):
        if path.name.startswith('marque-'):
            continue
        product = parse_product(path, '')
        if not product or not product['category'] or not product['brand_name']:
            continue
        by_brand.setdefault(brand_id(product['brand_name']), []).append(product)
    slugs = {brand_id(slug.replace('-', ' ')): slug for slug in all_brand_slugs(work)}
    summary = {}
    for bid, products in sorted(by_brand.items()):
        if bid in DIRECT:
            continue
        seen, unique = set(), []
        for product in products:
            key = model_key(product)
            if key not in seen:
                seen.add(key)
                unique.append(product)
        if len(unique) < MIN_PRODUCTS:
            continue
        slug = slugs.get(bid)
        facts = brand_facts(work, slug) if slug else {}
        country = COUNTRY_OVERRIDES.get(bid) or facts.get('country')
        name = unique[0]['brand_name']
        summary[bid] = {'name': name, 'slug': slug, 'country': country, 'evidence': facts.get('evidence', ''),
                        'products': len(unique)}
        lines = [
            f'RELEVÉ {name.upper()}', '', 'Date du relevé : 6 novembre 2026',
            'Relevé automatique complet sur WeDressFair (revendeur multimarque) : toutes les fiches de vêtements de la',
            'marque, un exemplaire par modèle, 3 s entre chaque page. Composition, pays de confection, prix et rayon tels',
            'qu’affichés par WeDressFair ; codes-barres (GTIN) des tailles en vente.',
            '', '===== LA MARQUE =====', '', 'Service de réparation (oui / non) : ', 'Lien de la page : ', '',
            'Revente ou seconde main (oui / non) : ', 'Lien de la page : ',
        ]
        for category in QUOTAS:
            items = [p for p in unique if p['category'] == category]
            if not items:
                continue
            lines += ['', f'===== {category} =====']
            for index, item in enumerate(items, 1):
                price = item['price']
                lines += ['', f'Produit {index}', f"Nom : {item['name']}", f"Lien : {item['url']}",
                          f"Rayon (femme / homme / mixte) : {item['gender']}", f"Composition : {item['composition']}",
                          f"Fabriqué en : {item['country']}", 'Tissé en : ', 'Teint en : ',
                          f"Prix : {price:g} €".replace('.', ',') if isinstance(price, (int, float)) else 'Prix : ',
                          f"Code-barres : {', '.join(item['gtins'][:3])}"]
        (releves / f'{bid}.txt').write_text('\n'.join(lines) + '\n')
    (work / 'wdf-all-summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=1))
    total = sum(b['products'] for b in summary.values())
    print(f'{len(summary)} marques, {total} vêtements')
    for bid, b in sorted(summary.items(), key=lambda kv: -kv[1]['products']):
        print(f"  {bid.ljust(26)} {str(b['products']).rjust(4)}  {b['country'] or '?'}")


COMMANDS = {
    'download': lambda: download(Path(sys.argv[2])),
    'build': lambda: build(Path(sys.argv[2]), Path(sys.argv[3])),
    'download-all': lambda: download_all(Path(sys.argv[2])),
    'build-all': lambda: build_all(Path(sys.argv[2]), Path(sys.argv[3])),
}

if __name__ == '__main__':
    COMMANDS[sys.argv[1]]()
