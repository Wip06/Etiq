# TO DO

## Comptes connectés (interdit aux invités)
- Politique de confidentialité (`src/app/privacy.tsx`) : faire relire, et vérifier les conditions de l'offre gratuite de Gemini (utilisation des données par Google, relecture humaine)
- Valider en équipe les poids du pourcentage de correspondance (`goalWeight` et `budgetWeight`), et faire vérifier qu'il ne peut pas être lu comme un score environnemental (art. D. 541-245)
- Valider en équipe les seuils des objectifs (`CRITERIA` dans `src/data/recommendations.ts`) : 25 % de synthétique au plus (en partie jusqu'à 50 %), 50 % de confection en Europe au moins (en partie dès 25 %), 60 % des produits déclarés sous la médiane (en partie dès 40 %)

## Marques : relevés des fiches produits
Protocole dans `releves/` (20 produits par marque). Faits : Sézane, Uniqlo (à la main, 26 oct.), Sessùn, Ba&sh, Maje, Promod, Sandro, Claudie Pierlot (automatique, 2 nov.)  ; relevés complets automatiques du 6 nov. : Nudie Jeans (208 vêtements) et Asphalte (176) sur leurs sites, 28 marques sur WeDressFair (733).
- WeDressFair (revendeur multimarque éco-responsable, qui accepte la lecture automatique, y compris par les IA) : tout son catalogue de vêtements est relevé ; à relancer de temps en temps (scripts et mode d'emploi dans `scripts/releves/auto/`). Pays de la marque inconnu pour 12 marques (WeDressFair ne le dit pas)
- Pas de relevé à la main prévu (décidé le 5 nov.) : seulement des relevés automatiques, sur les sites qui l'acceptent. Bloquent la lecture automatique ou les robots de Claude : H&M, Zara, Octobre Éditions, Jules, Celio, Kiabi, Faguo, Le Slip Français, Armedangels, Loom, 1083, Atelier Tuffery, Hopaal, Bonne Gueule, Ecoalf, Saint James, Armor Lux, Patagonia, American Vintage. Ces marques s'appuient sur leurs chiffres du portail officiel, quand elles en ont (les fiches vierges de `releves/` restent disponibles si quelqu'un veut les remplir)
- Vérifier sur les sites les services relevés dans la presse : réparation et seconde main de Maje, seconde main de Ba&sh, de Sandro et de Claudie Pierlot ; seconde main de Promod ; réparation et seconde main de Sessùn (non vérifiés)
- Réessayer plus tard en automatique (trop de requêtes le 2 nov.) : Mango, Pimkie, Cyrillus, Des Petits Hauts, Rouje
- Balzac Paris : vérifier si c'est bien « MAISON BALZAC » sur le portail (269 produits)
- Rédiger la description de chaque marque relevée (remplace « Analyse environnementale à compléter »)
- Argument pour le jury : bien classées sur le portail, Ba&sh (74 % des produits sous la médiane) et Maje (84 %) ont pourtant 46 % et 35 % de synthétique en moyenne, et 16 % et 5 % de confection en Europe dans notre relevé : le coût officiel seul ne suffit pas, d'où nos objectifs séparés
- Argument pour le jury : les marques les plus achetées par la cible (H&M, Zara, Shein, Mango, Sézane) n'ont déclaré aucun produit sur le portail ; Clear Fashion utilise sa propre base, différente du portail
- Argument pour le jury : sur le portail, 97 % des produits déclarés par Faguo et Armedangels ont moins d'impact que la médiane de leur catégorie, 96 % chez Jules et Le Slip Français, mais seulement 26 % chez Kiabi (copie du 26 oct. 2026)

## Scan
- Déposer le calcul sur le portail avant de l'afficher (serveur de test pour la démo). Obligation légale avant tout affichage public d'une estimation
- Prix des alternatives (« même prix, moins d'impact », écart de prix à choisir par l'utilisateur) : le portail ne donne aucun prix, il faut une source (relevé à la main, gamme de prix par marque…)
- Quiz : valider en équipe les profils de marque (prix, nombre de références) et les prix de référence de `src/data/quiz.ts`, ce sont des hypothèses
- Équivalent eau pour les estimations par étiquette et le quiz (km de voiture aussi) : l'API Ecobalyse sans compte renvoie 0 pour l'eau (à tester avec un compte)

## Contenu
- « Le savais-tu ? » (`src/data/didYouKnow.ts`) : en ajouter, toujours vérifiées à la source d'origine (les fiches The Good Goods contiennent des erreurs, voir l'en-tête du fichier)
- Ajouter d'autres articles (liens The Good Goods + résumé écrit par nous)
- Image qui illustre chaque article dans l'onglet « Apprendre »

## Pitch
- Argument « IA frugale » : pas de chatbot, par choix (décidé le 6 nov.). Un chatbot pousse à multiplier les requêtes, contredit le message de sobriété et peut se tromper sur un label ou une matière ; les réponses existent déjà dans le lexique, les articles et les fiches. L'IA ne sert qu'à lire une étiquette, là où elle évite un vrai effort : un seul appel, le plus petit modèle (Flash-Lite), réflexion minimale, pas de réessai. Repère : 0,24 Wh et 0,03 g CO₂e pour une question texte médiane à Gemini, selon Google (août 2025, chiffres publiés par Google et discutés)

## Design
- Écran de démarrage (`assets/splash-tiko.png`) : à vérifier sur une version installée (`eas build`), Expo Go ne l'affiche pas. Il n'y a pas encore de `eas.json`
- Tiko : obtenir les images d'origine en meilleure résolution (environ 200 px de large aujourd'hui, ce qui limite sa taille à l'écran et rend l'icône de l'app un peu floue : à refaire avant toute publication)
- Écran Accueil provisoire : peut-être à remplacer
- Ajouter un mode invité avant la connexion
- Logo de l'app (pistes dans le canevas : étiquette cousue, « e » sur étiquette volante, scan de l'étiquette)

## Fait
- Recherche avec filtres : toucher un vêtement ouvre un pop-up sur fond flouté (« Neuf ou d'occasion ? ») avec Tiko, qui propose « Le trouver d'occasion sur Vinted » (bouton principal) puis « Acheter neuf sur le site de la marque · prix » (bouton secondaire, bordé, pleine largeur). Un titre et un repère tirés au hasard à chaque ouverture (5 versions : km en voiture et douches, heures d'empreinte d'un habitant de la planète, bouteilles d'eau, 43 vêtements neufs par an en France, bouteilles en plastique pour un vêtement synthétique), tous sourcés : médianes de la catégorie sur le portail (pas le coût du vêtement), Refashion 2025, notice officielle (`src/components/SecondHandChoice.tsx`)
- Seconde main sur Vinted (Etiq+) : bouton « Trouver d'occasion » sur la fiche produit (marque + type de vêtement), la fiche marque et l'estimation par étiquette (type de vêtement + matière principale), qui ouvre la recherche Vinted (l'app si elle est installée). Lien simple, sans commission ; « Alternatives en seconde main » n'est plus « Bientôt » dans le comparatif
- Mention « Estimation de démonstration, pas encore déposée sur le portail officiel » remontée sous l'étiquette du coût de l'estimation par étiquette
- Offre Etiq+ mise en avant pour les comptes standard : carte d'offre en haut de la page Etiq+ (15 € par an, soit 1,25 € par mois, les trois fonctions incluses, bouton « Passer à Etiq+ ») et carte « Passez à Etiq+ » sur l'accueil (masquée pour les abonnés et les invités)
- Page Etiq+ en comparatif « Standard ou Etiq+ ? » : tableau fonction par fonction (Standard gratuit, Etiq+ 15 € par an, « Bientôt » pour les alertes et la seconde main), liste dans `PLAN_FEATURES` (`src/data/etiqPlus.ts`)
- Relevés complets automatiques (6 nov.) : Nudie Jeans (208 vêtements) et Asphalte (176) sur leurs sites, tout le catalogue de vêtements de WeDressFair (733 vêtements de 28 marques éco-responsables), un exemplaire par modèle. 52 marques au catalogue, dont 38 avec leur carte « Notre relevé ». Recherche avec filtres : 1 251 vêtements, dont 529 homme. Les codes-barres relevés sont rapprochés de la copie du portail : 73 vêtements renvoient vers leur coût officiel
- Prix d'Etiq+ fixé à 15 € par an (6 nov.), affiché sur la page Etiq+ (`ETIQ_PLUS_PRICE` dans `src/data/etiqPlus.ts`)
- 13 marques ajoutées au catalogue (5 nov.) : Octobre Éditions, Jules, Celio, Kiabi, Faguo, Le Slip Français, Armedangels, Picture Organic Clothing, Loom, 1083, Atelier Tuffery, Asphalte, Nudie Jeans. Carte « Sur le portail officiel » (produits déclarés, part sous la médiane, durabilité médiane) sur la fiche des marques sans relevé. Rayons (Homme, Femme) dans les étiquettes de toutes les marques, pour la recherche
- Lien « Comment nous choisissons les marques » en bas de toutes les fiches marques, relevées ou non
- Bouton « Demander l'ajout d'une marque » dans l'onglet Marques (bas de liste, et quand la recherche ne trouve rien) : ouvre un e-mail déjà rédigé pour contact@etiq.com (`CONTACT_EMAIL` dans `src/utils/links.ts`). Vérifier que l'équipe reçoit bien les e-mails de cette adresse
- Recherche avec filtres (Etiq+), depuis l'onglet Marques : les 152 vêtements relevés sur les fiches produits de 8 marques, filtrés par rayon (femme, homme), catégorie, pays de fabrication (ou Europe), part de fibres synthétiques et prix, plus une recherche par nom, marque ou matière ; triés par prix, sans classement environnemental. Données générées depuis `releves/` par `npm run data:releves` (les moyennes recalculées sont celles des fiches marques)
- « Le savais-tu ? » vérifié le 5 nov. 2026 auprès des sources d'origine (Woolmark, FranceAgriMer, douane, Textile Exchange, Alliance du lin, FAO…) : 13 anecdotes corrigées ou précisées, 2 sur le cachemire remplacées par 2 sur le lin, chaque anecdote cite sa source (lien), l'article The Good Goods n'est proposé que s'il ne la contredit pas
- « Le savais-tu ? » en pop-up à l'ouverture, sur l'app floutée (expo-blur), fermé par « Continuer », en touchant le fond ou par le bouton retour d'Android
- Magasins à proximité (Etiq+) aussi sur la fiche produit, avec le nom de la marque plutôt que celui de la société déclarée sur le portail quand l'app la connaît
- Saisie manuelle de la composition (matières, pourcentages, pays de confection) : pour corriger une lecture d'étiquette, ou tout saisir si la lecture échoue, si l'étiquette est illisible ou si la photo est introuvable
- Mode hors ligne : les fiches du portail et les étiquettes officielles déjà consultées sont gardées sur le téléphone ; sans réseau (8 s sans réponse), l'app les affiche avec la date de la copie. Effacées avec le compte
- Etiq+ simulé : page Etiq+ (avantages, abonnement et résiliation simulés, sans paiement), statut gardé par compte. « Ma garde-robe » réservée aux abonnés : bouton « Je l'ai acheté » sur la fiche produit et l'estimation par étiquette, total, niveaux et empreinte dans la garde-robe, accès depuis le profil
- Magasins à proximité (Etiq+) sur la fiche marque : ouvre Google Maps sur la recherche « marque + magasin »
- Quiz garde-robe proposé en tête de l'accueil tant que le compte ne l'a pas fait, donc juste après l'inscription
- Lecture d'étiquette accélérée : Flash-Lite en premier, 10 s maximum par modèle, plus de réessais automatiques, réflexion minimale. Mesuré le 5 nov. 2026 : 1,6 à 3,5 s par étiquette (contre 78 à 150 s le 26 oct.), lecture toujours exacte
- Mode étiquette : photo, lecture par Gemini dans une fonction Supabase, calcul Ecobalyse, affichage « Estimation Etiq »
- Étiquette officielle du coût environnemental sur la fiche produit (SVG du portail, charte graphique respectée)
- Comparaison avec la catégorie, à poids égal, et boutons « i » d'explication
- Cadre de visée du scanner, codes-barres Android corrigés
- Base complète du portail téléchargée (scripts `npm run data:download` et `npm run data:stats`)
- Passage au SDK 58 d'Expo
- Alternatives avec moins d'impact (même catégorie, poids proche, au moins 10 % de moins pour 100 g) sur la fiche produit et l'estimation par étiquette, sans filtre de prix
- Repères sur la fiche produit : eau en douches et bouteilles (indicateur « wtu »), climat en km de voiture (« cch », facteur Impact CO2 de l'ADEME) ; plastique en bouteilles de 1,5 L sur l'estimation par étiquette (fibres synthétiques × masse)
- Quiz « Quel est l'impact de votre garde-robe ? » en haut de l'onglet Apprendre, réservé aux comptes connectés : achats d'une année, matière, pays de fabrication et type de marque, calculés avec Ecobalyse ; leviers (marque, occasion, pays, matière) ; comparaison aux 43 vêtements neufs par Français en 2025 (Refashion) ; matière inconnue déduite du type de marque (vêtements types d'Ecobalyse)
- Points de coût environnemental traduits en jours d'empreinte d'un habitant moyen de la planète (1 000 000 de points = un an, notice officielle p. 8 ; moyenne mondiale 2010 des facteurs EF 3.1 du JRC) : fiche produit, estimation par étiquette
- Tiko, la mascotte, avec sa bulle (`src/components/Tiko.tsx`), cliquable quand elle propose de scanner, et icône de l'app : accueil, onboarding, questions des quiz, fiche produit, produit non déclaré, alternatives, attente de lecture, résultat du quiz, listes vides. Un seul par écran, pose liée à la situation et jamais au résultat
- Résultat du quiz en km de voiture et en douches (achats × vêtement médian de chaque catégorie sur le portail, ordre de grandeur), avec la comparaison à la moyenne française
- Encart matière (résumé du lexique + « En savoir plus » vers l'article The Good Goods) à côté de chaque matière lue sur une étiquette
- Onboarding : 4 objectifs (réduire mon impact, acheter moins mais durable, moins de plastique, fabrication proche) et budget ; modifiables depuis le profil
- Recommandations à l'accueil : « Marques pour vous » filtrées par les objectifs (pas de note de marque) et « À lire pour vous » ; page « Nos critères » ; section « Notre relevé » sur la fiche marque
- Relevés Sézane (11 % de synthétique, 75 % confectionné en Europe) et Uniqlo (27 %, 0 %)
- Profil : carte « Mon impact » (indicateur avant/après : évolution du quiz garde-robe depuis le premier, part des vêtements scannés sous la médiane de leur catégorie), prénom (demandé à l'onboarding, modifiable), page « Confidentialité », suppression du compte
- Petit mouton / mascotte qui s'anime et apporte des petites infos 
- Au moment de l'ouverture prendre un "le savais tu dans les articles" 


## Idées
- Un quiz pour tester ses connaissances ? Gamification ? Badges quand on scanne des produits durables ? Quand on a des bonnes réponses...
- Remplir des infos personnelles pour analyser de la data


## Etiq+ 
- Décider si le mode hors ligne devient une fonction Etiq+ : aujourd'hui il marche pour tous, ce qui protège la démo quel que soit le compte utilisé
- Pour la démo : créer deux comptes, l'un passé en Etiq+ depuis la page Etiq+ (« Passer à Etiq+, 15 € par an (simulation) »), l'autre standard
- Recherche avec filtres : 1 251 vêtements de 38 marques. Chaque nouveau relevé l'élargit : après avoir ajouté un fichier dans `releves/`, lancer `npm run data:releves` (avec la copie du portail, `npm run data:download`, pour rapprocher les codes-barres ; sans elle, les liens vers le coût officiel disparaissent)
- Uniqlo : confirmer que le relevé du 26 oct. a été fait dans le rayon femme (supposé d'après les produits : robes, blouses, top à brassière intégrée)
