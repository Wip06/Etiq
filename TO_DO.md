# TO DO

## Comptes connectés (interdit aux invités)
- « Ma garde-robe » (fonction premium Etiq+, abonnement annuel prévu au modèle économique) : bouton « Je l'ai acheté » sur la fiche d'un vêtement scanné, garde-robe et impact cumulé dans le profil. Même en maquette, il montre au jury que le modèle économique existe dans le produit
- Politique de confidentialité (`src/app/privacy.tsx`) : faire relire, et vérifier les conditions de l'offre gratuite de Gemini (utilisation des données par Google, relecture humaine)
- Valider en équipe les seuils des objectifs (`CRITERIA` dans `src/data/recommendations.ts`) : 25 % de synthétique au plus, 50 % de confection en Europe au moins, 60 % des produits déclarés sous la médiane. Uniqlo est à 27 % de synthétique, cas limite

## Marques : relevés des fiches produits
Protocole et fiches à remplir dans `releves/` (20 produits par marque, les premiers affichés dans 6 catégories). Un relevé à la main prend 10 à 20 minutes. Faits le 26 oct. 2026 : Sézane, Uniqlo.
- À la main (sites qui bloquent la lecture automatique) : **H&M, Zara, Shein, Kiabi** en priorité (les plus achetées par la cible), puis Mango, Pull&Bear. American Vintage aussi : son robots.txt interdit les robots sur les fiches
- Automatique, à réessayer plus tard (sites Shopify, bloqués le 26 oct. après un relevé trop gourmand sur Noo) : **Armedangels, Le Slip Français, Loom, Noo**. Une seule requête pour le catalogue, puis 20 fiches espacées de 5 s. Si le blocage persiste, relevé à la main
- Automatique : **Asphalte** (à confirmer) et **Maje** (composition lisible, pays de fabrication chargés à part : à compléter à la main, environ 5 min)
- Balzac Paris : vérifier si c'est bien « MAISON BALZAC » sur le portail (269 produits)
- Rédiger la description de chaque marque relevée (remplace « Analyse environnementale à compléter »)
- Argument pour le jury : les marques les plus achetées par la cible (H&M, Zara, Shein, Mango, Sézane) n'ont déclaré aucun produit sur le portail ; Clear Fashion utilise sa propre base, différente du portail

## Scan
- **Lecture d'étiquette trop lente** (mesuré le 26 oct. 2026 : 93 s à plus de 120 s quand `gemini-3.8-flash` répond, 6 s avec `gemini-3.5-flash-lite`, lecture correcte). Dans `supabase/functions/read-label` : mettre `gemini-3.5-flash-lite` en premier (3.8-flash en secours), limiter chaque modèle à 20 s avant de passer au suivant, réduire la « réflexion » du modèle (vérifier le nom du réglage pour Gemini 3). Reste gratuit. Puis déployer avec `npx supabase functions deploy read-label --no-verify-jwt` (accès au compte Supabase du projet : Yannick) et mettre à jour l'ordre des modèles dans CLAUDE.md. En attendant, le secret `GEMINI_MODEL=gemini-3.5-flash-lite` le place en tête sans redéployer
- Déposer le calcul sur le portail avant de l'afficher (serveur de test pour la démo). Obligation légale avant tout affichage public d'une estimation
- Saisie manuelle de la composition en secours, si la lecture de l'étiquette échoue
- Prix des alternatives (« même prix, moins d'impact », écart de prix à choisir par l'utilisateur) : le portail ne donne aucun prix, il faut une source (relevé à la main, gamme de prix par marque…)
- Encart social (salaire minimum comparé au salaire vital du pays de confection) : abandonné le 26 oct. 2026, les chiffres de salaire vital de WageIndicator sont payants. Piste restante : les études publiques Anker (Global Living Wage Coalition), mais elles ne couvrent pas tous les pays et datent d'années différentes
- Quiz : valider en équipe les profils de marque (prix, nombre de références) et les prix de référence de `src/data/quiz.ts`, ce sont des hypothèses
- Équivalent eau pour les estimations par étiquette et le quiz (km de voiture aussi) : l'API Ecobalyse sans compte renvoie 0 pour l'eau (à tester avec un compte)

## Contenu
- Ajouter d'autres articles (liens The Good Goods + résumé écrit par nous)
- Image qui illustre chaque article dans l'onglet « Apprendre »

## Assistant
- Chatbot pour des conseils et des questions

## Design
- Écran Accueil provisoire : peut-être à remplacer
- Ajouter un mode invité avant la connexion
- Logo de l'app (pistes dans le canevas : étiquette cousue, « e » sur étiquette volante, scan de l'étiquette)

## Fait
- Mode étiquette : photo, lecture par Gemini dans une fonction Supabase, calcul Ecobalyse, affichage « Estimation Etiq »
- Étiquette officielle du coût environnemental sur la fiche produit (SVG du portail, charte graphique respectée)
- Comparaison avec la catégorie, à poids égal, et boutons « i » d'explication
- Cadre de visée du scanner, codes-barres Android corrigés
- Base complète du portail téléchargée (scripts `npm run data:download` et `npm run data:stats`)
- Passage au SDK 58 d'Expo
- Alternatives avec moins d'impact (même catégorie, poids proche, au moins 10 % de moins pour 100 g) sur la fiche produit et l'estimation par étiquette, sans filtre de prix
- Repères sur la fiche produit : eau en douches et bouteilles (indicateur « wtu »), climat en km de voiture (« cch », facteur Impact CO2 de l'ADEME) ; plastique en bouteilles de 1,5 L sur l'estimation par étiquette (fibres synthétiques × masse)
- Quiz « Quel est l'impact de votre garde-robe ? » en haut de l'onglet Apprendre, réservé aux comptes connectés : achats d'une année, matière, pays de fabrication et type de marque, calculés avec Ecobalyse ; leviers (marque, occasion, pays, matière) ; comparaison aux 43 vêtements neufs par Français en 2025 (Refashion) ; matière inconnue déduite du type de marque (vêtements types d'Ecobalyse)
- Points de coût environnemental traduits en jours d'empreinte d'un habitant moyen de la planète (1 000 000 de points = un an, notice officielle p. 8 ; moyenne mondiale 2010 des facteurs EF 3.1 du JRC) : quiz, fiche produit, estimation par étiquette
- Encart matière (résumé du lexique + « En savoir plus » vers l'article The Good Goods) à côté de chaque matière lue sur une étiquette
- Onboarding : 4 objectifs (réduire mon impact, acheter moins mais durable, moins de plastique, fabrication proche) et budget ; modifiables depuis le profil
- Recommandations à l'accueil : « Marques pour vous » filtrées par les objectifs (pas de note de marque) et « À lire pour vous » ; page « Nos critères » ; section « Notre relevé » sur la fiche marque
- Relevés Sézane (11 % de synthétique, 75 % confectionné en Europe) et Uniqlo (27 %, 0 %)
- Profil : carte « Mon impact » (indicateur avant/après : évolution du quiz garde-robe depuis le premier, part des vêtements scannés sous la médiane de leur catégorie), prénom (demandé à l'onboarding, modifiable), page « Confidentialité », suppression du compte

## Idées
- Un quiz pour tester ses connaissances ? Gamification ? Badges quand on scanne des produits durables ? Quand on a des bonnes réponses...
- Remplir des infos personnelles pour analyser de la data
- Quiz d'impact de la garde-robe : le proposer aussi juste après l'inscription (onboarding) ? 