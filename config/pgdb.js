import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const connectPgDb = async () => {
  try {
    const client = await pool.connect();
    console.log(" PostgreSQL connected successfully");
    client.release();
  } catch (error) {
    console.error(" Database connection failed:", error);
    process.exit(1); // Stop the server if the database connection fails
  }
};

export default pool;
