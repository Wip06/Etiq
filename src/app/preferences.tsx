import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PreferencesQuiz } from '@/components/PreferencesQuiz';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

// Modifier ses objectifs depuis le profil.
export default function PreferencesScreen() {
  const { user, savePreferences } = useSession();

  return (
    <View style={styles.container}>
      <PreferencesQuiz
        initial={user?.preferences}
        submitLabel="Enregistrer"
        onSubmit={(preferences) => {
          savePreferences(preferences);
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
});
