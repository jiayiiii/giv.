import Octicons from '@expo/vector-icons/Octicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    
    <Tabs screenOptions={{ tabBarActiveTintColor: '#847ed6' }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'home',
          headerShown: false,
          tabBarIcon: ({ color }) => <Octicons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <Octicons size={28} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
