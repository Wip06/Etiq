import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, Text, View } from 'react-native';

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

// Tiko et sa bulle : une phrase courte, au plus un par écran. Il apparaît avec un léger rebond, sauf si
// le téléphone demande de réduire les animations.
export function Tiko({ pose, message }: { pose: TikoPose; message: string }) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduceMotion) => {
        if (cancelled) return;
        if (reduceMotion) progress.setValue(1);
        else Animated.spring(progress, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
      });
    return () => {
      cancelled = true;
    };
  }, [progress]);

  const animatedStyle = {
    opacity: progress.interpolate({ inputRange: [0, 0.6], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [
      { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
      { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
    ],
  };

  return (
    <Animated.View style={[styles.row, animatedStyle]}>
      <Animated.Image
        source={POSES[pose]}
        style={styles.image}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <View style={styles.bubble}>
        <View style={styles.tail} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
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
  text: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    color: colors.text,
  },
});
