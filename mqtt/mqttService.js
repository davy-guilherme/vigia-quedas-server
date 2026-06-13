const mqtt = require('mqtt');
const dotenv = require('dotenv').config();

const { handleFall } = require('./handlers/fallHandler');

function initMQTT () {
    console.log(process.env.MQTT_HOST);
    // const client = mqtt.connect('mqtt://localhost:1883');
    // const client = mqtt.connect('mqtt://52.202.93.46:1883');
    const client = mqtt.connect(process.env.MQTT_HOST);

    client.on('connect', () => {
        console.log('MQTT conectado');
        client.subscribe('vigiaquedas/device/+/fall');
        console.log('Subscrito no tópico: vigiaquedas/device/+/fall')
    });

    client.on('message', async (topic, message) => {
        // const device = topic.split('/')[2];
        // const payload = message.toString();
        // console.log("-------------------------");
        // console.log(`Queda do dispositivo ${device}`);
        try {
            const payload = JSON.parse(message.toString());

            if (topic.includes('/fall')) {
                console.log('fall mqtt');
                await handleFall(topic, payload);
            }

        } catch (err) {
            console.error('Erro ao processar mensagem MQTT:', err);
        }

        // deviceController.novaChamada({ mesa, payload }, io);
    });

    client.on('reconnect', () => {
        console.log('MQTT: Tentando reconectar...');
    });

    client.on('close', () => {
        console.log('MQTT: Conexão fechada.');
    });

    client.on('offline', () => {
        console.log('MQTT: Cliente está offline.');
    });

    client.on('error', (err) => {
        console.error('MQTT: Erro de conexão:', err.message);
    });
}

module.exports = { initMQTT };