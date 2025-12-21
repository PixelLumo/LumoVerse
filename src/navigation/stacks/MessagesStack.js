import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ConversationsScreen from '../../screens/messages/ConversationsScreen';
import MessagingScreen from '../../screens/messages/MessagingScreen';

const Stack = createNativeStackNavigator();

export default function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ConversationsScreen"
        component={ConversationsScreen}
      />
      <Stack.Screen name="MessagingScreen" component={MessagingScreen} />
    </Stack.Navigator>
  );
}
