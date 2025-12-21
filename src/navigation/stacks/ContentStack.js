import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LeaderboardScreen from '../../screens/content/LeaderboardScreen';
import TutorialsScreen from '../../screens/content/TutorialsScreen';
import BlogScreen from '../../screens/content/BlogScreen';

const Stack = createNativeStackNavigator();

export default function ContentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
      <Stack.Screen name="TutorialsScreen" component={TutorialsScreen} />
      <Stack.Screen name="BlogScreen" component={BlogScreen} />
    </Stack.Navigator>
  );
}
