# Contexte projet - Challenge EDHEC x 42 Nice

Ce fichier résume une conversation préparatoire tenue dans l'app Claude le 7 octobre 2026.
Lis-le en entier avant de commencer à travailler.

## Qui je suis

- Yannick, étudiant à 42 Nice (depuis novembre 2024).
- Stack déjà pratiquée : C, C++98, Rust (Askama, WASM, Tailwind sur VitalSync / ft_transcendence), TypeScript / React Native (CleanGuide).
- Environnement : Mac + iPhone + ipad Pro.

## Le challenge

- Challenge "Tech & Business for Good" EDHEC Business School x 42 Nice, automne 2026.
- Équipes mixtes : étudiants EDHEC (business) + étudiants 42 (tech).
- Calendrier :
  - Mer. 7 oct. 2026, 13h00-17h30 : kick-off (fait)
  - Mer. 14 oct. 2026, 16h00-19h00
  - Lun. 26 oct. 2026, 13h00-16h00
  - Mar. 3 nov. 2026, 13h00-17h00
  - Lun. 16 nov. 2026, 14h00-16h00
  - Mer. 18 nov. 2026, 13h00-17h00 : session finale en présentiel
- Précédent : CleanGuide, app React Native, 1re place sur 10 équipes au hackathon EDHEC x 42 Nice 2025. Même format de jury, recette à reproduire.

## L'idée retenue

**"Le Yuka des vêtements"** - champ choisi : Sustainability.

- Problème : manque de transparence de l'industrie de la mode pour les consommateurs soucieux de leur impact environnemental (composition des vêtements, difficulté à identifier les marques responsables).
- Question directrice (fiche équipe) : comment rendre l'industrie de la mode plus transparente pour que les consommateurs comprennent l'impact environnemental de leurs vêtements ?
- Format : vraie app mobile en démo (comme CleanGuide), pas seulement une maquette.

### Retours sur la fiche équipe (Session 1) à corriger

