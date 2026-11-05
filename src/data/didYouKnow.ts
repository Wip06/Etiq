// Anecdotes « Le savais-tu ? » du pop-up d'ouverture. Parties des fiches de The Good Goods (relevé du
// 3 nov. 2026), elles ont été vérifiées le 5 nov. 2026 auprès des sources d'origine, que chacune cite.
// Fiches qui se trompent, donc plus proposées en lecture : laine (« trois fois son poids », 35 % selon
// Woolmark), chanvre (« devant la Chine », la France est 2e), Origine France Garantie (« Made in France »
// « sans preuve ni contrôle », alors que la douane et la DGCCRF le contrôlent). Les deux anecdotes sur le
// cachemire (« 95 % par la Chine », grammes par chèvre et par écharpe) sont retirées faute de source fiable.
// `article` n'est renseigné que quand la fiche ne contredit pas l'anecdote.

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
];

export const randomFact = (): Fact => FACTS[Math.floor(Math.random() * FACTS.length)];
