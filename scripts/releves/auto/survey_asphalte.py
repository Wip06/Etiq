"""Relevé automatique Asphalte (rayon homme, /h/products/), en deux temps :
  download <dossier> : télécharge les fiches candidates (4 s entre chaque page), sans rien exécuter ;
  build <dossier> <relevé> : lit les JSON produits par nuxt_eval.js (exécuté dans Docker, sans réseau)
                             et écrit le relevé au format de releves/.
Premiers modèles de chaque catégorie dans le plan du site, une seule version par modèle.
"""
import html
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
DELAY = 4
QUOTAS = {
    'T-SHIRTS ET TOPS': 5,
    'PULLS ET MAILLE': 4,
    'PANTALONS ET JEANS': 4,
    'CHEMISES ET BLOUSES': 4,
    'MANTEAUX ET VESTES': 3,
}
# Catégorie probable d'après l'adresse, pour ne télécharger que des vêtements.
SLUG_HINTS = [
    ('MANTEAUX ET VESTES', ['veste', 'manteau', 'blouson', 'parka', 'caban', 'trench', 'doudoune', 'surchemise', 'overshirt', 'bomber']),
    ('PULLS ET MAILLE', ['pull', 'sweat', 'cardigan', 'gilet', 'col-roule', 'hoodie', 'polaire', 'maille']),
    ('T-SHIRTS ET TOPS', ['t-shirt', 'tee', 'polo', 'henley', 'debardeur', 'marcel']),
    ('CHEMISES ET BLOUSES', ['chemise']),
    ('PANTALONS ET JEANS', ['pantalon', 'jean', 'chino', 'jogging']),
]
SKIP = ['ceinture', 'casquette', 'chaussette', 'boots', 'chaussure', 'sac', 'bonnet', 'echarpe', 'carte-cadeau',
        'gant', 'boxer', 'calecon', 'slip', 'maillot', 'short', 'costume', 'bob', 'tote', 'basket', 'derby']
TYPES = {
    'hauts': 'T-SHIRTS ET TOPS', 't-shirts': 'T-SHIRTS ET TOPS', 'polos': 'T-SHIRTS ET TOPS',
    'mailles et sweats': 'PULLS ET MAILLE', 'pulls et sweats': 'PULLS ET MAILLE', 'pulls': 'PULLS ET MAILLE',
    'chemises': 'CHEMISES ET BLOUSES', 'pantalons': 'PANTALONS ET JEANS', 'jeans': 'PANTALONS ET JEANS',
    'bas': 'PANTALONS ET JEANS', 'vestes': 'MANTEAUX ET VESTES', 'manteaux': 'MANTEAUX ET VESTES',
    'vestes et manteaux': 'MANTEAUX ET VESTES', 'blousons': 'MANTEAUX ET VESTES',
}


def base_model(slug):
    return re.sub(r'-(archive-stock|stock|v\d+|\d+)$', '', slug)


def hint(slug):
    if any(word in slug for word in SKIP):
        return None
    return next((category for category, words in SLUG_HINTS if any(word in slug for word in words)), None)


def download(work):
    pages = work / 'pages'
    pages.mkdir(exist_ok=True)
    urls = [u for u in re.findall(r'<loc>([^<]+)</loc>', (work / 'fr-FR.xml').read_text()) if '/h/products/' in u]
    wanted = {category: 0 for category in QUOTAS}
    seen = set()
    for url in urls:
        slug = url.rstrip('/').split('/')[-1]
        category = hint(slug)
        model = base_model(slug)
        # Deux fois le quota de candidats : certaines fiches n'ont pas de composition chiffrée.
        if not category or model in seen or wanted[category] >= QUOTAS[category] * 2:
            continue
        seen.add(model)
        wanted[category] += 1
        target = pages / f'{slug}.html'
        if target.exists():
            continue
        time.sleep(DELAY)
        request = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'fr-FR,fr;q=0.9'})
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                target.write_text(response.read().decode('utf-8', errors='replace'))
        except Exception as error:  # noqa: BLE001
            print('ERREUR', url, error)
    print('candidats', wanted)


def text(blocks):
    return ' '.join(child.get('text', '') for block in (blocks or []) if isinstance(block, dict)
                    for child in block.get('children', []) if isinstance(child, dict)).strip()


