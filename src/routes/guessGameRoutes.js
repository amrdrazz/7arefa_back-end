const express = require('express');

const router = express.Router();

const guessGameControllers = require('../controllers/guessGameControllers');

router.post('/start', guessGameControllers.startGame);
router.post('/guess', guessGameControllers.guess);
router.get('/search', guessGameControllers.getSuggestions);

module.exports = router