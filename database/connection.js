const mysql = require('mysql2/promise');

/* Pool de conexões */
const pool = mysql.createPool({
    host: 'srv1196.hstgr.io',
    user: 'u247117055_vigia_us',
    password: 'Tmuk@gr!y4c',
    database: 'u247117055_vigia',
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