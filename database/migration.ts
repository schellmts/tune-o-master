import type { SQLiteDatabase } from 'expo-sqlite';

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS meta (
      schema_version INTEGER NOT NULL DEFAULT 0
    );
  `);

  let row = await db.getFirstAsync<{ schema_version: number }>(
    'SELECT schema_version FROM meta LIMIT 1'
  );

  if (row == null) {
    await db.runAsync('INSERT INTO meta (schema_version) VALUES (0)');
    row = { schema_version: 0 };
  }

  let v = row.schema_version;

  if (v < 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS instrumentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        afinacao TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS historico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL,
        nota TEXT NOT NULL,
        frequencia REAL NOT NULL
      );

      CREATE TABLE IF NOT EXISTS configuracoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        instrumento_id INTEGER,
        tema TEXT NOT NULL,
        FOREIGN KEY (instrumento_id) REFERENCES instrumentos(id)
      );
    `);

    await db.runAsync('UPDATE meta SET schema_version = 1');
    v = 1;
  }

  if (v < 2) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        criado_em TEXT NOT NULL
      );
    `);

    const adminPadrao = await db.getFirstAsync<{ total: number }>(
      'SELECT COUNT(1) as total FROM admins WHERE usuario = ?',
      'admin'
    );

    if (!adminPadrao || adminPadrao.total === 0) {
      await db.runAsync(
        'INSERT INTO admins (usuario, senha, criado_em) VALUES (?, ?, ?)',
        'admin',
        'admin123',
        new Date().toISOString()
      );
    }

    await db.runAsync('UPDATE meta SET schema_version = 2');
    v = 2;
  }

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      criado_em TEXT NOT NULL
    );
  `);

  const adminPadrao = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(1) as total FROM admins WHERE usuario = ?',
    'admin'
  );
  if (!adminPadrao || adminPadrao.total === 0) {
    await db.runAsync(
      'INSERT INTO admins (usuario, senha, criado_em) VALUES (?, ?, ?)',
      'admin',
      'admin123',
      new Date().toISOString()
    );
  }

  const instrumentosVazios = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(1) as total FROM instrumentos'
  );
  if (!instrumentosVazios || instrumentosVazios.total === 0) {
    await db.runAsync(
      'INSERT INTO instrumentos (nome, afinacao) VALUES (?, ?)',
      'Guitarra',
      JSON.stringify({
        afinacoes: [
          {
            nomeAfinacao: 'E Standard',
            quantidadeCordas: 6,
            cordas: [
              { nota: 'E', frequencia: '82.41' },
              { nota: 'A', frequencia: '110.00' },
              { nota: 'D', frequencia: '146.83' },
              { nota: 'G', frequencia: '196.00' },
              { nota: 'B', frequencia: '246.94' },
              { nota: 'E', frequencia: '329.63' },
            ],
          },
          {
            nomeAfinacao: 'Drop D',
            quantidadeCordas: 6,
            cordas: [
              { nota: 'D', frequencia: '73.42' },
              { nota: 'A', frequencia: '110.00' },
              { nota: 'D', frequencia: '146.83' },
              { nota: 'G', frequencia: '196.00' },
              { nota: 'B', frequencia: '246.94' },
              { nota: 'E', frequencia: '329.63' },
            ],
          },
        ],
      })
    );
    await db.runAsync(
      'INSERT INTO instrumentos (nome, afinacao) VALUES (?, ?)',
      'Contrabaixo',
      JSON.stringify({
        afinacoes: [
          {
            nomeAfinacao: 'E Standard',
            quantidadeCordas: 4,
            cordas: [
              { nota: 'E', frequencia: '41.20' },
              { nota: 'A', frequencia: '55.00' },
              { nota: 'D', frequencia: '73.42' },
              { nota: 'G', frequencia: '98.00' },
            ],
          },
        ],
      })
    );
  }
}
