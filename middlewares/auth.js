const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/connection');

const dotenv = require('dotenv').config();

async function authenticateJWT (req, res, next) {
    const token = req.cookies.token;

    // Sem token → redireciona imediatamente
    if (!token) {
        return res.redirect('/auth/login');
    }

    // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //     if (err) {
    //         // Token inválido ou expirado → redireciona
    //         return res.redirect('/auth/login');
    //     }
    //     console.log(`Usuário: ${user}`);
    //     req.user = user;
    //     next();
    // });

    try {

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const [rows] = await db.execute(
            `
            SELECT
                id,
                nome,
                email
            FROM users
            WHERE id = ?
            `,
            [payload.id]
        );

        if (rows.length === 0) {

            res.clearCookie('token');

            return res.redirect('/auth/login');

        }

        const user = rows[0];

        req.user = user;

        const [devices] = await db.execute(
            `
            SELECT
                *
            FROM devices
            WHERE user_id = ?
            `,
            [user.id]
        );

        console.log(devices);

        const [alerts] = await db.execute(
            `
            SELECT
                *
            FROM alerts
            WHERE user_id = ?
            `,
            [user.id]
        );

        console.log(alerts);

        req.user = user;
        req.devices = devices;
        req.alerts = alerts;

        res.locals.user = user;
        res.locals.devices = devices;
        res.locals.alerts = alerts;

        next();

    } catch (err) {

        res.clearCookie('token');

        return res.redirect('/auth/login');

    }
}

function redirectIfAuthenticated (req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return next();
    }

    try {

        jwt.verify(token, process.env.JWT_SECRET);

        return res.redirect('/dashboard');

    } catch (err) {

        return next();

    }

}

module.exports = {
    authenticateJWT,
    redirectIfAuthenticated
};
