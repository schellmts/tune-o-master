import { AdminAuthProvider } from '@/contexts/admin-auth';
import { Stack } from 'expo-router';

const headerOptions = {
  headerStyle: { backgroundColor: '#2b2d44' },
  headerTintColor: '#fff',
  headerTitleAlign: 'center' as const,
  headerTitleStyle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
  },
};

export default function AdminLayout() {
  return (
    <AdminAuthProvider>
      <Stack
        screenOptions={{
          ...headerOptions,
          contentStyle: { backgroundColor: '#12131e' },
        }}>
        <Stack.Screen name="index" options={{ title: 'Painel Admin', headerShown: false }} />
        <Stack.Screen name="instrumentos" options={{ title: 'Cadastro de Instrumentos' }} />
        <Stack.Screen name="administradores" options={{ title: 'Cadastro de Administradores' }} />
      </Stack>
    </AdminAuthProvider>
  );
}
