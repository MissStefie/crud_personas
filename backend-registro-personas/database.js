const dotenv = require("dotenv");
const mysql = require('mysql2/promise');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT, 
});

const getConnection = async () => {
  return await pool.getConnection();
};

module.exports = {
  getConnection,
};
