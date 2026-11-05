import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { impactLevel } from '@/components/CategoryComparison';
import { EtiqPlusBadge } from '@/components/EtiqPlusBadge';
import { ImpactEquivalents } from '@/components/ImpactEquivalents';
import { Tiko } from '@/components/Tiko';
import { formatCount, pluralize } from '@/data/equivalents';
import { useLibrary, type WardrobeItem } from '@/session/LibraryProvider';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

// « Ma garde-robe » (Etiq+) : les vêtements achetés après un scan, et leur impact cumulé. Les coûts
// sont ceux du portail officiel, ou les estimations Etiq faites depuis l'étiquette.
export default function WardrobeScreen() {
  const { user } = useSession();
  const { wardrobe, toggleWardrobe } = useLibrary();

  if (!user?.premium) {
    return (
      <View style={[styles.container, styles.centered]}>
        <EtiqPlusBadge />
        <Text style={styles.title}>« Ma garde-robe » fait partie d’Etiq+</Text>
        <Text style={styles.text}>
          Ajoutez les vêtements que vous achetez et suivez l’impact cumulé de votre garde-robe.
        </Text>
        <Button label="Découvrir Etiq+" onPress={() => router.replace('/etiq-plus')} />
      </View>
    );
  }

  if (wardrobe.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Tiko
          pose="endormi"
          message="Ta garde-robe est vide. Scanne un vêtement et appuie sur « Je l’ai acheté » !"
          onPress={() => router.navigate('/scan')}
        />
      </View>
    );
  }

  const total = wardrobe.reduce((sum, item) => sum + item.cost, 0);
  const estimates = wardrobe.filter((item) => item.estimate).length;
  const compared = wardrobe.filter((item) => item.lessImpactThan !== null);
  const lowImpact = compared.filter((item) => (item.lessImpactThan ?? 0) >= 50).length;

  const confirmRemove = (item: WardrobeItem) =>
    Alert.alert('Retirer ce vêtement ?', item.title, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Retirer', style: 'destructive', onPress: () => toggleWardrobe(item) },
    ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <EtiqPlusBadge />
        <Text style={styles.total}>{pluralize(wardrobe.length, 'vêtement')}</Text>
        <Text style={styles.text}>
          {formatCount(Math.round(total))} points de coût environnemental au total
          {estimates > 0 ? `, dont ${pluralize(estimates, 'estimation')} Etiq faite${estimates > 1 ? 's' : ''} depuis l’étiquette` : ''}.
        </Text>
        {compared.length > 0 && (
          <Text style={styles.text}>
            {lowImpact} sur {compared.length} ont moins d’impact que la moitié des vêtements de leur catégorie.
          </Text>
        )}
      </View>

      <ImpactEquivalents cost={total} plural />

      <Text style={styles.sectionTitle}>Mes vêtements</Text>
      {wardrobe.map((item) => (
        <WardrobeRow key={item.id} item={item} onRemove={() => confirmRemove(item)} />
      ))}
    </ScrollView>
  );
}

function WardrobeRow({ item, onRemove }: { item: WardrobeItem; onRemove: () => void }) {
  const level = item.lessImpactThan !== null ? impactLevel(item.lessImpactThan) : null;
  // Seuls les vêtements du portail ont une fiche à rouvrir ; une estimation dépend de la photo.
  const open = item.estimate
    ? undefined
    : () => router.push({ pathname: '/product/[gtin]', params: { gtin: item.id } });

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole={open ? 'button' : undefined}
        disabled={!open}
        onPress={open}
        style={({ pressed }) => [styles.rowMain, pressed && styles.pressed]}
      >
        <Text style={styles.rowTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.rowSubtitle} numberOfLines={1}>
          {item.subtitle} · {item.estimate ? 'Estimation Etiq' : 'Portail officiel'}
        </Text>
        <View style={styles.rowFooter}>
          <Text style={styles.rowCost}>{formatCount(Math.round(item.cost))} pts</Text>
          {level && <Text style={[styles.level, { backgroundColor: level.color }]}>{level.label}</Text>}
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Retirer ${item.title} de ma garde-robe`}
        hitSlop={12}
        onPress={onRemove}
      >
        <Ionicons name="trash-outline" size={20} color={colors.secondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  content: {
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  card: {
    gap: 6,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  total: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  rowMain: {
    flex: 1,
    gap: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  rowSubtitle: {
    fontSize: 14,
    color: colors.secondary,
  },
  rowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowCost: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  level: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
    color: colors.onImpact,
  },
});
