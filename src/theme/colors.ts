// Palette "Vert bouteille et champagne", retenue le 14 oct. 2026.
export const colors = {
  background: '#0F1F1A',
  surface: '#17302A',
  text: '#F4F1EA',
  accent: '#D9C08A',
  onAccent: '#0F1F1A',
  secondary: '#8FA595',
  // Fond assombri autour du cadre de visée de l'appareil photo.
  overlay: 'rgba(15, 31, 26, 0.6)',
  // Échelle de la comparaison avec la catégorie, du moins au plus impactant. Le nom du niveau
  // accompagne toujours la couleur, pour rester lisible en cas de daltonisme.
  impactScale: ['#4FB27E', '#A6CF6A', '#E8CF55', '#EE9A45', '#EF6F5C'],
  // Texte posé sur une couleur de l'échelle.
  onImpact: '#0F1F1A',
} as const;
