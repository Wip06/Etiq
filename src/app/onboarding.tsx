import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { PreferencesQuiz } from '@/components/PreferencesQuiz';
import { Tiko } from '@/components/Tiko';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

export default function OnboardingScreen() {
  const { user, savePreferences, saveFirstName } = useSession();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  // Le prénom n'est demandé qu'une fois : un compte qui repasse par l'onboarding le garde.
  const [askName, setAskName] = useState(!user?.firstName);

  if (askName) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.flex}>
            <Text style={styles.title}>Bienvenue sur Etiq</Text>
            <Tiko pose="assisSourire" message="Salut ! Moi, c’est Tiko. Et toi, comment tu t’appelles ?" />
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Ton prénom"
              placeholderTextColor={colors.secondary}
              autoComplete="given-name"
              autoCapitalize="words"
              returnKeyType="next"
              accessibilityLabel="Prénom"
            />
          </View>
          <Button
            label="Continuer"
            disabled={firstName.trim().length === 0}
            onPress={() => {
              saveFirstName(firstName.trim());
              setAskName(false);
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{user?.firstName ? `Bienvenue, ${user.firstName}` : 'Bienvenue sur Etiq'}</Text>
      <PreferencesQuiz submitLabel="Découvrir mes recommandations" onSubmit={savePreferences} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 24,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.accent,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    color: colors.text,
    backgroundColor: colors.surface,
  },
});
