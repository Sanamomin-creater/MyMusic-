// DB_Conn.js
const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // your MySQL username
  password: 'root',  // your MySQL password
  database: 'musicdata'
});

con.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = con;
