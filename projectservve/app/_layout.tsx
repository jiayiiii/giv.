import { Stack } from 'expo-router';
import { UserProvider } from '../context/UserContext';

export default function Layout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="SIPScreen" 
          options={{ 
            headerShown: true,
            title: "Student Initiated Project"
          }} 
        />
      </Stack>
    </UserProvider>
  );
}

