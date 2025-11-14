import express from "express";
import config from "./config/config.js";
import { logMiddleware } from "./middleware/logger.js";
import jobRoutes from "./routes/jobRoutes.js";

const app = express(); // <-- must come first

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logMiddleware);

// serve static frontend files
app.use(express.static("public"));

// routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Jobs API",
    version: "1.0.0",
    environment: config.nodeEnv,
    endpoints: {
      jobs: "/jobs"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

app.use("/jobs", jobRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`
  });
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

// start server
const PORT = process.env.PORT || config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
