import * as SQLite from 'expo-sqlite';

// Open the database synchronously
export const db = SQLite.openDatabaseSync('lifesync.db');

export async function initializeDatabase(db: SQLite.SQLiteDatabase) {
  try {
    // Enable WAL mode for better performance
    await db.execAsync('PRAGMA journal_mode = WAL;');

    // Tasks Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT NOT NULL,
        category TEXT NOT NULL,
        dueDate TEXT,
        reminder INTEGER DEFAULT 0,
        recurring INTEGER DEFAULT 0,
        completed INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );
    `);

    // Habits Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        frequency TEXT NOT NULL, -- JSON string array
        reminderTime TEXT,
        target INTEGER NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    // Habit Completions Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS habit_completions (
        id TEXT PRIMARY KEY NOT NULL,
        habitId TEXT NOT NULL,
        date TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        FOREIGN KEY (habitId) REFERENCES habits (id) ON DELETE CASCADE
      );
    `);

    // Expenses Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        paymentMethod TEXT NOT NULL,
        note TEXT,
        createdAt TEXT NOT NULL
      );
    `);

    // Budgets Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY NOT NULL,
        category TEXT NOT NULL,
        limitAmount REAL NOT NULL,
        month TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    // Goals Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        target REAL NOT NULL,
        deadline TEXT,
        icon TEXT,
        createdAt TEXT NOT NULL
      );
    `);

    // Goal Contributions Table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS goal_contributions (
        id TEXT PRIMARY KEY NOT NULL,
        goalId TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        note TEXT,
        FOREIGN KEY (goalId) REFERENCES goals (id) ON DELETE CASCADE
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}
