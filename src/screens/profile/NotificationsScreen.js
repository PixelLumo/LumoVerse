import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Header, Card } from '../../components/common';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New message from Alex' },
    { id: 2, text: 'Leaderboard updated' },
  ]);

  return (
    <View style={styles.container}>
      <Header title="Notifications" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.list}>
        {notifications.map((note) => (
          <Card key={note.id} style={styles.card}>
            <Text style={styles.text}>{note.text}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  list: { padding: 20 },
  card: { marginBottom: 10 },
  text: { color: '#ffffff' },
});
