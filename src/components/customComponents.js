import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function ChatBox({ message, sender }) {
  return (
    <View style={styles.chatBox}>
      <Text style={styles.sender}>{sender}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export function UserCard({ name, role, avatar }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.role}>{role}</Text>
    </View>
  );
}

export function StatBox({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chatBox: { backgroundColor: '#220a40', padding: 15, borderRadius: 8, marginBottom: 10 },
  sender: { color: '#ff1493', fontWeight: 'bold', marginBottom: 5 },
  message: { color: '#ffffff' },
  card: { backgroundColor: '#220a40', padding: 15, borderRadius: 8, marginBottom: 10 },
  name: { color: '#ffffff', fontWeight: 'bold' },
  role: { color: '#b0a0ff' },
  stat: { backgroundColor: '#220a40', padding: 15, borderRadius: 8, alignItems: 'center' },
  value: { color: '#ff1493', fontSize: 20, fontWeight: 'bold' },
  label: { color: '#b0a0ff', marginTop: 5 },
});
