import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { randomFact } from '@/data/didYouKnow';
import { colors } from '@/theme/colors';
import { openLink } from '@/utils/links';

// Écran d'ouverture : même image, même taille et même fond que l'écran de démarrage natif (app.json),
// qu'il prolonge, avec une anecdote à lire. L'app ne s'ouvre que quand l'utilisateur continue.
export function DidYouKnowScreen({ ready, onContinue }: { ready: boolean; onContinue: () => void }) {
  const [fact] = useState(randomFact);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require('../../assets/splash-tiko.png')}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel="Tiko, la mascotte d’Etiq"
        />
        <View style={styles.card}>
          <Text style={styles.title}>Le savais-tu ?</Text>
          <Text style={styles.fact}>{fact.text}</Text>
          <Pressable
            accessibilityRole="link"
            hitSlop={8}
            onPress={() => openLink(fact.url)}
            style={({ pressed }) => [styles.link, pressed && styles.pressed]}
          >
            <Text style={styles.linkLabel}>Lire l’article</Text>
            <Ionicons name="open-outline" size={16} color={colors.accent} />
          </Pressable>
          <Text style={styles.source}>Source : The Good Goods, fiche {fact.source}</Text>
        </View>
      </ScrollView>
      <Button label={ready ? 'Continuer' : 'Chargement…'} onPress={onContinue} disabled={!ready} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
  },
  card: {
    alignSelf: 'stretch',
    gap: 10,
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.surface,
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
    color: colors.secondary,
  },
});
