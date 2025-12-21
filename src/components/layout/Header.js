import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../utils/theme';

export function Header({ title, subtitle }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.surface },
  title: { fontSize: theme.typography.fontSizeXL, fontWeight: 'bold', color: theme.colors.text },
  subtitle: { fontSize: theme.typography.fontSizeSmall, color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
});
