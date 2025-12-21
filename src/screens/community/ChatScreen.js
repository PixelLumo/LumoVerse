import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { apiService } from '../../services/api';
import { Header } from '../../components/common';

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await apiService.get('/messages');
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const response = await apiService.post('/messages', { content: input });
      setMessages([...messages, response.data]);
      setInput('');
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#ff1493" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Header title="Chat" showBackButton onBackPress={() => navigation.goBack()} />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.text}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor="#888"
          style={styles.input}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  message: { padding: 10, borderRadius: 8, marginBottom: 10, maxWidth: '80%' },
  myMessage: { backgroundColor: '#ff1493', alignSelf: 'flex-end' },
  otherMessage: { backgroundColor: '#220a40', alignSelf: 'flex-start' },
  text: { color: '#fff' },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#444' },
  input: { flex: 1, backgroundColor: '#220a40', color: '#fff', borderRadius: 8, paddingHorizontal: 10 },
  sendButton: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 },
});
