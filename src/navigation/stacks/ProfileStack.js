import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../../screens/profile/ProfileScreen';
import PatreonScreen from '../../screens/profile/PatreonScreen';
import AboutScreen from '../../screens/misc/AboutScreen';
import ContactScreen from '../../screens/misc/ContactScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="PatreonScreen" component={PatreonScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
      <Stack.Screen name="ContactScreen" component={ContactScreen} />
    </Stack.Navigator>
  );
}
