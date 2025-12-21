import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { galleryAPI } from '../../utils/api';
import { Header } from '../../components/common';

export default function GalleryScreen({ navigation }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await galleryAPI.getAll();
        setArtworks(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ArtworkDetails', { id: item.id })}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="#ff1493" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Header title="Gallery" />
      <FlatList
        data={artworks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  image: { width: '48%', height: 150, margin: '1%', borderRadius: 10 },
});
