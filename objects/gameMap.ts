import { ItemSpawnInfo } from "./itemSpawnInfo";
import { CloneMachineTile } from "./gameTiles/terrain/cloneMachineTile";
import { TeleportTile } from "./gameTiles/terrain/teleportTile";
import { TrapTile } from "./gameTiles/terrain/trapTile";
import { ThiefTile } from "./gameTiles/terrain/thiefTile";
import { BootTile } from "./gameTiles/object/bootTile";
import { KeyDoorTile } from "./gameTiles/terrain/keyDoorTile";
import { KeyTile } from "./gameTiles/object/keyTile";
import { TankToggleButtonTile } from "./gameTiles/terrain/tankToggleButtonTile";
import { CellBlockTile } from "./gameTiles/terrain/cellBlockTile";
import { GravelTile } from "./gameTiles/terrain/gravelTile";
import { DirtTile } from "./gameTiles/terrain/dirtTile";
import { ThinWallTile } from "./gameTiles/terrain/thinWallTile";
import { BlueWallTile } from "./gameTiles/terrain/blueWallTile";
import { ToggleButtonTile } from "./gameTiles/terrain/toggleButtonTile";
import { ToggleWallTile } from "./gameTiles/terrain/toggleWallTile";
import { InvisibleWallTile } from "./gameTiles/terrain/invisibleWallTile";
import { AppearingWallTile } from "./gameTiles/terrain/appearingWallTile";
import { ForceTile } from "./gameTiles/terrain/forceTile";
import {
  BallTile,
  BlobTile,
  BlockTile,
  BugTile,
  FireballTile,
  GliderTile,
  MobTile,
  ParemeciumTile,
  TankTile,
  TeethTile,
  WalkerTile,
} from "./mobTile";
import { ObjectTile } from "./objectTile";
import { ChipTile } from "./gameTiles/object/chipTile";
import { WallTile } from "./gameTiles/terrain/wallTile";
import { BlankTile } from "./gameTiles/terrain/blankTile";
import { Constants } from "./../constants/constants";
import { WaterTile } from "./gameTiles/terrain/waterTile";
import { TerrainTile } from "./terrainTile";
import { Mob } from "./mob";
import { IceTile } from "./gameTiles/terrain/iceTile";
import { FireTile } from "./gameTiles/terrain/fireTile";
import { BombTile } from "./gameTiles/object/bombTile";
import { TrapButtonTile } from "./gameTiles/terrain/trapButtonTile";
import { CloneMachineButtonTile } from "./gameTiles/terrain/cloneMachineButtonTile";
import { BowlingBallTile } from "./gameTiles/object/bowlingBallTile";
import { WhistleTile } from "./gameTiles/object/whistleTile";
import { Coordinates } from './coordinates';

export class GameMap {
  mobTiles: MobTile[][];
  objectTiles: ObjectTile[][];
  terrainTiles: TerrainTile[][];
  spawningArea: ItemSpawnInfo[][];
  playerSpawn: Coordinates[];

  constructor() {
    this.playerSpawn = new Array<Coordinates>();
    this.terrainTiles = new Array<TerrainTile[]>();
    this.objectTiles = new Array<ObjectTile[]>();
    this.mobTiles = new Array<MobTile[]>();
    this.spawningArea = new Array<ItemSpawnInfo[]>();
    for (let i = 0; i < Constants.MAP_SIZE; i++) {
      const terrainRow: TerrainTile[] = new Array<TerrainTile>();
      const objectRow: ObjectTile[] = new Array<ObjectTile>();
      const mobRow: MobTile[] = new Array<MobTile>();
      const spawningRow: ItemSpawnInfo[] = new Array<ItemSpawnInfo>();
      for (let j = 0; j < Constants.MAP_SIZE; j++) {
        terrainRow.push(new BlankTile());
        objectRow.push(null);
        mobRow.push(null);
        spawningRow.push(null);
      }
      this.terrainTiles.push(terrainRow);
      this.objectTiles.push(objectRow);
      this.mobTiles.push(mobRow);
      this.spawningArea.push(spawningRow);
    }
  }

  setTerrainTile(coords: Coordinates, tile: TerrainTile): void {
    this.terrainTiles[coords.x][coords.y] = tile;
  }

  getTerrainTile(coords: Coordinates): TerrainTile {
    return this.terrainTiles[coords.x][coords.y];
  }

  setObjectTile(coords: Coordinates, tile: ObjectTile): void {
    this.objectTiles[coords.x][coords.y] = tile;
  }

