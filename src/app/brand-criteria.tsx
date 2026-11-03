import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GOALS } from '@/data/goals';
import { CRITERIA } from '@/data/recommendations';
import { colors } from '@/theme/colors';

// Comment l'app choisit les marques qu'elle propose. Les seuils viennent de CRITERIA : la page
// reste juste si on les modifie.
const GOAL_RULES: Record<string, string> = {
  impact: `Au moins ${CRITERIA.minBelowMedianShare} % de ses produits déclarés sur le portail officiel ont un coût environnemental plus bas que la médiane de leur catégorie, à poids égal (en partie dès ${CRITERIA.partialBelowMedianShare} %). Il faut au moins ${CRITERIA.minDeclaredReferences} produits déclarés : en dessous, nous ne savons pas.`,
  durable: 'La marque propose un service de réparation ou de revente de ses vêtements d’occasion (en partie si ce service n’existe que dans quelques magasins).',
  materials: `En moyenne, au plus ${CRITERIA.maxSyntheticShare} % de fibres synthétiques (polyester, nylon, acrylique, élasthanne…) dans la composition de ses vêtements (en partie jusqu’à ${CRITERIA.partialSyntheticShare} %).`,
  local: `Au moins ${CRITERIA.minEuropeShare} % de ses vêtements sont confectionnés en Europe (en partie dès ${CRITERIA.partialEuropeShare} %).`,
};

export default function BrandCriteriaScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Section title="Notre principe">
        <Paragraph>
          Aucune marque ne paie pour apparaître dans Etiq ou pour être mieux placée. Nous ne donnons pas de note aux
          marques : ce sont vos objectifs, choisis à l’inscription, qui classent celles que nous vous proposons.
        </Paragraph>
      </Section>

      <Section title="Les critères">
        {GOALS.map((goal) => (
          <View key={goal.id} style={styles.rule}>
            <Text style={styles.ruleTitle}>{goal.label}</Text>
            <Paragraph>{GOAL_RULES[goal.id]}</Paragraph>
          </View>
        ))}
        <Paragraph>
          Toutes les marques relevées sont proposées, de la plus proche à la moins proche de vos objectifs et de votre
          budget. Une marque peut donc ne correspondre qu’en partie : chaque carte indique ce qui correspond ou non, et
          pourquoi. Une marque qui ne remplit aucun de vos objectifs est présentée « à défaut ».
        </Paragraph>
      </Section>

      <Section title="D’où viennent les données">
        <Paragraph>
          Les fiches produits des marques. La composition y est obligatoire en Europe, et le pays de confection doit y
          figurer en France depuis la loi AGEC. Nous relevons un échantillon de 20 fiches, les premières de six catégories sur le site ou dans son plan, à une date donnée.
        </Paragraph>
        <Paragraph>
          Les chiffres publiés par la marque, quand son site ne se laisse pas relever. Ils sont alors signalés comme
          « déclarés par la marque » : nous ne pouvons pas les vérifier produit par produit.
        </Paragraph>
        <Paragraph>
          Le portail officiel de l’affichage environnemental. Attention : une marque n’y déclare que les produits
          qu’elle choisit.
        </Paragraph>
      </Section>

      <Section title="Pourquoi plusieurs critères ?">
        <Paragraph>
          Le coût environnemental officiel additionne de nombreux impacts. Un vêtement en polyester peut y obtenir un
          chiffre plus bas qu’un vêtement en coton, très gourmand en eau, tout en relâchant des microfibres plastiques
          à chaque lavage. Ces critères ne s’opposent pas : ils mesurent des choses différentes, et c’est à vous de
          choisir ce qui compte.
        </Paragraph>
      </Section>

      <Section title="Les limites">
        <Paragraph>
          Un relevé est une photo à une date : les collections changent. Chaque fiche de marque indique la date et le
          nombre de produits relevés, avec ses sources.
        </Paragraph>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: 24,
    padding: 24,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent,
  },
  rule: {
    gap: 4,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
});
