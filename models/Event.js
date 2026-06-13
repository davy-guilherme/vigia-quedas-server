const db = require('../database/connection');

class Event {

    static async findById(id) {

        const [rows] = await db.execute(
            `
            SELECT *
            FROM events
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
            FROM events
            WHERE user_id = ?
            ORDER BY created_at DESC
            `,
            [userId]
        );

        return rows;
    }

    static async findByDevice(deviceId) {

        const [rows] = await db.execute(
            `
            SELECT *
            FROM events
            WHERE device_id = ?
            ORDER BY created_at DESC
            `,
            [deviceId]
        );

        return rows;
    }

    static async create(data) {

        const [result] = await db.execute(
            `
            INSERT INTO events (
                user_id,
                device_id,
                type,
                message
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                data.user_id,
                data.device_id,
                data.type,
                data.message
            ]
        );

        return result.insertId;
    }

}

module.exports = Event;