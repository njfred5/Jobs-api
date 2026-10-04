import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, Vite runs on :5173 and forwards /api calls to the Express server on :3000
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:3000" } }
});
