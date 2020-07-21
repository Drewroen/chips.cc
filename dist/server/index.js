"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const PORT = process.env.PORT || 5000;
const socket_io_1 = __importDefault(require("socket.io"));
const constants_1 = require("../constants/constants");
// App setup
const server = express_1.default()
    .use(express_1.default.static(path_1.default.join(__dirname, '../../public')))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
console.log(__dirname);
// Socket setup & pass server
const io = socket_io_1.default(server);
// Create map
const map = new Array(constants_1.Constants.MAP_SIZE);
for (let i = 0; i < constants_1.Constants.MAP_SIZE; i++) {
    map[i] = new Array(constants_1.Constants.MAP_SIZE);
}
for (let i = 0; i < constants_1.Constants.MAP_SIZE; i++) {
    for (let j = 0; j < constants_1.Constants.MAP_SIZE; j++) {
        map[i][j] = { tile: 0 };
    }
}
const playerList = [];
// Listen for socket.io connections
io.on('connection', socket => {
    console.log('Player connected!', socket.id);
    socket.on('start', function () {
        if (!playerInGame(socket.id)) {
            const randomX = Math.floor(Math.random() * constants_1.Constants.MAP_SIZE);
            const randomY = Math.floor(Math.random() * constants_1.Constants.MAP_SIZE);
            map[randomX][randomY] = { tile: 1, playerId: socket.id };
            playerList.push({ id: socket.id, cooldown: 0 });
        }
    });
    socket.on('movement', function (data) {
        movePlayer(socket.id, data.direction);
    });
    socket.on('disconnect', function () {
        removePlayerFromGame(socket.id);
    });
});
setInterval(updateGame, 1000.0 / constants_1.Constants.FPS);
function updateGame() {
    playerList.map(player => player.cooldown--);
    io.sockets.emit('updateGame', { gameMap: map });
}
function playerInGame(id) {
    const coords = findPlayer(id);
    return coords != null;
}
function removePlayerFromGame(id) {
    const coords = findPlayer(id);
    if (coords !== null) {
        const x = coords[0];
        const y = coords[1];
        map[x][y] = { tile: 0 };
    }
}
function movePlayer(id, direction) {
    const coords = findPlayer(id);
    if (coords !== null && playerList.find(player => player.id === id).cooldown <= 0) {
        const i = coords[0];
        const j = coords[1];
        let newI = i;
        let newJ = j;
        switch (direction) {
            case 'up':
                newJ--;
                break;
            case 'down':
                newJ++;
                break;
            case 'left':
                newI--;
                break;
            case 'right':
                newI++;
                break;
            default: break;
        }
        if (canMove(newI, newJ)) {
            map[i][j] = { tile: 0 };
            map[newI][newJ] = { tile: 1, playerId: id };
            updateCooldown(id);
        }
    }
}
function updateCooldown(id) {
    playerList[playerList.findIndex(player => player.id === id)].cooldown = 30;
}
function findPlayer(id) {
    for (let i = 0; i < constants_1.Constants.MAP_SIZE; i++) {
        for (let j = 0; j < constants_1.Constants.MAP_SIZE; j++) {
            if (map[i][j].playerId === id) {
                return [i, j];
            }
        }
    }
}
function canMove(i, j) {
    if (i < 0 || i >= constants_1.Constants.MAP_SIZE || j < 0 || j >= constants_1.Constants.MAP_SIZE) {
        return false;
    }
    if (map[i][j].tile !== 0) {
        return false;
    }
    return true;
}
//# sourceMappingURL=index.js.map