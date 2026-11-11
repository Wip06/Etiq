import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ArticleImage } from '@/data/articles';
import { colors } from '@/theme/colors';

type Props = {
  image: ArticleImage;
  // Texte alternatif pour les lecteurs d'écran.
  alt: string;
  // Vignette de la liste (plus basse, sans crédit) ou couverture de la page de l'article.
  compact?: boolean;
};

// Image de couverture d'un article, affichée depuis le site de sa source et gardée en cache sur le
// téléphone (lisible hors ligne une fois vue). Si elle ne se charge pas, rien ne s'affiche.
export function ArticleCover({ image, alt, compact = false }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <View style={styles.box}>
      <Image
        source={image.url}
        alt={alt}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={200}
        onError={() => setFailed(true)}
        style={[styles.image, compact ? styles.compact : styles.full]}
      />
      {!compact && <Text style={styles.credit}>{image.credit}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: 6,
  },
  image: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  compact: {
    aspectRatio: 2.4,
  },
  full: {
    aspectRatio: 16 / 9,
  },
  credit: {
    fontSize: 12,
    color: colors.secondary,
  },
});
