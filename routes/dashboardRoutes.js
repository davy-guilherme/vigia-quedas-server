const express = require("express");
const path = require("path");
const authenticateJWT = require("../middlewares/auth");

const router = express.Router();

router.get("/", authenticateJWT, (req, res) => {
    res.render('dashboard/home', {

    });
});

router.get("/devices", authenticateJWT, (req, res) => {
    res.render('device/home', {
        
    })
});

// router.get("/events", authenticateJWT, (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/events/home.html'));
// });

module.exports = router;