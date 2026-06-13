const Device = require('../models/Device');

function startDeviceMonitor() {

    setInterval(
        async () => {

            try {

                await Device.markOfflineDevices();

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