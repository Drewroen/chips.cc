import { Constants } from './../constants/constants';
import { Player } from './../objects/player';
import { GameMap } from './../objects/gameMap';
import * as express from 'express';
import * as path from 'path';
const PORT = process.env.PORT || 5000;
import * as socketIO from 'socket.io';
import { PlayerTile } from './../objects/gameTiles/playerTile';
import { GameTile } from 'objects/gameTile';

// App setup
const server = express()
  .use(express.static(path.join(__dirname, '../chipscc')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Socket setup & pass server
const io = socketIO(server);

// Create map
const map = new GameMap();
map.loadMap();
let playerList: Player[] = [];

// Listen for socket.io connections
io.on('connection', socket => {
  socket.on(Constants.SOCKET_EVENT_START, function(name) {
    if (!playerInGame(socket.id)) {
      spawnPlayer(socket.id, name);
      updateGameInfo();
    }
  });

  socket.on(Constants.SOCKET_EVENT_MOVE, function(data) {
    movePlayer(socket.id, data);
    updateGameInfo();
  });

  socket.on(Constants.SOCKET_EVENT_DISCONNECT, function() {
    if (playerInGame(socket.id)) {
      removePlayerFromGame(socket.id);
    }
    updateGameInfo();
  });

  updateGameInfo();
});

setInterval(tick, 1000.0 / Constants.FPS);

function tick() {
  playerList.map(player => player.incrementCooldown());
}

function updateGameInfo() {
  io.sockets.emit(Constants.SOCKET_EVENT_UPDATE_GAME_MAP, { gameMap: map, players: playerList });
}

function playerInGame(id: string): boolean {
  const coords = findPlayer(id);
  return coords != null;
}

function removePlayerFromGame(id: string): void {
  const coords = findPlayer(id);
  if (coords) {
    const x = coords[0];
    const y = coords[1];
    map.setMobTile(x, y, null);
  }
  playerList = playerList.filter(player => player.id !== id);
}

function movePlayer(id: string, direction: any): void {
  const coords = findPlayer(id);
  if (coords && playerList.find(player => player.id === id).cooldown <= 0) {
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
      interactObjectFromPlayer(newI, newJ, id);
      map.setMobTile(i, j, null);
      map.setMobTile(newI, newJ, new PlayerTile(id));
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
      if (map.getMobTile(i, j)?.playerId === id) {
        return [i, j];
      }
    }
  }
}

function canMove(i: number, j: number) {
  if (map.getTerrainTile(i, j).solid) {
    return false;
  }
  return true;
}

function spawnPlayer(id: string, name: string) {
  let spawned = false;
  const x = Math.floor(Math.random() * Constants.MAP_SIZE);
  const y = Math.floor(Math.random() * Constants.MAP_SIZE);

  while (!spawned)
  {
    if(map.getTerrainTile(x, y).value === Constants.TERRAIN_FLOOR &&
       !map.getObjectTile(x, y) &&
       !map.getMobTile(x, y))
    {
      map.setMobTile(x, y, new PlayerTile(id));
      playerList.push(new Player(id, name));
      spawned = true;
    }
  }
}

function interactObjectFromPlayer(x: number, y: number, id: string) {
  const objectTile: GameTile = map.getObjectTile(x, y);
  if (objectTile?.value === Constants.OBJECT_CHIP) {
    playerList.find(player => player.id === id).score++;
    map.setObjectTile(x, y, null);
  }
}
