const express = require("express");
const path = require("path");
const { authenticateJWT } = require("../middlewares/auth");

const router = express.Router();

router.get("/", authenticateJWT, (req, res) => {
    res.render('dashboard/home', {
        // user: req.user
    });
});

router.get("/devices", authenticateJWT, (req, res) => {
    res.render('device/home', {
        // user: req.user
    })
});

router.get("/events", authenticateJWT, (req, res) => {
    res.render('events/home', {

    })
});

module.exports = router;