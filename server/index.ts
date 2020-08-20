import { Constants } from './../constants/constants'
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
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
let chipsGame: Game;
let lastGameImage: string;
let newGameJustCreated = true;
let currentLevel = 0;

const chipsMapInfo = readChipsDat();
const chipsLevels = processChipsLevels(chipsMapInfo);

newGame();

function newGame(): void {
  newGameJustCreated = true;
  const randomLevel = Math.floor(currentLevel % chipsLevels.length)
  chipsGame = new Game(chipsLevels[randomLevel]);
  currentLevel++;
}

setInterval(tick, 1000.0 / Constants.GAME_FPS);

function tick() {
  if(chipsGame.players.length === 0 && !newGameJustCreated)
  {
    newGame();
  }
  else if(chipsGame.gameStatus === Constants.GAME_STATUS_PLAYING) {
    newGameJustCreated = false;
    chipsGame.tick();
  }
  else if(chipsGame.gameStatus === Constants.GAME_STATUS_NOT_STARTED) {
    if(chipsGame.players.length > 0)
      chipsGame.startingTimer === 0 ? chipsGame.gameStatus = Constants.GAME_STATUS_PLAYING : chipsGame.startingTimer--;
  }
  else if(chipsGame.gameStatus === Constants.GAME_STATUS_FINISHED) {
    chipsGame.finishTimer === 0 ? newGame() : chipsGame.finishTimer--;
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

setInterval(checkForUpdates, 1000.0 / Constants.SOCKET_FPS);

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

function readChipsDat(): string[]
{
  const directory = path.resolve(__dirname, '../CHIPS_MMO.dat');
  const map: Buffer = fs.readFileSync(directory);
  return map.toString('hex').match(/../g);
}

function processChipsLevels(data: string[]): string[][]
{
  data = data.slice(4); // Magic number in dat file

  const levels: number = unsignedWordToInt(data.slice(0, 2)); // Number of levels
  data = data.slice(2);

  const levelData = new Array();

  for(let i = 0; i < levels; i++)
  {
    const bytesInLevel: number = unsignedWordToInt(data.slice(0, 2));
    data = data.slice(2);
    const levelInfo = data.slice(0, bytesInLevel);
    data = data.slice(bytesInLevel);
    levelData.push(levelInfo);
  }
  return levelData;
}

function unsignedWordToInt(data: string[]): number
{
  return parseInt('0x' + data[0], 16) + (parseInt('0x' + data[1], 16) * (16 * 16))
}
