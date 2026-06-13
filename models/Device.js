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

        console.log("varrendo dispositivos offline");

        await db.execute(
            `
            UPDATE devices
            SET status = 'offline'
            WHERE
                status = 'online'
                AND last_seen <
                    DATE_SUB(
                        NOW(),
                        INTERVAL 2 MINUTE
                    )
            `
        );

    }

}

module.exports = Device;