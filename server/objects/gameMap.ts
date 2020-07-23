import { WallTile } from './gameTiles/wallTile';
import { GameTile } from './gameTile';
import { BlankTile } from './gameTiles/blankTile';
import { Constants } from './../../constants/constants';

export class GameMap {
    tiles: GameTile[][];

    constructor() {
        this.tiles = new Array<GameTile[]>();
        for (let i = 0; i < Constants.MAP_SIZE; i++) {
            const row: GameTile[] = new Array<GameTile>();
            for (let j = 0; j < Constants.MAP_SIZE; j++) {
                row.push(new BlankTile());
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

    loadMap(): void {
      this.tiles[0][0] = new WallTile();
      this.tiles[1][1] = new WallTile();
      this.tiles[2][2] = new WallTile();
      this.tiles[3][3] = new WallTile();
      this.tiles[5][4] = new WallTile();
      this.tiles[4][4] = new WallTile();
    }
}
