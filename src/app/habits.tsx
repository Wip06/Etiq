import { router } from 'expo-router';
import { Alert } from 'react-native';

import { Button } from '@/components/Button';
import { HabitsForm } from '@/components/HabitsForm';
import { useLibrary } from '@/session/LibraryProvider';

// « Ma situation », depuis le profil : mêmes questions qu'à la fin de l'onboarding.
export default function HabitsScreen() {
  const { habits, saveHabits } = useLibrary();

  const erase = () =>
    Alert.alert('Effacer vos réponses ?', 'Vos réponses et votre accord de partage seront supprimés.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Effacer',
        style: 'destructive',
        onPress: () => {
          saveHabits(null);
          router.back();
        },
      },
    ]);

  return (
    <HabitsForm
      initial={habits}
      submitLabel="Enregistrer"
      onSubmit={(answers) => {
        saveHabits(answers);
        router.back();
      }}
      footer={habits && <Button label="Effacer mes réponses" variant="secondary" onPress={erase} />}
    />
  );
}
