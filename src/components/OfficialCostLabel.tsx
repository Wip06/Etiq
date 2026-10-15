import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { labelImageUrl } from '@/services/portal';

// Étiquette officielle du coût environnemental, telle que le portail la fournit. La charte graphique
// interdit de la redessiner ou d'en changer la police : on affiche le SVG officiel tel quel. Il passe
// par une vue web, car le moteur SVG de React Native ignore la police Marianne embarquée dans le
// fichier et afficherait les chiffres dans une autre police.
// En numérique, la hauteur est fixée à 80 px (charte graphique de mars 2026).
const HEIGHT = 80;
const WIDTH = (HEIGHT * 154) / 77;

type Props = {
  gtin: string;
  cost: number;
  per100g: number;
};

export function OfficialCostLabel({ gtin, cost, per100g }: Props) {
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;background:transparent"><img src="${labelImageUrl(gtin)}" alt="" width="${WIDTH}" height="${HEIGHT}" style="display:block"></body></html>`;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Coût environnemental : ${Math.round(cost)} points d’impact, ${Math.round(per100g)} pour 100 grammes`}
      style={styles.frame}
    >
      <WebView
        source={{ html }}
        originWhitelist={['*']}
        javaScriptEnabled={false}
        scrollEnabled={false}
        pointerEvents="none"
        style={styles.webview}
      />
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
});
