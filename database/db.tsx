import { SQLiteProvider } from 'expo-sqlite';
import type { ReactNode } from 'react';
import { runMigrations } from './migration';

type Props = { children: ReactNode };

export default function DatabaseProvider({ children }: Props) {
  return (
    <SQLiteProvider databaseName="tuneo.db" onInit={runMigrations}>
      {children}
    </SQLiteProvider>
  );
}
