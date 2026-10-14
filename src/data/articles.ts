// Articles de l'onglet « Apprendre ». Chaque article cite ses sources.

export type Article = {
  id: string;
  title: string;
  theme: string;
  summary: string;
  paragraphs: string[];
  sources: { label: string; url: string }[];
};

export const articles: Article[] = [
  {
    id: 'cout-environnemental',
    title: 'Le coût environnemental, c’est quoi ?',
    theme: 'Réglementation',
    summary: 'Le chiffre officiel qui mesure l’impact d’un vêtement, et comment le lire.',
    paragraphs: [
      'Le coût environnemental est l’indicateur officiel de l’impact d’un vêtement en France. Il s’exprime en points d’impact : plus le chiffre est élevé, plus l’impact est fort.',
      'Il est calculé avec la méthode publique Ecobalyse, développée par l’ADEME et beta.gouv. Le calcul tient compte de la composition, de la masse, des pays où le vêtement a été tissé, teint et confectionné, et de sa durabilité.',
      'Depuis le 1er octobre 2025, les marques peuvent afficher ce coût, sur la base du volontariat. Depuis le 1er octobre 2026, n’importe quel tiers (association, média, application) peut aussi le calculer et le publier, à condition de respecter les règles officielles.',
      'Tous les coûts publiés sont déposés sur un portail public, où chacun peut les consulter par code-barres.',
    ],
    sources: [
      { label: 'Décret n° 2025-957', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052212871' },
      { label: 'Portail officiel', url: 'https://affichage-environnemental.ecobalyse.beta.gouv.fr/' },
    ],
  },
  {
    id: 'lire-etiquette',
    title: 'Lire l’étiquette de son vêtement',
    theme: 'Matières premières',
    summary: 'Ce que l’étiquette cousue vous apprend, et ce qu’elle ne dit pas.',
    paragraphs: [
      'En Europe, l’étiquette cousue doit indiquer la composition du vêtement : la part de chaque fibre, par exemple 60 % coton et 40 % polyester. C’est une obligation du règlement européen n° 1007/2011.',
      'Elle mentionne souvent le pays de confection, c’est-à-dire là où le vêtement a été assemblé.',
      'En revanche, elle ne donne ni la masse du vêtement, ni les pays où le tissu a été fabriqué et teint. Ces étapes pèsent pourtant lourd dans l’impact environnemental.',
    ],
    sources: [
      { label: 'Règlement (UE) n° 1007/2011', url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32011R1007' },
    ],
  },
  {
    id: 'tracabilite',
    title: 'Traçabilité : d’où vient mon vêtement ?',
    theme: 'Traçabilité',
    summary: 'Les étapes de fabrication et l’information que les marques doivent publier.',
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
    ],
  },
];

export function getArticle(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}
