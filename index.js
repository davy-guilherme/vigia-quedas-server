const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const dashRoutes = require("./routes/dashboardRoutes");
const cookieParser = require('cookie-parser');
const mqttService = require('./mqtt/mqttService');
const os = require('os');

const db = require('./database/connection');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const { startDeviceMonitor } = require('./services/deviceMonitor');

app.use((req, res, next) => {
    res.locals.currentUrl = req.path;
    next();
});

// Rotas
app.use('/', publicRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashRoutes);

// STATIC
app.use(express.static(path.join(__dirname, 'public')));

/*
Define EJS como template engine
*/
app.set("view engine", "ejs");

// Inicia MQTT
mqttService.initMQTT();

// inicia varredura de dispositivos offline
startDeviceMonitor();


// app.get('/', (req, res) => {
//     res.send('Hello World');
// });
// app.get('/', (req, res) => {
//     res.redirect('/');
// })

const interfaces = os.networkInterfaces();

for (const interfaceName in interfaces) {

    const networkInterface = interfaces[interfaceName];

    for (const network of networkInterface) {

        if (network.family === 'IPv4' && !network.internal) {

            console.log(`${interfaceName}: ${network.address}`);

        }

    }

}

app.listen(3000, () => {
    console.log('Server is running on https://localhost:3000');
});

async function testDatabase() {
    try {
        const connection = await db.getConnection();
        console.log('MariaDB conectado!');
        connection.release();
    } catch (err) {
        console.error(err);
    }
}

testDatabase();