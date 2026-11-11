// Anecdotes « Le savais-tu ? » du pop-up d'ouverture. Parties des fiches de The Good Goods (relevé du
// 3 nov. 2026), elles ont été vérifiées le 5 nov. 2026 auprès des sources d'origine, que chacune cite.
// Fiches qui se trompent, donc plus proposées en lecture : laine (« trois fois son poids », 35 % selon
// Woolmark), chanvre (« devant la Chine », la France est 2e), Origine France Garantie (« Made in France »
// « sans preuve ni contrôle », alors que la douane et la DGCCRF le contrôlent). Les deux anecdotes sur le
// cachemire (« 95 % par la Chine », grammes par chèvre et par écharpe) sont retirées faute de source fiable.
// `article` n'est renseigné que quand la fiche ne contredit pas l'anecdote.
// 14 anecdotes ajoutées le 11 nov. 2026 (microfibres, greenwashing, loi ultra-express, réparation, données
// officielles), tirées des sources lues pour les articles de l'onglet « Apprendre » (src/data/articles.ts).

export type Fact = {
  text: string;
  // Source d'origine du chiffre ou de l'affirmation, et son lien.
  source: string;
  url: string;
  // Fiche de The Good Goods pour aller plus loin.
  article?: string;
};

const MATERIALS = 'https://www.thegoodgoods.fr/matieres';
const LABELS = 'https://www.thegoodgoods.fr/labels';

const ALLIANCE_FLAX = {
  source: 'Alliance for European Flax-Linen & Hemp, chiffres 2023',
  url: 'https://allianceflaxlinenhemp.eu/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBam9lIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5867504d46c969ee23adf0e1c45ea44aceb59a00/Flyer%20Alliance%20-%20FR.pdf',
};
const DECREE_AGEC = {
  source: 'Décret n° 2022-748 du 29 avril 2022',
  url: 'https://aida.ineris.fr/reglementation/decret-ndeg-2022-748-290422-relatif-a-linformation-consommateur-qualites',
};
const DIRECTIVE_GREENWASHING = {
  source: 'Directive (UE) 2024/825, annexe',
  url: 'https://eur-lex.europa.eu/eli/dir/2024/825/oj?locale=fr',
};
const LAW_ULTRA_EXPRESS = {
  source: 'Loi n° 2026-602 du 8 juillet 2026',
  url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054399113',
};
const REFASHION_REPAIR = {
  source: 'Refashion, deux ans du Bonus réparation, décembre 2025',
  url: 'https://media-pro.refashion.fr/2026/01/vdefcommunique-de-presse-i-2-ans-du-bonus-reparation.pdf',
};
const PORTAL_STATS = {
  source: 'Portail officiel de l’affichage environnemental, copie du 26 oct. 2026',
  url: 'https://affichage-environnemental.ecobalyse.beta.gouv.fr/stats',
};
const TGG_MICROFIBRES = 'https://www.thegoodgoods.fr/societe/microfibres-plastique-vetements/';
const TGG_GREENWASHING = 'https://www.thegoodgoods.fr/mode/comment-reconnaitre-le-greenwashing/';
const TGG_REPAIR =
  'https://www.thegoodgoods.fr/media/economie-de-la-mode/circularite-services/les-applications-associations-et-services-de-reparation-de-vetements/';

const FRANCEAGRIMER_HEMP = {
  source: 'FranceAgriMer, fiche filière chanvre 2026 (chiffres InterChanvre 2024)',
  url: 'https://www.franceagrimer.fr/sites/default/files/2026-02/23_FICHE_FILIERE_CHANVRE_2026.pdf',
};

