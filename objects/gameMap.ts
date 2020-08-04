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

    loadMap(mobs: Mob[], level: string[]): void {
      const levelInfo = level.slice(0, 8);
      level = level.slice(8);
      const firstLayerSize = this.unsignedWordToInt(level.slice(0, 2));
      level = level.slice(2);
      let firstLayerInfo: string[] = level.slice(0, firstLayerSize);
      level = level.slice(firstLayerSize);
      const secondLayerSize = this.unsignedWordToInt(level.slice(0, 2));
      level = level.slice(2);
      let secondLayerInfo: string[] = level.slice(0, secondLayerSize);
      level = level.slice(secondLayerSize);
      const remainingInfo = level;

      let position = 0;
      while(secondLayerInfo.length !== 0)
      {
        const value = secondLayerInfo.slice(0, 1);
        let repeatLength;
        let blockType;
        let cutLength;
        if (value[0] === 'ff')
        {
          repeatLength = this.hexToInt(secondLayerInfo.slice(1, 2)[0]);
          blockType = secondLayerInfo.slice(2, 3)[0];
          cutLength = 3;
        }
        else
        {
          repeatLength = 1;
          blockType = value[0];
          cutLength = 1;
        }
        for(let i = 0; i < repeatLength; i++)
        {
          const x = position % Constants.MAP_SIZE;
          const y = Math.floor(position / Constants.MAP_SIZE);
          this.setTileFromId(x, y, blockType, mobs);
          position++;
        }
        secondLayerInfo = secondLayerInfo.slice(cutLength);
      }

      position = 0;
      while(firstLayerInfo.length !== 0)
      {
        const value = firstLayerInfo.slice(0, 1);
        let repeatLength;
        let blockType;
        let cutLength;
        if (value[0] === 'ff')
        {
          repeatLength = this.hexToInt(firstLayerInfo.slice(1, 2)[0]);
          blockType = firstLayerInfo.slice(2, 3)[0];
          cutLength = 3;
        }
        else
        {
          repeatLength = 1;
          blockType = value[0];
          cutLength = 1;
        }
        for(let i = 0; i < repeatLength; i++)
        {
          const x = position % Constants.MAP_SIZE;
          const y = Math.floor(position / Constants.MAP_SIZE);
          this.setTileFromId(x, y, blockType, mobs);
          position++;
        }
        firstLayerInfo = firstLayerInfo.slice(cutLength);
      }
    }

    spawnChips(): void {
      const chipsNeeded = this.countChipsUnderMinimum();
      for(let i = 0; i < chipsNeeded; i++)
      {
        const spawned = false;

        const x = Math.floor(Math.random() * Constants.MAP_SIZE);
        const y = Math.floor(Math.random() * Constants.MAP_SIZE);
        if(this.getTerrainTile(x, y).value === Constants.TERRAIN_FLOOR &&
            !this.getObjectTile(x, y) &&
            !this.getMobTile(x, y))
        {
          this.setObjectTile(x, y, new ChipTile());
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

    private hexToInt(hex: string): number
    {
      return parseInt('0x' + hex, 16);
    }

    private unsignedWordToInt(data: string[]): number
    {
      return parseInt('0x' + data[0], 16) + (parseInt('0x' + data[1], 16) * (16 * 16))
    }

    private setTileFromId(x: number, y: number, blockType: string, mobs: Mob[]): void
    {
      switch(blockType)
      {
        case '00': this.terrainTiles[x][y] = new BlankTile(); break;
        case '01': this.terrainTiles[x][y] = new WallTile(); break;
        case '02': this.objectTiles[x][y] = new ChipTile(); break;
        case '03': this.terrainTiles[x][y] = new WaterTile(); break;
        case '04': console.log('Fire'); break;
        case '05': console.log('Invisible wall'); break;
        case '06': console.log('block one direction'); break;
        case '07': console.log('block one direction'); break;
        case '08': console.log('block one direction'); break;
        case '09': console.log('block one direction'); break;
        case '0a': console.log('block'); break;
        case '0b': console.log('dirt'); break;
        case '0c': this.terrainTiles[x][y] = new IceTile(); break;
        case '0d': this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_DOWN); break;
        case '0e': console.log('clone'); break;
        case '0f': console.log('clone'); break;
        case '10': console.log('clone'); break;
        case '11': console.log('clone'); break;
        case '12': this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_UP); break;
        case '13': this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_RIGHT); break;
        case '14': this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_LEFT); break;
        case '15': this.terrainTiles[x][y] = new FinishTile(); break;
        case '16': console.log('key door'); break;
        case '17': console.log('key door'); break;
        case '18': console.log('key door'); break;
        case '19': console.log('key door'); break;
        case '1a': console.log('ice corner'); break;
        case '1b': console.log('ice corner'); break;
        case '1c': console.log('ice corner'); break;
        case '1d': console.log('ice corner'); break;
        case '1e': console.log('blue wall'); break;
        case '1f': console.log('blue wall'); break;
        case '21': console.log('thief'); break;
        case '22': this.terrainTiles[x][y] = new SocketTile(); break;
        case '23': console.log('green button'); break;
        case '24': console.log('red button'); break;
        case '25': console.log('green button block'); break;
        case '26': console.log('green button block'); break;
        case '27': console.log('brown button'); break;
        case '28': console.log('blue button'); break;
        case '29': console.log('teleport'); break;
        case '2a': console.log('bomb'); break;
        case '2b': console.log('trap'); break;
        case '2c': console.log('invisible wall'); break;
        case '2d': console.log('gravel'); break;
        case '2e': console.log('cell block'); break;
        case '2f': console.log('hint'); break;
        case '30': console.log('block two directions'); break;
        case '31': console.log('cloning machine'); break;
        case '32': console.log('force random direction'); break;
        case '40': this.addMob(x, y, new BugTile(Constants.DIRECTION_UP), mobs); break;
        case '41': this.addMob(x, y, new BugTile(Constants.DIRECTION_LEFT), mobs); break;
        case '42': this.addMob(x, y, new BugTile(Constants.DIRECTION_DOWN), mobs); break;
        case '43': this.addMob(x, y, new BugTile(Constants.DIRECTION_RIGHT), mobs); break;
        case '44': this.addMob(x, y, new FireballTile(Constants.DIRECTION_UP), mobs); break;
        case '45': this.addMob(x, y, new FireballTile(Constants.DIRECTION_LEFT), mobs); break;
        case '46': this.addMob(x, y, new FireballTile(Constants.DIRECTION_DOWN), mobs); break;
        case '47': this.addMob(x, y, new FireballTile(Constants.DIRECTION_RIGHT), mobs); break;
        case '48': this.addMob(x, y, new BallTile(Constants.DIRECTION_UP), mobs); break;
        case '49': this.addMob(x, y, new BallTile(Constants.DIRECTION_LEFT), mobs); break;
        case '4a': this.addMob(x, y, new BallTile(Constants.DIRECTION_DOWN), mobs); break;
        case '4b': this.addMob(x, y, new BallTile(Constants.DIRECTION_RIGHT), mobs); break;
        case '4c': console.log('tank'); break;
        case '4d': console.log('tank'); break;
        case '4e': console.log('tank'); break;
        case '4f': console.log('tank'); break;
        case '50': this.addMob(x, y, new GliderTile(Constants.DIRECTION_UP), mobs); break;
        case '51': this.addMob(x, y, new GliderTile(Constants.DIRECTION_LEFT), mobs); break;
        case '52': this.addMob(x, y, new GliderTile(Constants.DIRECTION_DOWN), mobs); break;
        case '53': this.addMob(x, y, new GliderTile(Constants.DIRECTION_RIGHT), mobs); break;
        case '54': this.addMob(x, y, new TeethTile(Constants.DIRECTION_DOWN), mobs); break;
        case '55': this.addMob(x, y, new TeethTile(Constants.DIRECTION_DOWN), mobs); break;
        case '56': this.addMob(x, y, new TeethTile(Constants.DIRECTION_DOWN), mobs); break;
        case '57': this.addMob(x, y, new TeethTile(Constants.DIRECTION_DOWN), mobs); break;
        case '58': this.addMob(x, y, new WalkerTile(Constants.DIRECTION_UP), mobs); break;
        case '59': this.addMob(x, y, new WalkerTile(Constants.DIRECTION_LEFT), mobs); break;
        case '5a': this.addMob(x, y, new WalkerTile(Constants.DIRECTION_DOWN), mobs); break;
        case '5b': this.addMob(x, y, new WalkerTile(Constants.DIRECTION_RIGHT), mobs); break;
        case '5c': this.addMob(x, y, new BlobTile(Constants.DIRECTION_UP), mobs); break;
        case '5d': this.addMob(x, y, new BlobTile(Constants.DIRECTION_LEFT), mobs); break;
        case '5e': this.addMob(x, y, new BlobTile(Constants.DIRECTION_DOWN), mobs); break;
        case '5f': this.addMob(x, y, new BlobTile(Constants.DIRECTION_RIGHT), mobs); break;
        case '60': this.addMob(x, y, new ParemeciumTile(Constants.DIRECTION_UP), mobs); break;
        case '61': this.addMob(x, y, new ParemeciumTile(Constants.DIRECTION_LEFT), mobs); break;
        case '62': this.addMob(x, y, new ParemeciumTile(Constants.DIRECTION_DOWN), mobs); break;
        case '63': this.addMob(x, y, new ParemeciumTile(Constants.DIRECTION_RIGHT), mobs); break;
        case '64': console.log('key'); break;
        case '65': console.log('key'); break;
        case '66': console.log('key'); break;
        case '67': console.log('key'); break;
        case '68': console.log('item'); break;
        case '69': console.log('item'); break;
        case '6a': console.log('item'); break;
        case '6b': console.log('item'); break;
        default: console.log('Unknown block type: ' + blockType); break;
      }
    }
}
