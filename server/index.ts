import { EloResult } from './../objects/eloResult';
import { PlayerScore } from './../objects/playerScore';
import { GAME_ROOMS } from './../objects/room';
import { GameRoom } from './../objects/gameRoom';
import { Constants } from "./../constants/constants";
import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import * as lz from "lz-string";
const PORT = process.env.PORT || 5000;
import * as socketIO from "socket.io";
import * as AWS from "aws-sdk";
import * as bodyparser from "body-parser";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { Game } from "./../objects/game";

// App setup
AWS.config.update({
  region: "us-east-2",
});

dotenv.config();

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const app = express();
app.use(express.static(path.join(__dirname, "../chipscc")));

app.use(bodyparser.json());

function encrypt(text) {
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.PASSWORD_CRYPTO_SECRET, "hex"),
    Buffer.from(process.env.PASSWORD_IV_SECRET, "hex")
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: process.env.PASSWORD_IV_SECRET,
    encryptedData: encrypted.toString("hex"),
  };
}

function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.PASSWORD_CRYPTO_SECRET, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post("/account", function (req, res) {
  const body = req.body;
  var currentAccountParams: any = {
    TableName: "ChipsMMOAccounts",
    Key: {
      Username: body.username,
    },
  };
  dynamoDb.get(currentAccountParams, function (err, data) {
    if (err) {
      res
        .status(500)
        .send("Failed to get account from dynamo to check if exists");
    } else {
      const accountExists = data.Item !== undefined;
      if (accountExists) res.status(400).send("Account already exists");
      else {
        var newAccountParams = {
          TableName: "ChipsMMOAccounts",
          Item: {
            Username: body.username,
            Password: encrypt(body.password),
            Email: body.email,
            Verified: 0,
            ELO: 1000,
            Banned: 0,
          },
        };

        dynamoDb.put(newAccountParams, function (err, data) {
          if (err) {
            res.status(500).send("Unable to add item. Error JSON");
          } else {
            res.status(201).send({ message: "Added Item" });
          }
        });
      }
    }
  });
});

app.post("/account/:username/status", function (req, res) {
  const username = req.params.username;
  var currentAccountParams: any = {
    TableName: "ChipsMMOAccounts",
    Key: {
      Username: username,
    },
  };
  dynamoDb.get(currentAccountParams, function (err, data) {
    if (err) {
      res
        .status(500)
        .send("Failed to get account from dynamo to check if exists");
    } else {
      const accountExists = data.Item !== undefined;
      if (accountExists) res.status(200).send("Username exists");
      res.status(201).send("Username available");
    }
  });
});

app.get("/info", authenticateToken, function (req, res) {
  var currentAccountParams: any = {
    TableName: "ChipsMMOAccounts",
    Key: {
      Username: (req as any).user.username,
    },
  };
  dynamoDb.get(currentAccountParams, function (err, data) {
    if (err) {
      res
        .status(500)
        .send("Failed to get account from dynamo to check if exists");
    } else {
      const accountExists = data.Item === undefined;
      if (accountExists) res.status(403).send("Account does not exist");
      else {
        res.status(200).json({
          username: data.Item.Username,
          elo: data.Item.ELO,
          verified: data.Item.Verified,
        });
      }
    }
  });
});

app.post("/login", function (req, res) {
  const body = req.body;
  var currentAccountParams: any = {
    TableName: "ChipsMMOAccounts",
    Key: {
      Username: body.username,
    },
  };
  dynamoDb.get(currentAccountParams, function (err, data) {
    if (err) {
      res
        .status(500)
        .send("Failed to get account from dynamo to check if exists");
    } else {
      const accountExists = data.Item !== undefined;
      if (accountExists) {
        if (body.password === decrypt(data.Item.Password)) {
          const userInfo = { username: data.Item.Username };
          const accessToken = generateAccessToken(userInfo);
          const refreshToken = jwt.sign(
            userInfo,
            process.env.REFRESH_TOKEN_SECRET
          );
          var newRefreshTokenParams = {
            TableName: "ChipsMMORefreshTokens",
            Item: {
              Username: body.username,
              RefreshToken: refreshToken,
            },
          };

          dynamoDb.put(newRefreshTokenParams, function (err, data) {
            if (err) {
              res.status(500).send("Unable to add item. Error JSON");
            }
          });
          res.status(201).json({ accessToken, refreshToken });
        } else {
          res.status(401).send("Failed to login");
        }
      } else {
        res.status(403).send("Account not found");
      }
    }
  });
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) res.sendStatus(401);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const currentRefreshTokenParams: any = {
      TableName: "ChipsMMORefreshTokens",
      Key: {
        Username: user.username,
      },
    };
    dynamoDb.get(currentRefreshTokenParams, function (err, data) {
      if (err) {
        res
          .status(500)
          .send("Failed to get refresh tokens from dynamo to check if exists");
      } else {
        if (data.Item?.RefreshToken !== refreshToken)
          return res.sendStatus(403);
        else {
          const accessToken = generateAccessToken({ username: user.username });
          res.status(201).json({ accessToken });
        }
      }
    });
  });
});

