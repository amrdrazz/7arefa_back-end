const app = require('./src/app');

const connectDB = require('./src/config/db');

// const { Server } = require('socket.io');

// const http = require('http');

// const cors = require('cors');
// const registerSockets = require('./src/sockets');

// const players = new Map();


// const startServer = async () => {
//   await connectDB();

  // const server = http.createServer(app);

  // const io = new Server(server, {
  //   cors: {
  //     origin: "https://7arefa.vercel.app/"
  //   }
  // });


  // registerSockets(io);

  // io.on('connection', (socket) => {
  //   console.log('Socket connected:', socket.id);

  //   socket.on('identify', (clientId) => {
  //     const player = players.get(clientId);

  //     if (player){
  //       player.socketId = socket.id;

  //       socket.join(player.roomCode);

  //       socket.data.clientId = player.clientId;
  //       socket.data.roomCode = player.roomCode;
  //       socket.data.side = player.side;
  //     }else{
  //       console.log('new player');

  //       players.set(clientId, {
  //         clientId,
  //         socketId: socket.id,
  //         roomCode: null,
  //         side: null
  //       });
  //     }
  //   });

  //   socket.on('disconnect', () => {
  //     console.log('Socket disconnected:', socket.id);
  //   });
  // });

//   return app
// }

connectDB()


module.exports = app;