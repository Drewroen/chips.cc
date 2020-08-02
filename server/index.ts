import { Constants } from './../constants/constants'
import * as express from 'express';
import * as path from 'path';
const PORT = process.env.PORT || 5000;
import * as socketIO from 'socket.io';
import { Game } from './../objects/game';
import { IfStmt } from '@angular/compiler';

// App setup
const server = express()
  .use(express.static(path.join(__dirname, '../chipscc')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Socket setup & pass server
const io = socketIO(server);

// Create map
let chipsGame: Game;
let lastGameImage: string;
let newGameJustCreated = true;

newGame();

function newGame(): void {
  chipsGame = new Game();
  lastGameImage = JSON.stringify(chipsGame.gameMap);
}

setInterval(tick, 1000.0 / Constants.FPS);

function tick() {
  if(chipsGame.players.length === 0)
  {
    newGameJustCreated = true;
    newGame();
  }
  else if(chipsGame.gameStatus === Constants.GAME_STATUS_PLAYING) {
    newGameJustCreated = false;
    chipsGame.tick();
  }
  else if(chipsGame.gameStatus === Constants.GAME_STATUS_NOT_STARTED) {
    chipsGame.startingTimer === 0 ? chipsGame.gameStatus = Constants.GAME_STATUS_PLAYING : chipsGame.startingTimer--;
  }
  else if(chipsGame.gameStatus === Constants.GAME_STATUS_FINISHED) {
    chipsGame.finishTimer === 0 ? chipsGame = new Game() : chipsGame.finishTimer--;
  }
}


// Listen for socket.io connections
io.on('connection', socket => {
  socket.on(Constants.SOCKET_EVENT_START, function(name: string) {
    chipsGame.addPlayerToGame(socket.id, name);
  });

  socket.on(Constants.SOCKET_EVENT_KEYDOWN, function(data: number) {
    chipsGame.addMovement(socket.id, data);
  });

  socket.on(Constants.SOCKET_EVENT_KEYUP, function(data: number) {
    chipsGame.removeMovement(socket.id, data);
  });

  socket.on(Constants.SOCKET_EVENT_DISCONNECT, function() {
    chipsGame.removePlayerFromGame(socket.id);
  });
});

setInterval(checkForUpdates, 1000.0 / Constants.FPS);

function checkForUpdates(): void {
  const currentGameImage = JSON.stringify(chipsGame.gameMap);
  if (currentGameImage !== lastGameImage ||
      (chipsGame.startingTimer % 60 === 0 && chipsGame.startingTimer !== Constants.START_AND_FINISH_TIMER) ||
      (chipsGame.finishTimer % 60 === 0 && chipsGame.finishTimer !== Constants.START_AND_FINISH_TIMER))
  {
    io.sockets.emit(Constants.SOCKET_EVENT_UPDATE_GAME_MAP, chipsGame);
    lastGameImage = currentGameImage;
  }
}
