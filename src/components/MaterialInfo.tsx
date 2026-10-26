import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { FAMILIES, findMaterial } from '@/data/materials';
import { colors } from '@/theme/colors';
import { openLink } from '@/utils/links';

// Bouton placé à côté d'une matière lue sur l'étiquette : il ouvre par-dessus la page le résumé de
// sa fiche du lexique, avec un lien vers l'article complet. Rien ne s'affiche sans fiche.
export function MaterialInfoButton({ text, ecobalyseId }: { text: string; ecobalyseId?: string }) {
  const [open, setOpen] = useState(false);
  const material = findMaterial(text, ecobalyseId);
  if (!material) return null;

  const readMore = () => {
    setOpen(false);
    openLink(material.url);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Qu’est-ce que : ${material.name}`}
        hitSlop={13}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="book-outline" size={18} color={colors.accent} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        <Pressable accessibilityLabel="Fermer" style={styles.backdrop} onPress={() => setOpen(false)}>
          {/* Un appui sur l'encart lui-même ne le ferme pas. */}
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.family}>{FAMILIES[material.family]}</Text>
                <Text style={styles.name}>{material.name}</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Fermer" hitSlop={13} onPress={() => setOpen(false)}>
                <Ionicons name="close" size={24} color={colors.secondary} />
              </Pressable>
            </View>
            <Text style={styles.summary}>{material.summary}</Text>
            <Button label="En savoir plus" onPress={readMore} />
            <Text style={styles.credit}>Article complet de The Good Goods</Text>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.overlay,
  },
  sheet: {
    gap: 14,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  family: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: colors.secondary,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  credit: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.secondary,
  },
});
