import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath = path.isAbsolute(config.databaseUrl)
  ? config.databaseUrl
  : path.join(__dirname, "../../", config.databaseUrl);

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export default db;

export const initializeDatabase = async () => {
  const { default: User } = await import("../models/User.js");
  const { default: SavedJob } = await import("../models/SavedJob.js");
  User.createTable();
  SavedJob.createTable();
  console.log(`📊 Database ready (${dbPath})`);
};
