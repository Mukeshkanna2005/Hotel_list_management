const { Pool } = require("pg");
require("dotenv").config({ path: __dirname + "/../.env" });

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
});

// Test the connection on startup
pool.query("SELECT current_database(), NOW()")
  .then((res) => {
    const dbName = res.rows[0].current_database;
    console.log(`✅ Connected to PostgreSQL database "${dbName}" successfully on port ${process.env.DB_PORT || 5432}`);
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message || err.code || err);
  });

module.exports = pool;
