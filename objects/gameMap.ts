import { ChipTile } from './gameTiles/chipTile';
import { WallTile } from './gameTiles/wallTile';
import { GameTile } from './gameTile';
import { BlankTile } from './gameTiles/blankTile';
import { Constants } from './../constants/constants';

export class GameMap {
    mobTiles: GameTile[][];
    objectTiles: GameTile[][];
    terrainTiles: GameTile[][];

    constructor() {
      this.terrainTiles = new Array<GameTile[]>();
      this.objectTiles = new Array<GameTile[]>();
      this.mobTiles = new Array<GameTile[]>();
      for (let i = 0; i < Constants.MAP_SIZE; i++) {
        const terrainRow: GameTile[] = new Array<GameTile>();
        const objectRow: GameTile[] = new Array<GameTile>();
        const mobRow: GameTile[] = new Array<GameTile>();
        for (let j = 0; j < Constants.MAP_SIZE; j++) {
            terrainRow.push(new BlankTile());
            objectRow.push(null);
            mobRow.push(null);
        }
        this.terrainTiles.push(terrainRow);
        this.objectTiles.push(objectRow);
        this.mobTiles.push(mobRow);
      }
    }

    setTerrainTile(x: number, y: number, tile: GameTile): void {
      this.terrainTiles[x][y] = tile;
    }

    getTerrainTile(x: number, y: number): GameTile {
      return this.terrainTiles[x][y];
    }

    setObjectTile(x: number, y: number, tile: GameTile): void {
      this.objectTiles[x][y] = tile;
    }

    getObjectTile(x: number, y: number): GameTile {
      return this.objectTiles[x][y];
    }

    setMobTile(x: number, y: number, tile: GameTile): void {
      this.mobTiles[x][y] = tile;
    }

    public getMobTile(x: number, y: number): GameTile {
      return this.mobTiles[x][y];
    }

    loadMap(): void {
      this.terrainTiles[0][0] = new WallTile();
      this.terrainTiles[1][1] = new WallTile();
      this.terrainTiles[2][2] = new WallTile();
      this.terrainTiles[3][3] = new WallTile();
      this.terrainTiles[5][4] = new WallTile();
      this.terrainTiles[4][4] = new WallTile();

      this.objectTiles[0][1] = new ChipTile();
      this.objectTiles[0][2] = new ChipTile();
      this.objectTiles[0][3] = new ChipTile();
      this.objectTiles[0][4] = new ChipTile();
      this.objectTiles[0][5] = new ChipTile();
      this.objectTiles[0][6] = new ChipTile();
      this.objectTiles[0][7] = new ChipTile();
    }
}