export const FACTS: Fact[] = [
  // Matières
  {
    text: 'En 2024, le polyester représentait 59 % des fibres textiles produites dans le monde, et 88 % de ce polyester venait du pétrole.',
    source: 'Textile Exchange, Materials Market Report 2025',
    url: 'https://textileexchange.org/knowledge-center/reports/materials-market-report-2025/',
    article: `${MATERIALS}/polyester/`,
  },
  {
    text: 'Fabriquer un t-shirt en coton conventionnel demande près de 2 700 litres d’eau, selon le WWF.',
    source: 'WWF',
    url: 'https://www.worldwildlife.org/stories/the-impact-of-a-cotton-t-shirt',
    article: `${MATERIALS}/coton/`,
  },
  {
    text: 'Dans une étude de 2021, un tissu denim en coton 100 % recyclé consommait 98 % d’eau de moins qu’en coton neuf.',
    source: 'Fidan et al., Journal of Cleaner Production, 2021',
    url: 'https://doi.org/10.1016/j.jclepro.2020.125439',
    article: `${MATERIALS}/coton/`,
  },
  {
    text: 'Les trois quarts des fibres longues de lin du monde sont produites en France, en Belgique et aux Pays-Bas.',
    ...ALLIANCE_FLAX,
    article: `${MATERIALS}/lin/`,
  },
  {
    text: 'Le lin européen pousse sans irrigation, et sa fibre est extraite de la tige par un procédé mécanique, sans solvants.',
    ...ALLIANCE_FLAX,
    article: `${MATERIALS}/lin/`,
  },
  {
    text: 'Un hectare de lin européen donne de quoi faire 4 000 chemises.',
    ...ALLIANCE_FLAX,
    article: `${MATERIALS}/lin/`,
  },
  {
    text: 'Le lin représente moins de 0,5 % des fibres textiles produites dans le monde.',
    ...ALLIANCE_FLAX,
    article: `${MATERIALS}/lin/`,
  },
  {
    text: 'La laine peut absorber jusqu’à 35 % de son poids en humidité avant de paraître mouillée.',
    source: 'Woolmark',
    url: 'https://www.woolmark.com/industry/research/factsheets/wool-is-naturally-breathable/',
  },
  {
    text: 'En France, le chanvre pousse sans irrigation ni pesticides : semé en avril, il est récolté dès la mi-août.',
    ...FRANCEAGRIMER_HEMP,
  },
  {
    text: 'La France est le premier producteur de chanvre d’Europe et le deuxième du monde, après la Chine. Mais seules 10 % de ses fibres servent au textile.',
    ...FRANCEAGRIMER_HEMP,
  },
  {
    text: 'Pour récupérer la soie, on tue la chrysalide par la chaleur (soleil, vapeur ou air chaud) avant que le papillon ne perce son cocon.',
    source: 'FAO, Silk reeling and testing manual, 1999',
    url: 'https://www.fao.org/4/x2099e/x2099e05.htm',
    article: `${MATERIALS}/soie/`,
  },
  {
    text: 'Il faut 15 bouteilles en plastique pour fabriquer un pull polaire, selon Citeo.',
    source: 'Citeo, infographie sur le recyclage des bouteilles, 2022',
    url: 'https://www.citeo.com/',
    article: `${MATERIALS}/polyester-recycle/`,
  },
  {
    text: 'Pour fabriquer le lyocell TENCEL, plus de 99 % du solvant est récupéré et réutilisé en circuit fermé.',
    source: 'Lenzing, fabricant de TENCEL',
    url: 'https://www.tencel.com/fr/process',
    article: `${MATERIALS}/lyocell-lyocell/`,
  },
  {
    text: 'L’élasthanne est un polyuréthane issu du pétrole : pour porter ce nom, une fibre étirée à trois fois sa longueur doit reprendre aussitôt sa forme.',
    source: 'Règlement (UE) n° 1007/2011, annexe I',
    url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32011R1007',
    article: `${MATERIALS}/elasthanne/`,
  },
  // Labels
  {
    text: '« Made in France » n’est pas un label mais une mention d’origine, contrôlée par la douane et la DGCCRF : un t-shirt importé puis seulement floqué en France n’y a pas droit.',
    source: 'Douane, dépliant « Fabriqué en France », 2022',
    url: 'https://www.douane.gouv.fr/sites/default/files/2022-10/24/depliant-fabrique-en-france.pdf',
  },
  {
    text: 'Pour être Origine France Garantie, un produit doit prendre ses caractéristiques essentielles en France, et au moins la moitié de son prix de revient doit y être acquise.',
    source: 'Origine France Garantie',
    url: 'https://www.originefrancegarantie.fr/',
  },
  {
    text: 'B Corp certifie des entreprises entières, et non des produits.',
    source: 'B Lab',
    url: 'https://www.bcorporation.net/en-us/certification/',
    article: `${LABELS}/b-corp/`,
  },
  {
    text: 'Max Havelaar, c’est le héros d’un roman néerlandais de 1860, signé Multatuli, qui dénonçait l’exploitation coloniale à Java.',
    source: 'Multatuli, Max Havelaar, 1860',
    url: 'https://fr.wikisource.org/wiki/Auteur:Multatuli',
    article: `${LABELS}/fairtrade-max-havelaar/`,
  },
  {
    text: 'La classe la plus stricte d’OEKO-TEX Standard 100 concerne les articles pour bébés et enfants jusqu’à 3 ans.',
    source: 'OEKO-TEX',
    url: 'https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100',
    article: `${LABELS}/oeko-tex-standard-100/`,
  },
  {
    text: 'Un produit ne peut porter le logo GRS que si au moins la moitié de sa matière est recyclée.',
    source: 'Textile Exchange',
    url: 'https://textileexchange.org/recycled-claim-global-recycled-standard/',
    article: `${LABELS}/global-recycle-standard/`,
  },
  {
    text: 'La norme RWS s’applique dès 5 % de laine certifiée, mais un vêtement qui contient aussi de la laine vierge non certifiée ne peut pas porter son logo.',
    source: 'Control Union, organisme certificateur',
    url: 'https://espana.controlunion.com/en/certification-program/rws-responsible-wool-standard/',
    article: `${LABELS}/responsible-wool-standard/`,
  },
  {
    text: 'Le label GOTS interdit notamment les métaux lourds toxiques, le PVC et les colorants azoïques qui libèrent des amines cancérigènes.',
    source: 'GOTS',
    url: 'https://global-standard.org/',
    article: `${LABELS}/gots/`,
  },
  {
    text: 'Fair Wear Foundation est née en 1999 de l’alliance d’un syndicat néerlandais, la FNV, et de la Clean Clothes Campaign.',
    source: 'Fair Wear',
    url: 'https://www.fairwear.org/',
    article: `${LABELS}/fair-wear-foundation/`,
  },
  {
    text: 'Le lin European Flax est roui naturellement au sol, dans le champ, et non dans l’eau.',
    ...ALLIANCE_FLAX,
    article: `${LABELS}/european-flax/`,
  },

  // Ajouts du 11 nov. 2026, vérifiés aux mêmes sources que les articles de l'onglet « Apprendre ».
  // Microfibres
  {
    text: 'Au-delà de 50 % de fibres synthétiques, la fiche d’un vêtement doit indiquer : « rejette des microfibres plastiques dans l’environnement lors du lavage ».',
    ...DECREE_AGEC,
    article: TGG_MICROFIBRES,
  },
  {
    text: 'Le lavage des textiles synthétiques serait la première source de microplastiques primaires dans les océans : environ 35 %.',
    source: 'UICN, Primary microplastics in the oceans, 2017',
    url: 'https://doi.org/10.2305/IUCN.CH.2017.01.en',
    article: TGG_MICROFIBRES,
  },
  // Greenwashing (directive européenne)
  {
    text: 'Depuis le 27 septembre 2026, l’Union européenne interdit les mots vagues comme « écologique » sans performance environnementale excellente reconnue.',
    ...DIRECTIVE_GREENWASHING,
    article: TGG_GREENWASHING,
  },
  {
    text: 'Un label de développement durable doit désormais reposer sur une certification, ou avoir été créé par une autorité publique.',
    ...DIRECTIVE_GREENWASHING,
    article: TGG_GREENWASHING,
  },
  {
    text: 'Dans l’Union européenne, dire qu’un produit est neutre pour le climat grâce à la compensation carbone est interdit depuis le 27 septembre 2026.',
    ...DIRECTIVE_GREENWASHING,
    article: TGG_GREENWASHING,
  },
  // Loi contre la mode ultra-express
  {
    text: 'À partir du 1er janvier 2027, la publicité pour la mode ultra-express est interdite en France, y compris par les influenceurs.',
    ...LAW_ULTRA_EXPRESS,
  },
  {
    text: 'Sur un site de vente en ligne, le lieu de fabrication d’un vêtement doit s’afficher en caractères aussi grands que le prix.',
    ...LAW_ULTRA_EXPRESS,
  },
  {
    text: 'La pénalité qui frappe la mode ultra-express pourra atteindre 20 € par vêtement à partir de 2030.',
    ...LAW_ULTRA_EXPRESS,
  },
  // Réparation
  {
    text: 'Le Bonus réparation, financé par les marques, a soutenu plus de 1,7 million de réparations de vêtements et de chaussures en deux ans.',
    ...REFASHION_REPAIR,
    article: TGG_REPAIR,
  },
  {
    text: 'En 2024, 21,6 millions de vêtements et de chaussures ont été réparés en France.',
    ...REFASHION_REPAIR,
    article: TGG_REPAIR,
  },
  // Calculs et données officiels
  {
    text: 'D’après la méthode officielle, le même t-shirt coûte 25 % de moins en coton bio qu’en coton conventionnel.',
    source: 'Calcul Ecobalyse 7.0.0 : t-shirt de 170 g confectionné au Bangladesh',
    url: 'https://ecobalyse.beta.gouv.fr/versions/v7.0.0/#/api',
    article: `${MATERIALS}/coton/`,
  },
  {
    text: 'Seules 192 marques ont déclaré des vêtements sur le portail officiel de l’affichage environnemental.',
    ...PORTAL_STATS,
  },
  {
    text: 'En médiane, un jean neuf pèse 2 732 points de coût environnemental : plus de trois fois un t-shirt (786 points).',
    ...PORTAL_STATS,
  },
  {
    text: 'Selon une étude commandée par Vinted, un achat d’occasion évite en moyenne 1,8 kg CO₂e par rapport à un achat neuf.',
    source: 'Vaayu pour Vinted, 2021-2022',
    url: 'https://www.vaayu.tech/press-releases/shopping-second-hand-on-vinted-is-a-better-choice-for-the-climate-than-buying-new-according-to-a-report-by-vaayu',
  },
];

export const randomFact = (): Fact => FACTS[Math.floor(Math.random() * FACTS.length)];
