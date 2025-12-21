import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeStack from './stacks/HomeStack';
import CommunityStack from './stacks/CommunityStack';
import ContentStack from './stacks/ContentStack';
import MessagesStack from './stacks/MessagesStack';
import ProfileStack from './stacks/ProfileStack';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f0f1a',
          borderTopColor: '#220a40',
        },
        tabBarActiveTintColor: '#ff1493',
        tabBarInactiveTintColor: '#b0a0ff',
        tabBarIcon: ({ color, size }) => {
          let icon;

          switch (route.name) {
            case 'Home':
              icon = 'home';
              break;
            case 'Community':
              icon = 'people';
              break;
            case 'Content':
              icon = 'grid';
              break;
            case 'Messages':
              icon = 'chatbubble';
              break;
            case 'Profile':
              icon = 'person';
              break;
            default:
              icon = 'ellipse';
          }

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Community" component={CommunityStack} />
      <Tab.Screen name="Content" component={ContentStack} />
      <Tab.Screen name="Messages" component={MessagesStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
