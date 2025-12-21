import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../../../utils/theme';

export function Button({ title, onPress, variant = 'primary', disabled = false }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, variant === 'primary' ? styles.primaryText : styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center' },
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.colors.primary },
  text: { fontSize: 16, fontWeight: '600' },
  primaryText: { color: theme.colors.background },
  secondaryText: { color: theme.colors.primary },
  disabled: { opacity: 0.5 },
});
