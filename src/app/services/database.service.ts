import { Injectable } from '@angular/core';
import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: Database | null = null;
  private SQL: SqlJsStatic | null = null;

  async initializeDatabase() {
    if (this.db) {
      return;
    }

    try {
      // Initialize SQL.js
      this.SQL = await initSqlJs({
        locateFile: file => `assets/sql-wasm/${file}`
      });
      
      // Create new database or load existing
      const savedData = localStorage.getItem('sqliteDB');
      if (savedData) {
        const binary = new Uint8Array(JSON.parse(savedData));
        this.db = new this.SQL.Database(binary);
      } else {
        // Initialize new database
        this.db = new this.SQL.Database();
        await this.createTables();
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    this.db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  private saveToLocalStorage() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const data = this.db.export();
    const binary = JSON.stringify(Array.from(data));
    localStorage.setItem('sqliteDB', binary);
  }

  async addTask(title: string): Promise<void> {
    if (!this.db) {
      await this.initializeDatabase();
    }

    if (!this.db) {
      throw new Error('Failed to initialize database');
    }
    
    this.db.run(
      'INSERT INTO tasks (title) VALUES (?)',
      [title]
    );
    this.saveToLocalStorage();
  }

  async getTasks(): Promise<Array<{id: number, title: string, completed: boolean, created_at: string}>> {
    if (!this.db) {
      await this.initializeDatabase();
    }

    if (!this.db) {
      throw new Error('Failed to initialize database');
    }
    
    const result = this.db.exec('SELECT * FROM tasks ORDER BY created_at DESC');
    if (result.length === 0) return [];
    
    return result[0].values.map(row => ({
      id: row[0] as number,
      title: row[1] as string,
      completed: Boolean(row[2]),
      created_at: row[3] as string
    }));
  }

  async toggleTask(id: number): Promise<void> {
    if (!this.db) {
      await this.initializeDatabase();
    }

    if (!this.db) {
      throw new Error('Failed to initialize database');
    }
    
    this.db.run(
      'UPDATE tasks SET completed = NOT completed WHERE id = ?',
      [id]
    );
    this.saveToLocalStorage();
  }

  async deleteTask(id: number): Promise<void> {
    if (!this.db) {
      await this.initializeDatabase();
    }

    if (!this.db) {
      throw new Error('Failed to initialize database');
    }
    
    this.db.run('DELETE FROM tasks WHERE id = ?', [id]);
    this.saveToLocalStorage();
  }
}


