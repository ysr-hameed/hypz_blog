// dbTest.js
import pool from "../config/db.js";

export async function checkDbConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database Connected Successfully!");
  } catch (err) {
    console.log(`Database Connection Failed : ${err}`);
  }
}