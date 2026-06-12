const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config();

/* Pool de conexões */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// const pool = mysql.createPool({
//     host: 'srv1196.hstgr.io',
//     user: 'u247117055_vigia_us',
//     password: 'Tmuk@gr!y4c',
//     database: 'u247117055_vigia',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

module.exports = pool;