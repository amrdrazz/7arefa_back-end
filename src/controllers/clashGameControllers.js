const ClashGame = require('../models/ClashGame');

const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

const stats = [
    'pac',
    'sho',
    'pas',
    'dri',
    'def',
    'phy'
];

const rounds = require('../data/rounds');

const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

const generateRoomCode = () => {
    return nanoid();
}



module.exports.createGame = async (req, res) => {
    const { name, clientId } = req.body;

    if(!name || !clientId) return res.status(400).json({ message: 'Host player data is required' });

    let roomCode = generateRoomCode();

    const isCodeExists = await ClashGame.exists({roomCode});

    while(isCodeExists) {
        roomCode = generateRoomCode();
        const isCodeExists = await ClashGame.exists({roomCode});
    }

    try{
        const game = await ClashGame.create({
            roomCode,

            players: {
                hostPlayer: {
                    name,
                    clientId
                },
                guest: null
            },
        
            rounds,
        
            currentRound: 1,
        
            score: {
                player1: 0,
                player2: 0
            }
        });

        res.status(200).json({ roomId: game._id });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: err });
    }
    
}

module.exports.joinRoom = async (req, res) => {
    const {player, roomId} = req.body;
    if (!player || !roomId) return res.status(400).json({ message: 'Player & Room ID are required' });

    try{
        const room = await ClashGame.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not founded' });

        if (room.players.player2) return res.status(400).json({ message: 'The room is empty' });

        room.players.player2 = player;

        await room.save();
    }catch(err){
        console.log(err);
        res.status(500).json({ error: err })
    }
}