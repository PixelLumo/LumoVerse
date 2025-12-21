import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { blogAPI } from '../../utils/api';
import { Header } from '../../components/common';

export default function BlogScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogAPI.getAll();
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BlogDetails', { id: item.id })}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.excerpt}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="#ff1493" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Header title="Blog" />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  card: { backgroundColor: '#220a40', padding: 15, borderRadius: 10, marginBottom: 15 },
  title: { color: '#ff1493', fontSize: 16, fontWeight: 'bold' },
  desc: { color: '#b0a0ff', fontSize: 14, marginTop: 5 },
});
