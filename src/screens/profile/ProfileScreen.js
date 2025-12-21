import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { apiService } from '../../services/api';
import { Header } from '../../components/common';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setFirstname(currentUser?.firstname || '');
      setLastname(currentUser?.lastname || '');
    };
    loadUser();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updated = await authService.updateProfile({ firstname, lastname });
      Alert.alert('Success', 'Profile updated.');
      setUser(updated);
    } catch (error) {
      Alert.alert('Failed', error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Logout Failed', 'An error occurred while logging out.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Profile" showBackButton onBackPress={() => navigation.goBack()} />
      {user ? (
        <View style={styles.form}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#888"
            style={styles.input}
            value={firstname}
            onChangeText={setFirstname}
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#888"
            style={styles.input}
            value={lastname}
            onChangeText={setLastname}
          />

          <Button title={loading ? 'Updating...' : 'Update Profile'} onPress={handleUpdate} />
          {loading && <ActivityIndicator size="small" color="#ff1493" style={{ marginTop: 10 }} />}

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ActivityIndicator size="large" color="#ff1493" style={{ marginTop: 50 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  form: { padding: 20, marginTop: 30 },
  input: {
    backgroundColor: '#220a40',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  logoutButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#b71c1c',
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
});
