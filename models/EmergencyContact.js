const db = require('../database/connection');
const Device = require('../models/Device');

class EmergencyContact {

    // Lista todos os contatos ativos de um usuário específico (útil para quando houver queda)
    static async findActiveByUserId(userId) {
        const [rows] = await db.execute(
            `
            SELECT 
                u.id,
                u.nome,
                u.email,
                ec.relacao,
                ec.status,
                ec.created_at
            FROM emergency_contacts ec
            INNER JOIN users u ON ec.contact_user_id = u.id
            WHERE ec.user_id = ? AND ec.status = 'active'
            `,
            [userId]
        );
        return rows;
    }

    // Lista todos os convites (pendentes ou não) que o usuário enviou
    static async findWithUserDetails(userId) {
        const [rows] = await db.execute(
            `
            SELECT 
                ec.id AS connection_id,
                u.id AS contact_id,
                u.nome,
                u.email,
                ec.relacao,
                ec.status
            FROM emergency_contacts ec
            INNER JOIN users u ON ec.contact_user_id = u.id
            WHERE ec.user_id = ?
            ORDER BY ec.created_at DESC
            `,
            [userId]
        );
        return rows;
    }

    // Cria um novo pedido de vínculo (por padrão entra como 'pending')
    static async create(data) {
        const [result] = await db.execute(
            `
            INSERT INTO emergency_contacts (
                user_id,
                contact_user_id,
                relacao,
                status
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                data.user_id,
                data.contact_user_id,
                data.relacao,
                data.status || 'pending'
            ]
        );
        return result.insertId;
    }

    // Atualiza o status (útil para o contato aceitar/recusar o convite de monitoramento)
    static async updateStatus(id, status) {
        const [result] = await db.execute(
            `
            UPDATE emergency_contacts
            SET status = ?
            WHERE id = ?
            `,
            [status, id]
        );
        return result.affectedRows > 0;
    }

    // Remove um contato de emergência
    static async delete(id) {
        const [result] = await db.execute(
            `
            DELETE FROM emergency_contacts
            WHERE id = ?
            `,
            [id]
        );
        return result.affectedRows > 0;
    }

    // Busca os usuários que adicionaram o usuário logado como contato de emergência
    // static async findWhoMonitorsMe(contactUserId) {
    static async findWhoIMonitore(contactUserId) {
        // 1. Busca primeiro todas as pessoas que eu monitoro
        const [users] = await db.execute(
            `
            SELECT 
                ec.id AS connection_id,
                u.id AS monitored_user_id,
                u.nome,
                u.email,
                ec.relacao,
                ec.status
            FROM emergency_contacts ec
            INNER JOIN users u ON ec.user_id = u.id
            WHERE ec.contact_user_id = ?
            ORDER BY ec.created_at DESC
            `,
            [contactUserId]
        );

        // 2. Para cada usuário encontrado, busca os dispositivos dele em paralelo
        const monitoredUsersWithDevices = await Promise.all(
            users.map(async (user) => {
                // Usa o método que você já possui no seu Model Device
                const devices = await Device.findByUser(user.monitored_user_id);
                
                // Retorna o objeto do usuário injetando a lista de dispositivos dele
                return {
                    ...user,
                    devices: devices // Cada dispositivo aqui já virá com 'nome', 'serial_number', 'status', etc.
                };
            })
        );

        return monitoredUsersWithDevices;
    }
}

module.exports = EmergencyContact;