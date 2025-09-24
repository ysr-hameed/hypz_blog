import pool from "../config/db.js"

export async function createDatabaseTables() {
  try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password_hash TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `)
  console.log(`Tables created successfully!`);
  } catch (err) {
    console.error('Error while creating tables :', err);
  }
}