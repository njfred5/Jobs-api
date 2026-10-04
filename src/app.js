import express from "express";
import helmet from "helmet";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import config from "./config/config.js";
import { logMiddleware } from "./middleware/logger.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import savedRoutes from "./routes/savedRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, "../client/dist");

const app = express();
app.set("trust proxy", 1); // Render sits behind a proxy (needed for rate limiting)

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "https:"] // company logos come from other domains
      }
    }
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(logMiddleware);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString(), environment: config.nodeEnv });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api", notFound); // unknown API routes -> JSON 404

// serve the React build (React routes fall back to index.html)
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("/{*splat}", (req, res) => res.sendFile(path.join(clientDist, "index.html")));
} else {
  app.get("/", (req, res) =>
    res.json({
      message: "Jobs API is running. Run `npm run build` to build and serve the React UI.",
      endpoints: ["/api/jobs", "/api/auth", "/api/saved"]
    })
  );
}

app.use(notFound);
app.use(errorHandler);

export default app;
