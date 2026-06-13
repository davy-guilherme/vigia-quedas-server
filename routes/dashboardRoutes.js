const express = require("express");
const path = require("path");
const { authenticateJWT } = require("../middlewares/auth");
const DashboardController = require("../controllers/dashboardController");
const EventsController = require('../controllers/eventsController');
const DevicesController = require('../controllers/devicesController');

const router = express.Router();

router.get("/", authenticateJWT, DashboardController.index);

router.get("/devices", authenticateJWT, DevicesController.index);

router.get("/events", authenticateJWT, EventsController.index);

// router.get("/events", authenticateJWT, (req, res) => {
//     res.render('events/home', {})
// });

module.exports = router;