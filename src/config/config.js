import dotenv from "dotenv";
dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error("Missing required environment variable: JWT_SECRET");
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv,
  isProduction,
  isDevelopment: nodeEnv === "development",
  databaseUrl: process.env.DATABASE_URL || "./database.sqlite",
  jwtSecret: process.env.JWT_SECRET || "dev-only-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jobsCacheMs: (Number(process.env.JOBS_CACHE_MINUTES) || 15) * 60 * 1000
};

export default config;
