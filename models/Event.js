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
        // Seleciona os dados do evento e traz também o nome do usuário e do dispositivo
        let sql = `
            SELECT 
                e.*,
                u.nome AS usuario_nome,
                d.nome AS dispositivo_nome
            FROM events e
            INNER JOIN users u ON e.user_id = u.id
            INNER JOIN devices d ON e.device_id = d.id
            WHERE (e.user_id = ? OR e.user_id IN (
                SELECT user_id 
                FROM emergency_contacts 
                WHERE contact_user_id = ? AND status = 'active'
            ))
        `;
        
        // O userId entra duas vezes: para os próprios eventos e para a subquery de monitorados
        const queryParams = [userId, userId];

        // Se o filtro 'tipo' existir, adiciona à query
        if (filters.tipo) {
            sql += ` AND e.tipo = ?`;
            queryParams.push(filters.tipo);
        }

        // Se o filtro 'status' !!existir, adiciona à query
        if (filters.status) {
            sql += ` AND e.status = ?`;
            queryParams.push(filters.status);
        }

        // Se o filtro 'device_id' existir, adiciona à query
        if (filters.device_id) {
            sql += ` AND e.device_id = ?`;
            queryParams.push(filters.device_id);
        }

        // Mantém a ordenação global por data do alerta
        sql += ` ORDER BY e.created_at DESC`;

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