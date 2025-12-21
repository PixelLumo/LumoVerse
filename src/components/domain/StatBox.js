import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../utils/theme';

export function StatBox({ label, value, icon }) {
  return (
    <View style={styles.box}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, backgroundColor: theme.colors.surface, paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.md, borderRadius: 12, alignItems: 'center', marginHorizontal: theme.spacing.sm },
  value: { fontSize: theme.typography.fontSizeXL, fontWeight: 'bold', color: theme.colors.primary },
  label: { fontSize: 12, color: theme.colors.textSecondary, marginTop: theme.spacing.sm },
});
