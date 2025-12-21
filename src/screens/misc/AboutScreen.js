import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Header } from '../../components/common';

export default function AboutScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="About LumoVerse" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <Text style={styles.text}>
          LumoVerse is a vibrant community for creators, learners, and innovators.
          Here you can join discussions, showcase your work, and grow your skills.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 20 },
  text: { color: '#ffffff', fontSize: 16, lineHeight: 24 },
});
