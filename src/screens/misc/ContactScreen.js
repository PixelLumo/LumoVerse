import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { apiService } from '../../utils/services';
import { Header } from '../../components/common';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!name || !email || !message) return Alert.alert('Error', 'All fields are required');

    try {
      await apiService.post('/contact', { name, email, message });
      Alert.alert('Success', 'Message sent!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Contact Us" />
      <TextInput placeholder="Name" placeholderTextColor="#888" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" placeholderTextColor="#888" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Message"
        placeholderTextColor="#888"
        style={[styles.input, { height: 120 }]}
        multiline
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={{ color: '#0f0f1a', fontWeight: 'bold' }}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20 },
  input: { backgroundColor: '#220a40', color: '#fff', borderRadius: 8, padding: 12, marginBottom: 15 },
  button: { backgroundColor: '#ff1493', padding: 15, borderRadius: 8, alignItems: 'center' },
});
