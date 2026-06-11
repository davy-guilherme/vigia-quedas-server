const mqtt = require('mqtt');

const { handleFall } = require('./handlers/fallHandler');

function initMQTT () {
    // const client = mqtt.connect('mqtt://localhost:1883');
    const client = mqtt.connect('mqtt://52.202.93.46:1883');

    client.on('connect', () => {
        console.log('MQTT conectado');
        // client.subscribe('vigiaquedas/device/{device_id}/fall');
        client.subscribe('vigiaquedas/device/+/fall');
    });

    client.on('message', async (topic, message) => {
        // const device = topic.split('/')[2];
        // const payload = message.toString();
        // console.log("-------------------------");
        // console.log(`Queda do dispositivo ${device}`);
        try {
            const payload = JSON.parse(message.toString());

            if (topic.includes('/fall')) {
                await handleFall(topic, payload);
            }

        } catch (err) {
            console.error('Erro ao processar mensagem MQTT:', err);
        }

        // deviceController.novaChamada({ mesa, payload }, io);
    });

    client.on('reconnect', () => {
        console.log('Tentando reconectar...');
    });

    client.on('close', () => {
        console.log('Conexão fechada.');
    });

    client.on('offline', () => {
        console.log('Cliente está offline.');
    });

    client.on('error', (err) => {
        console.error('Erro de conexão:', err.message);
    });
}

module.exports = { initMQTT };