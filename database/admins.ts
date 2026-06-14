import type { SQLiteDatabase } from 'expo-sqlite';

type Admin = {
  id: number;
  usuario: string;
};

export async function autenticarAdmin(
  db: SQLiteDatabase,
  usuario: string,
  senha: string
): Promise<Admin | null> {
  const usuarioLimpo = usuario.trim();
  const senhaLimpa = senha.trim();

  if (!usuarioLimpo || !senhaLimpa) return null;

  const row = await db.getFirstAsync<Admin>(
    'SELECT id, usuario FROM admins WHERE usuario = ? AND senha = ? LIMIT 1',
    usuarioLimpo,
    senhaLimpa
  );

  return row ?? null;
}

export async function listarAdmins(db: SQLiteDatabase): Promise<Admin[]> {
  return db.getAllAsync<Admin>('SELECT id, usuario FROM admins ORDER BY id DESC');
}

export async function criarAdmin(db: SQLiteDatabase, usuario: string, senha: string): Promise<void> {
  await db.runAsync(
    'INSERT INTO admins (usuario, senha, criado_em) VALUES (?, ?, ?)',
    usuario.trim(),
    senha.trim(),
    new Date().toISOString()
  );
}
