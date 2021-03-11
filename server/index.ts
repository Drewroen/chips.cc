import { GAME_ROOMS } from './../objects/room';
import { GameRoom } from './../objects/gameRoom';
import { Constants } from './../constants/constants';
import * as express from 'express';
import * as lz from 'lz-string'
const PORT = process.env.PORT || 5000;
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { Game } from './../objects/game';
import { ChipsDat } from './../static/chipsdat/chipsdat';
import { EloService } from './../services/elo/eloService';

// App setup
dotenv.config();
const app = express()
  .use(require('./../routes/account'));

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Socket setup & pass server
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.environment === 'dev' ? 'http://localhost:4200' : 'http://chipsmmo.cc.s3-website.us-east-2.amazonaws.com',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

const clientRooms = new Map<string, number>();
const verifiedAccounts = new Map<string, string>();

const eloService = new EloService(dynamoDb);

let tickNumber = 0;

const gameRooms = new Array<GameRoom>();
const chipsLevels = ChipsDat.getChipsLevelData();

GAME_ROOMS.forEach(room => {
  gameRooms.push(new GameRoom(room, chipsLevels));
});

setInterval(tick, 1000.0 / Constants.GAME_FPS);

async function tick() {
  tickNumber++;
  for (let i = 0; i < GAME_ROOMS.length; i++) {
    const gameRoom = gameRooms[i];
    if (!gameRoom.hasInitialized && gameRoom.readyToInitialize())
      gameRoom.initializeRoom();
    if (gameRoom.hasInitialized) {
      if (gameRoom.game.timer <= 0 && gameRoom.gameHasEnded())
        gameRoom.endRoom();
      else
        gameRoom.tick();
    }

    if (gameRoom.gameHasEnded() && !gameRoom.eloCalculated) {
      gameRoom.eloCalculated = true;
      try {
        const eloResults = await eloService.calculateEloValues(gameRoom);
        await eloService.updateEloValues(eloResults);
        io.to(gameRoom.room.name).emit(
          Constants.SOCKET_EVENT_UPDATE_ELO,
          eloResults
        );
      } catch (err) {
        console.log('Did not update elo values');
      }
    }

    gameRoom.game.players.forEach((player) => {
      if (clientRooms.get(player.id) !== i && player.alive)
        gameRoom.game.findPlayerTile(player.id)?.kill(gameRoom.game);
    });
  }
}

function clientCount(room) {
  const clients = io.sockets.adapter.rooms[room];
  return clients ? clients.length : 0;
}

// Listen for socket.io connections
io.on('connection', (socket) => {
  let joinedRoom = false;
  for (let i = 0; i < GAME_ROOMS.length; i++) {
    if (
      !joinedRoom &&
      clientCount(gameRooms[i].room.name) < Constants.GAME_LOBBY_MAX_SIZE
    ) {
      socket.join(gameRooms[i].room.name);
      clientRooms.set(socket.id, i);
      updateRoomInfo(socket.id);
      joinedRoom = true;
    }
  }
  updateRoomCounts();

  socket.on(Constants.SOCKET_EVENT_JOIN_ROOM, function (roomNumber: number) {
    if (
      clientCount(gameRooms[roomNumber].room.name) < Constants.GAME_LOBBY_MAX_SIZE &&
      clientRooms.get(socket.id) !== roomNumber
    ) {
      if (clientRooms.get(socket.id) !== null) {
        gameRooms[clientRooms.get(socket.id)].game.removePlayerFromGame(socket.id);
        socket.leave(gameRooms[clientRooms.get(socket.id)].room.name);
        gameRooms[clientRooms.get(socket.id)].room.playerCount--;
      }
      socket.join(gameRooms[roomNumber].room.name);
      gameRooms[roomNumber].room.playerCount++;
      clientRooms.set(socket.id, roomNumber);
      updateRoomInfo(socket.id);
      updateRoomCounts();
    }
  });

  socket.on(Constants.SOCKET_EVENT_START, function (name: string) {
    const room = clientRooms.get(socket.id);
    gameRooms[room]?.game?.addPlayerToGame(socket.id, name);
  });

  socket.on(Constants.SOCKET_EVENT_KEYDOWN, function (data: number) {
    const room = clientRooms.get(socket.id);
    gameRooms[room]?.game?.addMovement(socket.id, data);
  });

  socket.on(Constants.SOCKET_EVENT_KEYUP, function (data: number) {
    const room = clientRooms.get(socket.id);
    gameRooms[room]?.game?.removeMovement(socket.id, data);
  });

  socket.on(Constants.SOCKET_EVENT_DISCONNECT, function () {
    const room = clientRooms.get(socket.id);
    gameRooms[room]?.game?.removePlayerFromGame(socket.id);
    clientRooms.delete(socket.id);
    updateRoomCounts();
  });

  socket.on(Constants.SOCKET_EVENT_LOGIN, function (token: string) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decryptedToken) => {
      if (err) return;
      const username = decryptedToken.username;
      if (verifiedAccounts.get(username) !== socket.id) {
        const badSocketId = verifiedAccounts.get(username);
        if (gameRooms) {
          gameRooms.forEach(room => {
            if (room.game.findPlayer(badSocketId)) {
              room.game.findPlayer(badSocketId).id = socket.id;
              room.game.findPlayerTile(badSocketId)?.kill(room.game);
            }

          })
        }
        verifiedAccounts.delete(username);
        io.to(badSocketId).emit(Constants.SOCKET_EVENT_MULTILOGIN);
      }
      verifiedAccounts.set(username, socket.id);
    });
  });

  socket.on(Constants.SOCKET_EVENT_LOGOUT, function (token: string) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decryptedToken) => {
      if (err) return;
      const username = decryptedToken.username;
      verifiedAccounts.delete(username);
    });
  })
});

