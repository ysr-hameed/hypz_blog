// server.js
import http from "http";
import app from "./src/app.js";
import config from "./src/config/config.js";
import { checkDbConnection } from "./src/database/checkDbConnection.js";
import { createDatabaseTables } from "./src/database/databaseSchema.js";

const PORT = config.port || 3000;

// Wrap Express app in HTTP server
const server = http.createServer(app);

// Max timeout 1 minute
server.timeout = 60000; // 60,000 ms = 1 minute

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  checkDbConnection();
  createDatabaseTables();
});