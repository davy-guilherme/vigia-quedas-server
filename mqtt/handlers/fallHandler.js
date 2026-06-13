const Device = require('../../models/Device');
const Event = require('../../models/Event');
const db = require('../../database/connection');
const { getIO } = require('../../services/socket');

async function handleFall(topic, payload) {

    console.log('novo');
    if (!payload.timestamp) {
        console.log('Payload inválido');
        return;
    }

    const serialNumber = topic.split('/')[2];

    console.log('-------------------------');
    console.log(`Queda detectada: ${serialNumber}`);

    try {

        // Busca o dispositivo
        const device =
            await Device.findBySerial(
                serialNumber
            );

        if (!device) {

            console.log(
                'Dispositivo não encontrado'
            );

            return;
        }

        const eventId =
            await Event.create({
                user_id: device.user_id,
                device_id: device.id,
                tipo: 'fall_detected',
                descricao: `Queda detectada pelo dispositivo ${device.nome}`
            });

        const event =
            await Event.findById(eventId);

        console.log(
            `Evento (queda) criado: ${eventId}`
        );

        const io = getIO();

        // Em vez de io.emit (que envia para TODO MUNDO), 
        // usamos io.to(`user-${id}`) para enviar apenas para a sala do usuário específico.
        const roomName = `user-${device.user_id}`;
        
        io.to(roomName).emit(
            'new-event',
            event
        );

    } catch (err) {

        console.error(err);

    }
}

module.exports = { handleFall };