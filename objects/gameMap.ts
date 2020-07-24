import { MobTile } from './mobTile';
import { ObjectTile } from './objectTile';
import { ChipTile } from './gameTiles/chipTile';
import { WallTile } from './gameTiles/wallTile';
import { GameTile } from './gameTile';
import { BlankTile } from './gameTiles/blankTile';
import { Constants } from './../constants/constants';
import { WaterTile } from './gameTiles/waterTile';
import { TerrainTile } from './terrainTile';

export class GameMap {
    mobTiles: MobTile[][];
    objectTiles: ObjectTile[][];
    terrainTiles: TerrainTile[][];

    constructor() {
      this.terrainTiles = new Array<TerrainTile[]>();
      this.objectTiles = new Array<ObjectTile[]>();
      this.mobTiles = new Array<MobTile[]>();
      for (let i = 0; i < Constants.MAP_SIZE; i++) {
        const terrainRow: TerrainTile[] = new Array<TerrainTile>();
        const objectRow: ObjectTile[] = new Array<ObjectTile>();
        const mobRow: MobTile[] = new Array<MobTile>();
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

    setTerrainTile(x: number, y: number, tile: TerrainTile): void {
      this.terrainTiles[x][y] = tile;
    }

    getTerrainTile(x: number, y: number): TerrainTile {
      return this.terrainTiles[x][y];
    }

    setObjectTile(x: number, y: number, tile: ObjectTile): void {
      this.objectTiles[x][y] = tile;
    }

    getObjectTile(x: number, y: number): ObjectTile {
      return this.objectTiles[x][y];
    }

    setMobTile(x: number, y: number, tile: MobTile): void {
      this.mobTiles[x][y] = tile;
    }

    getMobTile(x: number, y: number): MobTile {
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

      this.terrainTiles[1][2] = new WaterTile();
    }

    spawnChips(): void {
      const chipsNeeded = this.countChipsUnderMinimum();
      for(let i = 0; i < chipsNeeded; i++)
      {
        let spawned = false;

        while(!spawned)
        {
          const x = Math.floor(Math.random() * Constants.MAP_SIZE);
          const y = Math.floor(Math.random() * Constants.MAP_SIZE);
          if(this.getTerrainTile(x, y).value === Constants.TERRAIN_FLOOR &&
              !this.getObjectTile(x, y) &&
              !this.getMobTile(x, y))
          {
            this.setObjectTile(x, y, new ChipTile());
            spawned = true;
          }
        }
      }
    }

    private countChipsUnderMinimum(): number {
      let total = 0;
      for(let i = 0; i < Constants.MAP_SIZE; i++)
      {
        for(let j = 0; j < Constants.MAP_SIZE; j++)
        {
          if (this.getObjectTile(i, j)?.value === Constants.OBJECT_CHIP)
          {
            total++;
          }
        }
      }
      return Constants.MINIMUM_CHIPS - total;
    }
}