def build(work, output):
    urls = [u for u in re.findall(r'<loc>([^<]+)</loc>', (work / 'fr-FR.xml').read_text()) if '/h/products/' in u]
    chosen = {category: [] for category in QUOTAS}
    for url in urls:
        slug = url.rstrip('/').split('/')[-1]
        path = work / 'json' / f'{slug}.json'
        if not path.exists():
            continue
        data = json.loads(path.read_text())
        product = next((v['data'] for k, v in data.get('data', {}).items() if k.startswith('product-') and isinstance(v, dict) and v.get('data')), None)
        if not product:
            continue
        shop = product.get('shopify_product') or {}
        category = TYPES.get((shop.get('productType') or '').strip().lower()) or hint(slug)
        if not category or len(chosen[category]) >= QUOTAS[category]:
            continue
        bullet = next((b for b in product.get('bullets') or [] if re.search(r'\d+\s*%', b)), None)
        if not bullet:
            continue
        # « Tricot en côte perlée 100 % laine mérinos douce » → « 100 % laine mérinos » : les parts chiffrées,
        # sans les qualificatifs. Une composition qui ne fait pas 100 % (« 3 % d'élasthanne pour… ») est
        # incomplète : le produit est écarté.
        parts = re.findall(r'(\d+(?:[.,]\d+)?)\s*%\s*([^,%\d]+?)(?=\s+(?:et\s+)?\d|,|$)', bullet)
        if not 99 <= sum(float(p.replace(',', '.')) for p, _ in parts) <= 101:
            continue
        cut = re.compile(r"\s+(douce|bien|pour|confectionn|labellis|et\s+d[ée]perlant|double\s+retors|et\s+chaude).*$", re.I)
        composition = ', '.join(f'{p}% {cut.sub("", name).strip()}' for p, name in parts)
        steps = {}
        for block in product.get('blocks') or []:
            for inner in block.get('blocks') or []:
                if inner.get('_type') == 'tracabiliteBlock':
                    for step in inner.get('parcours') or []:
                        # « São Félix Da Marinha, Portugal » → « Portugal ».
                        region = (step.get('factory_region') or '').split(',')[-1].strip()
                        steps[text(step.get('title')).lower()] = region
        made = next((steps[k] for k in steps if 'confection' in k or 'fabrication' in k), '')
        woven = next((steps[k] for k in steps if k.startswith('tissage') or k.startswith('tricotage')), '')
        dyed = next((steps[k] for k in steps if k.startswith('teinture')), '')
        price = ((shop.get('priceRange') or {}).get('minVariantPrice'))
        page_title = re.search(r'<title>([^<]*)</title>', (work / 'pages' / f'{slug}.html').read_text()).group(1)
        title = html.unescape(re.sub(r'\s*-\s*Asphalte\s*$', '', page_title)).strip()
        if any(item['name'] == title for items in chosen.values() for item in items):
            continue
        chosen[category].append({'name': title, 'url': url, 'composition': composition, 'made': made,
                                 'woven': woven, 'dyed': dyed, 'price': price})

    lines = [
        'RELEVÉ ASPHALTE',
        '',
        'Date du relevé : 5 novembre 2026',
        'Relevé automatique (rayon homme) : premiers modèles de chaque catégorie dans le plan du site, 4 s entre',
        'chaque page. Pays d’après le bloc « Traçabilité » de chaque fiche (étapes Confection, Tissage ou Tricotage,',
        'Teinture) ; composition d’après les points clés de la fiche. Pays vides : pas de bloc « Traçabilité » dans',
        'les données de la fiche (certaines l’affichent par un module externe, non lu ici).',
        '',
        '===== LA MARQUE =====',
        '',
        'Service de réparation (oui / non) : ',
        'Lien de la page : ',
        '',
        'Revente ou seconde main (oui / non) : ',
        'Lien de la page : ',
    ]
    for category, items in chosen.items():
        lines += ['', f'===== {category} =====']
        for index, item in enumerate(items, 1):
            price = item['price']
            lines += [
                '', f'Produit {index}', f"Nom : {item['name']}", f"Lien : {item['url']}",
                'Rayon (femme / homme / mixte) : homme', f"Composition : {item['composition']}",
                f"Fabriqué en : {item['made']}", f"Tissé en : {item['woven']}", f"Teint en : {item['dyed']}",
                f"Prix : {price:g} €".replace('.', ',') if isinstance(price, (int, float)) else 'Prix : ',
            ]
    output.write_text('\n'.join(lines) + '\n')
    for category, items in chosen.items():
        print(f'{category}: {len(items)}/{QUOTAS[category]}')
        for item in items:
            print(f"   {item['name']} | {item['composition']} | confection {item['made']} | tissage {item['woven']} | teinture {item['dyed']} | {item['price']} €")



# ---------------------------------------------------------------------------------------------------------
# Relevé complet (6 nov. 2026) : rayons homme (/h/) et femme (/f/), un modèle par adresse de base.
# ---------------------------------------------------------------------------------------------------------

def all_targets(work):
    urls = re.findall(r'<loc>([^<]+)</loc>', (work / 'fr-FR.xml').read_text())
    targets, seen = [], set()
    for url in urls:
        match = re.search(r'asphalte\.com/([hf])/products/([^/?#]+)', url)
        if not match:
            continue
        rayon, slug = match.groups()
        if not hint(slug) or (rayon, base_model(slug)) in seen:
            continue
        seen.add((rayon, base_model(slug)))
        targets.append((rayon, slug, url))
    return targets


def download_all(work):
    pages = work / 'pages'
    pages.mkdir(exist_ok=True)
    todo = [(r, s, u) for r, s, u in all_targets(work) if not (pages / f'{r}-{s}.html').exists() and not (r == 'h' and (pages / f'{s}.html').exists())]
    print(len(todo), 'pages à télécharger', flush=True)
    for rayon, slug, url in todo:
        time.sleep(DELAY)
        request = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'fr-FR,fr;q=0.9'})
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                (pages / f'{rayon}-{slug}.html').write_text(response.read().decode('utf-8', errors='replace'))
        except Exception as error:  # noqa: BLE001
            print('ERREUR', url, error, flush=True)
    print('terminé', flush=True)


