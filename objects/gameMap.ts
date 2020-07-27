import { ForceTile } from './gameTiles/terrain/forceTile';
import { SocketTile } from './gameTiles/terrain/socketTile';
import { MobTile } from './mobTile';
import { ObjectTile } from './objectTile';
import { ChipTile } from './gameTiles/object/chipTile';
import { WallTile } from './gameTiles/terrain/wallTile';
import { BlankTile } from './gameTiles/terrain/blankTile';
import { Constants } from './../constants/constants';
import { WaterTile } from './gameTiles/terrain/waterTile';
import { TerrainTile } from './terrainTile';
import { Mob } from './mob';
import { BallTile } from './gameTiles/mob/ballTile';
import { FinishTile } from './gameTiles/terrain/finishTile';

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

    loadMap(mobs: Mob[]): void {
      this.terrainTiles[0][0] = new WallTile();
      this.terrainTiles[0][1] = new WallTile();
      this.terrainTiles[0][2] = new SocketTile();
      this.terrainTiles[0][3] = new WallTile();
      this.terrainTiles[0][4] = new WallTile();
      this.terrainTiles[4][0] = new WallTile();
      this.terrainTiles[4][1] = new WallTile();
      this.terrainTiles[4][2] = new SocketTile();
      this.terrainTiles[4][3] = new WallTile();
      this.terrainTiles[4][4] = new WallTile();
      this.terrainTiles[1][0] = new WallTile();
      this.terrainTiles[2][0] = new SocketTile();
      this.terrainTiles[3][0] = new WallTile();
      this.terrainTiles[1][4] = new WallTile();
      this.terrainTiles[2][4] = new SocketTile();
      this.terrainTiles[3][4] = new WallTile();

      this.terrainTiles[1][1] = new FinishTile();
      this.terrainTiles[2][1] = new FinishTile();
      this.terrainTiles[3][1] = new FinishTile();
      this.terrainTiles[1][2] = new FinishTile();
      this.terrainTiles[2][2] = new FinishTile();
      this.terrainTiles[3][2] = new FinishTile();
      this.terrainTiles[1][3] = new FinishTile();
      this.terrainTiles[2][3] = new FinishTile();
      this.terrainTiles[3][3] = new FinishTile();

      this.mobTiles[8][8] = new BallTile(Constants.DIRECTION_DOWN);
      mobs.push(new Mob(this.mobTiles[8][8].id));

      this.mobTiles[7][8] = new BallTile(Constants.DIRECTION_LEFT);
      mobs.push(new Mob(this.mobTiles[7][8].id));

      this.mobTiles[8][7] = new BallTile(Constants.DIRECTION_RIGHT);
      mobs.push(new Mob(this.mobTiles[8][7].id));

      this.mobTiles[7][7] = new BallTile(Constants.DIRECTION_UP);
      mobs.push(new Mob(this.mobTiles[7][7].id));

      for(let i = 0; i < Constants.MAP_SIZE; i++)
        this.terrainTiles[6][i] = new ForceTile(Constants.DIRECTION_UP);

      this.terrainTiles[6][0] = new WallTile();

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
