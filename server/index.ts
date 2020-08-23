import { Constants } from './../constants/constants'
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as lz from 'lz-string';
const PORT = process.env.PORT || 5000;
import * as socketIO from 'socket.io';
import { Game } from './../objects/game';

// App setup
const server = express()
  .use(express.static(path.join(__dirname, '../chipscc')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Socket setup & pass server
const io = socketIO(server);

const chipsMapInfo = readChipsDat();
const chipsLevels = processChipsLevels(chipsMapInfo);

const roomNames = new Array<string>();
const roomGamesJustCreated = new Array<boolean>();
const roomGames = new Array<Game>();
const clientRooms = new Map<string, number>();
for(let i = 0; i < Constants.GAME_LOBBIES; i++)
{
  roomNames.push('room' + i);
  roomGamesJustCreated.push(false);
  roomGames.push(getNewGame());
}

function getNewGame(): Game {
  return new Game(chipsLevels[Math.floor(Math.random() * chipsLevels.length)]);
}

setInterval(tick, 1000.0 / Constants.GAME_FPS);

function tick() {
  for(let i = 0; i < Constants.GAME_LOBBIES; i++)
  {
    if(roomGames[i].players.length === 0 && !roomGamesJustCreated[i])
    {
      roomGamesJustCreated[i] = true;
      roomGames[i] = getNewGame();
    }
    else if(roomGames[i].gameStatus === Constants.GAME_STATUS_PLAYING) {
      roomGamesJustCreated[i] = false;
      roomGames[i].tick();
    }
    else if(roomGames[i].gameStatus === Constants.GAME_STATUS_NOT_STARTED) {
      if(roomGames[i].players.length > 0)
        roomGames[i].startingTimer === 0 ? roomGames[i].gameStatus = Constants.GAME_STATUS_PLAYING : roomGames[i].startingTimer--;
    }
    else if(roomGames[i].gameStatus === Constants.GAME_STATUS_FINISHED) {
      roomGames[i].finishTimer === 0 ? roomGames[i] = getNewGame() : roomGames[i].finishTimer--;
    }
  }
}

function clientCount(room) {
  const clients = io.sockets.adapter.rooms[room];
  return clients ? clients.length : 0;
}


// Listen for socket.io connections
io.on('connection', socket => {
  let joinedRoom = false;
  for(let i = 0; i < Constants.GAME_LOBBIES; i++)
  {
    if(!joinedRoom && clientCount(roomNames[i]) < Constants.GAME_LOBBY_MAX_SIZE)
    {
      socket.join(roomNames[i]);
      clientRooms.set(socket.id, i);
      joinedRoom = true;
    }
  }

  socket.on(Constants.SOCKET_EVENT_JOIN_ROOM, function(roomNumber: number) {
    if(clientCount(roomNames[roomNumber]) < Constants.GAME_LOBBY_MAX_SIZE && clientRooms.get(socket.id) !== roomNumber)
    {
      if(clientRooms.get(socket.id) !== null)
      {
        roomGames[clientRooms.get(socket.id)].removePlayerFromGame(socket.id);
        socket.leave(roomNames[clientRooms.get(socket.id)]);
      }
      socket.join(roomNames[roomNumber]);
      clientRooms.set(socket.id, roomNumber);
    }
  })

  socket.on(Constants.SOCKET_EVENT_START, function(name: string) {
    const room = clientRooms.get(socket.id);
    roomGames[room]?.addPlayerToGame(socket.id, name);
  });

  socket.on(Constants.SOCKET_EVENT_KEYDOWN, function(data: number) {
    const room = clientRooms.get(socket.id);
    roomGames[room]?.addMovement(socket.id, data);
  });

  socket.on(Constants.SOCKET_EVENT_KEYUP, function(data: number) {
    const room = clientRooms.get(socket.id);
    roomGames[room]?.removeMovement(socket.id, data);
  });

  socket.on(Constants.SOCKET_EVENT_DISCONNECT, function() {
    const room = clientRooms.get(socket.id);
    roomGames[room]?.removePlayerFromGame(socket.id);
    clientRooms.delete(socket.id);
  });
});

setInterval(checkForUpdates, 1000.0 / Constants.SOCKET_FPS);

function checkForUpdates(): void {
  for(let i = 0; i < Constants.GAME_LOBBIES; i++)
  {
    const emittedObject = {
      terrain: roomGames[i].gameMap.terrainTiles.map(terrainRow => {
        return terrainRow.map(tile => {
          return tile.value
        });
      }),
      object: roomGames[i].gameMap.objectTiles.map(objectRow => {
        return objectRow.map(tile => {
          return tile?.value
        });
      }),
      mobs: roomGames[i].gameMap.mobTiles.map(mobRow => {
        return mobRow.map(tile => {
          return {id: tile?.id, value: tile?.value}
        });
      }),
      players: roomGames[i].players,
      gameStatus: roomGames[i].gameStatus,
      startingTimer: roomGames[i].startingTimer,
      finishTimer: roomGames[i].finishTimer,
      roomCounts: roomNames.map(name => clientCount(name))
    };
    const compressedObject = lz.compress(JSON.stringify(emittedObject));
    io.to(roomNames[i]).emit(Constants.SOCKET_EVENT_UPDATE_GAME_MAP, compressedObject);
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
