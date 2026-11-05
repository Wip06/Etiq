import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { useEffect, useState, type ComponentRef, type RefObject } from 'react';
import { BackHandler, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { randomFact } from '@/data/didYouKnow';
import { colors } from '@/theme/colors';
import { openLink } from '@/utils/links';

type Props = {
  ready: boolean;
  // Contenu à flouter derrière le pop-up : obligatoire pour que le flou marche sur Android.
  blurTarget: RefObject<ComponentRef<typeof View> | null>;
  onContinue: () => void;
};

// Pop-up d'ouverture « Le savais-tu ? » : une anecdote au centre, l'app floutée derrière. Il se ferme
// avec « Continuer », en touchant le fond ou avec le bouton retour d'Android, une fois l'app chargée.
export function DidYouKnowPopup({ ready, blurTarget, onContinue }: Props) {
  const [fact] = useState(randomFact);
  const { article } = fact;

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (ready) onContinue();
      return true;
    });
    return () => subscription.remove();
  }, [ready, onContinue]);

  return (
    <View style={styles.overlay} accessibilityViewIsModal>
      <BlurView
        style={StyleSheet.absoluteFill}
        intensity={40}
        tint="dark"
        blurTarget={blurTarget}
        blurMethod="dimezisBlurViewSdk31Plus"
      />
      <Pressable
        style={StyleSheet.absoluteFill}
        disabled={!ready}
        onPress={onContinue}
        accessibilityLabel="Fermer"
        accessibilityRole="button"
      />
      <View style={styles.card}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} bounces={false}>
          <Image
            source={require('../../assets/splash-tiko.png')}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel="Tiko, la mascotte d’Etiq"
          />
          <Text style={styles.title}>Le savais-tu ?</Text>
          <Text style={styles.fact}>{fact.text}</Text>
          {article && (
            <Pressable
              accessibilityRole="link"
              hitSlop={8}
              onPress={() => openLink(article)}
              style={({ pressed }) => [styles.link, pressed && styles.pressed]}
            >
              <Text style={styles.linkLabel}>Lire l’article de The Good Goods</Text>
              <Ionicons name="open-outline" size={16} color={colors.accent} />
            </Pressable>
          )}
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Source : ${fact.source}`}
            hitSlop={8}
            onPress={() => openLink(fact.url)}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={styles.source}>
              Source : <Text style={styles.sourceLink}>{fact.source}</Text>
            </Text>
          </Pressable>
        </ScrollView>
        <Button label={ready ? 'Continuer' : 'Chargement…'} onPress={onContinue} disabled={!ready} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    gap: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.secondary,
    backgroundColor: colors.surface,
  },
  scroll: {
    flexGrow: 0,
  },
  content: {
    gap: 10,
  },
  image: {
    alignSelf: 'center',
    width: 110,
    height: 110,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
  fact: {
    fontSize: 17,
    lineHeight: 25,
    color: colors.text,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  linkLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
    textDecorationLine: 'underline',
  },
  source: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondary,
  },
  sourceLink: {
    textDecorationLine: 'underline',
  },
});
