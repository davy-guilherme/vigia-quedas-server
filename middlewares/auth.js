const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const dotenv = require('dotenv').config();

function authenticateJWT (req, res, next) {
    const token = req.cookies.token;

    // Sem token → redireciona imediatamente
    if (!token) {
        return res.redirect('/auth/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Token inválido ou expirado → redireciona
            return res.redirect('/auth/login');
        }
        console.log(`Usuário: ${user}`);
        req.user = user;
        next();
    });
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
