const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcryptjs");

const router = express.Router();
const JWT_SECRET = "segredo-super-seguro";

const db = require('../database/connection');

// // Usuário temporário (troque depois por banco)
const usuarioFake = {
    id: 1,
    email: "dvybatista@gmail.com",
    senhaHash: bcrypt.hashSync("123456", 10) // senha: 123456
};

router.get("/login", (req, res) => {
    res.render('auth/login', {

    });
});

// POST para realizar login
router.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    if (email !== usuarioFake.email) {
        return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, usuarioFake.senhaHash);

    if (!senhaValida) {
        return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const token = jwt.sign(
        { id: usuarioFake.id, email: usuarioFake.email },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // coloque true se usar HTTPS
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 // 1 hora
    }).json({ msg: "Login realizado!" });

    // return res.redirect("/dashboard");
});

router.get('/register', (req, res) => {
    res.render('auth/register', {

    });
});

router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        await db.execute(
            'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        );
        res.json({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            erro: 'Erro ao cadastrar'
        });
    }
})

router.post('/logout', (req, res) => {
  res.clearCookie("token");
  return res.json({ msg: "Logout realizado com sucesso" });
});

module.exports = router;