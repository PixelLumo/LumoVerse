import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../../utils/theme';

export function ScreenContainer({ children, style }) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
});
