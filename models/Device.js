const db = require('../database/connection');

class Device {

    static async findById(id) {

        const [rows] = await db.execute(
            `
            SELECT *
            FROM devices
            WHERE id = ?
            `,
            [id]
        );

        return rows[0] || null;
    }

    static async findByUser(userId) {

        const [rows] = await db.execute(
            `
            SELECT *
            FROM devices
            WHERE user_id = ?
            ORDER BY created_at DESC
            `,
            [userId]
        );

        return rows;
    }

    static async findBySerial(serialNumber) {

        const [rows] = await db.execute(
            `
            SELECT *
            FROM devices
            WHERE serial_number = ?
            `,
            [serialNumber]
        );

        return rows[0] || null;
    }

    static async updateLastSeen(
        serialNumber
    ) {

        await db.execute(
            `
            UPDATE devices
            SET
                status = 'online',
                last_seen = NOW()
            WHERE serial_number = ?
            `,
            [serialNumber]
        );
    }

    static async markOfflineDevices() {

        const [devices] = await db.execute(
            `
            SELECT *
            FROM devices
            WHERE status = 'online'
            AND last_seen < DATE_SUB(NOW(), INTERVAL 2 MINUTE)
            `
        );

        await db.execute(
            `
            UPDATE devices
            SET status = 'offline'
            WHERE status = 'online'
            AND last_seen < DATE_SUB(NOW(), INTERVAL 2 MINUTE)
            `
        );

        return devices;
    }

    static async findMyAndMonitoredDevices(userId) {
        const [rows] = await db.execute(
            `
            SELECT 
                d.*,
                u.nome AS dono_nome
            FROM devices d
            INNER JOIN users u ON d.user_id = u.id
            WHERE d.user_id = ? 
               OR d.user_id IN (
                   SELECT user_id 
                   FROM emergency_contacts 
                   WHERE contact_user_id = ? AND status = 'active'
               )
            ORDER BY d.created_at DESC
            `,
            [userId, userId]
        );

        return rows;
    }

}

module.exports = Device;