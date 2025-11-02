import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3b82f6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'BooksyGo',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="auth/login"
          options={{
            title: 'Conectare',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="auth/register"
          options={{
            title: 'Înregistrare',
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}

