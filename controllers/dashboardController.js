const Device = require('../models/Device');
const Event = require('../models/Event');
const EmergencyContact = require('../models/EmergencyContact');

async function index(req, res) {

    const userId = req.user.id;

    const devices = await Device.findByUser(userId);

    // const events = await Event.findByUser(userId);
    const events = await Event.findWithFilters(userId);

    // Pessoas que EU adicionei como meus contatos
    const emergency_contacts = await EmergencyContact.findWithUserDetails(userId);

    // Pessoas que ME adicionaram como contato delas (quem eu monitoro)
    const monitored_users = await EmergencyContact.findWhoIMonitore(userId);

    console.log('Monitorados:');
    console.log(monitored_users);

    res.render('dashboard/home', {
        devices,
        events,
        emergency_contacts,
        monitored_users
    });
}

module.exports = {
    index
};