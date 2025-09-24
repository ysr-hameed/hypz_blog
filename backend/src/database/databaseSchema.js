import pool from "../config/db.js"

export async function createDatabaseTables() {
  const query = ``; // your SQL query here

  if (!query.trim()) {
    console.log("No tables to create. Skipping...");
    return;
  }

  try {
    await pool.query(query);
    console.log("Tables created successfully!");
  } catch (err) {
    console.error('Error while creating tables :', err);
  }
}