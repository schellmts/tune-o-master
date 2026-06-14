import type { SQLiteDatabase } from 'expo-sqlite';

export type CordaAfinacao = {
  nota: string;
  frequencia: string;
};

export type AfinacaoInstrumento = {
  nomeAfinacao: string;
  quantidadeCordas: number;
  cordas: CordaAfinacao[];
};

export type Instrumento = {
  id: number;
  nome: string;
  afinacao: string;
};

export async function listarInstrumentos(db: SQLiteDatabase): Promise<Instrumento[]> {
  return db.getAllAsync<Instrumento>('SELECT id, nome, afinacao FROM instrumentos ORDER BY id DESC');
}

export async function inserirInstrumento(
  db: SQLiteDatabase,
  nome: string,
  afinacoes: AfinacaoInstrumento[]
): Promise<void> {
  await db.runAsync(
    'INSERT INTO instrumentos (nome, afinacao) VALUES (?, ?)',
    nome.trim(),
    JSON.stringify({ afinacoes })
  );
}

export async function apagarInstrumento(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM instrumentos WHERE id = ?', id);
}
