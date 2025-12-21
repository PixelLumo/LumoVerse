import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { messageAPI } from '../../services/api';
import { Header } from '../../components/common';

export default function MessagingScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await messageAPI.getConversations();
        setConversations(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ChatScreen', { conversationId: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="#ff1493" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Header title="Messages" />
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  card: {
    backgroundColor: '#220a40',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  lastMessage: { color: '#ccc', fontSize: 14, marginTop: 5 },
});
