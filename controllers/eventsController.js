const Event = require('../models/Event');
const Device = require('../models/Device');

async function index(req, res) {
    try {
        const userId = req.user.id;
        
        // Captura o novo parâmetro device_id vindo da URL
        const { tipo, status, device_id } = req.query;

        // Busca os eventos filtrados e busca TAMBÉM todos os dispositivos do usuário
        const events = await Event.findWithFilters(userId, { tipo, status, device_id });
        const devices = await Device.findByUser(userId);

        // Renderiza a view passando os dispositivos encontrados
        res.render('events/home', {
            events,
            devices, // <-- Enviado para preencher o select de dispositivos
            user: req.user,
            filters: { tipo, status, device_id } 
        });
        
    } catch (error) {
        console.error("Erro ao listar ou filtrar eventos:", error);
        res.status(500).send("Erro interno do servidor.");
    }
}

module.exports = {
    index
};