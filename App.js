import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from './src/utils/theme';

// Screens
import HomeScreen from './src/screens/home/HomeScreen';
import AboutScreen from './src/screens/misc/AboutScreen';
import CommunityScreen from './src/screens/community/CommunityScreen';
import ChatScreen from './src/screens/community/ChatScreen';
import MessagingScreen from './src/screens/messages/MessagingScreen';
import NotificationsScreen from './src/screens/profile/NotificationsScreen';
import LeaderboardScreen from './src/screens/content/LeaderboardScreen';
import TutorialsScreen from './src/screens/content/TutorialsScreen';
import GalleryScreen from './src/screens/content/GalleryScreen';
import BlogScreen from './src/screens/content/BlogScreen';
import ContactScreen from './src/screens/misc/ContactScreen';
import PatreonScreen from './src/screens/profile/PatreonScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- STACKS ---
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'LumoVerse' }} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
      <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
      <Stack.Screen name="ContactScreen" component={ContactScreen} />
    </Stack.Navigator>
  );
}

function CommunityStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="CommunityScreen" component={CommunityScreen} options={{ title: 'Community' }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function ContentStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} options={{ title: 'Leaderboard' }} />
      <Stack.Screen name="TutorialsScreen" component={TutorialsScreen} />
      <Stack.Screen name="BlogScreen" component={BlogScreen} />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="MessagingScreen" component={MessagingScreen} options={{ title: 'Messages' }} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="PatreonScreen" component={PatreonScreen} options={{ title: 'Profile & Support' }} />
    </Stack.Navigator>
  );
}

// --- BOTTOM TAB NAVIGATOR ---
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Community') iconName = 'chat-multiple';
          else if (route.name === 'Content') iconName = 'book';
          else if (route.name === 'Messages') iconName = 'bell';
          else if (route.name === 'Profile') iconName = 'account';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.surface },
        headerShown: false,
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

// --- APP ENTRY ---
export default function App() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
