import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../utils/theme';

export function ChatBox({ message, sender, timestamp }) {
  const isOwn = sender === 'own';
  return (
    <View style={[styles.container, isOwn && styles.own]}>
      <View style={[styles.box, isOwn ? styles.ownBox : styles.otherBox]}>
        <Text style={[styles.text, isOwn && styles.ownText]}>{message}</Text>
      </View>
      <Text style={styles.timestamp}>{timestamp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: theme.spacing.sm, alignItems: 'flex-start' },
  own: { alignItems: 'flex-end' },
  box: { maxWidth: '80%', paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg, borderRadius: 12 },
  ownBox: { backgroundColor: theme.colors.primary },
  otherBox: { backgroundColor: theme.colors.surface },
  text: { color: theme.colors.text },
  ownText: { color: theme.colors.background },
  timestamp: { fontSize: 10, color: theme.colors.textTertiary, marginTop: 4 },
});
