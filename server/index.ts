import { Constants } from './../constants/constants'
import * as express from 'express';
import * as path from 'path';
const PORT = process.env.PORT || 5000;
import * as socketIO from 'socket.io';
import { Game } from './../objects/game';

// App setup
const server = express()
  .use(express.static(path.join(__dirname, '../chipscc')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Socket setup & pass server
const io = socketIO(server);

// Create map
const chipsGame = new Game();

setInterval(tick, 1000.0 / Constants.FPS);

function tick() {
  chipsGame.tick();
}


// Listen for socket.io connections
io.on('connection', socket => {
  socket.on(Constants.SOCKET_EVENT_START, function(name) {
    if (!chipsGame.playerInGame(socket.id)) {
      chipsGame.spawnPlayer(socket.id, name);
      updateGameInfo();
    }
  });

  socket.on(Constants.SOCKET_EVENT_MOVE, function(data) {
    chipsGame.movePlayer(socket.id, data);
    updateGameInfo();
  });

  socket.on(Constants.SOCKET_EVENT_DISCONNECT, function() {
    if (chipsGame.playerInGame(socket.id)) {
      chipsGame.removePlayerFromGame(socket.id);
    }
    updateGameInfo();
  });

  updateGameInfo();
});

function updateGameInfo() {
  io.sockets.emit(Constants.SOCKET_EVENT_UPDATE_GAME_MAP, chipsGame);
}


