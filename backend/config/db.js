const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1517',
    database: 'kalais_store'
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed", err);
    } else {
        console.log("MySQL Connected Successfully");
    }
});

module.exports = db;