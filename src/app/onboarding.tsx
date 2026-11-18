import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { HabitsForm } from '@/components/HabitsForm';
import { PreferencesQuiz } from '@/components/PreferencesQuiz';
import { Tiko } from '@/components/Tiko';
import type { Habits } from '@/data/habits';
import { useLibrary } from '@/session/LibraryProvider';
import { useSession, type Preferences } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

type Step = 'name' | 'goals' | 'offer' | 'situation';

export default function OnboardingScreen() {
  const { user, savePreferences, saveFirstName } = useSession();
  const { habits, saveHabits } = useLibrary();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  // Le prénom n'est demandé qu'une fois : un compte qui repasse par l'onboarding le garde.
  const [step, setStep] = useState<Step>(user?.firstName ? 'goals' : 'name');
  // Les objectifs ne sont enregistrés qu'à la toute fin : les enregistrer termine l'onboarding et ouvre l'app.
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  const finish = () => {
    if (preferences) savePreferences(preferences);
  };

  if (step === 'name') {
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
              setStep('goals');
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (step === 'offer') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flex}>
          <Text style={styles.title}>Ma situation</Text>
          <Tiko pose="assisRegard" message="Dernière étape ! Tu veux bien m’en dire un peu plus sur toi ?" />
          <Text style={styles.text}>
            Quelques questions sur votre situation et vos habitudes d’achat, toutes facultatives. Elles nous aident à
            comprendre comment on achète des vêtements. Vos réponses ne sont partagées que si vous l’acceptez.
          </Text>
          <Text style={styles.meta}>Vous pourrez répondre, modifier ou effacer vos réponses à tout moment dans votre profil.</Text>
        </View>
        <View style={styles.actions}>
          <Button label="Répondre maintenant" onPress={() => setStep('situation')} />
          <Button label="Plus tard, depuis mon profil" variant="secondary" onPress={finish} />
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'situation') {
    // Le budget mensuel vient d'être donné avec les objectifs : la question est préremplie.
    const initial: Habits = {
      sharing: null,
      updatedAt: new Date().toISOString(),
      ...habits,
      answers: { budget: preferences ? [preferences.budget] : undefined, ...habits?.answers },
    };
    return (
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <HabitsForm
          inOnboarding
          initial={initial}
          submitLabel="Découvrir mes recommandations"
          onSubmit={(answers) => {
            saveHabits(answers);
            finish();
          }}
          header={<Text style={styles.title}>Ma situation</Text>}
          footer={<Button label="Plus tard, depuis mon profil" variant="secondary" onPress={finish} />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{user?.firstName ? `Bienvenue, ${user.firstName}` : 'Bienvenue sur Etiq'}</Text>
      <PreferencesQuiz
        initial={preferences}
        submitLabel="Continuer"
        onSubmit={(chosen) => {
          setPreferences(chosen);
          setStep('offer');
        }}
      />
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
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.accent,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondary,
  },
  actions: {
    gap: 12,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    color: colors.text,
    backgroundColor: colors.surface,
  },
});
