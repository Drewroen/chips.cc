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
import { identifierModuleUrl } from "@angular/compiler";

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
    Buffer.from(process.env.PASSWORD_IV_SECRET, "hex")
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
            res.status(200).send("Added item");
          }
        });
      }
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
          res.status(200).json({ accessToken, refreshToken });
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
          res.status(200).json({ accessToken });
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

const roomNames = new Array<string>();
const roomGamesJustCreated = new Array<boolean>();
const roomGames = new Array<Game>();
const roomTimes = new Array<number>();
const clientRooms = new Map<string, number>();
const verifiedAccounts = new Map<string, string>();
const lastGameImages = new Array<string>();

let tickNumber = 0;

for (let i = 0; i < Constants.GAME_LOBBIES; i++) {
  roomNames.push("room" + i);
  roomGamesJustCreated.push(false);
  roomGames.push(getNewGame());
  roomTimes.push(0);
  lastGameImages.push(null);
}

function getNewGame(): Game {
  return new Game(chipsLevels[Math.floor(Math.random() * chipsLevels.length)]);
}

setInterval(tick, 1000.0 / Constants.GAME_FPS);

function tick() {
  tickNumber++;
  for (let i = 0; i < Constants.GAME_LOBBIES; i++) {
    if (roomGames[i].players.length === 0 && !roomGamesJustCreated[i]) {
      roomGamesJustCreated[i] = true;
      roomGames[i] = getNewGame();
    } else if (roomGames[i].gameStatus === Constants.GAME_STATUS_PLAYING) {
      roomGamesJustCreated[i] = false;
      roomGames[i].tick();
    } else if (roomGames[i].gameStatus === Constants.GAME_STATUS_NOT_STARTED) {
      if (roomGames[i].players.length > 0)
        roomGames[i].startingTimer === 0
          ? (roomGames[i].gameStatus = Constants.GAME_STATUS_PLAYING)
          : roomGames[i].startingTimer--;
    } else if (roomGames[i].gameStatus === Constants.GAME_STATUS_FINISHED) {
      roomGames[i].finishTimer === 0
        ? (roomGames[i] = getNewGame())
        : roomGames[i].finishTimer--;
    }

    roomGames[i].players.forEach((player) => {
      if (clientRooms.get(player.id) !== i && player.alive)
        roomGames[i].findPlayerTile(player.id)?.kill(roomGames[i]);
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
  for (let i = 0; i < Constants.GAME_LOBBIES; i++) {
    if (
      !joinedRoom &&
      clientCount(roomNames[i]) < Constants.GAME_LOBBY_MAX_SIZE
    ) {
      socket.join(roomNames[i]);
      clientRooms.set(socket.id, i);
      joinedRoom = true;
    }
  }

  socket.on(Constants.SOCKET_EVENT_JOIN_ROOM, function (roomNumber: number) {
    if (
      clientCount(roomNames[roomNumber]) < Constants.GAME_LOBBY_MAX_SIZE &&
      clientRooms.get(socket.id) !== roomNumber
    ) {
      if (clientRooms.get(socket.id) !== null) {
        roomGames[clientRooms.get(socket.id)].removePlayerFromGame(socket.id);
        socket.leave(roomNames[clientRooms.get(socket.id)]);
      }
      socket.join(roomNames[roomNumber]);
      clientRooms.set(socket.id, roomNumber);
    }
  });

  socket.on(Constants.SOCKET_EVENT_START, function (name: string) {
    const room = clientRooms.get(socket.id);
    roomGames[room]?.addPlayerToGame(socket.id, name);
  });

  socket.on(Constants.SOCKET_EVENT_KEYDOWN, function (data: number) {
    const room = clientRooms.get(socket.id);
    roomGames[room]?.addMovement(socket.id, data);
  });

  socket.on(Constants.SOCKET_EVENT_KEYUP, function (data: number) {
    const room = clientRooms.get(socket.id);
    roomGames[room]?.removeMovement(socket.id, data);
  });

  socket.on(Constants.SOCKET_EVENT_DISCONNECT, function () {
    const room = clientRooms.get(socket.id);
    roomGames[room]?.removePlayerFromGame(socket.id);
    clientRooms.delete(socket.id);
  });

  socket.on(Constants.SOCKET_EVENT_LOGIN, function (token: string) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decryptedToken) => {
      if (err) return;
      const username = decryptedToken.username;
      if (verifiedAccounts.get(username) !== socket.id) {
        const badSocketId = verifiedAccounts.get(username);
        const room = clientRooms.get(badSocketId);
        if (roomGames)
        {
          roomGames.forEach(room => {
            if (room.findPlayer(badSocketId))
            {
              room.findPlayer(badSocketId).id = socket.id;
              room.findPlayerTile(badSocketId)?.kill(room);
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
  for (let i = 0; i < Constants.GAME_LOBBIES; i++) {
    if (readyToUpdate(i)) {
      const emittedObject = {
        terrain: roomGames[i].gameMap.terrainTiles.map((terrainRow) => {
          return terrainRow.map((tile) => {
            return tile.value;
          });
        }),
        object: roomGames[i].gameMap.objectTiles.map((objectRow) => {
          return objectRow.map((tile) => {
            return tile?.value;
          });
        }),
        mobs: roomGames[i].gameMap.mobTiles.map((mobRow) => {
          return mobRow.map((tile) => {
            return { id: tile?.id, value: tile?.value };
          });
        }),
        players: roomGames[i].players,
        gameStatus: roomGames[i].gameStatus,
        startingTimer: roomGames[i].startingTimer,
        finishTimer: roomGames[i].finishTimer,
        roomCounts: roomNames.map((name) => clientCount(name)),
      };
      const compressedObject = lz.compress(JSON.stringify(emittedObject));
      io.to(roomNames[i]).emit(
        Constants.SOCKET_EVENT_UPDATE_GAME_MAP,
        compressedObject
      );
    }
  }
}

function readyToUpdate(map: number): boolean {
  if (
    tickNumber %
      (Constants.GAME_FPS / Constants.CONSISTENT_UPDATES_PER_SECOND) ===
    0
  )
    return true;
  if (roomGames[map].gameStatus === Constants.GAME_STATUS_NOT_STARTED) {
    if (
      Math.floor(roomGames[map].startingTimer / Constants.GAME_FPS) !==
      roomTimes[map]
    ) {
      roomTimes[map] = Math.floor(
        roomGames[map].startingTimer / Constants.GAME_FPS
      );
      return true;
    }
    return false;
  } else if (roomGames[map].gameStatus === Constants.GAME_STATUS_FINISHED) {
    if (
      Math.floor(roomGames[map].finishTimer / Constants.GAME_FPS) !==
      roomTimes[map]
    ) {
      roomTimes[map] = Math.floor(
        roomGames[map].finishTimer / Constants.GAME_FPS
      );
      return true;
    }
    return false;
  } else if (roomGames[map].gameStatus === Constants.GAME_STATUS_PLAYING) {
    const comparisonObject = {
      terrain: roomGames[map].gameMap.terrainTiles.map((terrainRow) => {
        return terrainRow.map((tile) => {
          return tile.value;
        });
      }),
      object: roomGames[map].gameMap.objectTiles.map((objectRow) => {
        return objectRow.map((tile) => {
          return tile?.value;
        });
      }),
      mobs: roomGames[map].gameMap.mobTiles.map((mobRow) => {
        return mobRow.map((tile) => {
          return { id: tile?.id, value: tile?.value };
        });
      }),
      playerItems: roomGames[map].players.map((player) => {
        return player.inventory;
      }),
    };
    const comparisonObjectString = JSON.stringify(comparisonObject);
    if (comparisonObjectString !== lastGameImages[map]) {
      lastGameImages[map] = comparisonObjectString;
      return true;
    }
    return false;
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
