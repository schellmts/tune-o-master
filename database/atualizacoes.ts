import type { SQLiteDatabase } from 'expo-sqlite';

const TAG = '[SQLite/atualizacoes]';

export type Atualizacao = {
  id: number;
  titulo: string;
  descricao: string | null;
  criado_em: number;
};

export async function listarAtualizacoes(db: SQLiteDatabase): Promise<Atualizacao[]> {
  console.log(TAG, 'listar → iniciando SELECT');
  const rows = await db.getAllAsync<Atualizacao>(
    'SELECT id, titulo, descricao, criado_em FROM atualizacoes ORDER BY criado_em DESC'
  );
  console.log(TAG, 'listar → ok, linhas:', rows.length);
  return rows;
}

export async function inserirAtualizacao(
  db: SQLiteDatabase,
  titulo: string,
  descricao?: string | null
): Promise<void> {
  const criado_em = Date.now();
  console.log(TAG, 'inserir →', { titulo, descricao: descricao ?? null, criado_em });
  await db.runAsync(
    'INSERT INTO atualizacoes (titulo, descricao, criado_em) VALUES (?, ?, ?)',
    titulo,
    descricao ?? null,
    criado_em
  );
  console.log(TAG, 'inserir → commit ok');
}

export async function atualizarAtualizacao(
  db: SQLiteDatabase,
  id: number,
  titulo: string,
  descricao?: string | null
): Promise<void> {
  console.log(TAG, 'atualizar →', { id, titulo, descricao: descricao ?? null });
  await db.runAsync(
    'UPDATE atualizacoes SET titulo = ?, descricao = ? WHERE id = ?',
    titulo,
    descricao ?? null,
    id
  );
  console.log(TAG, 'atualizar → ok, id:', id);
}

export async function apagarAtualizacao(db: SQLiteDatabase, id: number): Promise<void> {
  console.log(TAG, 'apagar → id:', id);
  await db.runAsync('DELETE FROM atualizacoes WHERE id = ?', id);
  console.log(TAG, 'apagar → ok, id:', id);
}
