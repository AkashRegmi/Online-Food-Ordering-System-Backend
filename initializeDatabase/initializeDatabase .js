import pool from "../config/pgdb.js";

export const initializeDatabase = async () => {
  try {
    const tableQueries = [
      // Contacts Table
      `CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    ];
    for (const table of tableQueries) {
      console.log("Preparing to make the table ");
      await pool.query(table);
      console.log("Table Created");
    }
  } catch (error) {
    console.error(" Error during database initialization:", error);
    process.exit(1);
  }
};