def parse_item(work, page_name, slug, url):
    path = work / 'json' / f'{page_name}.json'
    if not path.exists():
        return None
    data = json.loads(path.read_text())
    product = next((v['data'] for k, v in data.get('data', {}).items() if k.startswith('product-') and isinstance(v, dict) and v.get('data')), None)
    if not product:
        return None
    shop = product.get('shopify_product') or {}
    category = TYPES.get((shop.get('productType') or '').strip().lower()) or hint(slug)
    bullet = next((b for b in product.get('bullets') or [] if re.search(r'\d+\s*%', b)), None)
    if not category or not bullet:
        return None
    parts = re.findall(r'(\d+(?:[.,]\d+)?)\s*%\s*([^,%\d]+?)(?=\s+(?:et\s+)?\d|,|$)', bullet)
    if not 99 <= sum(float(x.replace(',', '.')) for x, _ in parts) <= 101:
        return None
    cut = re.compile(r"\s+(douce|bien|pour|confectionn|labellis|et\s+d[ée]perlant|double\s+retors|et\s+chaude).*$", re.I)
    composition = ', '.join(f'{x}% {cut.sub("", name).strip()}' for x, name in parts)
    steps = {}
    for block in product.get('blocks') or []:
        for inner in block.get('blocks') or []:
            if inner.get('_type') == 'tracabiliteBlock':
                for step in inner.get('parcours') or []:
                    steps[text(step.get('title')).lower()] = (step.get('factory_region') or '').split(',')[-1].strip()
    page_title = re.search(r'<title>([^<]*)</title>', (work / 'pages' / f'{page_name}.html').read_text())
    return {
        'category': category,
        'name': html.unescape(re.sub(r'\s*-\s*Asphalte\s*$', '', page_title.group(1) if page_title else slug)).strip(),
        'url': url, 'composition': composition,
        'made': next((steps[k] for k in steps if 'confection' in k or 'fabrication' in k), ''),
        'woven': next((steps[k] for k in steps if k.startswith('tissage') or k.startswith('tricotage')), ''),
        'dyed': next((steps[k] for k in steps if k.startswith('teinture')), ''),
        'price': (shop.get('priceRange') or {}).get('minVariantPrice'),
    }


def build_all(work, output):
    items, seen = [], set()
    for rayon, slug, url in all_targets(work):
        page_name = f'{rayon}-{slug}' if (work / 'json' / f'{rayon}-{slug}.json').exists() else slug
        if rayon == 'f' and page_name == slug:
            continue
        item = parse_item(work, page_name, slug, url)
        if not item:
            continue
        item['gender'] = 'homme' if rayon == 'h' else 'femme'
        key = (item['name'], item['gender'])
        if key in seen:
            continue
        seen.add(key)
        items.append(item)
    lines = [
        'RELEVÉ ASPHALTE', '', 'Date du relevé : 6 novembre 2026',
        'Relevé automatique complet : tous les vêtements des rayons homme et femme du plan du site, un exemplaire par',
        'modèle, 4 s entre chaque page. Pays d’après le bloc « Traçabilité » de chaque fiche (étapes Confection ou',
        'Fabrication, Tissage ou Tricotage, Teinture) ; composition d’après les points clés de la fiche (écartée si',
        'elle ne fait pas 100 %). Pays vides : pas de bloc « Traçabilité » dans les données de la fiche.',
        '', '===== LA MARQUE =====', '', 'Service de réparation (oui / non) : ', 'Lien de la page : ', '',
        'Revente ou seconde main (oui / non) : ', 'Lien de la page : ',
    ]
    for category in QUOTAS:
        chosen = [i for i in items if i['category'] == category]
        if not chosen:
            continue
        lines += ['', f'===== {category} =====']
        for index, item in enumerate(chosen, 1):
            price = item['price']
            lines += ['', f'Produit {index}', f"Nom : {item['name']}", f"Lien : {item['url']}",
                      f"Rayon (femme / homme / mixte) : {item['gender']}", f"Composition : {item['composition']}",
                      f"Fabriqué en : {item['made']}", f"Tissé en : {item['woven']}", f"Teint en : {item['dyed']}",
                      f"Prix : {price:g} €".replace('.', ',') if isinstance(price, (int, float)) else 'Prix : ']
    output.write_text('\n'.join(lines) + '\n')
    print(len(items), 'vêtements :', {g: sum(1 for i in items if i['gender'] == g) for g in ('homme', 'femme')},
          '| pays connus', sum(1 for i in items if i['made']))

if __name__ == '__main__':
    work = Path(sys.argv[2])
    if sys.argv[1] == 'download':
        download(work)
    elif sys.argv[1] == 'download-all':
        download_all(work)
    elif sys.argv[1] == 'build-all':
        build_all(work, Path(sys.argv[3]))
    else:
        build(work, Path(sys.argv[3]))
