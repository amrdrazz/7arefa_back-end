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


function registerClashSocket(io, socket) {

  socket.on("create-room", async (name) => {
    if (!name) name='host';
    console.log("create room");

    let roomCode = generateRoomCode();

    const isCodeExists = await ClashGame.exists({ roomCode });

    while (isCodeExists) {
      roomCode = generateRoomCode();
      const isCodeExists = await ClashGame.exists({ roomCode });
    }

    try {
      const game = await ClashGame.create({
        roomCode,

        players: {
          hostPlayer: name,
          guest: null
        },

        rounds,

        currentRound: 1,

        score: {
          player1: 0,
          player2: 0
        }
      });

      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      socket.data.side = "host";

      console.log(name, "-created-", roomCode);

    } catch (err) {
      console.log(err);
    }
  });

  socket.on("join-room", async ({name, roomCode}) => {

    if(!name) name = 'guest'

    try{
      const game = await ClashGame.findOne({
        roomCode
      });

      if(!game) return;

      game.guest = name;

      game.save();

      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      socket.data.side = "guest";

      console.log(name, "-joined-", roomCode);
    }catch(err){
      console.log(err);
    }
  });

  // socket.on("start-game", () => {
  //   const
  // });

}

module.exports = registerClashSocket;