app.delete("/logout", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) res.sendStatus(401);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const currentRefreshTokenParams: any = {
      TableName: "ChipsMMORefreshTokens",
      Key: {
        Username: user.username,
      },
    };
    dynamoDb.get(currentRefreshTokenParams, function (err, data) {
      if (err) {
        res
          .status(500)
          .send("Failed to get refresh tokens from dynamo to check if exists");
      } else {
        if (data.Item?.RefreshToken !== refreshToken)
          return res.sendStatus(403);
        else {
          const emptyRefreshTokenParams: any = {
            TableName: "ChipsMMORefreshTokens",
            Key: {
              Username: user.username,
            },
          };
          dynamoDb.delete(emptyRefreshTokenParams, function (err, data) {
            if (err) {
              res.status(500).send("Unable to delete item.");
            } else {
              res.status(204).send("Deleted item");
            }
          });
        }
      }
    });
  });
});

app.patch("/account", authenticateToken, function (req, res) {
  const body = req.body;
  var currentAccountParams: any = {
    TableName: "ChipsMMOAccounts",
    Key: {
      Username: (req as any).user.username,
    },
  };
  dynamoDb.get(currentAccountParams, function (err, data) {
    if (err) {
      res
        .status(500)
        .send("Failed to get account from dynamo to check if exists");
    } else {
      const accountExists = data.Item !== undefined;
      if (!accountExists) res.status(400).send("Account does not exist");
      else {
        var newAccountParams = {
          TableName: "ChipsMMOAccounts",
          Item: {
            Username: (req as any).user.username,
            Password: body.password
              ? encrypt(body.password)
              : data.Item.Password,
            Email: body.email || data.Item.Email,
            Verified: body.email ? 0 : data.Item.Verified,
            ELO: data.Item.ELO,
            Banned: data.Item.Banned,
          },
        };

        dynamoDb.put(newAccountParams, function (err, data) {
          if (err) {
            res.status(500).send("Unable to add item. Error JSON");
          } else {
            res.status(200).send("Updated item");
          }
        });
      }
    }
  });
});

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Socket setup & pass server
const io = socketIO(server);

const chipsMapInfo = readChipsDat();
const chipsLevels = processChipsLevels(chipsMapInfo);

const clientRooms = new Map<string, number>();
const verifiedAccounts = new Map<string, string>();
const lastGameImages = new Array<string>();

const gameRooms = new Array<GameRoom>();

let tickNumber = 0;

for (let i = 0; i < GAME_ROOMS.length; i++) {
  gameRooms.push(new GameRoom(getNewGame(), GAME_ROOMS[i]))
}

function getNewGame(): Game {
  return new Game(chipsLevels[Math.floor(Math.random() * chipsLevels.length)]);
}

setInterval(tick, 1000.0 / Constants.GAME_FPS);

