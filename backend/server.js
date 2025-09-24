// server.js
import app from "./src/app.js";
import config from "./src/config/config.js";
import {checkDbConnection} from "./src/database/checkDbConnection.js"
import {createDatabaseTables} from "./src/database/databaseSchema.js"

app.listen(config.port, () => {
  console.log(`🚀 Server running on PORT : ${config.port}`);
  checkDbConnection();
  createDatabaseTables();
});