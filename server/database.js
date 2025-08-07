import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { resolve } from 'path';

let dbInstance = null;

export async function initializeDatabase() {
  const dbPath = resolve('./server/database.sqlite');
  
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // 创建用户表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建任务表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      image TEXT,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // 插入示例用户数据
  try {
    await db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      ['admin', 'admin123']
    );
  } catch (error) {
    // 用户已存在，忽略错误
  }

  // 插入示例任务数据
  try {
    // 先获取admin用户的ID
    const adminUser = await db.get('SELECT id FROM users WHERE username = ?', 'admin');
    if (adminUser) {
      await db.run(
        'INSERT INTO tasks (title, completed, user_id) VALUES (?, ?, ?)',
        ['学习 Nuxt3', false, adminUser.id]
      );
      
      await db.run(
        'INSERT INTO tasks (title, completed, user_id) VALUES (?, ?, ?)',
        ['掌握 Vue3 Composition API', false, adminUser.id]
      );
    }
  } catch (error) {
    // 任务已存在，忽略错误
  }

  dbInstance = db;
  return db;
}

export async function getDatabase() {
  if (!dbInstance) {
    await initializeDatabase();
  }
  return dbInstance;
}