- **Un seul profil utilisateur** (la fiche l'exige). Proposition : jeune adulte 20-35 ans qui veut acheter responsable mais ne sait pas quelles marques ou quels vêtements le sont. Le B2B relève du modèle de revenus, pas de l'utilisateur.
- **Un indicateur mesurable avant/après**, par exemple : % d'utilisateurs capables d'évaluer l'impact d'un vêtement avant achat, ou part d'achats responsables dans leurs dépenses textile.
- **Paragraphe "What we want to do"** trop court : préciser qui vit le problème et le changement visé.
- **Techno** à préciser : le CNN / OCR sert à scanner l'étiquette d'un vêtement pour en extraire composition et pays de fabrication.

## Concurrence

Section revérifiée le 7 oct. 2026.

- **Clear Fashion** (France, Marseille) : app gratuite "Clear Fashion - Score & Scan" lancée en 2019, 400 000+ utilisateurs, 500+ marques, 4,7/5 sur l'App Store. Note les marques avec un Fashion Score /100 maison (environnement, social, santé, animaux). **Depuis mars 2026, elle scanne le code-barres d'un vêtement en magasin et affiche son coût environnemental officiel** : 27 000 produits de 66 marques (Kiabi, Tex, Courrèges, Millet...). Revendique 17 millions de consommateurs qui la connaissent. Revenus : modules payants vendus aux marques (calcul et dépôt du coût environnemental, fiches AGEC, passeport numérique, allégations). Limite : ne couvre que les produits déclarés par les marques.
- **Portail officiel de l'État** : recherche gratuite par code-barres, 105 545 références de 171 marques (672 148 codes-barres). Depuis octobre 2026, un citoyen peut y déclarer lui-même un vêtement via un formulaire (FranceConnect) : seulement 3 déclarations citoyennes au 7 oct. 2026.
- **Good On You** (Australie) : note les marques de 1 à 5 (environnement, droits des travailleurs, bien-être animal), plus de 6 000 marques, app gratuite. Note des marques, pas des produits. Revenus : accès payant à ses données de notation, mise en avant des marques bien notées, commissions d'affiliation. (Partenaires Farfetch, Microsoft, Klarna : non revérifiés.)
- **Outils B2B Ecobalyse** (ex. FilVert sur Shopify, Carbonfact) : aident les marques à calculer et afficher leur coût environnemental. Pas orientés consommateur.

### Différenciant visé

**L'ancien différenciant ne tient plus** : "les concurrents notent des marques, pas des vêtements" est faux depuis mars 2026. Clear Fashion et le portail officiel donnent déjà le coût d'un vêtement précis par code-barres.

Proposition à valider en équipe : couvrir **les vêtements que la marque n'a pas déclarés**, c'est-à-dire l'immense majorité (171 marques seulement sur le portail).
- Si le code-barres est sur le portail : afficher le coût officiel (comme Clear Fashion).
- Sinon : lire l'étiquette (composition, pays), calculer le coût avec Ecobalyse en tant que tiers (droit ouvert le 1er oct. 2026) et le déposer sur le portail. Ni Clear Fashion ni le portail ne font ce calcul automatiquement à partir d'une photo.
- Neutralité : aucune marque ne nous paie, alors que Clear Fashion vit des marques qu'elle note.

## Cadre réglementaire (France)

- **Coût environnemental** des vêtements, exprimé en points d'impact (plus c'est élevé, plus l'impact est fort). Méthode officielle : **Ecobalyse** (ADEME / beta.gouv), gratuit et open source. Paramètres : composition, masse, pays des étapes de fabrication, durabilité.
- Décret n° 2025-957 et arrêté du 6 septembre 2025.
- **Depuis le 1er oct. 2025** : affichage possible, sur base volontaire.
- **Depuis le 1er oct. 2026** : l'affichage reste volontaire pour les marques, mais **n'importe quel tiers** (association, média, comparateur, app) peut calculer et publier le coût environnemental d'un vêtement sans l'accord de la marque, à partir de données disponibles ou estimées, en respectant les conditions réglementaires. Le tiers s'expose au même contrôle qu'une marque. (Vérifié le 7 oct. 2026 sur le texte du décret : caractère volontaire confirmé, articles D. 541-243 à D. 541-245 du code de l'environnement. Seule obligation : quiconque communique un score environnemental sur un vêtement doit aussi afficher le coût environnemental, art. D. 541-245.)
- **Contraintes pour l'app** :
  - Si la marque a calculé elle-même son coût, c'est ce chiffre qui doit être repris par tous. On ne publie pas de chiffre concurrent.
  - Tout score maison sur l'impact environnemental doit être accompagné du coût environnemental officiel et ne doit pas le contredire ni prêter à confusion.
  - Un tiers qui calcule et publie un coût doit respecter **toutes** les conditions de l'art. D. 541-243 et garder les justificatifs du calcul à disposition de la DGCCRF (art. R. 541-246). Texte intégral lu le 7 oct. 2026. Concrètement :
    - **déposer le calcul sur le portail avant de l'afficher** (coût, détail par impact, identification du produit, date, auteur, version de la méthode, plus les paramètres utilisés, réservés aux contrôleurs) ;
    - ne pas le mettre à jour plus d'une fois tous les trois mois ;
    - utiliser la signalétique officielle sans la modifier : module noir de 80 px de haut en numérique, au moins aussi grand que tout autre score environnemental affiché à côté (arrêté art. 8, charte graphique de mars 2026).
  - Le coût se rapporte à une **référence** de produit (même composition, couleur, forme ; hors tailles), identifiée sur le portail par son code-barres (GTIN).
  - Périmètre : produits neufs ou remanufacturés (art. D. 541-241), pas la seconde main. 11 catégories seulement : t-shirt/polo, pull, chemise, pantalon/short, jean, jupe/robe, manteau/veste, chaussettes, boxer/slip, caleçon, maillot de bain. Hors périmètre : chaussures, soutiens-gorge, doudounes, accessoires (écharpe, bonnet), vêtements de sport techniques, produits dont plus de 20 % de la masse est une matière non modélisée (ex. chemise 100 % soie).
- **D'où vient la confusion "obligatoire"** : la loi Climat de 2021 (art. L. 541-9-11 et L. 541-9-12 du code de l'environnement) pose le principe d'un affichage obligatoire, mais renvoie à un décret la liste des catégories concernées. Pour le textile, le décret de 2025 n'a fixé qu'un cadre volontaire. Aucun calendrier d'obligation à ce jour.
- **Sanctions** : amende administrative jusqu'à 3 000 € (personne physique) et 15 000 € (personne morale) pour un affichage non conforme (art. L. 541-9-14 et L. 541-9-15, lus en résumé, à relire avant la finale). Une fausse déclaration sur le portail relève de l'art. 441-1 du code pénal (CGU du portail).
- **Contrôle** : la DGCCRF sanctionne déjà les manquements d'information environnementale, mais sur un autre texte : la fiche produit de la loi AGEC (art. 13, décret n° 2022-748), qui impose aux marques de publier le pays de tissage, de teinture/impression et de confection, et la mention sur les microfibres plastiques. Shein : 1,098 M€ le 3 juillet 2025. Boohoo : 224 950 € le 8 septembre 2026 (pays de fabrication absents sur 1 863 articles). Ces pays sont justement les données dont un tiers a besoin pour calculer un coût.
- **Loi n° 2026-602 du 8 juillet 2026** ("mode ultra-express") : ne rend pas l'affichage du coût obligatoire. Elle impose d'indiquer les lieux de fabrication des textiles vendus en ligne, crée des pénalités par produit (0,25 à 12 € en 2026, jusqu'à 20 € en 2030) et interdit la publicité pour l'ultra-express au 1er janvier 2027. Lue en résumé, pas mot pour mot.
- **Europe** : l'acte délégué ESPR pour les vêtements est prévu au 4e trimestre 2027 (Commission européenne). Il porte sur l'écoconception et le passeport numérique produit ; la page de la Commission ne mentionne aucun score environnemental pour le consommateur. L'ancienne formule "obligation d'affichage UE vers 2030" n'est pas confirmée : ne pas l'affirmer devant le jury.
- Portail officiel : https://affichage-environnemental.ecobalyse.beta.gouv.fr/

### Idée "vigilance citoyenne" (si une marque ment)

L'app ne recalcule pas un chiffre concurrent, mais peut :
- afficher le coût déclaré avec son détail public ;
- comparer la composition scannée sur l'étiquette avec celle déclarée sur le portail et signaler une incohérence ;
- proposer de signaler l'anomalie à la DGCCRF via SignalConso.
Angle juridique à faire valider avant la finale.

Vérifié le 7 oct. 2026 :
- La comparaison directe n'est **pas possible** : la fiche publique du portail donne le coût, son détail par impact et par étape (matières, filature, tissage, teinture, confection, usage, fin de vie) et le coefficient de durabilité, mais pas la composition ni les pays déclarés, réservés à la DGCCRF et à l'ADEME. Seule la masse se déduit (coût total / coût aux 100 g).
- Piste indirecte : recalculer l'étape "matières" à partir de l'étiquette et la comparer à celle déclarée. À manier avec prudence.
- SignalConso a bien une catégorie dédiée aux allégations environnementales trompeuses, en magasin et en ligne.

## Modèle économique

- **Garder la neutralité du classement** (force de Yuka) : aucune marque ne paie pour être mieux notée ou recommandée. L'idée initiale "les entreprises paient pour être recommandées" est abandonnée car elle détruit la confiance.
- **B2C freemium** : scan gratuit ; premium en **abonnement annuel à petit prix** (référence : Yuka, prix libre de 10, 15, 20 ou 50 €/an) plutôt que mensuel, car on achète des vêtements bien moins souvent que de la nourriture. Fonctions premium utiles entre deux achats : suivi de l'impact de sa garde-robe, alertes sur ses marques favorites, alternatives en seconde main.
- **B2B neutre** en complément : données agrégées anonymisées, outil d'audit / d'amélioration pour les marques. Le premium seul ne suffira probablement pas, à assumer devant le jury.

## Choix techniques

- **React Native** (TypeScript), comme CleanGuide : vraie app sur téléphone pour la démo, accès caméra, pas de nouvelle stack à apprendre.
- Parcours clé à prioriser : **scan de l'étiquette -> coût environnemental -> alternatives**.
- Brique technique : OCR / vision pour lire l'étiquette (composition, pays), puis calcul ou récupération du coût via la méthode Ecobalyse.
- Délai : environ 6 semaines jusqu'à la finale du 18 novembre 2026.

### APIs officielles (testées avec de vraies requêtes le 7 oct. 2026)

**Portail de l'affichage environnemental** : base `https://affichage-environnemental.ecobalyse.beta.gouv.fr/api`, spécification OpenAPI sur `/documentation/api`.
- Sans authentification :
  - `GET /produits/{gtin}` : coût officiel d'un vêtement par code-barres (8, 12 ou 13 chiffres), 404 s'il n'est pas déclaré ;
  - `GET /produits/tous?page=&size=` : tous les produits publics (500 par page maximum) ;
  - `GET /produits/{gtin}/historique` : versions successives ;
  - `GET /image?type=gtin&gtin=...` : étiquette officielle en SVG, prête à afficher.
- Avec un jeton `Bearer` (compte ProConnect ou FranceConnect) : `POST /produits` pour déclarer un produit.
- Serveur de test pour s'entraîner sans toucher aux vraies données : `https://test-affichage-environnemental.ecobalyse.beta.gouv.fr/`. À utiliser pour la démo.
- Données publiques réutilisables sous Licence Ouverte (art. D. 541-243).
- Non vérifié : qu'un tiers puisse déclarer par API un produit d'une marque qui n'est pas la sienne. L'aide en ligne sur la déclaration par un tiers est encore vide ("à venir"). À tester sur le serveur de test.

**Calculateur Ecobalyse** (version réglementaire 7.0.0) : `POST https://ecobalyse.beta.gouv.fr/versions/v7.0.0/api/textile/simulator`, sans authentification. Listes de valeurs : `/textile/products`, `/textile/materials`, `/textile/countries`.
- Minimum accepté : catégorie, masse, composition, pays de confection. Exemple testé : t-shirt 100 % coton de 170 g confectionné au Bangladesh = 1 771 points.
- Paramètres obligatoires pour une déclaration réglementaire : catégorie, masse, composition, pays de tissage/tricotage, pays d'ennoblissement (teinture), pays de confection. Le reste a une valeur par défaut.
- 16 matières modélisées ; équivalences officielles pour les autres (polyamide = nylon, lyocell = viscose, soie et cachemire = laine).

### Ce que l'étiquette ne donne pas

- L'étiquette cousue donne la composition (obligatoire, règlement UE 1007/2011) et souvent le pays de confection. Elle ne donne **ni la masse, ni les pays de tissage et de teinture**. Ces pays figurent sur la fiche produit AGEC en ligne des marques ; la masse se pèse ou se prend par défaut selon la catégorie.
- **Un calcul fait avec la seule étiquette pénalise le vêtement.** Le coefficient de durabilité (0,67 à 1,45) dépend de données de marque absentes de l'étiquette : nombre de références au catalogue, prix, taille de l'entreprise, service de réparation. Par défaut il vaut 0,67, le pire cas. Même t-shirt testé : 1 771 points par défaut, 879 points si la marque est une PME avec 500 références et un prix de 35 €. Lire aussi le prix sur l'étiquette et connaître la marque réduit cet écart.

### Parcours recommandé

1. Scanner le code-barres et interroger le portail. S'il répond, afficher le coût officiel avec l'étiquette SVG.
2. Sinon, photographier l'étiquette de composition (OCR), compléter catégorie, masse et prix, calculer avec Ecobalyse.
3. Déposer le calcul sur le portail avant de l'afficher (serveur de test pour la démo).

## Design visuel

Six palettes candidates, aucune tranchée au 7 oct. 2026 (fond / texte / accent principal / accent secondaire).

Première série :

- **Indigo denim** : `#F5F6F8` / `#14161A` / `#2B3A8F` / `#E8A33D`
- **Écru et fil rouge** : `#F3EFE6` / `#1C1B19` / `#B3261E` / `#6B655A`
- **Vert sapin** : `#F2F4EF` / `#15201A` / `#1F5C45` / `#C8643C`

Seconde série, sur la direction "moderne, luxe, éthique" donnée par Yannick :

- **Noir et laiton** : `#F7F5F0` / `#111111` / `#8C6A2F` / `#3F4A36`
- **Vert bouteille et champagne** (thème sombre) : `#0F1F1A` / `#F4F1EA` / `#D9C08A` / `#8FA595`
- **Grège et prune** : `#EFEAE2` / `#1E1A1C` / `#4A2338` / `#8A7355`

Nuanciers : https://claude.ai/artifact/2npraUEn26vKSWUCNWdq5K (cadres "Palettes" et "Palettes : moderne, luxe, éthique").

## Sources

- Clear Fashion : https://us.fashionnetwork.com/news/Clear-Fashion-app-takes-off-on-mobile,1136732.html
- Good On You : https://goodonyou.eco/faqs/
- Affichage textile au 1er oct. 2026 : https://projetcelsius.com/blog/affichage-environnemental-textile-1er-octobre-2026/
- Ecobalyse : https://projetcelsius.com/blog/ecobalyse-outil-affichage-environnemental-textile/
- Dispositif et dépôt sur le portail : https://www.lettredesreseaux.com/textiles-un-affichage-environnemental-facultatif-depuis-le-1er-octobre-2025.html
- Amende Shein : https://cm.twobirds.com/en/insights/2025/france/1098-million-deuros-damende-pour-nonrespect-de-linformation-sur-la-qualit-environnementale-des-produ
- Amende Boohoo : https://fashionunited.uk/news/business/france-fines-boohoo-225-000-euros-over-missing-environmental-product-information/2026090890221

Ajoutées lors de la vérification du 7 oct. 2026 :

- Décret n° 2025-957 (texte intégral) : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052212871
- Arrêté du 6 septembre 2025 : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052213047
- Code de l'environnement, art. L. 541-9-11 à L. 541-9-15 : https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006074220/LEGISCTA000043959454/
- Loi n° 2026-602 du 8 juillet 2026 : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054399113
- Notice méthodologique (PDF, 68 pages) : https://affichage-environnemental.ecobalyse.beta.gouv.fr/notice-reglementaire.pdf
- Charte graphique (PDF) : https://affichage-environnemental.ecobalyse.beta.gouv.fr/charte.pdf
- Documentation API du portail : https://affichage-environnemental.ecobalyse.beta.gouv.fr/documentation/api
- Statistiques du portail : https://affichage-environnemental.ecobalyse.beta.gouv.fr/stats
- Aide du portail (déclaration par un particulier, serveur de test) : https://docs.numerique.gouv.fr/docs/4c19480c-746e-49d9-aa1c-8b94f8790720/
- API Ecobalyse 7.0.0 : https://ecobalyse.beta.gouv.fr/versions/v7.0.0/#/api
- Clear Fashion, lancement du scan : https://fashionunited.be/fr/actualite/mode/affichage-environnemental-clear-fashion-lance-le-scan-pour-27-000-produits-textile/2026033134911
- Clear Fashion, App Store : https://apps.apple.com/fr/app/clear-fashion-score-scan/id1468459532
- Amende Boohoo, communiqué DGCCRF : https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/injonctions-et-sanctions/la-dgccrf-sanctionne-boohoo-dune-amende-de-224-950-euros-pour-une-information-defaillante-sur-la
- ESPR textile, Commission européenne : https://single-market-economy.ec.europa.eu/single-market/digital-product-passport/textile-apparel_en
- SignalConso, allégations environnementales : https://signal.conso.gouv.fr/fr/tromperie-allegation-label-environnement-magasin
