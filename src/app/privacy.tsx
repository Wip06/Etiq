import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

// Politique de confidentialité du prototype. Texte à faire relire avant toute publication.
export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Section title="Ce que l’app garde">
        Votre e-mail, votre prénom, vos objectifs, vos favoris, l’historique de vos scans et vos résultats au quiz. Ces
        données restent sur votre téléphone : elles ne sont envoyées à aucun serveur d’Etiq.
      </Section>

      <Section title="Les photos d’étiquettes">
        Pour lire une étiquette, la photo est envoyée à notre service hébergé chez Supabase, qui la transmet à Gemini,
        l’intelligence artificielle de Google. Nous ne conservons pas les photos. En revanche, nous utilisons l’offre
        gratuite de Gemini : Google peut utiliser ces photos pour améliorer ses produits, et des personnes peuvent les
        relire. Photographiez uniquement l’étiquette, sans visage ni information personnelle.
      </Section>

      <Section title="Les données publiques">
        Les codes-barres scannés sont envoyés au portail officiel de l’affichage environnemental, et les compositions
        lues sur les étiquettes au calculateur officiel Ecobalyse, deux services publics de l’État. Ces envois ne
        contiennent aucune donnée personnelle.
      </Section>

      <Section title="Ce que nous ne faisons pas">
        Etiq n’affiche pas de publicité et ne vend aucune donnée. Aucune marque ne paie pour être mise en avant.
      </Section>

      <Section title="Supprimer vos données">
        Le bouton « Supprimer mon compte », dans votre profil, efface de votre téléphone tout ce que l’app garde sur
        votre compte. Vous pouvez aussi supprimer l’application.
      </Section>

      <Text style={styles.note}>
        Prototype réalisé pour le challenge « Tech & Business for Good » EDHEC Business School × 42 Nice, automne 2026.
      </Text>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.paragraph}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: 20,
    padding: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  note: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondary,
  },
});