setInterval(checkForUpdates, 1000.0 / Constants.SOCKET_FPS);

function checkForUpdates(): void {
  for (let i = 0; i < GAME_ROOMS.length; i++) {
    if (readyToUpdate(i)) {
      const emittedObject = {
        terrain: gameRooms[i].game.gameMap.terrainTiles.map((terrainRow) => {
          return terrainRow.map((tile) => {
            return tile.value;
          });
        }),
        object: gameRooms[i].game.gameMap.objectTiles.map((objectRow) => {
          return objectRow.map((tile) => {
            return tile?.value;
          });
        }),
        mobs: gameRooms[i].game.gameMap.mobTiles.map((mobRow) => {
          return mobRow.map((tile) => {
            return { id: tile?.id, value: tile?.value };
          });
        }),
        players: gameRooms[i].game.players,
        gameStatus: gameRooms[i].game.gameStatus,
        timer: Math.floor(gameRooms[i].game.timer / Constants.GAME_FPS)
      };
      const compressedObject = lz.compress(JSON.stringify(emittedObject));
      io.to(gameRooms[i].room.name).emit(
        Constants.SOCKET_EVENT_UPDATE_GAME_MAP,
        compressedObject
      );
    }
  }
}

function updateRoomCounts(): void {
  io.emit(Constants.SOCKET_EVENT_UPDATE_ROOM_COUNTS,
    gameRooms.map((room) => clientCount(room.room.name)));
}

function updateRoomInfo(socketId: string): void {
  io.to(socketId).emit(Constants.SOCKET_EVENT_UPDATE_CURRENT_ROOM,
    clientRooms.get(socketId));
}

function readyToUpdate(mapNumber: number): boolean {
  const currentGameRoom = gameRooms[mapNumber];
  let comparisonObjectString = '';
  if (currentGameRoom.gameHasNotStarted())
    comparisonObjectString = JSON.stringify({
      time: Math.floor(currentGameRoom.game.timer / Constants.GAME_FPS)
    });
  else if (currentGameRoom.gameHasEnded())
    comparisonObjectString = JSON.stringify({
      time: Math.floor(currentGameRoom.game.timer / Constants.GAME_FPS)
    });
  else if (currentGameRoom.gameIsHappening())
    comparisonObjectString = JSON.stringify({
      terrain: currentGameRoom.game.gameMap.terrainTiles.map((terrainRow) => {
        return terrainRow.map((tile) => {
          return tile.value;
        });
      }),
      object: currentGameRoom.game.gameMap.objectTiles.map((objectRow) => {
        return objectRow.map((tile) => {
          return tile?.value;
        });
      }),
      mobs: currentGameRoom.game.gameMap.mobTiles.map((mobRow) => {
        return mobRow.map((tile) => {
          return { id: tile?.id, value: tile?.value };
        });
      }),
      playerItems: currentGameRoom.game.players.map((player) => {
        return player.inventory;
      }),
      time: Math.floor(currentGameRoom.game.timer / Constants.GAME_FPS)
    });

  if (comparisonObjectString !== gameRooms[mapNumber].lastGameImage) {
    gameRooms[mapNumber].setLastGameImage(comparisonObjectString);
    return true;
  }
  return false;
}