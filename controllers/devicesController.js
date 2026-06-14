const Device = require('../models/Device');

async function index(req, res) {
    try {
        const userId = req.user.id;

        // Busca tanto os seus hardwares quanto os das pessoas que você monitora
        const devices = await Device.findMyAndMonitoredDevices(userId);

        res.render('device/home', {
            devices,
            user: req.user
        });
        
    } catch (error) {
        console.error("Erro ao listar dispositivos no painel:", error);
        res.status(500).send("Erro interno do servidor.");
    }
}

module.exports = { index };