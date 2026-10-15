import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Pressable } from 'react-native';

import type { Explanation } from '@/data/explanations';
import { colors } from '@/theme/colors';

// Petit « i » placé devant une donnée : un appui ouvre son explication.
export function InfoButton({ explanation }: { explanation: Explanation }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`En savoir plus : ${explanation.title}`}
      // La zone d'appui dépasse l'icône pour atteindre 44 px, la taille minimale recommandée.
      hitSlop={13}
      onPress={() => Alert.alert(explanation.title, explanation.text)}
    >
      <Ionicons name="information-circle-outline" size={18} color={colors.secondary} />
    </Pressable>
  );
}
