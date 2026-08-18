const Player = require('../models/Player');

const top5Leagues = [
  "Premier League",
  "LALIGA EA SPORTS",
  "Serie A Enilive",
  "Bundesliga",
  "Ligue 1 McDonald's",
];

module.exports.getRandomPlayer = async (req, res) => {
    try{
        const players = await Player.aggregate([
            {
                $match: {
                league: { $in: top5Leagues },
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


        res.json({
            id: players[0]._id,
            fcId: players[0].fcId,
            name: players[0].name,
            cardUrl: players[0].cardUrl,
            nation: players[0].nation,
            position: players[0].position,
            rating: players[0].rating,
            team: players[0].team,
            league: players[0].league,
        });
    }catch(err){
        console.error(err);

        res.status(500).json({
            message: "Server error",
        });
    }
}
