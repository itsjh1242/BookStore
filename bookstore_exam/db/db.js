const mysql = require("mysql2/promise");
// MAC: itsjh0112
// HOME: 0112
// NM246: 011200
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "itsjh0112",
  port: 3306,
  database: "bookstore1",
});

module.exports = pool;