  getObjectTile(coords: Coordinates): ObjectTile {
    return this.objectTiles[coords.x][coords.y];
  }

  setMobTile(coords: Coordinates, tile: MobTile): void {
    this.mobTiles[coords.x][coords.y] = tile;
  }

  getMobTile(coords: Coordinates): MobTile {
    return this.mobTiles[coords.x][coords.y];
  }

  loadMap(mobs: Mob[], level: string[]): void {
    level.slice(0, 8);
    level = level.slice(8);
    const firstLayerSize = this.unsignedWordToInt(level.slice(0, 2));
    level = level.slice(2);
    let firstLayerInfo: string[] = level.slice(0, firstLayerSize);
    level = level.slice(firstLayerSize);
    const secondLayerSize = this.unsignedWordToInt(level.slice(0, 2));
    level = level.slice(2);
    let secondLayerInfo: string[] = level.slice(0, secondLayerSize);
    level = level.slice(secondLayerSize);

    let position = 0;
    while (secondLayerInfo.length !== 0) {
      const value = secondLayerInfo.slice(0, 1);
      let repeatLength;
      let blockType;
      let cutLength;
      if (value[0] === "ff") {
        repeatLength = this.hexToInt(secondLayerInfo.slice(1, 2)[0]);
        blockType = secondLayerInfo.slice(2, 3)[0];
        cutLength = 3;
      } else {
        repeatLength = 1;
        blockType = value[0];
        cutLength = 1;
      }
      for (let i = 0; i < repeatLength; i++) {
        const x = position % Constants.MAP_SIZE;
        const y = Math.floor(position / Constants.MAP_SIZE);
        this.setTileFromId(x, y, blockType, mobs);
        position++;
      }
      secondLayerInfo = secondLayerInfo.slice(cutLength);
    }

    position = 0;
    while (firstLayerInfo.length !== 0) {
      const value = firstLayerInfo.slice(0, 1);
      let repeatLength;
      let blockType;
      let cutLength;
      if (value[0] === "ff") {
        repeatLength = this.hexToInt(firstLayerInfo.slice(1, 2)[0]);
        blockType = firstLayerInfo.slice(2, 3)[0];
        cutLength = 3;
      } else {
        repeatLength = 1;
        blockType = value[0];
        cutLength = 1;
      }
      for (let i = 0; i < repeatLength; i++) {
        const x = position % Constants.MAP_SIZE;
        const y = Math.floor(position / Constants.MAP_SIZE);
        this.setTileFromId(x, y, blockType, mobs);
        position++;
      }
      firstLayerInfo = firstLayerInfo.slice(cutLength);
    }
  }

  spawnItems(): void {
    for (let i = 0; i < Constants.MAP_SIZE; i++)
      for (let j = 0; j < Constants.MAP_SIZE; j++) {
        const spawnTile = this.spawningArea[i][j];
        if (spawnTile) {
          spawnTile.currentTime++;
          if (
            spawnTile.currentTime > spawnTile.respawnTime &&
            this.getObjectTile(new Coordinates(i, j)) === null
          ) {
            switch (spawnTile.spawnType) {
              case Constants.SPAWN_BLUE_KEY:
                this.objectTiles[i][j] = new KeyTile(Constants.OBJECT_BLUE_KEY);
                break;
              case Constants.SPAWN_RED_KEY:
                this.objectTiles[i][j] = new KeyTile(Constants.OBJECT_RED_KEY);
                break;
              case Constants.SPAWN_GREEN_KEY:
                this.objectTiles[i][j] = new KeyTile(
                  Constants.OBJECT_GREEN_KEY
                );
                break;
              case Constants.SPAWN_YELLOW_KEY:
                this.objectTiles[i][j] = new KeyTile(
                  Constants.OBJECT_YELLOW_KEY
                );
                break;
              case Constants.SPAWN_FIRE_BOOTS:
                this.objectTiles[i][j] = new BootTile(
                  Constants.OBJECT_FIRE_BOOTS
                );
                break;
              case Constants.SPAWN_FLIPPERS:
                this.objectTiles[i][j] = new BootTile(
                  Constants.OBJECT_FLIPPERS
                );
                break;
              case Constants.SPAWN_ICE_SKATES:
                this.objectTiles[i][j] = new BootTile(
                  Constants.OBJECT_ICE_SKATES
                );
                break;
              case Constants.SPAWN_SUCTION_BOOTS:
                this.objectTiles[i][j] = new BootTile(
                  Constants.OBJECT_SUCTION_BOOTS
                );
                break;
              case Constants.SPAWN_CHIP:
                this.objectTiles[i][j] = new ChipTile();
                break;
              case Constants.SPAWN_BOWLING_BALL:
                this.objectTiles[i][j] = new BowlingBallTile();
            }
          }
        }
      }
  }

