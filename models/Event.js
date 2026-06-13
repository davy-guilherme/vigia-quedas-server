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

    static async findWithFilters(userId, filters = {}) {
        // Base da query filtrando sempre pelo usuário logado
        let sql = `SELECT * FROM events WHERE user_id = ?`;
        const queryParams = [userId];

        // Se o filtro 'tipo' existir, adiciona à query
        if (filters.tipo) {
            sql += ` AND tipo = ?`;
            queryParams.push(filters.tipo);
        }

        // Se o filtro 'status' existir, adiciona à query
        if (filters.status) {
            sql += ` AND status = ?`;
            queryParams.push(filters.status);
        }

        // NOVO: Se o filtro 'device_id' existir, adiciona à query
        if (filters.device_id) {
            sql += ` AND device_id = ?`;
            queryParams.push(filters.device_id);
        }

        // Mantém a ordenação dos alertas mais recentes primeiro
        sql += ` ORDER BY created_at DESC`;

        const [rows] = await db.execute(sql, queryParams);
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

        console.log('Event create: ');
        console.log(data);
        const [result] = await db.execute(
            `
            INSERT INTO events (
                user_id,
                device_id,
                tipo,
                descricao,
                status
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                data.user_id,
                data.device_id,
                data.tipo,
                data.descricao,
                data.status || 'pending'
            ]
        );

        return result.insertId;
    }

}

module.exports = Event;