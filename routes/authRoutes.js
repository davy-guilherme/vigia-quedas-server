const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcryptjs");

const { redirectIfAuthenticated } = require('../middlewares/auth');
const router = express.Router();

const dotenv = require('dotenv').config();

const db = require('../database/connection');

// // Usuário temporário (troque depois por banco)
// const usuarioFake = {
//     id: 1,
//     email: "dvybatista@gmail.com",
//     senhaHash: bcrypt.hashSync("123456", 10) // senha: 123456
// };

router.get("/login", redirectIfAuthenticated, (req, res) => {
    res.render('auth/login', {

    });
});

// POST para realizar login
router.post("/login", async (req, res) => {

    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: "Email e senha são obrigatórios." });
        }

        // if (email !== usuarioFake.email) {
        //     return res.status(401).json({ erro: "Credenciais inválidas." });
        // }

        // const senhaValida = await bcrypt.compare(senha, usuarioFake.senhaHash);

        // if (!senhaValida) {
        //     return res.status(401).json({ erro: "Credenciais inválidas." });
        // }

        const [rows] = await db.execute(
            "SELECT id, email, senha_hash FROM users WHERE email = ?",
            [email]
        );

        console.log(rows.length);

        if (rows.length === 0) {

            return res.status(401).json({
                erro: "Credenciais inválidas - 1."
            });

        }

        const usuario = rows[0];

        // const senhaValida = await bcrypt.compare(
        //     senha,
        //     usuario.senha_hash
        // );
        // console.log(usuario);

        const senhaValida = senha === usuario.senha_hash;

        // console.log("Senha recebida:", senha);
        // console.log("Senha banco:", usuario.senha_hash);
        // console.log("Tipo recebida:", typeof senha);
        // console.log("Tipo banco:", typeof usuario.senha_hash);
        // console.log("Senha válida?", senhaValida);

        if (!senhaValida) {

            return res.status(401).json({
                erro: "Credenciais inválidas. - 2"
            });

        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            // { id: usuarioFake.id, email: usuarioFake.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        console.log("Token gerado");

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // coloque true se usar HTTPS
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 // 1 hora
        }).json({ msg: "Login realizado!" });
        console.log("Cookie criado");

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });

    }

    // return res.redirect("/dashboard");
});

router.get('/register', redirectIfAuthenticated, (req, res) => {
    res.render('auth/register', {

    });
});

router.post('/register', async (req, res) => {
    try {

        const { nome, email, senha } = req.body;

        const senhaHash = await bcrypt.hash(senha, 10);

        const [result] = await db.execute(
            'INSERT INTO users (nome, email, senha_hash) VALUES (?, ?, ?)',
            // [nome, email, senhaHash]
            [nome, email, senha]
        );

        const token = jwt.sign(
            {
                id: result.insertId,
                email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60
        });

        res.json({
            success: true
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            erro: 'Erro ao cadastrar'
        });

    }
    // try {
    //     const { nome, email, senha } = req.body;
    //     await db.execute(
    //         'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
    //         [nome, email, senha]
    //     );
    //     res.json({
    //         success: true
    //     });
    // } catch (err) {
    //     console.log(err);
    //     res.status(500).json({
    //         erro: 'Erro ao cadastrar'
    //     });
    // }
})

router.post('/logout', (req, res) => {
    res.clearCookie("token");
    //   return res.json({ msg: "Logout realizado com sucesso" });
    return res.redirect('/');
});

module.exports = router;