function tick() {
  tickNumber++;
  for (let i = 0; i < GAME_ROOMS.length; i++) {
    const gameRoom = gameRooms[i];
    if (gameRoom.game.players.length === 0 && !gameRoom.gameJustCreated) {
      gameRoom.gameJustCreated = true;
      gameRoom.game = getNewGame();
      gameRoom.eloCalculated = false;
    } else if (gameRoom.game.gameStatus === Constants.GAME_STATUS_PLAYING) {
      gameRoom.gameJustCreated = false;
      gameRoom.game.tick();
    } else if (gameRoom.game.gameStatus === Constants.GAME_STATUS_NOT_STARTED) {
      if (gameRoom.game.players.length > 0)
        gameRoom.game.timer === 0
          ? (gameRoom.game.gameStatus = Constants.GAME_STATUS_PLAYING)
          : gameRoom.game.timer--;
    } else if (gameRoom.game.gameStatus === Constants.GAME_STATUS_FINISHED) {
      gameRoom.game.timer === 0
        ? (gameRoom.game = getNewGame())
        : gameRoom.game.timer--;
      if (!gameRoom.eloCalculated) {
        updateEloValues(gameRoom);
        gameRoom.eloCalculated = true;
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
io.on("connection", (socket) => {
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
        if (gameRooms)
        {
          gameRooms.forEach(room => {
            if (room.game.findPlayer(badSocketId))
            {
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
  const currentGameMap = gameRooms[mapNumber].game;
  let comparisonObjectString = "";
  if (tickNumber % (Constants.GAME_FPS / Constants.CONSISTENT_UPDATES_PER_SECOND) === 0)
    return true;
  if (currentGameMap.gameStatus === Constants.GAME_STATUS_NOT_STARTED)
    comparisonObjectString = JSON.stringify({
      time: currentGameMap.timer / Constants.GAME_FPS
    });
  else if (currentGameMap.gameStatus === Constants.GAME_STATUS_FINISHED)
    comparisonObjectString = JSON.stringify({
      time: currentGameMap.timer / Constants.GAME_FPS
    });
  else if (currentGameMap.gameStatus === Constants.GAME_STATUS_PLAYING)
    comparisonObjectString = JSON.stringify({
      terrain: currentGameMap.gameMap.terrainTiles.map((terrainRow) => {
        return terrainRow.map((tile) => {
          return tile.value;
        });
      }),
      object: currentGameMap.gameMap.objectTiles.map((objectRow) => {
        return objectRow.map((tile) => {
          return tile?.value;
        });
      }),
      mobs: currentGameMap.gameMap.mobTiles.map((mobRow) => {
        return mobRow.map((tile) => {
          return { id: tile?.id, value: tile?.value };
        });
      }),
      playerItems: currentGameMap.players.map((player) => {
        return player.inventory;
      }),
    });

  if (comparisonObjectString !== lastGameImages[mapNumber]) {
    lastGameImages[mapNumber] = comparisonObjectString;
    return true;
  }
  return false;
}

function readChipsDat(): string[] {
  const directory = path.resolve(__dirname, "../CHIPS_MMO.dat");
  const map: Buffer = fs.readFileSync(directory);
  return map.toString("hex").match(/../g);
}

function processChipsLevels(data: string[]): string[][] {
  data = data.slice(4); // Magic number in dat file

  const levels: number = unsignedWordToInt(data.slice(0, 2)); // Number of levels
  data = data.slice(2);

  const levelData = new Array();

  for (let i = 0; i < levels; i++) {
    const bytesInLevel: number = unsignedWordToInt(data.slice(0, 2));
    data = data.slice(2);
    const levelInfo = data.slice(0, bytesInLevel);
    data = data.slice(bytesInLevel);
    levelData.push(levelInfo);
  }
  return levelData;
}

function unsignedWordToInt(data: string[]): number {
  return (
    parseInt("0x" + data[0], 16) + parseInt("0x" + data[1], 16) * (16 * 16)
  );
}

function updateEloValues(game: GameRoom) {
  console.log("Calculating elo")
  const verifiedAccountNames = game.game.players.map(player => player.name).filter(name => name !== 'Chip');

  const currentAccountParams: any = {
    RequestItems: {
      "ChipsMMOAccounts": {
        Keys: verifiedAccountNames.map(name => {
          return {
            Username: name
          }
        })
      }
    }
  };
  dynamoDb.batchGet(currentAccountParams, function (err, data) {
    if (err) {
      console.log("Failed to get values, can't calculate elo");
      return;
    } else {
      var eloResults: EloResult[] = data.Responses.ChipsMMOAccounts.map(account => {return {
        id: account.Username,
        previousElo: account.ELO,
        newElo: account.ELO
      } as EloResult});

      for(var i = 0; i < eloResults.length; i++)
        for(var j = i + 1; j < eloResults.length; j++) {
          var iPlayer = game.game.players.filter(player => player.name === eloResults[i].id)[0];
          var jPlayer = game.game.players.filter(player => player.name === eloResults[j].id)[0];
          if (iPlayer.score > jPlayer.score || iPlayer.winner) {
            const eloChange = calculateRatingChange(eloResults[i].previousElo, eloResults[j].previousElo);
            eloResults[i].newElo += eloChange;
            eloResults[j].newElo -= eloChange;
          } else if (jPlayer.score > iPlayer.score || jPlayer.winner) {
            const eloChange = calculateRatingChange(eloResults[j].previousElo, eloResults[i].previousElo);
            eloResults[j].newElo += eloChange;
            eloResults[i].newElo -= eloChange;
          }
        }

      io.to(game.room.name).emit(
        Constants.SOCKET_EVENT_UPDATE_ELO,
        eloResults
      );

      eloResults.forEach(result => {
        var accountParams: any = {
          TableName: "ChipsMMOAccounts",
          Key: {
            Username: result.id
          }
        };
        dynamoDb.get(accountParams, function (err, data) {
          if (err) {
            console.log("Couldn't update elo for username: " + result.id);
          } else {
            var newEloParams = {
              TableName: "ChipsMMOAccounts",
              Item: {
                Username: data.Item.Username,
                Password: data.Item.Password,
                Banned: data.Item.Banned,
                ELO: result.newElo,
                Email: data.Item.Email,
                Verified: data.Item.Verified
              }
            };

            dynamoDb.put(newEloParams, function (err, data) {
              if (err) {
                console.log("Couldn't update the elo for username: " + result.id);
              }
            });
          }
        })
      })
    }
  });
}

function calculateRatingChange(winnerElo: number, loserElo: number) {
  const winnerExpected = (1.0 / (1.0 + Math.pow(10, ((loserElo - winnerElo) / 400))));
  return Math.round(Math.max(Constants.ELO_MAX_RATING_CHANGE * (1 - winnerExpected), Constants.ELO_MIN_RATING_CHANGE));
}
