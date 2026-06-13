const Device = require('../models/Device');
const Event = require('../models/Event');

async function index(req, res) {

    const devices = await Device.findByUser(req.user.id);

    const events = await Event.findByUser(req.user.id);

    res.render('dashboard/home', {
        devices,
        events
    });
}

module.exports = {
    index
};