import { TeethTile } from './gameTiles/mob/teethTile';
import { ParemeciumTile } from './gameTiles/mob/paremeciumTile';
import { BugTile } from './gameTiles/mob/bugTile';
import { WalkerTile } from './gameTiles/mob/walkerTile';
import { GliderTile } from './gameTiles/mob/gliderTile';
import { FireballTile } from './gameTiles/mob/fireballTile';
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
import { IceTile } from './gameTiles/terrain/iceTile';
import { BlobTile } from './gameTiles/mob/blobTile';

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

      this.addMob(15, 15, new WalkerTile(Constants.DIRECTION_LEFT), mobs);
      this.addMob(15, 16, new BallTile(Constants.DIRECTION_UP), mobs);
      this.addMob(15, 17, new FireballTile(Constants.DIRECTION_LEFT), mobs);
      this.addMob(15, 18, new GliderTile(Constants.DIRECTION_LEFT), mobs);
      this.addMob(15, 19, new BugTile(Constants.DIRECTION_DOWN), mobs);
      this.addMob(16, 19, new ParemeciumTile(Constants.DIRECTION_DOWN), mobs);
      this.addMob(7, 7, new BlobTile(Constants.DIRECTION_UP), mobs);
      this.addMob(7, 8, new BlobTile(Constants.DIRECTION_UP), mobs);
      this.addMob(7, 9, new BlobTile(Constants.DIRECTION_UP), mobs);
      this.addMob(7, 10, new BlobTile(Constants.DIRECTION_UP), mobs);
      this.addMob(6, 7, new TeethTile(Constants.DIRECTION_UP), mobs);
      this.addMob(6, 8, new TeethTile(Constants.DIRECTION_UP), mobs);
      this.addMob(6, 9, new TeethTile(Constants.DIRECTION_UP), mobs);
      this.addMob(6, 10, new TeethTile(Constants.DIRECTION_UP), mobs);

      this.terrainTiles[7][1] = new ForceTile(Constants.DIRECTION_DOWN);
      this.terrainTiles[7][2] = new ForceTile(Constants.DIRECTION_DOWN);
      this.terrainTiles[7][3] = new ForceTile(Constants.DIRECTION_DOWN);
      this.terrainTiles[7][4] = new ForceTile(Constants.DIRECTION_DOWN);

      this.terrainTiles[6][1] = new ForceTile(Constants.DIRECTION_DOWN);
      this.terrainTiles[6][2] = new ForceTile(Constants.DIRECTION_DOWN);
      this.terrainTiles[6][3] = new ForceTile(Constants.DIRECTION_DOWN);
      this.terrainTiles[6][4] = new ForceTile(Constants.DIRECTION_DOWN);

      this.terrainTiles[5][1] = new ForceTile(Constants.DIRECTION_UP);
      this.terrainTiles[5][2] = new ForceTile(Constants.DIRECTION_UP);
      this.terrainTiles[5][3] = new ForceTile(Constants.DIRECTION_UP);
      this.terrainTiles[5][4] = new ForceTile(Constants.DIRECTION_UP);

      this.terrainTiles[8][1] = new IceTile();
      this.terrainTiles[8][2] = new IceTile();
      this.terrainTiles[8][3] = new IceTile();
      this.terrainTiles[8][4] = new IceTile();
      this.terrainTiles[8][0] = new WallTile();

      for(let i = 10; i <= 20; i++)
      {
        this.terrainTiles[10][i] = new WallTile();
        this.terrainTiles[20][i] = new WallTile();
        this.terrainTiles[i][10] = new WallTile();
        this.terrainTiles[i][20] = new WallTile();
      }

      this.terrainTiles[10][15] = new IceTile();
      this.terrainTiles[20][15] = new IceTile();

      for(let i = 11; i < 14; i++)
        for(let j = 11; j < 14; j++)
          this.terrainTiles[i][j] = new IceTile();
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

    private addMob(x: number, y: number, mob: MobTile, mobs: Mob[]): void
    {
      this.mobTiles[x][y] = mob;
      mobs.push(new Mob(this.mobTiles[x][y].id));
    }
}
