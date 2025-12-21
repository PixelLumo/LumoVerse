import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { theme } from '../../utils/theme';

export default function ConversationsScreen() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Conversations</Text>
        <Text style={styles.text}>Your active chats</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  title: { fontSize: theme.typography.fontSize2XL, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.xl },
  text: { color: theme.colors.text },
});
