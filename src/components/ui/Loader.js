import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { theme } from '../../../utils/theme';

export function Loader({ size = 'large' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
