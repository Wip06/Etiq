// Lexique des labels : chaque entrée renvoie vers la fiche de The Good Goods.
// Les résumés d'une ligne (qui délivre le label, ce qu'il certifie) sont rédigés par nous, à faire relire.

import { normalize } from '@/utils/text';

export const THEMES = {
  organic: 'Bio et agriculture',
  sourcing: 'Filières responsables',
  chemicals: 'Chimie et santé',
  social: 'Social et équitable',
  other: 'Origine et autres',
} as const;

export type Theme = keyof typeof THEMES;

export type Label = {
  name: string;
  theme: Theme;
  summary: string;
  url: string;
};

const BASE_URL = 'https://www.thegoodgoods.fr/labels';

export const labels: Label[] = [
  // Bio et agriculture
  { name: 'GOTS', theme: 'organic', summary: 'Norme internationale pour les textiles d’au moins 70 % de fibres bio, avec des critères environnementaux et sociaux sur toute la fabrication.', url: `${BASE_URL}/gots/` },
  { name: 'Organic Content Standard (OCS)', theme: 'organic', summary: 'Certifie la part de matière bio dans un produit et sa traçabilité.', url: `${BASE_URL}/organic-content-standard/` },
  { name: 'Écocert', theme: 'organic', summary: 'Organisme de certification.', url: `${BASE_URL}/ecocert/` },
  { name: 'Ecocert Textile', theme: 'organic', summary: 'Référentiel d’Ecocert pour les textiles dont le tissu est GOTS ou OCS, ou fait de textiles écologiques ou recyclés.', url: `${BASE_URL}/ecocert-textile/` },
  { name: 'Demeter', theme: 'organic', summary: 'Label de l’agriculture biodynamique.', url: `${BASE_URL}/demeter-agriculture-biodynamique/` },
  { name: 'Regenerative Organic Certified (ROC)', theme: 'organic', summary: 'Certification qui combine agriculture bio, santé des sols, bien-être animal et équité sociale.', url: `${BASE_URL}/regenerative-organic-certified-roc/` },
  { name: 'Soil Association', theme: 'organic', summary: 'Organisme britannique de certification bio, qui certifie aussi des textiles.', url: `${BASE_URL}/soil-association-organic/` },
  { name: 'BioRé', theme: 'organic', summary: 'Concerne les tissus issus de la culture biologique du coton.', url: `${BASE_URL}/biore/` },
  { name: 'Land to Market (L2M)', theme: 'organic', summary: 'Label exigeant qui met en lumière les acteurs de l’agriculture régénérative.', url: `${BASE_URL}/land-to-market-l2m/` },
  { name: 'Naturtextil', theme: 'organic', summary: 'Label de l’association allemande IVN pour des textiles en fibres naturelles, aux critères très stricts.', url: `${BASE_URL}/naturtextil/` },

  // Filières responsables
  { name: 'Responsible Wool Standard (RWS)', theme: 'sourcing', summary: 'Norme pour la laine : bien-être des moutons et gestion des terres.', url: `${BASE_URL}/responsible-wool-standard/` },
  { name: 'Responsible Mohair Standard', theme: 'sourcing', summary: 'Équivalent du RWS pour le mohair, issu de la chèvre angora.', url: `${BASE_URL}/responsible-mohair-standard/` },
  { name: 'Responsible Down Standard (RDS)', theme: 'sourcing', summary: 'Label visant à de certifier le bon traitement animal chez les exploitants de volailles qui produise plumes et duvets pour l’industrie textile.', url: `${BASE_URL}/responsible-down-standard-rds/` },
  { name: 'Leather Working Group (LWG)', theme: 'sourcing', summary: 'Organisation qui représente la filière cuir et réduit son impact environnemental.', url: `${BASE_URL}/leather-working-group-lwg/` },
  { name: 'Naturleder', theme: 'sourcing', summary: 'Label européen ayant pour objectif de réduire l’impact social et environnemental du cuir, pour pallier le manque de régulation dans la production de cuir dans l’industrie textile.', url: `${BASE_URL}/naturleder/` },
  { name: 'European Flax', theme: 'sourcing', summary: 'Garantit un lin cultivé en Europe, sans OGM, peu d’engrais et de pesticides.', url: `${BASE_URL}/european-flax/` },
  { name: 'Masters of Linen', theme: 'sourcing', summary: 'Garantit un lin produit et transformé en Europe, du champ jusqu’au tissu.', url: `${BASE_URL}/masters-of-linen/` },
  { name: 'Global Recycled Standard (GRS)', theme: 'sourcing', summary: 'Norme de Textile Exchange qui certifie le contenu recyclé, avec des critères sociaux et environnementaux.', url: `${BASE_URL}/global-recycle-standard/` },
  { name: 'FSC', theme: 'sourcing', summary: 'Certifie que le bois, et donc la viscose qui en est tirée, vient de forêts gérées durablement.', url: `${BASE_URL}/forest-stewardship-council-fsc/` },
  { name: 'PEFC', theme: 'sourcing', summary: 'Autre certification de gestion durable des forêts.', url: `${BASE_URL}/pefc/` },
  { name: 'Nativa Precious Fiber', theme: 'sourcing', summary: 'Programme de traçabilité de la laine mérinos.', url: `${BASE_URL}/nativa-precious-fiber/` },

  // Chimie et santé
  { name: 'Oeko-Tex Standard 100', theme: 'chemicals', summary: 'Garantit que le produit fini a été testé contre une liste de substances nocives.', url: `${BASE_URL}/oeko-tex-standard-100/` },
  { name: 'Bluesign', theme: 'chemicals', summary: 'Contrôle les produits chimiques utilisés pendant la fabrication textile.', url: `${BASE_URL}/bluesign/` },
  { name: 'Norme REACH', theme: 'chemicals', summary: 'Règlement européen sur les substances chimiques. C’est une obligation légale, pas un label.', url: `${BASE_URL}/norme-reach/` },
  { name: 'Écolabel européen', theme: 'chemicals', summary: 'Label environnemental officiel de l’Union européenne.', url: `${BASE_URL}/lecolabel-europeen-produits-textiles/` },
  { name: 'Écolabel Nordic', theme: 'chemicals', summary: 'Label environnemental officiel des pays nordiques.', url: `${BASE_URL}/ecolabel-nordic/` },
  { name: 'Cradle to Cradle', theme: 'chemicals', summary: 'Certifie des produits conçus pour être réutilisés ou recyclés.', url: `${BASE_URL}/craddle-to-craddle/` },

  // Social et équitable
  { name: 'Fair Wear Foundation', theme: 'social', summary: 'Organisation qui accompagne les marques pour améliorer les conditions de travail dans les ateliers de confection.', url: `${BASE_URL}/fair-wear-foundation/` },
  { name: 'Fairtrade / Max Havelaar', theme: 'social', summary: 'Commerce équitable droits humains des producteurs, préservation de l’environnement', url: `${BASE_URL}/fairtrade-max-havelaar/` },
  { name: 'World Fair Trade Organization', theme: 'social', summary: 'Réseau mondial du commerce équitable, qui engage l’entreprise entière et pas un seul produit.', url: `${BASE_URL}/world-fair-trade-organization/` },
  { name: 'SA 8000', theme: 'social', summary: 'Norme internationale de responsabilité sociale sur les conditions de travail.', url: `${BASE_URL}/sa-8000/` },
  { name: 'BSCI', theme: 'social', summary: 'Code de conduite pour auditer les conditions de travail chez les fournisseurs.', url: `${BASE_URL}/40033/` },
  { name: 'Ethical Trading Initiative', theme: 'social', summary: 'Alliance d’entreprises, syndicats et ONG pour le respect des droits des travailleurs.', url: `${BASE_URL}/ethical-trading-initiative/` },
  { name: 'B Corp', theme: 'social', summary: 'Certification d’entreprise qui évalue l’ensemble de ses impacts sociaux et environnementaux.', url: `${BASE_URL}/b-corp/` },
  { name: 'Entreprise à mission', theme: 'social', summary: 'Statut légal français (loi Pacte, 2019) : l’entreprise inscrit une raison d’être et des objectifs sociaux ou environnementaux dans ses statuts.', url: `${BASE_URL}/entreprise-a-mission/` },
  { name: 'Green America', theme: 'social', summary: 'Association américaine qui certifie des entreprises engagées socialement et écologiquement.', url: `${BASE_URL}/green-america/` },
  { name: 'SloWeAre', theme: 'social', summary: 'Label indépendant qui évalue les marques de mode éco-responsables sur l’ensemble de leurs pratiques.', url: `${BASE_URL}/sloweare/` },

  // Origine et autres
  { name: 'Origine France Garantie', theme: 'other', summary: 'Label des producteurs textiles français pour préserver savoir-faire et emplois.', url: `${BASE_URL}/origine-france-garantie/` },
  { name: 'France Terre Textile', theme: 'other', summary: 'Garantit qu’au moins 75 % des étapes de fabrication sont réalisées en France.', url: `${BASE_URL}/france-terre-textile/` },
  { name: 'Entreprise du Patrimoine Vivant (EPV)', theme: 'other', summary: 'Label d’État qui distingue les entreprises françaises aux savoir-faire d’excellence.', url: `${BASE_URL}/epv-entreprise-patrimoine-vivant-2/` },
  { name: 'AOP', theme: 'other', summary: 'Signe européen qui protège un produit fabriqué dans une zone géographique définie, selon un savoir-faire reconnu.', url: `${BASE_URL}/aop-appellation-dorigine-protegee/` },
  { name: 'Vegan', theme: 'other', summary: 'Indique qu’un produit ne contient aucune matière d’origine animale.', url: `${BASE_URL}/vegan/` },
  { name: 'PETA', theme: 'other', summary: 'Délivre la certification Cruelty-Free (pas de tests sur les animaux) ; les produits certifiés ne contiennent aucune matière animale.', url: `${BASE_URL}/peta/` },
  { name: 'ISO 9001', theme: 'other', summary: 'Norme internationale de management de la qualité. Elle ne porte ni sur l’environnement ni sur le social.', url: `${BASE_URL}/iso-9001/` },
  { name: 'Higg Index', theme: 'other', summary: 'Outils d’auto-évaluation de l’impact social et environnemental, développés par la Sustainable Apparel Coalition.', url: `${BASE_URL}/higg-index/` },
];

export function searchLabels(query: string): Label[] {
  const q = normalize(query.trim());
  if (!q) return labels;
  return labels.filter((label) => normalize(label.name).includes(q));
}
