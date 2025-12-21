import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { apiService } from '../../services/api';
import { Header } from '../../components/common';

export default function CommunityScreen({ navigation }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await apiService.get('/community/members');
        setMembers(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MemberProfile', { id: item.id })}>
      <Text style={styles.name}>{item.firstname} {item.lastname}</Text>
      <Text style={styles.info}>{item.bio}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="#ff1493" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Header title="Community" />
      <FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
  name: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  info: { color: '#ccc', fontSize: 14, marginTop: 5 },
});
