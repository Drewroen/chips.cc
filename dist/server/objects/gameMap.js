"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameTile_1 = require("./gameTile");
const constants_1 = require("./../../constants/constants");
class GameMap {
    constructor() {
        this.tiles = new Array();
        for (let i = 0; i < constants_1.Constants.MAP_SIZE; i++) {
            const row = new Array();
            for (let j = 0; j < constants_1.Constants.MAP_SIZE; j++) {
                row.push(new gameTile_1.GameTile());
            }
            this.tiles.push(row);
        }
    }
    setTile(x, y, tile) {
        this.tiles[x][y] = tile;
    }
    getTile(x, y) {
        return this.tiles[x][y];
    }
}
exports.GameMap = GameMap;
//# sourceMappingURL=gameMap.js.map