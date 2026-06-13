const db = require('../../database/connection');

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
        const [devices] = await db.execute(
            `
            SELECT
                d.id,
                d.user_id,
                d.nome
            FROM devices d
            WHERE d.serial_number = ?
            `,
            [serialNumber]
        );

        if (devices.length === 0) {

            console.log('Dispositivo não encontrado');

            return;

        }

        const device = devices[0];

        // Registra a queda
        const [fallResult] = await db.execute(
            `
            INSERT INTO falls (
                user_id,
                device_id,
                detected_at,
                latitude,
                longitude,
                confirmed
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                device.user_id,
                device.id,
                new Date(payload.timestamp),
                payload.latitude || null,
                payload.longitude || null,
                false
            ]
        );

        // Cria alerta relacionado à queda
        await db.execute(
            `
            INSERT INTO alerts (
                user_id,
                device_id,
                tipo,
                descricao,
                status
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                device.user_id,
                device.id,
                'fall_detected',
                `Queda detectada pelo dispositivo ${device.nome}`,
                'pending'
            ]
        );

        console.log(
            `Queda registrada com sucesso (Fall ID ${fallResult.insertId})`
        );

    } catch (err) {

        console.error(err);

    }
}

module.exports = { handleFall };