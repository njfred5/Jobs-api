import db from "../config/database.js";

class User {
  static createTable() {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  static findById(id) {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  }

  static findByEmail(email) {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  }

  static create({ name, email, passwordHash }) {
    const result = db
      .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
      .run(name, email, passwordHash);
    return this.findById(result.lastInsertRowid);
  }
}

export default User;
