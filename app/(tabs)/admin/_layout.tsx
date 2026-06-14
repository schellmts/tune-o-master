import { AdminAuthProvider } from '@/contexts/admin-auth';
import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <AdminAuthProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#12131e' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="instrumentos" />
        <Stack.Screen name="administradores" />
      </Stack>
    </AdminAuthProvider>
  );
}
