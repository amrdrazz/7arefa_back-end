const express = require('express');

const router = express.Router();

const playerControllers = require('../controllers/playerControllers');

router.get('/random', playerControllers.getRandomPlayer);

module.exports = router