const express = require('express');
const cors = require('cors');

const playerRoutes = require('./routes/playerRoutes');
const guessGameRoutes = require('./routes/guessGameRoutes')

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://7arefa.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use('/guess-game', guessGameRoutes);
app.use('/players', playerRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: '7arefa API' });
});

module.exports = app