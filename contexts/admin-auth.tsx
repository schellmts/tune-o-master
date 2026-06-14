import { createContext, useContext, useState, type ReactNode } from 'react';

type AdminAuthContextType = {
  logado: boolean;
  setLogado: (value: boolean) => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [logado, setLogado] = useState(false);
  return (
    <AdminAuthContext.Provider value={{ logado, setLogado }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth deve ser usado dentro de AdminAuthProvider');
  return ctx;
}
