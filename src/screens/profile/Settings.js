import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common';

export default function Settings({ navigation }) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <Header title="Settings" showBackButton onBackPress={() => navigation.goBack()} />
      <View style={styles.section}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#888', true: '#ff1493' }} />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#888', true: '#ff1493' }} />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('ProfileScreen')}>
        <Text style={styles.logoutText}>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20 },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  label: { color: '#fff', fontSize: 16 },
  logoutButton: { marginTop: 30, padding: 12, borderRadius: 8, backgroundColor: '#ff1493', alignItems: 'center' },
  logoutText: { color: '#0f0f1a', fontWeight: 'bold' },
});
