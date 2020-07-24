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

// Create previous map to check for updates
let lastGameImage = JSON.stringify(chipsGame.gameMap);

setInterval(tick, 1000.0 / Constants.FPS);

function tick() {
  chipsGame.tick();
}


// Listen for socket.io connections
io.on('connection', socket => {
  socket.on(Constants.SOCKET_EVENT_START, function(name) {
    chipsGame.addPlayerToGame(socket.id, name);
  });

  socket.on(Constants.SOCKET_EVENT_MOVE, function(data) {
    chipsGame.movePlayer(socket.id, data);
  });

  socket.on(Constants.SOCKET_EVENT_DISCONNECT, function() {
    chipsGame.removePlayerFromGame(socket.id);
  });
});

setInterval(checkForUpdates, 1000.0 / Constants.FPS);

function checkForUpdates(): void {
  let currentGameImage = JSON.stringify(chipsGame.gameMap);
  if (currentGameImage !== lastGameImage)
  {
    io.sockets.emit(Constants.SOCKET_EVENT_UPDATE_GAME_MAP, chipsGame);
    lastGameImage = currentGameImage;
  }
}


