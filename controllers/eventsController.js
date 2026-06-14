const Event = require('../models/Event');
const Device = require('../models/Device');
const EmergencyContact = require('../models/EmergencyContact'); // Importe o model de contatos

async function index(req, res) {
    try {
        const userId = req.user.id;
        const { tipo, status, device_id } = req.query;

        // 1. Busca os eventos (agora traz os seus + monitorados de forma unificada)
        const events = await Event.findWithFilters(userId, { tipo, status, device_id });

        // // 2. Busca os seus próprios dispositivos
        // const myDevices = await Device.findByUser(userId);

        // // 3. Busca os dispositivos de quem você monitora para alimentar o filtro do Modal
        // const peopleIMonitor = await EmergencyContact.findWhoIMonitore(userId);
        
        // // Junta todos os dispositivos em uma única lista para o <select> do HTML
        // let allDevices = [...myDevices];
        // peopleIMonitor.forEach(user => {
        //     if (user.status === 'active' && user.devices) {
        //         allDevices = allDevices.concat(user.devices);
        //     }
        // });

        const allDevices = await Device.findMyAndMonitoredDevices(userId);
        
        console.log("DIGITOS:");
        console.log(allDevices);

        res.render('events/home', {
            events,
            devices: allDevices, // Lista unificada enviada para a View
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

module.exports = {
    index
};