  addMob(
    x: number,
    y: number,
    mob: MobTile,
    mobs: Mob[],
    ownerId: string = null
  ): void {
    this.mobTiles[x][y] = mob;
    mobs.push(new Mob(this.mobTiles[x][y].id, ownerId));
  }

  private hexToInt(hex: string): number {
    return parseInt("0x" + hex, 16);
  }

  private unsignedWordToInt(data: string[]): number {
    return (
      parseInt("0x" + data[0], 16) + parseInt("0x" + data[1], 16) * (16 * 16)
    );
  }

  private setTileFromId(
    x: number,
    y: number,
    blockType: string,
    mobs: Mob[]
  ): void {
    switch (blockType) {
      case "00":
        this.terrainTiles[x][y] = new BlankTile();
        break;
      case "01":
        this.terrainTiles[x][y] = new WallTile();
        break;
      case "02":
        this.objectTiles[x][y] = new ChipTile();
        this.spawningArea[x][y] = new ItemSpawnInfo(Constants.SPAWN_CHIP);
        break;
      case "03":
        this.terrainTiles[x][y] = new WaterTile();
        break;
      case "04":
        this.terrainTiles[x][y] = new FireTile();
        break;
      case "05":
        this.terrainTiles[x][y] = new InvisibleWallTile();
        break;
      case "06":
        this.terrainTiles[x][y] = new ThinWallTile(
          Constants.TERRAIN_THIN_WALL_UP
        );
        break;
      case "07":
        this.terrainTiles[x][y] = new ThinWallTile(
          Constants.TERRAIN_THIN_WALL_LEFT
        );
        break;
      case "08":
        this.terrainTiles[x][y] = new ThinWallTile(
          Constants.TERRAIN_THIN_WALL_DOWN
        );
        break;
      case "09":
        this.terrainTiles[x][y] = new ThinWallTile(
          Constants.TERRAIN_THIN_WALL_RIGHT
        );
        break;
      case "0a":
        this.addMob(x, y, new BlockTile(Constants.DIRECTION_UP), mobs);
        break;
      case "0b":
        this.terrainTiles[x][y] = new DirtTile();
        break;
      case "0c":
        this.terrainTiles[x][y] = new IceTile(Constants.TERRAIN_ICE);
        break;
      case "0d":
        this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_DOWN);
        break;
      case "0e":
        this.addMob(x, y, new BlockTile(Constants.DIRECTION_UP), mobs);
        break;
      case "0f":
        this.addMob(x, y, new BlockTile(Constants.DIRECTION_LEFT), mobs);
        break;
      case "10":
        this.addMob(x, y, new BlockTile(Constants.DIRECTION_DOWN), mobs);
        break;
      case "11":
        this.addMob(x, y, new BlockTile(Constants.DIRECTION_RIGHT), mobs);
        break;
      case "12":
        this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_UP);
        break;
      case "13":
        this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_RIGHT);
        break;
      case "14":
        this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_LEFT);
        break;
      case "16":
        this.terrainTiles[x][y] = new KeyDoorTile(
          Constants.TERRAIN_BLUE_KEY_DOOR
        );
        break;
      case "17":
        this.terrainTiles[x][y] = new KeyDoorTile(
          Constants.TERRAIN_RED_KEY_DOOR
        );
        break;
      case "18":
        this.terrainTiles[x][y] = new KeyDoorTile(
          Constants.TERRAIN_GREEN_KEY_DOOR
        );
        break;
      case "19":
        this.terrainTiles[x][y] = new KeyDoorTile(
          Constants.TERRAIN_YELLOW_KEY_DOOR
        );
        break;
      case "1a":
        this.terrainTiles[x][y] = new IceTile(
          Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN
        );
        break;
      case "1b":
        this.terrainTiles[x][y] = new IceTile(
          Constants.TERRAIN_ICE_CORNER_DOWN_LEFT
        );
        break;
      case "1c":
        this.terrainTiles[x][y] = new IceTile(
          Constants.TERRAIN_ICE_CORNER_LEFT_UP
        );
        break;
      case "1d":
        this.terrainTiles[x][y] = new IceTile(
          Constants.TERRAIN_ICE_CORNER_UP_RIGHT
        );
        break;
      case "1e":
        this.terrainTiles[x][y] = new BlueWallTile(false);
        break;
      case "1f":
        this.terrainTiles[x][y] = new BlueWallTile(true);
        break;
      case "21":
        this.terrainTiles[x][y] = new ThiefTile();
        break;
      case "23":
        this.terrainTiles[x][y] = new ToggleButtonTile();
        break;
      case "24":
        this.terrainTiles[x][y] = new CloneMachineButtonTile();
        break;
      case "25":
        this.terrainTiles[x][y] = new ToggleWallTile(true);
        break;
      case "26":
        this.terrainTiles[x][y] = new ToggleWallTile(false);
        break;
      case "27":
        this.terrainTiles[x][y] = new TrapButtonTile();
        break;
      case "28":
        this.terrainTiles[x][y] = new TankToggleButtonTile();
        break;
      case "29":
        this.terrainTiles[x][y] = new TeleportTile();
        break;
      case "2a":
        this.objectTiles[x][y] = new BombTile();
        break;
      case "2b":
        this.terrainTiles[x][y] = new TrapTile();
        break;
      case "2c":
        this.terrainTiles[x][y] = new AppearingWallTile();
        break;
      case "2d":
        this.terrainTiles[x][y] = new GravelTile();
        break;
      case "2e":
        this.terrainTiles[x][y] = new CellBlockTile();
        break;
      case "30":
        this.terrainTiles[x][y] = new ThinWallTile(
          Constants.TERRAIN_THIN_WALL_DOWN_RIGHT
        );
        break;
      case "31":
        this.terrainTiles[x][y] = new CloneMachineTile();
        break;
      case "32":
        this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_RANDOM);
        break;
      case "34":
        this.objectTiles[x][y] = new BowlingBallTile();
        this.spawningArea[x][y] = new ItemSpawnInfo(
          Constants.SPAWN_BOWLING_BALL
        );
        break;
      case "35":
        this.objectTiles[x][y] = new WhistleTile();
        this.spawningArea[x][y] = new ItemSpawnInfo(Constants.SPAWN_WHISTLE);
        break;
      case "40":
        this.addMob(x, y, new BugTile(Constants.DIRECTION_UP), mobs);
        break;
      case "41":
        this.addMob(x, y, new BugTile(Constants.DIRECTION_LEFT), mobs);
        break;
      case "42":
        this.addMob(x, y, new BugTile(Constants.DIRECTION_DOWN), mobs);
        break;
      case "43":
        this.addMob(x, y, new BugTile(Constants.DIRECTION_RIGHT), mobs);
        break;
      case "44":
        this.addMob(x, y, new FireballTile(Constants.DIRECTION_UP), mobs);
        break;
      case "45":
        this.addMob(x, y, new FireballTile(Constants.DIRECTION_LEFT), mobs);
        break;
      case "46":
        this.addMob(x, y, new FireballTile(Constants.DIRECTION_DOWN), mobs);
        break;
      case "47":
        this.addMob(x, y, new FireballTile(Constants.DIRECTION_RIGHT), mobs);
        break;
      case "48":
        this.addMob(x, y, new BallTile(Constants.DIRECTION_UP), mobs);
        break;
      case "49":
        this.addMob(x, y, new BallTile(Constants.DIRECTION_LEFT), mobs);
        break;
      case "4a":
        this.addMob(x, y, new BallTile(Constants.DIRECTION_DOWN), mobs);
        break;
      case "4b":
        this.addMob(x, y, new BallTile(Constants.DIRECTION_RIGHT), mobs);
        break;
      case "4c":
        this.addMob(x, y, new TankTile(Constants.DIRECTION_UP), mobs);
        break;
      case "4d":
        this.addMob(x, y, new TankTile(Constants.DIRECTION_LEFT), mobs);
        break;
      case "4e":
        this.addMob(x, y, new TankTile(Constants.DIRECTION_DOWN), mobs);
        break;
      case "4f":
        this.addMob(x, y, new TankTile(Constants.DIRECTION_RIGHT), mobs);
        break;
      case "50":
        this.addMob(x, y, new GliderTile(Constants.DIRECTION_UP), mobs);
        break;
      case "51":
        this.addMob(x, y, new GliderTile(Constants.DIRECTION_LEFT), mobs);
        break;
      case "52":
        this.addMob(x, y, new GliderTile(Constants.DIRECTION_DOWN), mobs);
        break;
      case "53":
        this.addMob(x, y, new GliderTile(Constants.DIRECTION_RIGHT), mobs);
        break;
      case "54":
        this.addMob(x, y, new TeethTile(Constants.DIRECTION_UP), mobs);
        break;
      case "55":
        this.addMob(x, y, new TeethTile(Constants.DIRECTION_LEFT), mobs);
        break;
      case "56":
        this.addMob(x, y, new TeethTile(Constants.DIRECTION_DOWN), mobs);
        break;
      case "57":
        this.addMob(x, y, new TeethTile(Constants.DIRECTION_RIGHT), mobs);
        break;
      case "58":
        this.addMob(x, y, new WalkerTile(Constants.DIRECTION_UP), mobs);
        break;
      case "59":
        this.addMob(x, y, new WalkerTile(Constants.DIRECTION_LEFT), mobs);
        break;
      case "5a":
        this.addMob(x, y, new WalkerTile(Constants.DIRECTION_DOWN), mobs);
        break;
      case "5b":
        this.addMob(x, y, new WalkerTile(Constants.DIRECTION_RIGHT), mobs);
        break;
      case "5c":
        this.addMob(x, y, new BlobTile(Constants.DIRECTION_UP), mobs);
        break;
      case "5d":
        this.addMob(x, y, new BlobTile(Constants.DIRECTION_LEFT), mobs);
        break;
      case "5e":
        this.addMob(x, y, new BlobTile(Constants.DIRECTION_DOWN), mobs);
        break;
      case "5f":
        this.addMob(x, y, new BlobTile(Constants.DIRECTION_RIGHT), mobs);
        break;
      case "60":
        this.addMob(x, y, new ParemeciumTile(Constants.DIRECTION_UP), mobs);
        break;
      case "61":
        this.addMob(x, y, new ParemeciumTile(Constants.DIRECTION_LEFT), mobs);
        break;
      case "62":
        this.addMob(x, y, new ParemeciumTile(Constants.DIRECTION_DOWN), mobs);
        break;
      case "63":
        this.addMob(x, y, new ParemeciumTile(Constants.DIRECTION_RIGHT), mobs);
        break;
      case "64":
        this.objectTiles[x][y] = new KeyTile(Constants.OBJECT_BLUE_KEY);
        this.spawningArea[x][y] = new ItemSpawnInfo(Constants.SPAWN_BLUE_KEY);
        break;
      case "65":
        this.objectTiles[x][y] = new KeyTile(Constants.OBJECT_RED_KEY);
        this.spawningArea[x][y] = new ItemSpawnInfo(Constants.SPAWN_RED_KEY);
        break;
      case "66":
        this.objectTiles[x][y] = new KeyTile(Constants.OBJECT_GREEN_KEY);
        this.spawningArea[x][y] = new ItemSpawnInfo(Constants.SPAWN_GREEN_KEY);
        break;
      case "67":
        this.objectTiles[x][y] = new KeyTile(Constants.OBJECT_YELLOW_KEY);
        this.spawningArea[x][y] = new ItemSpawnInfo(Constants.SPAWN_YELLOW_KEY);
        break;
      case "68":
        this.objectTiles[x][y] = new BootTile(Constants.OBJECT_FLIPPERS);
        this.spawningArea[x][y] = new ItemSpawnInfo(Constants.SPAWN_FLIPPERS);
        break;
      case "69":
        this.objectTiles[x][y] = new BootTile(Constants.OBJECT_FIRE_BOOTS);
        this.spawningArea[x][y] = new ItemSpawnInfo(Constants.SPAWN_FIRE_BOOTS);
        break;
      case "6a":
        this.objectTiles[x][y] = new BootTile(Constants.OBJECT_ICE_SKATES);
        this.spawningArea[x][y] = new ItemSpawnInfo(Constants.SPAWN_ICE_SKATES);
        break;
      case "6b":
        this.objectTiles[x][y] = new BootTile(Constants.OBJECT_SUCTION_BOOTS);
        this.spawningArea[x][y] = new ItemSpawnInfo(
          Constants.SPAWN_SUCTION_BOOTS
        );
        break;
      case "6e":
        this.playerSpawn.push(new Coordinates(x, y));
        break;
      default:
        console.log("Unknown block type: " + blockType);
        break;
    }
  }
}
