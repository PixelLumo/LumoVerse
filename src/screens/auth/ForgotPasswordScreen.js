import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { theme } from '../../utils/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Handle password reset logic
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your email to reset password</Text>

        <Card style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={theme.colors.secondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Button title="Send Reset Link" onPress={handleResetPassword} fullWidth style={styles.button} />
        </Card>

        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Back to sign in
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: theme.spacing.lg, justifyContent: 'center' },
  title: { fontSize: theme.typography.fontSize2XL, fontWeight: theme.typography.fontWeightBold, color: theme.colors.primary, marginBottom: theme.spacing.md },
  subtitle: { fontSize: theme.typography.fontSizeBase, color: theme.colors.secondary, marginBottom: theme.spacing.xl },
  card: { marginVertical: theme.spacing.lg },
  input: { backgroundColor: theme.colors.background, color: theme.colors.text, padding: theme.spacing.md, marginBottom: theme.spacing.md, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.surface },
  button: { marginTop: theme.spacing.md },
  link: { color: theme.colors.primary, textAlign: 'center', marginTop: theme.spacing.lg, fontSize: theme.typography.fontSizeBase },
});
