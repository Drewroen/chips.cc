import { GameTile } from './gameTile';
import { Constants } from './../../constants/constants';

export class GameMap {
    tiles: GameTile[][];

    constructor() {
        this.tiles = new Array<GameTile[]>();
        for (let i = 0; i < Constants.MAP_SIZE; i++) {
            const row: GameTile[] = new Array<GameTile>();
            for (let j = 0; j < Constants.MAP_SIZE; j++) {
                row.push(new GameTile());
            }
            this.tiles.push(row);
        }
    }

    setTile(x: number, y: number, tile: GameTile): void {
        this.tiles[x][y] = tile;
    }

    getTile(x: number, y: number): GameTile {
        return this.tiles[x][y];
    }
}
