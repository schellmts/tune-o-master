import { useAdminAuth } from '@/contexts/admin-auth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useRequireAdmin() {
  const { logado } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!logado) router.replace('/admin');
  }, [logado, router]);

  return logado;
}
