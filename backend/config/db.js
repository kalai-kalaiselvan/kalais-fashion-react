const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection once
db.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection failed", err);
  } else {
    console.log("MySQL Connected Successfully");
    connection.release();
  }
});

module.exports = db;