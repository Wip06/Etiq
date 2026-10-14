import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { openLink } from '@/utils/links';

type Source = { label: string; url: string };

const DATA_SOURCES: Source[] = [
  {
    label: 'Portail officiel de l’affichage environnemental',
    url: 'https://affichage-environnemental.ecobalyse.beta.gouv.fr/',
  },
  { label: 'Méthode Ecobalyse (ADEME / beta.gouv)', url: 'https://ecobalyse.beta.gouv.fr/' },
];

const CONTENT_SOURCES: Source[] = [
  { label: 'The Good Goods : lexique des matières', url: 'https://www.thegoodgoods.fr/lexique-matieres/' },
  { label: 'The Good Goods : lexique des labels', url: 'https://www.thegoodgoods.fr/lexique-des-labels/' },
  { label: 'Décret n° 2025-957', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052212871' },
  { label: 'Arrêté du 6 septembre 2025', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052213047' },
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Etiq</Text>
      <Text style={styles.paragraph}>
        Application réalisée dans le cadre du challenge « Tech & Business for Good » EDHEC Business School × 42
        Nice, automne 2026. Etiq est indépendante : aucune marque ne la finance ni ne paie pour être mise en avant.
      </Text>

      <Section title="Données" sources={DATA_SOURCES}>
        Les coûts environnementaux affichés proviennent du portail officiel (données publiques sous Licence Ouverte)
        et sont calculés selon la méthode Ecobalyse.
      </Section>

      <Section title="Contenus" sources={CONTENT_SOURCES}>
        Les fiches des lexiques des matières et des labels appartiennent à The Good Goods : Etiq renvoie vers leur
        site. Les résumés d’une ligne sont rédigés par l’équipe Etiq.
      </Section>
    </ScrollView>
  );
}

function Section({ title, sources, children }: { title: string; sources: Source[]; children: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.paragraph}>{children}</Text>
      {sources.map((source) => (
        <Pressable key={source.url} accessibilityRole="link" onPress={() => openLink(source.url)}>
          <Text style={styles.link}>{source.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: 16,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.accent,
  },
  section: {
    gap: 10,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.text,
  },
  link: {
    fontSize: 15,
    textDecorationLine: 'underline',
    color: colors.accent,
  },
});
