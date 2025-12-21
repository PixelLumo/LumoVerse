import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../utils/theme';

export function UserCard({ name, avatar, status, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', paddingVertical: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.surface },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: theme.spacing.lg },
  content: { justifyContent: 'center' },
  name: { fontSize: theme.typography.fontSizeBase, fontWeight: 'bold', color: theme.colors.text },
  status: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 },
});
