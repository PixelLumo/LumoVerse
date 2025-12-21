import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { apiService } from '../../services/api';
import { Header } from '../../components/common';

export default function HomeScreen({ navigation }) {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetitions = async () => {
      try {
        const response = await apiService.get('/petitions/active');
        setPetitions(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPetitions();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PetitionDetails', { id: item.id })}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.description}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="#ff1493" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Header title="Home" />
      <FlatList
        data={petitions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  card: {
    backgroundColor: '#220a40',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  subtitle: { color: '#ccc', fontSize: 14, marginTop: 5 },
});
