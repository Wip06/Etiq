import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput } from 'react-native';

import { Button } from '@/components/Button';
import { useSession } from '@/session/SessionProvider';
import { colors } from '@/theme/colors';

// Connexion simulée : le mot de passe n'est pas vérifié.
export default function LoginScreen() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValid = email.includes('@');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="vous@exemple.fr"
        placeholderTextColor={colors.secondary}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />
      <Button label="Se connecter" onPress={() => signIn(email.trim())} disabled={!isValid} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    padding: 24,
    backgroundColor: colors.background,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: colors.secondary,
  },
  input: {
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
});
