// Articles de l'onglet « Apprendre », rédigés par nous. Chaque fait est vérifié à sa source d'origine
// (texte de loi, rapport, méthode officielle), citée dans « Sources » ; l'article de The Good Goods
// sert de « pour aller plus loin ». Vérifiés le 11 nov. 2026.
//
// Images : couverture de l'article de The Good Goods cité, affichée depuis leur site avec la mention de la
// source (choix de l'équipe, le 11 nov. 2026). Elles restent protégées par le droit d'auteur : à faire
// autoriser par The Good Goods, ou à remplacer, avant toute publication de l'app.

export type ArticleImage = {
  url: string;
  credit: string;
};

export type Article = {
  id: string;
  title: string;
  theme: string;
  summary: string;
  image?: ArticleImage;
  paragraphs: string[];
  sources: { label: string; url: string }[];
};

const TGG = 'https://www.thegoodgoods.fr';
const TGG_IMAGES = `${TGG}/wp-content/uploads`;
const TGG_CREDIT = 'Image : The Good Goods';

export const articles: Article[] = [
  {
    id: 'cout-environnemental',
    title: 'Le coût environnemental, c’est quoi ?',
    theme: 'Réglementation',
    summary: 'Le chiffre officiel qui mesure l’impact d’un vêtement, et comment le lire.',
    image: { url: `${TGG_IMAGES}/2023/07/Capture-decran-2023-07-05-a-11.25.39.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'Le coût environnemental est l’indicateur officiel de l’impact d’un vêtement en France. Il s’exprime en points d’impact : plus le chiffre est élevé, plus l’impact est fort.',
      'Il est calculé avec la méthode publique Ecobalyse, développée par l’ADEME et beta.gouv. Le calcul tient compte de la composition, de la masse, des pays où le vêtement a été tissé, teint et confectionné, et de sa durabilité.',
      'Depuis le 1er octobre 2025, les marques peuvent afficher ce coût, sur la base du volontariat. Depuis le 1er octobre 2026, n’importe quel tiers (association, média, application) peut aussi le calculer et le publier, à condition de respecter les règles officielles.',
      'Tous les coûts publiés sont déposés sur un portail public, où chacun peut les consulter par code-barres.',
    ],
    sources: [
      { label: 'Décret n° 2025-957', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052212871' },
      { label: 'Portail officiel', url: 'https://affichage-environnemental.ecobalyse.beta.gouv.fr/' },
      {
        label: 'Pour aller plus loin : The Good Goods, l’affichage environnemental',
        url: `${TGG}/media/juridique/affichage-environnemental-les-jeunes-marques-sont-elles-concernees-et-comment-le-mettre-en-oeuvre/`,
      },
    ],
  },
  {
    id: 'lire-etiquette',
    title: 'Lire l’étiquette de son vêtement',
    theme: 'Matières premières',
    summary: 'Ce que l’étiquette cousue vous apprend, et ce qu’elle ne dit pas.',
    image: { url: `${TGG_IMAGES}/2023/09/pexels-sam-lion-5709665-1.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'En Europe, l’étiquette cousue doit indiquer la composition du vêtement : la part de chaque fibre, par exemple 60 % coton et 40 % polyester. C’est une obligation du règlement européen n° 1007/2011.',
      'Elle mentionne souvent le pays de confection, c’est-à-dire là où le vêtement a été assemblé.',
      'En revanche, elle ne donne ni la masse du vêtement, ni les pays où le tissu a été fabriqué et teint. Ces étapes pèsent pourtant lourd dans l’impact environnemental.',
    ],
    sources: [
      { label: 'Règlement (UE) n° 1007/2011', url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32011R1007' },
      {
        label: 'Pour aller plus loin : The Good Goods, la fiche produit selon la loi AGEC',
        url: `${TGG}/media/juridique/quelles-informations-doivent-figurer-sur-une-fiche-produit-selon-la-loi-agec/`,
      },
    ],
  },
  {
    id: 'tracabilite',
    title: 'Traçabilité : d’où vient mon vêtement ?',
    theme: 'Traçabilité',
    summary: 'Les étapes de fabrication et l’information que les marques doivent publier.',
    image: { url: `${TGG_IMAGES}/2023/01/MISE-EN-AVANT-2.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'Un vêtement passe par plusieurs étapes, souvent dans des pays différents : production des matières, filature, tissage ou tricotage, teinture, confection.',
      'En France, la loi AGEC impose aux marques de publier une fiche produit indiquant le pays de tissage, de teinture et de confection, ainsi qu’une mention sur le relargage de microfibres plastiques.',
      'La DGCCRF contrôle ces informations. Shein a été condamnée à 1,098 million d’euros d’amende en juillet 2025, et Boohoo à 224 950 € en septembre 2026, notamment pour des pays de fabrication absents sur 1 863 articles.',
    ],
    sources: [
      {
        label: 'DGCCRF, sanction Boohoo',
        url: 'https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/injonctions-et-sanctions/la-dgccrf-sanctionne-boohoo-dune-amende-de-224-950-euros-pour-une-information-defaillante-sur-la',
      },
      {
        label: 'Bird & Bird, sanction Shein',
        url: 'https://cm.twobirds.com/en/insights/2025/france/1098-million-deuros-damende-pour-nonrespect-de-linformation-sur-la-qualit-environnementale-des-produ',
      },
      {
        label: 'Pour aller plus loin : The Good Goods, 5 startups de la traçabilité',
        url: `${TGG}/media/eco-conception/supply-chain-tracabilite/tracabilite-5-startups-qui-changent-la-mode-pour-plus-de-transparence/`,
      },
    ],
  },
  {
    id: 'laver-moins',
    title: 'Laver moins, laver mieux',
    theme: 'Entretien',
    summary: 'Les gestes d’entretien qui font durer un vêtement et réduisent son impact.',
    image: { url: `${TGG_IMAGES}/2021/06/pexels-alena-shekhovtcova-6995902.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'Un vêtement a moins d’impact s’il est porté longtemps. La méthode officielle en tient compte : son coefficient de durabilité, de 0,67 à 1,45, peut faire varier du simple au double le coût environnemental d’un même t-shirt.',
      'Le premier geste est de laver moins souvent : un vêtement qui n’est pas sale peut simplement être aéré. Quand il faut laver, l’ADEME indique que le programme 30 °C permet d’économiser plus de la moitié de l’électricité, et le programme Éco environ 15 %.',
      'Le lavage use aussi les fibres. Un vêtement synthétique y perd des microfibres plastiques : au-delà de 50 % de fibres synthétiques, la fiche produit doit d’ailleurs le signaler.',
      'Suivre l’étiquette d’entretien, sécher à l’air libre plutôt qu’au sèche-linge et faire réparer un accroc dès qu’il apparaît prolongent la vie du vêtement.',
    ],
    sources: [
      {
        label: 'ADEME, 20 solutions pour réduire sa consommation d’électricité',
        url: 'https://agirpourlatransition.ademe.fr/particuliers/finances/20-solutions-reduire-consommation-delectricite',
      },
      {
        label: 'Notice méthodologique officielle (coefficient de durabilité)',
        url: 'https://affichage-environnemental.ecobalyse.beta.gouv.fr/notice-reglementaire.pdf',
      },
      {
        label: 'Pour aller plus loin : The Good Goods, conseils pour laver son linge',
        url: `${TGG}/media/communication/pret-a-porter/comment-laver-entretenir-vetements-garder-longtemps/`,
      },
    ],
  },
  {
    id: 'seconde-main',
    title: 'La seconde main, vraiment meilleure pour le climat ?',
    theme: 'Seconde main',
    summary: 'Ce que mesure le rapport climat de Vinted, et ses limites.',
    image: { url: `${TGG_IMAGES}/2023/05/Magazine-Mockup.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'Acheter d’occasion évite de produire un vêtement neuf. Selon une étude réalisée par le cabinet Vaayu pour Vinted, sur 2021 et 2022, un achat d’occasion sur la plateforme évite en moyenne 1,8 kg CO₂e par rapport à un achat neuf.',
      'Ce chiffre est une moyenne : d’après la même étude, au moins 39 % des achats d’occasion remplaçaient un achat neuf. Un vêtement d’occasion qui s’ajoute à la garde-robe, sans remplacer un achat neuf, n’évite aucune production.',
      'L’étude a été commandée par Vinted : c’est une estimation, pas une mesure indépendante. La seconde main est la plus utile quand elle remplace vraiment un achat neuf, et quand on achète moins.',
      'Avec Etiq+, le bouton « Trouver d’occasion » cherche le même vêtement sur Vinted, sans commission pour Etiq.',
    ],
    sources: [
      {
        label: 'Vaayu, rapport climat de Vinted (communiqué)',
        url: 'https://www.vaayu.tech/press-releases/shopping-second-hand-on-vinted-is-a-better-choice-for-the-climate-than-buying-new-according-to-a-report-by-vaayu',
      },
      {
        label: 'Pour aller plus loin : The Good Goods, le rapport climat de Vinted',
        url: `${TGG}/media/sante-environnement/vinted-publie-son-rapport-sur-limpact-climatique-et-affirme-son-intention-de-promouvoir-une-seconde-main-a-limpact-positif/`,
      },
    ],
  },
  {
    id: 'bonus-reparation',
    title: 'Faire réparer pour moins cher : le Bonus réparation',
    theme: 'Réparation',
    summary: 'Une remise directe chez les cordonniers et retoucheurs labellisés.',
    image: { url: `${TGG_IMAGES}/2022/09/Les-reperateur.rices-illustration.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'Depuis le 7 novembre 2023, le Bonus réparation réduit directement la facture chez un cordonnier ou un retoucheur labellisé. Il est géré par Refashion, l’éco-organisme du textile, et financé à 100 % par les marques, sans argent public.',
      'Au lancement, la remise allait de 6 à 25 € selon la réparation, par exemple 7 € pour un trou ou un accroc, dans la limite de 60 % du prix.',
      'En deux ans, plus de 1 500 réparateurs ont été labellisés et plus de 1,7 million de réparations ont été soutenues. D’abord réservé aux vêtements et aux chaussures, le bonus concerne désormais tous les produits de la filière, linge de maison et lingerie compris.',
      'La réparation progresse : 21,6 millions de vêtements et de chaussures ont été réparés en France en 2024. Mais un Français sur deux seulement a entendu parler du bonus.',
    ],
    sources: [
      {
        label: 'Refashion, deux ans du Bonus réparation (décembre 2025)',
        url: 'https://media-pro.refashion.fr/2026/01/vdefcommunique-de-presse-i-2-ans-du-bonus-reparation.pdf',
      },
      {
        label: 'UFC-Que Choisir, montants du bonus au lancement',
        url: 'https://www.quechoisir.org/actualite-reparabilite-un-bonus-reparation-pour-le-textile-et-les-chaussures-n113194',
      },
      {
        label: 'Pour aller plus loin : The Good Goods, services de réparation',
        url: `${TGG}/media/economie-de-la-mode/circularite-services/les-applications-associations-et-services-de-reparation-de-vetements/`,
      },
    ],
  },
  {
    id: 'greenwashing',
    title: 'Reconnaître le greenwashing',
    theme: 'Greenwashing',
    summary: 'Ce que l’Union européenne interdit depuis septembre 2026, et comment repérer les promesses vagues.',
    // Campagne #duvraipasduvert de WeDressFair, reprise en couverture par The Good Goods.
    image: { url: `${TGG_IMAGES}/2020/09/COVER-WE-DRESS-FAIR-2.png`, credit: 'Image : WeDressFair, via The Good Goods' },
    paragraphs: [
      'Le greenwashing consiste à faire paraître un produit plus écologique qu’il ne l’est. Depuis le 27 septembre 2026, la directive européenne 2024/825 ajoute plusieurs pratiques à la liste de celles qui sont interdites en toutes circonstances.',
      'Sont visés : les mots vagues comme « écologique » ou « respectueux de l’environnement », sans performance environnementale excellente reconnue ; les labels de développement durable qui ne reposent ni sur une certification ni sur une autorité publique ; et l’affirmation qu’un produit a un impact neutre sur le climat grâce à la compensation carbone.',
      'Le texte interdit aussi de présenter comme valable pour tout le produit une promesse qui n’en concerne qu’un aspect, ou de vanter comme un plus ce que la loi impose déjà à tous.',
      'Fin octobre 2026, la France n’avait pas encore transposé la directive dans son droit. En cas de doute sur une allégation, on peut la signaler à la DGCCRF sur SignalConso.',
    ],
    sources: [
      { label: 'Directive (UE) 2024/825, annexe', url: 'https://eur-lex.europa.eu/eli/dir/2024/825/oj?locale=fr' },
      {
        label: 'Mayer Brown, état des transpositions (octobre 2026)',
        url: 'https://www.mayerbrown.com/fr/insights/publications/2026/10/the-eu-directive-on-empowering-consumers-for-the-green-transition-two-years-on-what-it-requires-and-where-the-member-states-stand',
      },
      {
        label: 'SignalConso, allégations environnementales',
        url: 'https://signal.conso.gouv.fr/fr/tromperie-allegation-label-environnement-magasin',
      },
      { label: 'Pour aller plus loin : The Good Goods, reconnaître le greenwashing', url: `${TGG}/mode/comment-reconnaitre-le-greenwashing/` },
    ],
  },
  {
    id: 'microfibres',
    title: 'Les microfibres plastiques, au lavage',
    theme: 'Matières premières',
    summary: 'Pourquoi un vêtement synthétique pollue aussi après l’achat.',
    image: { url: `${TGG_IMAGES}/2020/11/Copie-de-GRAND-FORMAT-35.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'Un vêtement en polyester, en nylon ou en acrylique perd de minuscules fibres de plastique à chaque lavage. Une partie rejoint les rivières et la mer.',
      'Selon l’UICN (2017), le lavage des textiles synthétiques serait la première source de microplastiques primaires dans les océans : environ 35 %, devant l’usure des pneus.',
      'En France, le décret du 29 avril 2022 impose que la fiche produit d’un vêtement à plus de 50 % de fibres synthétiques porte la mention « rejette des microfibres plastiques dans l’environnement lors du lavage ».',
      'Des microplastiques ont même été retrouvés dans des placentas humains (étude « Plasticenta », 2021, sur six placentas), sans que leur origine exacte soit connue. Pour limiter les rejets, on peut préférer les fibres naturelles et laver moins souvent.',
    ],
    sources: [
      { label: 'UICN, Primary microplastics in the oceans (2017)', url: 'https://doi.org/10.2305/IUCN.CH.2017.01.en' },
      {
        label: 'Décret n° 2022-748 du 29 avril 2022 (texte intégral, AIDA)',
        url: 'https://aida.ineris.fr/reglementation/decret-ndeg-2022-748-290422-relatif-a-linformation-consommateur-qualites',
      },
      { label: 'Ragusa et al., Environment International (2021)', url: 'https://doi.org/10.1016/j.envint.2020.106274' },
      { label: 'Pour aller plus loin : The Good Goods, des microfibres dans nos vêtements', url: `${TGG}/societe/microfibres-plastique-vetements/` },
    ],
  },
  {
    id: 'mode-ultra-express',
    title: 'La loi contre la mode ultra-express',
    theme: 'Réglementation',
    summary: 'Pénalités, publicité interdite, lieux de fabrication affichés : ce que change la loi du 8 juillet 2026.',
    // Pas la couverture de l'article de 2024 (portraits de deux personnes interviewées) : l'illustration de
    // l'article « En mode climat » de The Good Goods, cité dans les sources.
    image: { url: `${TGG_IMAGES}/2021/12/GRAND-FORMAT-2.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'La loi du 8 juillet 2026 vise les marques et les plateformes qui mettent sur le marché un très grand nombre de nouveaux modèles et incitent peu à réparer : la « mode ultra-express ». Les seuils précis doivent être fixés par décret.',
      'Depuis le 1er septembre 2026, leurs vêtements peuvent subir une pénalité sur l’éco-contribution : de 25 centimes à 12 € par produit en 2026, puis de 2 à 20 € à partir de 2030. À la demande du producteur, elle est limitée à la moitié du prix de vente hors taxe.',
      'À partir du 1er janvier 2027, la publicité pour ces produits et ces marques est interdite, y compris par les influenceurs, sous peine pour eux d’une amende pouvant atteindre 100 000 €. Le mot « gratuit » ne peut plus servir à leur promotion.',
      'La loi impose aussi d’afficher en ligne le lieu de fabrication d’un vêtement en caractères aussi grands que le prix, et prive ces marques de la réduction d’impôt sur leurs dons.',
    ],
    sources: [
      { label: 'Loi n° 2026-602 du 8 juillet 2026', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054399113' },
      {
        label: 'Texte intégral de la loi (AIDA)',
        url: 'https://aida.ineris.fr/reglementation/loi-ndeg-2026-602-080726-visant-a-reduire-limpact-environnemental-lindustrie-textile',
      },
      {
        label: 'Pour aller plus loin : The Good Goods, la loi contre la fast fashion (2024)',
        url: `${TGG}/media/juridique/expert-la-loi-contre-fast-et-ultra-fast-fashion-avec-anne-cecile-violland-et-yann-rivoallan/`,
      },
      {
        label: 'The Good Goods, en mode climat : stop fast fashion (2021)',
        url: `${TGG}/media/juridique/en-mode-climat-stop-fast-fashion-pef-affichage-environnemental/`,
      },
    ],
  },
  {
    id: 'coton-bio',
    title: 'Coton bio ou conventionnel ?',
    theme: 'Matières premières',
    summary: 'Ce que garantit le coton biologique, et ce qu’il change au coût environnemental.',
    image: { url: `${TGG_IMAGES}/2020/09/Coton-Sans-OGM-Sans-Pesticide-Fibre-Textile-Saine-Bienveillante.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'Le coton biologique est cultivé selon les règles de l’agriculture biologique : sans pesticides ni engrais chimiques de synthèse, et sans OGM.',
      'Avec la méthode officielle Ecobalyse, le même t-shirt de 170 g confectionné au Bangladesh coûte 1 771 points en coton conventionnel et 1 328 points en coton bio, soit 25 % de moins. En coton recyclé, il descend à 1 263 points.',
      'Pour être sûr qu’un vêtement est en coton bio, le label GOTS est un bon repère : il exige au moins 70 % de fibres biologiques certifiées, et 95 % pour la mention « biologique ».',
    ],
    sources: [
      { label: 'Calculateur officiel Ecobalyse 7.0.0', url: 'https://ecobalyse.beta.gouv.fr/versions/v7.0.0/#/api' },
      { label: 'Règlement (UE) 2018/848 sur l’agriculture biologique', url: 'https://eur-lex.europa.eu/eli/reg/2018/848/oj?locale=fr' },
      { label: 'GOTS, critères du label', url: 'https://global-standard.org/the-standard/gots-key-features' },
      { label: 'Pour aller plus loin : The Good Goods, coton bio et conventionnel', url: `${TGG}/mode/coton-biologique-vs-coton-conventionnel/` },
    ],
  },

  // Ajouts du 11 nov. 2026 (2e série). Les coûts cités sont calculés avec l'API Ecobalyse 7.0.0 : produit,
  // masse, matière et pays indiqués dans la phrase, autres paramètres par défaut.
  {
    id: 'consommation',
    title: '43 vêtements neufs par an : notre consommation en chiffres',
    theme: 'Consommation',
    summary: 'Ce que dit le baromètre 2025 de Refashion sur nos achats.',
    image: { url: `${TGG_IMAGES}/2024/10/SV_0.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'En 2025, 3,6 milliards de pièces neuves (vêtements, linge de maison et chaussures) ont été vendues en France : près de 10 millions par jour, 1,5 % de plus qu’en 2024.',
      'Chaque Français a acheté en moyenne 43 pièces d’habillement, une de plus qu’en 2024.',
      'Les petits prix dominent : 7 achats sur 10 portent sur l’entrée de gamme, et un article neuf coûte en moyenne 15,70 €.',
      'La seconde main progresse, de 4,8 % en volume, mais les achats neufs augmentent eux aussi.',
    ],
    sources: [
      {
        label: 'Refashion, baromètre de la consommation 2025 (juin 2026)',
        url: 'https://media-pro.refashion.fr/2026/06/2026-cp-barometre-annuel-de-la-consommation.pdf',
      },
      {
        label: 'Pour aller plus loin : The Good Goods, personne ne sait combien de vêtements sont produits',
        url: `${TGG}/media/eco-conception/supply-chain-tracabilite/personne-ne-sait-combien-de-vetements-sont-produits-chaque-annee-alerte-the-or-foundation/`,
      },
    ],
  },
  {
    id: 'pays-fabrication',
    title: 'Pourquoi le pays de fabrication compte',
    theme: 'Traçabilité',
    summary: 'Le même t-shirt, fabriqué en France ou au Bangladesh : ce que dit la méthode officielle.',
    image: { url: `${TGG_IMAGES}/2023/11/Twitter-post-1.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'Le coût environnemental d’un vêtement dépend des pays où il est filé, tissé, teint et confectionné, notamment parce que l’électricité n’y est pas produite de la même façon.',
      'Avec la méthode officielle, un t-shirt en coton de 170 g coûte 1 695 points s’il est entièrement fabriqué au Bangladesh, 1 586 en Chine, 1 391 en Turquie et 1 136 en France : un tiers de moins qu’au Bangladesh.',
      'Changer seulement le pays de confection compte beaucoup moins : environ 8 % d’écart entre le Bangladesh et la France. Ce sont les étapes en amont, filature, tissage et teinture, qui font la différence.',
      'C’est pourquoi la loi AGEC impose aux marques d’indiquer les pays de tissage, de teinture et de confection, et la loi de 2026 d’afficher en ligne le lieu de fabrication à côté du prix.',
    ],
    sources: [
      { label: 'Calculateur officiel Ecobalyse 7.0.0', url: 'https://ecobalyse.beta.gouv.fr/versions/v7.0.0/#/api' },
      {
        label: 'Décret n° 2022-748 (fiche produit AGEC)',
        url: 'https://aida.ineris.fr/reglementation/decret-ndeg-2022-748-290422-relatif-a-linformation-consommateur-qualites',
      },
      { label: 'Loi n° 2026-602 du 8 juillet 2026', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054399113' },
      {
        label: 'Pour aller plus loin : The Good Goods, quel regard porter sur le « made in Bangladesh » ?',
        url: `${TGG}/media/eco-conception/supply-chain-tracabilite/quel-regard-porter-sur-made-in-bangladesh-fast-fashion/`,
      },
    ],
  },
  {
    id: 'made-in-france',
    title: '« Made in France » : ce que dit vraiment la mention',
    theme: 'Traçabilité',
    summary: 'Une mention d’origine encadrée, à ne pas confondre avec un label.',
    image: { url: `${TGG_IMAGES}/2023/01/DB5A8353.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      '« Made in France » ou « Fabriqué en France » n’est pas un label mais une mention d’origine, que l’entreprise choisit d’apposer. Elle doit alors respecter les règles d’origine du code des douanes de l’Union.',
      'Un produit est d’origine France s’il y est entièrement obtenu, ou s’il y a subi sa dernière transformation substantielle. Pour un t-shirt importé, ajouter un flocage en France ne suffit pas.',
      'La douane contrôle ces mentions à l’importation, et la DGCCRF lors de la vente : une fausse origine est une pratique commerciale trompeuse.',
      'Le label Origine France Garantie va plus loin : le produit doit prendre ses caractéristiques essentielles en France, et au moins la moitié de son prix de revient doit y être acquise.',
    ],
    sources: [
      {
        label: 'Douane, dépliant « Fabriqué en France » (2022)',
        url: 'https://www.douane.gouv.fr/sites/default/files/2022-10/24/depliant-fabrique-en-france.pdf',
      },
      { label: 'Origine France Garantie', url: 'https://www.originefrancegarantie.fr/' },
      {
        label: 'Pour aller plus loin : The Good Goods, vrai made in France ou french washing ?',
        url: `${TGG}/media/communication/greenwashing/vrai-made-in-france-ou-french-washing-les-cles-pour-ne-pas-se-faire-avoir/`,
      },
    ],
  },
  {
    id: 'labels',
    title: 'Labels : qui garantit quoi ?',
    theme: 'Labels',
    summary: 'GOTS, OEKO-TEX, GRS, RWS, B Corp : ce que chacun vérifie vraiment.',
    image: { url: `${TGG_IMAGES}/2022/05/labels-certifications-1.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'Un label n’a de valeur que si un organisme indépendant le contrôle. Depuis le 27 septembre 2026, un label de développement durable doit reposer sur une certification, ou avoir été créé par une autorité publique.',
      'GOTS certifie les fibres biologiques : au moins 70 % de fibres biologiques certifiées, et 95 % pour la mention « biologique ». OEKO-TEX Standard 100 porte sur la santé : il vérifie l’absence de substances nocives, avec des exigences plus strictes pour les articles de bébé.',
      'GRS garantit une matière recyclée : au moins 50 % pour porter son logo. RWS concerne la laine et le bien-être des moutons : il s’applique dès 5 % de laine certifiée, mais un vêtement qui contient aussi de la laine vierge non certifiée ne peut pas porter son logo.',
      'B Corp, enfin, certifie une entreprise entière et non un produit : un vêtement d’une marque B Corp n’est pas certifié pour autant.',
    ],
    sources: [
      { label: 'Directive (UE) 2024/825, annexe', url: 'https://eur-lex.europa.eu/eli/dir/2024/825/oj?locale=fr' },
      { label: 'GOTS, critères du label', url: 'https://global-standard.org/the-standard/gots-key-features' },
      { label: 'OEKO-TEX Standard 100', url: 'https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100' },
      { label: 'Textile Exchange, Global Recycled Standard', url: 'https://textileexchange.org/recycled-claim-global-recycled-standard/' },
      {
        label: 'Control Union, Responsible Wool Standard',
        url: 'https://espana.controlunion.com/en/certification-program/rws-responsible-wool-standard/',
      },
      {
        label: 'Pour aller plus loin : The Good Goods, label, certification, appellation',
        url: `${TGG}/media/juridique/difference-label-certification-accreditation-et-appellation/`,
      },
    ],
  },
  {
    id: 'invendus',
    title: 'Les invendus ne peuvent plus être détruits',
    theme: 'Réglementation',
    summary: 'Ce qu’interdisent la loi française depuis 2022 et le droit européen depuis juillet 2026.',
    image: { url: `${TGG_IMAGES}/2021/08/Sans-titre-1.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'Depuis le 1er janvier 2022, la loi AGEC interdit en France d’éliminer les vêtements neufs invendus, par exemple en les brûlant ou en les mettant en décharge : ils doivent être donnés, réemployés ou recyclés.',
      'Depuis le 19 juillet 2026, le règlement européen sur l’écoconception va plus loin, dans toute l’Union : les grandes entreprises ne peuvent plus détruire leurs vêtements et chaussures invendus. Les entreprises moyennes y seront soumises en 2030, les petites en sont exemptées.',
      'Des exceptions restent possibles : produit dangereux, contrefait ou non conforme, défaut impossible à corriger, ou aucun repreneur trouvé.',
    ],
    sources: [
      {
        label: 'Ministère de l’Économie, interdiction de détruire les invendus (2022)',
        url: 'https://www.economie.gouv.fr/actualites/economie-circulaire-interdiction-de-destruction-des-invendus-non-alimentaires',
      },
      {
        label: 'Plateforme européenne Transition Pathways, vêtements invendus (mai 2026)',
        url: 'https://transition-pathways.europa.eu/textiles/opinions/eu-ban-destruction-unsold-clothing-scope-exceptions-and-open-questions',
      },
      {
        label: 'Pour aller plus loin : The Good Goods, la destruction des invendus interdite',
        url: `${TGG}/media/juridique/destruction-invendus-marques-mode-luxe-sera-interdite-2022/`,
      },
    ],
  },
  {
    id: 'polyester-recycle',
    title: 'Polyester recyclé : la bonne idée ?',
    theme: 'Matières premières',
    summary: 'D’où vient le polyester recyclé, et ce qu’il change vraiment.',
    image: { url: `${TGG_IMAGES}/2020/11/plastic-3.jpeg`, credit: TGG_CREDIT },
    paragraphs: [
      'Le polyester est la fibre la plus produite au monde : 59 % des fibres textiles en 2024. Seuls 12 % de ce polyester étaient recyclés.',
      'Et ce polyester recyclé vient à 98 % de bouteilles en plastique, pas de vieux vêtements : le recyclage d’un textile en un autre textile n’en représente qu’environ 2 %. Citeo compte 15 bouteilles pour un pull polaire.',
      'Pour le coût environnemental, le gain est modeste : avec la méthode officielle, un t-shirt de 170 g confectionné au Bangladesh coûte 1 137 points en polyester recyclé, contre 1 166 en polyester neuf, soit 2,5 % de moins.',
      'Recyclé ou non, le polyester reste un plastique : au lavage, il rejette des microfibres.',
    ],
    sources: [
      {
        label: 'Textile Exchange, Materials Market Report 2025',
        url: 'https://textileexchange.org/knowledge-center/reports/materials-market-report-2025/',
      },
      { label: 'Citeo', url: 'https://www.citeo.com/' },
      { label: 'Calculateur officiel Ecobalyse 7.0.0', url: 'https://ecobalyse.beta.gouv.fr/versions/v7.0.0/#/api' },
      { label: 'Pour aller plus loin : The Good Goods, le polyester recyclé est-il durable ?', url: `${TGG}/mode/le-polyester-recycle-est-il-durable/` },
    ],
  },
  {
    id: 'lin-chanvre',
    title: 'Lin et chanvre, des fibres d’Europe',
    theme: 'Matières premières',
    summary: 'Deux fibres cultivées près de chez nous, sans irrigation.',
    image: { url: `${TGG_IMAGES}/2020/09/lin-france-fibres.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'La France est le premier producteur mondial de lin fibre : en 2023, elle comptait 131 000 des 150 000 hectares de lin d’Europe. Les trois quarts des fibres longues du monde viennent de France, de Belgique et des Pays-Bas.',
      'Le lin européen pousse sans irrigation, et sa fibre est extraite de la tige par un procédé mécanique, sans solvants. Un hectare donne de quoi faire 4 000 chemises.',
      'Le chanvre, lui, pousse en France sans irrigation ni pesticides. La France en est le premier producteur d’Europe et le deuxième du monde, après la Chine, mais seules 10 % de ses fibres servent au textile.',
      'Avec la méthode officielle, un t-shirt de 170 g confectionné au Bangladesh coûte 1 238 points en lin et 1 259 en chanvre, contre 1 771 en coton conventionnel : environ 30 % de moins.',
    ],
    sources: [
      {
        label: 'Alliance for European Flax-Linen & Hemp, chiffres 2023',
        url: 'https://allianceflaxlinenhemp.eu/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBam9lIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5867504d46c969ee23adf0e1c45ea44aceb59a00/Flyer%20Alliance%20-%20FR.pdf',
      },
      {
        label: 'FranceAgriMer, fiche filière chanvre 2026',
        url: 'https://www.franceagrimer.fr/sites/default/files/2026-02/23_FICHE_FILIERE_CHANVRE_2026.pdf',
      },
      { label: 'Calculateur officiel Ecobalyse 7.0.0', url: 'https://ecobalyse.beta.gouv.fr/versions/v7.0.0/#/api' },
      { label: 'Pour aller plus loin : The Good Goods, le lin', url: `${TGG}/matieres/lin/` },
    ],
  },
  {
    id: 'laine',
    title: 'La laine, chaude et exigeante',
    theme: 'Matières premières',
    summary: 'Ses qualités, son coût environnemental, et le label RWS.',
    // La fiche « Laine » de The Good Goods se trompe (« trois fois son poids ») : seulement son image.
    image: { url: `${TGG_IMAGES}/2020/09/Capture-decran-2026-03-19-a-17.12.26-1732x1024.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'La laine absorbe l’humidité : jusqu’à 35 % de son poids avant de paraître mouillée, selon Woolmark.',
      'Dans la méthode officielle, elle pèse pourtant lourd : un pull de 370 g confectionné en Chine coûte 4 796 points en laine, contre 3 532 en coton et 2 372 en acrylique.',
      'Ce chiffre ne dit pas tout : l’acrylique est un plastique issu du pétrole, qui rejette des microfibres au lavage. Et un pull porté pendant des années répartit son impact sur bien plus d’usages.',
      'Le label RWS (Responsible Wool Standard) encadre le bien-être des moutons et la gestion de leurs pâturages.',
    ],
    sources: [
      { label: 'Woolmark, la laine respire', url: 'https://www.woolmark.com/industry/research/factsheets/wool-is-naturally-breathable/' },
      { label: 'Calculateur officiel Ecobalyse 7.0.0', url: 'https://ecobalyse.beta.gouv.fr/versions/v7.0.0/#/api' },
      { label: 'Textile Exchange, Responsible Wool Standard', url: 'https://textileexchange.org/responsible-wool-standard/' },
    ],
  },
  {
    id: 'jean',
    title: 'Le jean, poids lourd de la garde-robe',
    theme: 'Entretien',
    summary: 'La catégorie la plus impactante du portail, et comment faire durer le sien.',
    image: { url: `${TGG_IMAGES}/2020/09/o-JEANS-facebook.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'Sur le portail officiel, le jean est la catégorie la plus lourde : 2 732 points de coût environnemental en médiane, plus de trois fois un t-shirt (786 points).',
      'Il pèse aussi 560 g en médiane, plus de trois fois un t-shirt (158 g).',
      'Le faire durer est donc le meilleur geste : le laver moins souvent, et le faire réparer. Le Bonus réparation de Refashion réduit la facture chez un retoucheur labellisé, et certaines marques, comme Nudie Jeans, réparent gratuitement leurs jeans.',
      'D’occasion, un jean se trouve facilement : avec Etiq+, le bouton « Trouver d’occasion » cherche le modèle sur Vinted.',
    ],
    sources: [
      {
        label: 'Portail officiel de l’affichage environnemental (copie du 26 oct. 2026)',
        url: 'https://affichage-environnemental.ecobalyse.beta.gouv.fr/stats',
      },
      { label: 'Nudie Jeans, réparations gratuites', url: 'https://www.nudiejeans.com/en-FR/blog/free-repairs-forever' },
      {
        label: 'Refashion, deux ans du Bonus réparation',
        url: 'https://media-pro.refashion.fr/2026/01/vdefcommunique-de-presse-i-2-ans-du-bonus-reparation.pdf',
      },
      { label: 'Pour aller plus loin : The Good Goods, entretenir son jean', url: `${TGG}/mode/entretenir-son-jean/` },
    ],
  },
  {
    id: 'fibres-artificielles',
    title: 'Viscose, modal, lyocell : des fibres de bois',
    theme: 'Matières premières',
    summary: 'Ni naturelles ni synthétiques : des fibres de cellulose transformée.',
    image: { url: `${TGG_IMAGES}/2024/06/COVER-HEADER-TGG-2.jpg`, credit: TGG_CREDIT },
    paragraphs: [
      'La viscose, le modal et le lyocell ne sont ni naturels ni synthétiques : ce sont des fibres « artificielles », faites de cellulose, le plus souvent issue du bois, dissoute puis refilée.',
      'Le règlement européen les distingue par leur procédé : procédé viscose pour la viscose, procédé viscose modifié pour le modal, dissolution dans un solvant organique pour le lyocell.',
      'Pour son lyocell TENCEL, le fabricant Lenzing indique récupérer plus de 99 % du solvant, réutilisé en circuit fermé.',
      'La méthode officielle les traite comme de la viscose : un t-shirt de 170 g confectionné au Bangladesh coûte 1 259 points en viscose, contre 1 771 en coton conventionnel.',
    ],
    sources: [
      { label: 'Règlement (UE) n° 1007/2011, annexe I', url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32011R1007' },
      { label: 'Lenzing, TENCEL', url: 'https://www.tencel.com/fr/process' },
      { label: 'Calculateur officiel Ecobalyse 7.0.0', url: 'https://ecobalyse.beta.gouv.fr/versions/v7.0.0/#/api' },
      {
        label: 'Pour aller plus loin : The Good Goods, la mode faite de tout bois',
        url: `${TGG}/media/eco-conception/textile-trims/viscose-ecovero-tencelmodal-et-tencellyocell-la-mode-faite-de-tout-bois-the-good-goods/`,
      },
    ],
  },
];

export function getArticle(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}
