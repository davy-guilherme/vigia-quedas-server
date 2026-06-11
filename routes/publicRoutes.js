const express = require('express');
const router = express.Router();

const path = require('path');

// Home
// router.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/public/home.html'));
// });
router.get('/', (req, res) => {
    res.render('public/home', {
        nome: 'Davy',
        idade: 25
    })
});


router.get('/about', (req, res) => {
    res.render('public/about', {

    })
})

// Sobre

// Contato (?)

module.exports = router;