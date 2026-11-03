import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

// La pose dépend de la situation, jamais du résultat : Tiko ne juge ni un vêtement ni une marque, ce
// qui se lirait comme une note maison à côté du coût environnemental officiel.
const POSES = {
  debout: require('../../assets/tiko/tiko-debout.png'),
  assisSourire: require('../../assets/tiko/tiko-assis-sourire.png'),
  saut: require('../../assets/tiko/tiko-saut.png'),
  endormi: require('../../assets/tiko/tiko-endormi.png'),
  tetePenchee: require('../../assets/tiko/tiko-tete-penchee.png'),
  deDos: require('../../assets/tiko/tiko-de-dos.png'),
  mainsJoues: require('../../assets/tiko/tiko-mains-joues.png'),
  assisRegard: require('../../assets/tiko/tiko-assis-regard.png'),
  roule: require('../../assets/tiko/tiko-roule.png'),
};

export type TikoPose = keyof typeof POSES;

// Les images font environ 200 px de large : au-delà de cette taille, elles seraient floues.
const SIZE = 70;

// Tiko et sa bulle : une phrase courte, au plus un par écran. Avec onPress, toute la ligne est cliquable
// (par exemple pour ouvrir le scanner).
export function Tiko({ pose, message, onPress }: { pose: TikoPose; message: string; onPress?: () => void }) {
  const content = (
    <>
      <Image
        source={POSES[pose]}
        style={styles.image}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <View style={[styles.bubble, onPress && styles.bubbleWithArrow]}>
        <View style={styles.tail} />
        <Text style={[styles.text, onPress && styles.textWithArrow]}>{message}</Text>
        {onPress && <Ionicons name="chevron-forward" size={18} color={colors.accent} />}
      </View>
    </>
  );

  if (!onPress) return <View style={styles.row}>{content}</View>;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    width: SIZE,
    height: SIZE,
  },
  bubble: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  bubbleWithArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  tail: {
    position: 'absolute',
    top: '50%',
    left: -5,
    width: 12,
    height: 12,
    marginTop: -6,
    transform: [{ rotate: '45deg' }],
    backgroundColor: colors.surface,
  },
  textWithArrow: {
    flex: 1,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    color: colors.text,
  },
});
