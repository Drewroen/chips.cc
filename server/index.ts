import { BlankTile } from './objects/gameTiles/blankTile';
import { Player } from './objects/player';
import { GameTile } from './objects/gameTile';
import { GameMap } from './objects/gameMap';
import * as express from 'express';
import * as path from 'path';
const PORT = process.env.PORT || 5000;
import * as socketIO from 'socket.io';
import { Constants } from '../constants/constants';
import { PlayerTile } from './objects/gameTiles/playerTile';

// App setup
const server = express()
  .use(express.static(path.join(__dirname, '../chipscc')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

console.log(__dirname);

// Socket setup & pass server
const io = socketIO(server);

// Create map
const map = new GameMap();
map.loadMap();
const playerList: Player[] = [];

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.SOCKET_EVENT_START, function() {
    if (!playerInGame(socket.id)) {
      spawnPlayer(socket.id);
      updateGameMap();
    }
  });

  socket.on(Constants.SOCKET_EVENT_MOVE, function(data) {
    movePlayer(socket.id, data);
    updateGameMap();
  });

  socket.on(Constants.SOCKET_EVENT_DISCONNECT, function() {
    if (playerInGame(socket.id)) {
      removePlayerFromGame(socket.id);
    }
    updateGameMap();
  });

  updateGameMap();
});

setInterval(tick, 1000.0 / Constants.FPS);

function tick() {
  playerList.map(player => player.incrementCooldown());
}

function updateGameMap() {
  io.sockets.emit(Constants.SOCKET_EVENT_UPDATE_GAME_MAP, { gameMap: map });
}

function playerInGame(id: string): boolean {
  const coords = findPlayer(id);
  return coords != null;
}

function removePlayerFromGame(id: string): void {
  const coords = findPlayer(id);
  if (coords !== null) {
    const x = coords[0];
    const y = coords[1];
    map.setTile(x, y, new BlankTile());
  }
}

function movePlayer(id: string, direction: any): void {
  const coords = findPlayer(id);
  if (coords !== null && playerList.find(player => player.id === id).cooldown <= 0) {
    const i = coords[0];
    const j = coords[1];

    let newI = i;
    let newJ = j;
    switch (direction) {
      case Constants.KEY_UP_ARROW: newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
      case Constants.KEY_DOWN_ARROW: newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
      case Constants.KEY_LEFT_ARROW: newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
      case Constants.KEY_RIGHT_ARROW: newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
      default: break;
    }

    if (canMove(newI, newJ)) {
      map.setTile(i, j, new BlankTile());
      map.setTile(newI, newJ, new PlayerTile(id));
      updateCooldown(id);
    }
  }
}

function updateCooldown(id: string): void {
  playerList[playerList.findIndex(player => player.id === id)].cooldown = 30;
}

function findPlayer(id: string) {
  for (let i = 0; i < Constants.MAP_SIZE; i++) {
    for (let j = 0; j < Constants.MAP_SIZE; j++) {
      if (map.getTile(i, j).playerId === id) {
        return [i, j];
      }
    }
  }
}

function canMove(i: number, j: number) {
  if (i < 0 || i >= Constants.MAP_SIZE || j < 0 || j >= Constants.MAP_SIZE) {
    return false;
  }
  if (map.getTile(i, j).value !== 0) {
    return false;
  }
  return true;
}

function spawnPlayer(id: string) {
  var spot = false;

  const x = Math.floor(Math.random() * Constants.MAP_SIZE);
  const y = Math.floor(Math.random() * Constants.MAP_SIZE);

  if(map.getTile(x, y).value == 0)
  {
    map.setTile(x, y, new PlayerTile(id));
      playerList.push(new Player(id));
  }
}
