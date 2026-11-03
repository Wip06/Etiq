// Anecdotes « Le savais-tu ? » de l'écran d'ouverture. Elles sont reformulées à partir des fiches de
// The Good Goods (relevé du 3 nov. 2026), vers lesquelles chacune renvoie : à faire relire, et à
// recouper avant la finale pour les chiffres, attribués à leur source quand la fiche la cite.

export type Fact = { text: string; source: string; url: string };

const MATERIALS = 'https://www.thegoodgoods.fr/matieres';
const LABELS = 'https://www.thegoodgoods.fr/labels';

export const FACTS: Fact[] = [
  // Matières
  { text: 'Il faut environ 1,5 kg de pétrole pour produire 1 kg de polyester, selon le WWF.', source: 'Polyester', url: `${MATERIALS}/polyester/` },
  { text: 'Fabriquer un t-shirt en coton conventionnel demande près de 2 700 litres d’eau.', source: 'Coton', url: `${MATERIALS}/coton/` },
  { text: 'Recycler le coton permet de réduire sa consommation d’eau de 98 %.', source: 'Coton', url: `${MATERIALS}/coton/` },
  { text: '80 % de la culture mondiale du lin se trouve en Europe, et surtout en France.', source: 'Lin', url: `${MATERIALS}/lin/` },
  { text: 'La transformation du lin est mécanique, sans chimie, et demande très peu d’eau.', source: 'Lin', url: `${MATERIALS}/lin/` },
  { text: 'La laine absorbe trois fois son poids avant de paraître mouillée.', source: 'Laine', url: `${MATERIALS}/laine/` },
  { text: 'Le chanvre pousse en trois mois et demande près de 4 fois moins d’eau que le coton.', source: 'Chanvre', url: `${MATERIALS}/chanvre/` },
  { text: 'La France est le premier producteur de chanvre textile, devant la Chine.', source: 'Chanvre', url: `${MATERIALS}/chanvre/` },
  { text: 'Une chèvre cachemire donne 100 à 150 g de duvet par an, alors qu’une écharpe en demande au moins 180 g.', source: 'Cachemire', url: `${MATERIALS}/cachemire/` },
  { text: 'La Chine produit 95 % du cachemire mondial.', source: 'Cachemire', url: `${MATERIALS}/cachemire/` },
  { text: 'Pour récupérer la soie, les cocons sont étouffés dans des étuves à 80 °C.', source: 'Soie', url: `${MATERIALS}/soie/` },
  { text: 'Il faut 15 bouteilles en plastique pour fabriquer un pull en polyester recyclé, selon Citeo.', source: 'Polyester recyclé', url: `${MATERIALS}/polyester-recycle/` },
  { text: 'Pour fabriquer le lyocell, le solvant est recyclé en circuit fermé à 99 %.', source: 'Lyocell', url: `${MATERIALS}/lyocell-lyocell/` },
  { text: 'L’élasthanne est dérivé du pétrole et peut s’étirer jusqu’à 5 à 8 fois sa taille.', source: 'Élasthanne', url: `${MATERIALS}/elasthanne/` },
  // Labels
  { text: 'Le label « Made in France » n’existe pas : les entreprises se l’attribuent sans preuve ni contrôle.', source: 'Origine France Garantie', url: `${LABELS}/origine-france-garantie/` },
  { text: 'Pour être Origine France Garantie, au moins la moitié du coût de production d’un objet doit être française.', source: 'Origine France Garantie', url: `${LABELS}/origine-france-garantie/` },
  { text: 'B Corp certifie des entreprises entières, et non des produits.', source: 'B Corp', url: `${LABELS}/b-corp/` },
  { text: 'Max Havelaar, c’est le nom du héros d’un roman hollandais de 1860.', source: 'Fairtrade / Max Havelaar', url: `${LABELS}/fairtrade-max-havelaar/` },
  { text: 'La classe la plus stricte d’Œko-Tex Standard 100 concerne les produits pour les enfants de moins de 3 ans.', source: 'Œko-Tex Standard 100', url: `${LABELS}/oeko-tex-standard-100/` },
  { text: 'Un produit peut porter le label GRS si au moins la moitié de ses fibres est recyclée.', source: 'Global Recycled Standard', url: `${LABELS}/global-recycle-standard/` },
  { text: 'Le label RWS concerne des produits qui peuvent ne contenir que 5 % de laine certifiée.', source: 'Responsible Wool Standard', url: `${LABELS}/responsible-wool-standard/` },
  { text: 'Le label GOTS interdit notamment les métaux lourds toxiques, le PVC et les colorants azoïques cancérigènes.', source: 'GOTS', url: `${LABELS}/gots/` },
  { text: 'Fair Wear Foundation est née en 1999 grâce à un syndicat néerlandais.', source: 'Fair Wear Foundation', url: `${LABELS}/fair-wear-foundation/` },
  { text: 'Le lin European Flax est transformé après un rouissage naturel dans le champ.', source: 'European Flax', url: `${LABELS}/european-flax/` },
];

export const randomFact = (): Fact => FACTS[Math.floor(Math.random() * FACTS.length)];
