# Relevés de marques

Relevés à la main des fiches produits, pour les marques dont le site bloque la lecture automatique.
Ils alimentent les critères des fiches marques (`src/data/brands.ts`) et la page « Nos critères ».

## Protocole

- **Échantillon de 20 produits** : les premiers affichés dans chaque catégorie, dans l'ordre par défaut
  du site, sans trier ni filtrer (pour ne pas choisir les produits). Répartition : 5 t-shirts et tops,
  4 pulls et maille, 3 robes et jupes, 3 pantalons et jeans, 3 chemises et blouses, 2 manteaux et vestes.
- **Par produit** : catégorie, nom, URL, composition du tissu principal recopiée telle quelle, pays de
  confection (« Fabriqué en… »), pays de tissage et de teinture s'ils sont indiqués, prix.
- **Pour la marque** (en bas du fichier ou dans le message) : service de réparation ? de revente ou de
  seconde main ? avec l'URL de la page qui le dit.
- **Date du relevé** : dans le nom du commit ou en première ligne du message.

Un fichier texte par marque (`sezane.txt`) : un bloc par produit, à compléter après chaque « : ». Une
ligne laissée vide = information absente de la fiche, ce qui est aussi une information.
