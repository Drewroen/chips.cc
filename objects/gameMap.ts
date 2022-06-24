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
import { TrapButtonTile } from "./gameTiles/terrain/trapButtonTile";
import { CloneMachineButtonTile } from "./gameTiles/terrain/cloneMachineButtonTile";
import { BowlingBallTile } from "./gameTiles/object/bowlingBallTile";
import { Coordinates } from './coordinates';
import { MapExport, TileExport } from '../static/levels/levelLoading';
import { SpawnSettings } from './spawnSettings';
import { WhistleTile } from './gameTiles/object/whistleTile';
import { BombTile } from './gameTiles/object/bombTile';

export class GameMap {
  width: number;
  height: number;
  mobTiles: MobTile[][];
  objectTiles: ObjectTile[][];
  terrainTiles: TerrainTile[][];
  playerSpawn: Coordinates[];
  itemSpawn: Coordinates[];
  spawnSettings: SpawnSettings;

  constructor(mobs: Mob[], level: MapExport) {
    this.spawnSettings = new SpawnSettings(level.settings);
    this.width = level.gameMap.length;
    this.height = level.gameMap[0].length;
    this.playerSpawn = new Array<Coordinates>();
    this.itemSpawn = new Array<Coordinates>();
    this.terrainTiles = new Array<TerrainTile[]>();
    this.objectTiles = new Array<ObjectTile[]>();
    this.mobTiles = new Array<MobTile[]>();
    for (let i = 0; i < this.width; i++) {
      const terrainRow: TerrainTile[] = new Array<TerrainTile>();
      const objectRow: ObjectTile[] = new Array<ObjectTile>();
      const mobRow: MobTile[] = new Array<MobTile>();
      for (let j = 0; j < this.height; j++) {
        terrainRow.push(new BlankTile());
        objectRow.push(null);
        mobRow.push(null);
      }
      this.terrainTiles.push(terrainRow);
      this.objectTiles.push(objectRow);
      this.mobTiles.push(mobRow);
    }

    for (var i = 0; i < this.width; i++)
      for (var j = 0; j < this.height; j++) {
        this.setTileFromIdV2(i, j, level.gameMap[i][j], mobs);
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

  spawnItems(): void {
    for(var spawn of this.itemSpawn)
    {
      if (this.getObjectTile(spawn) != null || this.getMobTile(spawn) != null)
        continue;
      var random = Math.random() * Constants.ITEM_SPAWN_CHANCE;
      if (random < 1)
      {
        var item = this.spawnSettings.generateItem();
        switch (item)
        {
          case "Red Key": this.objectTiles[spawn.x][spawn.y] = new KeyTile(Constants.OBJECT_RED_KEY); break;
          case "Yellow Key": this.objectTiles[spawn.x][spawn.y] = new KeyTile(Constants.OBJECT_YELLOW_KEY); break;
          case "Green Key": this.objectTiles[spawn.x][spawn.y] = new KeyTile(Constants.OBJECT_GREEN_KEY); break;
          case "Blue Key": this.objectTiles[spawn.x][spawn.y] = new KeyTile(Constants.OBJECT_BLUE_KEY); break;
          case "Flippers": this.objectTiles[spawn.x][spawn.y] = new BootTile(Constants.OBJECT_FLIPPERS); break;
          case "Fire Boots": this.objectTiles[spawn.x][spawn.y] = new BootTile(Constants.OBJECT_FIRE_BOOTS); break;
          case "Ice Skates": this.objectTiles[spawn.x][spawn.y] = new BootTile(Constants.OBJECT_ICE_SKATES); break;
          case "Force Boots": this.objectTiles[spawn.x][spawn.y] = new BootTile(Constants.OBJECT_SUCTION_BOOTS); break;
          case "Bomb": this.objectTiles[spawn.x][spawn.y] = new BombTile(); break;
          case "Chip": this.objectTiles[spawn.x][spawn.y] = new ChipTile(); break;
          case "Bowling Ball": this.objectTiles[spawn.x][spawn.y] = new BowlingBallTile(); break;
          case "Whistle": this.objectTiles[spawn.x][spawn.y] = new WhistleTile(); break;
          case "Toggle Chip": break;
          case "Golden Chip": break;
          case "Treasure Chest": break;
          default: break;
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

  private setTileFromIdV2(
    x: number,
    y: number,
    tile: TileExport,
    mobs: Mob[]
  ): void {
    switch (tile.mob) {
      case 0: this.addMob(x, y, new BlobTile(Constants.DIRECTION_UP), mobs); break;
      case 1: this.addMob(x, y, new BlobTile(Constants.DIRECTION_LEFT), mobs); break;
      case 2: this.addMob(x, y, new BlobTile(Constants.DIRECTION_DOWN), mobs); break;
      case 3: this.addMob(x, y, new BlobTile(Constants.DIRECTION_RIGHT), mobs); break;
      case 4: this.addMob(x, y, new ParemeciumTile(Constants.DIRECTION_UP), mobs); break;
      case 5: this.addMob(x, y, new ParemeciumTile(Constants.DIRECTION_LEFT), mobs); break;
      case 6: this.addMob(x, y, new ParemeciumTile(Constants.DIRECTION_DOWN), mobs); break;
      case 7: this.addMob(x, y, new ParemeciumTile(Constants.DIRECTION_RIGHT), mobs); break;
      case 8: this.addMob(x, y, new FireballTile(Constants.DIRECTION_UP), mobs); break;
      case 9: this.addMob(x, y, new FireballTile(Constants.DIRECTION_LEFT), mobs); break;
      case 10: this.addMob(x, y, new FireballTile(Constants.DIRECTION_DOWN), mobs); break;
      case 11: this.addMob(x, y, new FireballTile(Constants.DIRECTION_RIGHT), mobs); break;
      case 12: this.addMob(x, y, new TeethTile(Constants.DIRECTION_UP), mobs); break;
      case 13: this.addMob(x, y, new TeethTile(Constants.DIRECTION_LEFT), mobs); break;
      case 14: this.addMob(x, y, new TeethTile(Constants.DIRECTION_DOWN), mobs); break;
      case 15: this.addMob(x, y, new TeethTile(Constants.DIRECTION_RIGHT), mobs); break;
      case 16: this.addMob(x, y, new BugTile(Constants.DIRECTION_UP), mobs); break;
      case 17: this.addMob(x, y, new BugTile(Constants.DIRECTION_LEFT), mobs); break;
      case 18: this.addMob(x, y, new BugTile(Constants.DIRECTION_DOWN), mobs); break;
      case 19: this.addMob(x, y, new BugTile(Constants.DIRECTION_RIGHT), mobs); break;
      case 20: this.addMob(x, y, new GliderTile(Constants.DIRECTION_UP), mobs); break;
      case 21: this.addMob(x, y, new GliderTile(Constants.DIRECTION_LEFT), mobs); break;
      case 22: this.addMob(x, y, new GliderTile(Constants.DIRECTION_DOWN), mobs); break;
      case 23: this.addMob(x, y, new GliderTile(Constants.DIRECTION_RIGHT), mobs); break;
      case 24: this.addMob(x, y, new TankTile(Constants.DIRECTION_UP), mobs); break;
      case 25: this.addMob(x, y, new TankTile(Constants.DIRECTION_LEFT), mobs); break;
      case 26: this.addMob(x, y, new TankTile(Constants.DIRECTION_DOWN), mobs); break;
      case 27: this.addMob(x, y, new TankTile(Constants.DIRECTION_RIGHT), mobs); break;
      case 28: this.addMob(x, y, new WalkerTile(Constants.DIRECTION_UP), mobs); break;
      case 29: this.addMob(x, y, new WalkerTile(Constants.DIRECTION_LEFT), mobs); break;
      case 30: this.addMob(x, y, new WalkerTile(Constants.DIRECTION_DOWN), mobs); break;
      case 31: this.addMob(x, y, new WalkerTile(Constants.DIRECTION_RIGHT), mobs); break;
      case 32: this.addMob(x, y, new BallTile(Constants.DIRECTION_UP), mobs); break;
      case 33: this.addMob(x, y, new BallTile(Constants.DIRECTION_LEFT), mobs); break;
      case 34: this.addMob(x, y, new BallTile(Constants.DIRECTION_DOWN), mobs); break;
      case 35: this.addMob(x, y, new BallTile(Constants.DIRECTION_RIGHT), mobs); break;
      case 36: this.addMob(x, y, new BlockTile(Constants.DIRECTION_UP), mobs); break;
      case 37: this.addMob(x, y, new BlockTile(Constants.DIRECTION_LEFT), mobs); break;
      case 38: this.addMob(x, y, new BlockTile(Constants.DIRECTION_DOWN), mobs); break;
      case 39: this.addMob(x, y, new BlockTile(Constants.DIRECTION_RIGHT), mobs); break;
      default: break;
    }

    switch (tile.terrain) {
      case 0: this.terrainTiles[x][y] = new BlankTile(); break;
      case 1: this.terrainTiles[x][y] = new WallTile(); break;
      case 2: this.terrainTiles[x][y] = new ThinWallTile(Constants.TERRAIN_THIN_WALL_UP); break;
      case 3: this.terrainTiles[x][y] = new ThinWallTile(Constants.TERRAIN_THIN_WALL_LEFT); break;
      case 4: this.terrainTiles[x][y] = new ThinWallTile(Constants.TERRAIN_THIN_WALL_DOWN); break;
      case 5: this.terrainTiles[x][y] = new ThinWallTile(Constants.TERRAIN_THIN_WALL_RIGHT); break;
      case 6: this.terrainTiles[x][y] = new ThinWallTile(Constants.TERRAIN_THIN_WALL_DOWN_RIGHT); break;
      case 7: this.terrainTiles[x][y] = new BlankTile(); break;
      case 8: this.terrainTiles[x][y] = new BlankTile(); break;
      case 9: this.terrainTiles[x][y] = new BlankTile(); break;
      case 10: this.terrainTiles[x][y] = new BlankTile(); break;
      case 11: this.terrainTiles[x][y] = new BlankTile(); break;
      case 12: this.terrainTiles[x][y] = new GravelTile(); break;
      case 13: this.terrainTiles[x][y] = new DirtTile(); break;
      case 14: this.terrainTiles[x][y] = new WaterTile(); break;
      case 15: this.terrainTiles[x][y] = new FireTile(); break;
      case 16: this.terrainTiles[x][y] = new BlueWallTile(false); break;
      case 17: this.terrainTiles[x][y] = new ThiefTile(); break;
      case 18: this.terrainTiles[x][y] = new CellBlockTile(); break;
      case 19: this.terrainTiles[x][y] = new CloneMachineTile(); break;
      case 20: this.terrainTiles[x][y] = new KeyDoorTile(Constants.TERRAIN_BLUE_KEY_DOOR); break;
      case 21: this.terrainTiles[x][y] = new KeyDoorTile(Constants.TERRAIN_GREEN_KEY_DOOR); break;
      case 22: this.terrainTiles[x][y] = new KeyDoorTile(Constants.TERRAIN_RED_KEY_DOOR); break;
      case 23: this.terrainTiles[x][y] = new KeyDoorTile(Constants.TERRAIN_YELLOW_KEY_DOOR); break;
      case 24: this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_UP); break;
      case 25: this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_LEFT); break;
      case 26: this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_DOWN); break;
      case 27: this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_RIGHT); break;
      case 28: this.terrainTiles[x][y] = new ForceTile(Constants.DIRECTION_RANDOM); break;
      case 29: this.terrainTiles[x][y] = new BlankTile(); break;
      case 30: this.terrainTiles[x][y] = new BlankTile(); break;
      case 31: this.terrainTiles[x][y] = new BlankTile(); break;
      case 32: this.terrainTiles[x][y] = new BlankTile(); break;
      case 33: this.terrainTiles[x][y] = new BlankTile(); break;
      case 34: this.terrainTiles[x][y] = new ToggleWallTile(true); break;
      case 35: this.terrainTiles[x][y] = new ToggleWallTile(false); break;
      case 36: this.terrainTiles[x][y] = new IceTile(Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN); break;
      case 37: this.terrainTiles[x][y] = new IceTile(Constants.TERRAIN_ICE_CORNER_DOWN_LEFT); break;
      case 38: this.terrainTiles[x][y] = new IceTile(Constants.TERRAIN_ICE_CORNER_LEFT_UP); break;
      case 39: this.terrainTiles[x][y] = new IceTile(Constants.TERRAIN_ICE_CORNER_UP_RIGHT); break;
      case 40: this.terrainTiles[x][y] = new IceTile(Constants.TERRAIN_ICE); break;
      case 41: this.terrainTiles[x][y] = new ToggleButtonTile(); break;
      case 42: this.terrainTiles[x][y] = new TankToggleButtonTile(); break;
      case 43: this.terrainTiles[x][y] = new CloneMachineButtonTile(); break;
      case 44: this.terrainTiles[x][y] = new TrapButtonTile(); break;
      case 45: this.terrainTiles[x][y] = new BlankTile(); break;
      case 46: this.terrainTiles[x][y] = new TrapTile(); break;
      case 47: this.terrainTiles[x][y] = new TeleportTile(); break;
      case 48: this.terrainTiles[x][y] = new BlankTile(); break;
      case 49: this.terrainTiles[x][y] = new BlankTile(); break;
      default: break;
    }

    switch (tile.spawn) {
      case 0: this.playerSpawn.push(new Coordinates(x, y, this.width, this.height)); break;
      case 1: this.itemSpawn.push(new Coordinates(x, y, this.width, this.height)); break;
    }
  }
}
