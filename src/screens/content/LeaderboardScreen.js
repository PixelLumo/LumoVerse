import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { userAPI } from '../../utils/api';
import { Header } from '../../components/common';

export default function LeaderboardScreen() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await userAPI.getLeaderboard();
        setLeaders(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <Text style={styles.name}>{item.firstname} {item.lastname}</Text>
      <Text style={styles.points}>{item.points} pts</Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#ff1493" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Header title="Leaderboard" />
      <FlatList
        data={leaders}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  rank: { color: '#ff1493', fontWeight: 'bold', width: 40 },
  name: { color: '#fff', fontWeight: 'bold', flex: 1 },
  points: { color: '#b0a0ff', width: 80, textAlign: 'right' },
});
