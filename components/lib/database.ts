import sqlite3 from 'sqlite3';
import { open } from 'sqlite'; // Import the open function from the 'sqlite' module

export async function openDb() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database,
  });
}

// Inicializa la tabla de comentarios
export async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT,
      content TEXT,
      approved BOOLEAN DEFAULT false,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}