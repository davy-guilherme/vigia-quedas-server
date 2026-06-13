// handlers/heartbeatHandler.js

const Device = require('../../models/Device');

async function handleHeartbeat(topic, payload) {

    const serialNumber = topic.split('/')[2];

    console.log(
        `Heartbeat recebido de ${serialNumber}`
    );

    await Device.updateLastSeen(
        serialNumber
    );
}

module.exports = {
    handleHeartbeat
};