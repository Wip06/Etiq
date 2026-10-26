// Traduit des indicateurs du coût environnemental en repères du quotidien.

// Eau (m³ éq) : ce n'est pas un volume brut, Ecobalyse pondère l'eau consommée par sa rareté là
// où elle est prélevée. On parle donc d'« équivalent » de douches, jamais de litres réellement utilisés.
// Douche de 5 minutes à 12 L/min. L'ADEME compte environ 35 L pour une douche rapide, les chiffres
// attribués au Centre d'information sur l'eau vont de 60 à 80 L : 60 L reste prudent.
const SHOWER_LITERS = 60;
const BOTTLE_LITERS = 1.5;

// Climat (kg CO₂e) : voiture thermique moyenne, fabrication de la voiture comprise, pour un
// conducteur seul. Source : API Impact CO2 de l'ADEME (/api/v1/transport, includeConstruction=1),
// lue le 26 oct. 2026. Sans la fabrication, 0,111 kg/km : on garde la valeur qui donne moins de km.
const CAR_KG_PER_KM = 0.142;

// Plastique : bouteille d'eau en PET de 1,5 L. Elle pesait 33 g en 2009 (Assemblée nationale), un
// peu moins aujourd'hui : 33 g donne un nombre de bouteilles prudent.
const BOTTLE_PLASTIC_GRAMS = 33;
// Matières Ecobalyse qui sont des plastiques issus du pétrole.
const SYNTHETIC_MATERIALS = ['ei-pet', 'ei-pet-r', 'ei-pa', 'ei-acrylique', 'ei-pp', 'elasthane'];

// Coût environnemental (points) : la notice méthodologique officielle (1er oct. 2025, p. 8) le
// calcule comme 1 000 000 × Σ pondération × impact / normalisation, où les pondérations font 100 %
// et où chaque facteur de normalisation est l'impact annuel d'un habitant moyen de la planète : ceux
// de la méthode européenne EF 3.1 (JRC), soit les totaux mondiaux de 2010 divisés par 6,9 milliards
// d'habitants (ex. 7 553 kg CO₂e pour le climat). Un million de points = un habitant sur un an.
const POINTS_PER_PERSON_YEAR = 1_000_000;

export type FootprintDuration = { value: number; unit: 'jour' | 'heure' };

// Durée de l'empreinte environnementale totale d'un habitant moyen de la planète équivalente à ce coût.
export function toFootprintDuration(points: number): FootprintDuration {
  const days = (points / POINTS_PER_PERSON_YEAR) * 365;
  return days >= 1 ? { value: Math.round(days), unit: 'jour' } : { value: Math.max(1, Math.round(days * 24)), unit: 'heure' };
}

// Part de l'empreinte annuelle d'un habitant moyen de la planète, en %.
export function toFootprintShare(points: number): number {
  return (points / POINTS_PER_PERSON_YEAR) * 100;
}

export type WaterEquivalent = {
  liters: number;
  showers: number;
  bottles: number;
};

export function toWaterEquivalent(m3: number): WaterEquivalent {
  const liters = m3 * 1000;
  return {
    liters,
    showers: Math.round(liters / SHOWER_LITERS),
    bottles: Math.round(liters / BOTTLE_LITERS),
  };
}

export function toCarKilometers(kgCo2e: number): number {
  return Math.round(kgCo2e / CAR_KG_PER_KM);
}

// Masse de fibres synthétiques d'un vêtement, en grammes, d'après sa composition en %.
export function syntheticGrams(materials: { id: string; percent: number }[], massGrams: number): number {
  const total = materials.reduce((sum, material) => sum + material.percent, 0);
  if (total <= 0) return 0;
  const synthetic = materials
    .filter((material) => SYNTHETIC_MATERIALS.includes(material.id))
    .reduce((sum, material) => sum + material.percent, 0);
  return (synthetic / total) * massGrams;
}

export function toPlasticBottles(grams: number): number {
  return Math.round(grams / BOTTLE_PLASTIC_GRAMS);
}

export const formatCount = (value: number) => value.toLocaleString('fr-FR');

export const pluralize = (count: number, word: string) => `${formatCount(count)} ${word}${count > 1 ? 's' : ''}`;
