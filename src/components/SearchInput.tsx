import { StyleSheet, TextInput } from 'react-native';

import { colors } from '@/theme/colors';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

export function SearchInput({ value, onChangeText, placeholder }: Props) {
  return (
    <TextInput
      style={styles.search}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.secondary}
      autoCorrect={false}
      clearButtonMode="while-editing"
    />
  );
}

const styles = StyleSheet.create({
  search: {
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
});
