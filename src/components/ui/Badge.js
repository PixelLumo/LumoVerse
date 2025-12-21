import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../utils/theme';

export function Badge({ label, variant = 'primary' }) {
  return (
    <View style={[styles.badge, variant === 'primary' ? styles.primary : styles.secondary]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, alignSelf: 'flex-start' },
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.secondary },
  text: { fontSize: 10, color: theme.colors.background, fontWeight: 'bold' },
});
