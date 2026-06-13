const Device = require('../models/Device');
const { getIO } = require('./socket');

function startDeviceMonitor() {

    setInterval(
        async () => {
            console.log("Varrendo dispositivos")
            try {

                const offlineDevices = await Device.markOfflineDevices();

                const io = getIO();

                for (const device of offlineDevices) {


                    console.log('Emitindo device-status-changed', {
                        deviceId: device.id,
                        status: 'offline'
                    });

                    io.to(`user-${device.user_id}`).emit(
                        'device-status-changed',
                        {
                            deviceId: device.id,
                            status: 'offline'
                        }
                    );
                }

            } catch (err) {

                console.error(
                    'Erro ao verificar dispositivos offline:',
                    err
                );

            }

        },
        60000
    );

}

module.exports = {
    startDeviceMonitor
};