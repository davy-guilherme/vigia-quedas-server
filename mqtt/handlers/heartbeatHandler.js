const Device = require('../../models/Device');
const { getIO } = require('../../services/socket');

async function handleHeartbeat(topic, payload) {

    const serialNumber = topic.split('/')[2];

    console.log(
        `Heartbeat recebido de ${serialNumber}`
    );

    const device = await Device.findBySerial(serialNumber);

    if (!device) {
        return;
    }

    const wasOffline = device.status === 'offline';

    await Device.updateLastSeen(
        serialNumber
    );

    if (wasOffline) {

        const io = getIO();

        io.to(`user-${device.user_id}`).emit(
            'device-status-changed',
            {
                deviceId: device.id,
                status: 'online'
            }
        );

        console.log(
            `Dispositivo ${serialNumber} voltou a ficar online`
        );
    }
}

module.exports = {
    handleHeartbeat
};