import { router } from 'expo-router';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Tiko } from '@/components/Tiko';
import { useLibrary, type Scan } from '@/session/LibraryProvider';
import { colors } from '@/theme/colors';

export default function HistoryScreen() {
  const { history, clearHistory } = useLibrary();

  const confirmClearHistory = () =>
    Alert.alert('Effacer l’historique ?', 'Tous vos scans seront supprimés.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Effacer', style: 'destructive', onPress: clearHistory },
    ]);

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(scan) => scan.gtin}
        renderItem={({ item }) => <ScanRow scan={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Tiko pose="endormi" message="Rien par ici pour l’instant… Scanne ton premier vêtement !" />}
        ListFooterComponent={
          history.length > 0 ? (
            <View style={styles.footer}>
              <Button label="Effacer l’historique" variant="secondary" onPress={confirmClearHistory} />
            </View>
          ) : undefined
        }
      />
    </View>
  );
}

function ScanRow({ scan }: { scan: Scan }) {
  const date = new Date(scan.scannedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  return (
    <Pressable
      accessibilityRole="button"
      // Pas de paramètre « scanned » : rouvrir un produit ne le rajoute pas à l'historique.
      onPress={() => router.push({ pathname: '/product/[gtin]', params: { gtin: scan.gtin } })}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.rowText}>
        <Text style={styles.title} numberOfLines={2}>
          {scan.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {scan.subtitle} · {date}
        </Text>
      </View>
      <Text style={scan.cost === null ? styles.subtitle : styles.cost}>
        {scan.cost === null ? 'Non déclaré' : `${Math.round(scan.cost).toLocaleString('fr-FR')} pts`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    gap: 12,
    padding: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondary,
  },
  cost: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  footer: {
    marginTop: 12,
  },
});
