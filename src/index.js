import config from "./config/config.js";
import { initializeDatabase } from "./config/database.js";
import app from "./app.js";

await initializeDatabase();

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port} (${config.nodeEnv})`);
});
