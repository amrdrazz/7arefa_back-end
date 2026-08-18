const crepto = require('crypto');

const Player = require('../models/Player');

const games = new Map();

const topTeams = require('../data/topTeams');

const top5Leagues = [
    "Premier League",
    "LALIGA EA SPORTS",
    "Serie A Enilive",
    "Bundesliga",
    "Ligue 1 McDonald's",
];

module.exports.startGame = async (req, res) => {
    try{
        const players = await Player.aggregate([
            {
                $match: {
                team: { $in: topTeams },
                "rating.ovr": { $gt: 80 },
                },
            },
            {
                $sample: {
                size: 1,
                },
            },
        ]);

        if (!players.length) {
            return res.status(404).json({ message: "No players found" });
        }

        const player = players[0];
    
        const gameId = crepto.randomUUID();
    
        games.set(gameId, {
            playerId: player._id.toString(),
            expiresAt: Date.now() + 10 * 60 * 1000
        });
    
        res.status(200).json({ gameId });
    }catch(err){
        console.error(err);

        res.status(500).json({ message: "Could not start game" });
    }
}

module.exports.getSuggestions = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name?.trim()) {
            return res.json([]);
        }

        const players = await Player.find({
            name: {
                $regex: `(^| )${name.trim()}`,
                $options: "i"
            },
            league: {
                $in: top5Leagues
            }
        })
        .sort({ "rating.ovr": -1 })
        .limit(10);

        res.status(200).json(players.map((player) => ({
            id: player._id,
            img: player.cardUrl,
            name: player.name,
            ovr: player.rating.ovr,
            club: player.team,
            natoin: player.nation
        })));

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports.guess = async (req, res) => {
    try{
        const { gameId, playerId } = req.body;

        if (!gameId || !playerId) {
            return res.status(400).json({ message: "gameId and playerId are required" });
        }

        const game = games.get(gameId);

        if (!game) {
            return res.status(404).json({
                message: "Game not found"
            });
        }

        const answerId = game.playerId;

        const [answer, guess] = await Promise.all([
            Player.findById(answerId),
            Player.findById(playerId),
        ]);

        if (!answer || !guess) {
            return res.status(404).json({ message: "Player not found" });
        }

        const result = {
            id: guess._id,
            
            name: guess.name,

            img: guess.cardUrl,

            team: {
                correct: guess.team === answer.team,
                team: guess.team
            },

            league: {
                correct: guess.league === answer.league,
                league: guess.league
            },

            nation: {
                correct: guess.nation === answer.nation,
                nation: guess.nation
            },

            position: {
                correct: guess.position === answer.position,
                position: guess.position
            },

            ovr: {
                correct: guess.rating.ovr === answer.rating.ovr,
                state:
                guess.rating.ovr > answer.rating.ovr
                ? "lower"
                : "higher",
                ovr: guess.rating.ovr
            },
        };

        const correct = guess._id.toString() === answer._id.toString();

        res.json({
            correct,
            result,
        });

    }catch(err){
        console.error(err);

        res.status(500).json({ message: "Could not process guess" });
    }
}