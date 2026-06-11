const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'segredo-super-seguro';

function authenticateJWT (req, res, next) {
    const token = req.cookies.token;

    // Sem token → redireciona imediatamente
    if (!token) {
        return res.redirect('/auth/login');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Token inválido ou expirado → redireciona
            return res.redirect('/auth/login');
        }
        console.log(`Usuário: ${user}`);
        req.user = user;
        next();
    });
}

module.exports = authenticateJWT;
