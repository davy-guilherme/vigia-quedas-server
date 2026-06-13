const db = require('../database/connection');

class User {

    static async findById(id) {

        const [rows] = await db.execute(
            `
            SELECT *
            FROM users
            WHERE id = ?
            `,
            [id]
        );

        return rows[0] || null;
    }
}

module.exports = User;