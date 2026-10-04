import db from "../config/database.js";

class SavedJob {
  static createTable() {
    db.exec(`
      CREATE TABLE IF NOT EXISTS saved_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        job_id TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, job_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  }

  static list(userId) {
    return db
      .prepare("SELECT data FROM saved_jobs WHERE user_id = ? ORDER BY created_at DESC")
      .all(userId)
      .map((row) => JSON.parse(row.data));
  }

  static add(userId, job) {
    db.prepare(
      "INSERT OR REPLACE INTO saved_jobs (user_id, job_id, data) VALUES (?, ?, ?)"
    ).run(userId, String(job.id), JSON.stringify(job));
    return job;
  }

  static remove(userId, jobId) {
    return (
      db
        .prepare("DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?")
        .run(userId, String(jobId)).changes > 0
    );
  }
}

export default SavedJob;
