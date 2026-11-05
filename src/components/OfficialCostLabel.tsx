import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { loadLabelImage } from '@/services/portal';
import { colors } from '@/theme/colors';

// Étiquette officielle du coût environnemental, telle que le portail la fournit. La charte graphique
// interdit de la redessiner ou d'en changer la police : on affiche le SVG officiel tel quel. Il passe
// par une vue web, car le moteur SVG de React Native ignore la police Marianne embarquée dans le
// fichier et afficherait les chiffres dans une autre police.
// Le SVG est chargé par l'app puis gardé en copie locale : l'étiquette reste visible hors connexion
// pour un vêtement déjà consulté.
// En numérique, la hauteur est fixée à 80 px (charte graphique de mars 2026).
const HEIGHT = 80;
const WIDTH = (HEIGHT * 154) / 77;

type Props = {
  // labelImageUrl (produit déclaré) ou scoreLabelImageUrl (coût calculé), de services/portal.
  imageUrl: string;
  cost: number;
  per100g: number;
};

export function OfficialCostLabel({ imageUrl, cost, per100g }: Props) {
  // undefined : chargement en cours ; null : ni réseau ni copie locale.
  const [source, setSource] = useState<{ url: string; dataUri: string | null } | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    loadLabelImage(imageUrl).then((dataUri) => !cancelled && setSource({ url: imageUrl, dataUri }));
    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  const description = `Coût environnemental : ${Math.round(cost)} points d’impact, ${Math.round(per100g)} pour 100 grammes`;
  const current = source?.url === imageUrl ? source : undefined;

  if (current && current.dataUri === null) {
    return (
      <View style={[styles.frame, styles.fallback]}>
        <Text style={styles.fallbackText}>{description}</Text>
      </View>
    );
  }

  const html = current
    ? `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;background:transparent"><img src="${current.dataUri}" alt="" width="${WIDTH}" height="${HEIGHT}" style="display:block"></body></html>`
    : null;

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={description} style={styles.frame}>
      {html && (
        <WebView
          source={{ html }}
          originWhitelist={['*']}
          javaScriptEnabled={false}
          scrollEnabled={false}
          pointerEvents="none"
          style={styles.webview}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: WIDTH,
    height: HEIGHT,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // Sans réseau ni copie locale, le coût reste lisible en texte.
  fallback: {
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  fallbackText: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    color: colors.text,
  },
});
