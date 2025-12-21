import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CommunityScreen from '../../screens/community/CommunityScreen';
import ChatScreen from '../../screens/community/ChatScreen';

const Stack = createNativeStackNavigator();

export default function CommunityStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}
