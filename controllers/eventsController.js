const Event = require('../models/Event');

async function index(req, res) {

    const events = await Event.findByUser(req.user.id);

    res.render('events/home', {
        events
    });
}

module.exports = {
    index
};