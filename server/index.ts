import { Player } from './objects/player';
import { GameTile } from './objects/gameTile';
import { GameMap } from './objects/gameMap';
import * as express from 'express';
import * as path from 'path';
const PORT = process.env.PORT || 5000;
import * as socketIO from 'socket.io';
import { Constants } from '../constants/constants';

// App setup
const server = express()
  .use(express.static(path.join(__dirname, '../chipscc')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

console.log(__dirname);

// Socket setup & pass server
const io = socketIO(server);

// Create map
const map = new GameMap();

const playerList: Player[] = [];

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on('start', function() {
    if (!playerInGame(socket.id)) {
      const randomX = Math.floor(Math.random() * Constants.MAP_SIZE);
      const randomY = Math.floor(Math.random() * Constants.MAP_SIZE);
      map.setTile(randomX, randomY, new GameTile(1, socket.id));
      playerList.push(new Player(socket.id));
    }
  });

  socket.on('movement', function(data) {
    movePlayer(socket.id, data.direction);
  });

  socket.on('disconnect', function() {
    if (playerInGame(socket.id)) {
      removePlayerFromGame(socket.id);
    }
  });
});

setInterval(updateGame, 1000.0 / Constants.FPS);

function updateGame() {
  playerList.map(player => player.cooldown--);
  io.sockets.emit('updateGame', { gameMap: map });
}

function playerInGame(id: string) {
  const coords = findPlayer(id);
  return coords != null;
}

function removePlayerFromGame(id: string) {
  const coords = findPlayer(id);
  if (coords !== null) {
    const x = coords[0];
    const y = coords[1];
    map.setTile(x, y, new GameTile(0));
  }
}

function movePlayer(id: string, direction: any) {
  const coords = findPlayer(id);
  if (coords !== null && playerList.find(player => player.id === id).cooldown <= 0) {
    const i = coords[0];
    const j = coords[1];

    let newI = i;
    let newJ = j;
    switch (direction) {
      case 'up': newJ--; break;
      case 'down': newJ++; break;
      case 'left': newI--; break;
      case 'right': newI++; break;
      default: break;
    }

    if (canMove(newI, newJ)) {
      map.setTile(i, j, new GameTile(0));
      map.setTile(newI, newJ, new GameTile(1, id));
      updateCooldown(id);
    }
  }
}

function updateCooldown(id: string) {
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
