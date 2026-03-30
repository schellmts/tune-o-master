import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: '#303148',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: true, title: 'Tune\'o Master' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
