import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../../utils/theme';

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.surface, borderRadius: 12, padding: theme.spacing.lg, marginBottom: theme.spacing.md, ...theme.shadows.small },
});
