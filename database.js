const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: "82.39.107.62",
    port: 3306,
    database: "core",
    user: "splitcore",
    password: "RLbKhFS7wswR8EwM",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;