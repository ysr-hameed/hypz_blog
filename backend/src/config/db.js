
import config from "./config.js"
import pkg from "pg"

const { Pool } = pkg;

const pool = new Pool({
  connectionString : config.db_url,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool