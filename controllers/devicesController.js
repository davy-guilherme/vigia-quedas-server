const Device = require('../models/Device');

async function index(req, res) {

    const devices = await Device.findByUser(req.user.id);

    res.render('device/home', {
        devices
    });
}

module.exports = { index };