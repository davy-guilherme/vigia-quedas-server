const express = require("express");
const path = require("path");
const { authenticateJWT } = require("../middlewares/auth");
const DashboardController = require("../controllers/dashboardController");
const EventsController = require('../controllers/EventsController');

const router = express.Router();

router.get("/", authenticateJWT, DashboardController.index);

router.get("/devices", authenticateJWT, (req, res) => {
    res.render('device/home', {
        // user: req.user
    })
});

router.get("/events", authenticateJWT, EventsController.index);

// router.get("/events", authenticateJWT, (req, res) => {
//     res.render('events/home', {})
// });

module.exports = router;