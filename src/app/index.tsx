import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Etiq</Text>
      <Text style={styles.subtitle}>Le coût environnemental de vos vêtements</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.accent,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.text,
  },
});
