const express = require('express');
const router = express.Router();
const config = require('./../config/config.json');
const botController = require('../controllers/bot');

router.post(`/${config.TOKEN}`, botController.startBot);

module.exports = router;
