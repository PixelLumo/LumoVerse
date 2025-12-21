import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { apiService } from '../../services/api';
import { Header } from '../../components/common';

export default function PatreonScreen() {
  const [patrons, setPatrons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatrons = async () => {
      try {
        const response = await apiService.get('/patreon');
        setPatrons(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatrons();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.firstname} {item.lastname}</Text>
      <Text style={styles.tier}>{item.tier}</Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#ff1493" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Header title="Patreon Supporters" />
      <FlatList
        data={patrons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />
      <TouchableOpacity style={styles.button} onPress={() => alert('Support Us')}>
        <Text style={{ color: '#0f0f1a', fontWeight: 'bold' }}>Become a Patron</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  card: { backgroundColor: '#220a40', padding: 15, borderRadius: 10, marginBottom: 15 },
  name: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  tier: { color: '#b0a0ff', fontSize: 14 },
  button: { backgroundColor: '#ff1493', padding: 15, borderRadius: 8, alignItems: 'center', margin: 20 },
});
