import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function Header({ title, showBackButton, onBackPress }) {
  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#ff1493" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

export function Button({ title, onPress, variant = 'primary', size = 'medium' }) {
  const isPrimary = variant === 'primary';
  const isSmall = size === 'small';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        isSmall && styles.smallButton,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
          isSmall && styles.smallButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Badge({ label, color = '#ff1493' }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#0f0f1a',
    borderBottomWidth: 1,
    borderBottomColor: '#220a40',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#ff1493', flex: 1, textAlign: 'center' },
  placeholder: { width: 40 },
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  primaryButton: { backgroundColor: '#ff1493' },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#ff1493' },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  primaryButtonText: { color: '#0f0f1a' },
  secondaryButtonText: { color: '#ff1493' },
  smallButton: { paddingVertical: 8, paddingHorizontal: 12 },
  smallButtonText: { fontSize: 12 },
  card: { backgroundColor: '#220a40', borderRadius: 12, padding: 15, marginBottom: 15 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
  badgeText: { color: '#0f0f1a', fontWeight: 'bold', fontSize: 12 },
});
