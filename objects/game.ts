import { TileLayer } from './tileLayer';
import { Constants } from "./../constants/constants";
import { Player } from "./player";
import { MobTile, PlayerTile } from "./mobTile";
import { Mob } from "./mob";
import { MobService } from "./../services/mobService";
import { PlayerService } from "./../services/playerService";
import { Coordinates } from './coordinates';
import { Timer } from './timer';
import { MapExport } from '../static/levels/levelLoading';
import { Dimensions } from './dimensions';
import { ObjectTile } from './objectTile';
import { SpawnSettings } from './spawnSettings';
import { TerrainTile } from './terrainTile';
import { BlankTile } from './gameTiles/terrain/blankTile';
import { BombTile } from './gameTiles/object/bombTile';
import { BootTile } from './gameTiles/object/bootTile';
import { ChipTile } from './gameTiles/object/chipTile';
import { KeyTile } from './gameTiles/object/keyTile';
import { WhistleTile } from './gameTiles/object/whistleTile';
import { BowlingBallTile } from './gameTiles/object/bowlingBallTile';
import { MapCreationService } from '../services/mapCreationService';

export class Game {
  players: Player[];
  mobs: Mob[];
  gameTick = 0;
  gameStatus: number;
  timer: Timer;
  level: MapExport;
  dimensions: Dimensions;
  tiles: TileLayer[][];
  playerSpawn: Coordinates[];
  itemSpawn: Coordinates[];
  spawnSettings: SpawnSettings;

  constructor(levelInfo: MapExport) {
    this.players = new Array<Player>();
    this.mobs = new Array<Mob>();
    this.level = levelInfo;
    this.gameStatus = Constants.GAME_STATUS_NOT_STARTED;
    this.timer = new Timer();

    this.spawnSettings = new SpawnSettings(levelInfo.settings);
    this.dimensions = new Dimensions(levelInfo.gameMap.length, levelInfo.gameMap[0].length);
    this.playerSpawn = new Array<Coordinates>();
    this.itemSpawn = new Array<Coordinates>();
    this.tiles = new Array<TileLayer[]>();
    for (let i = 0; i < this.dimensions.width; i++) {
      const tileRow: TileLayer[] = new Array<TileLayer>();
      for (let j = 0; j < this.dimensions.height; j++)
        tileRow.push(new TileLayer(null, null, new BlankTile()));
      this.tiles.push(tileRow);
    }

    MapCreationService.loadMap(this, levelInfo);
  }
  
  findPlayerCoordinates(id: string): Coordinates {
    for (let i = 0; i < this.dimensions.width; i++) {
      for (let j = 0; j < this.dimensions.height; j++) {
        let coords = new Coordinates(i, j, this.dimensions.width, this.dimensions.height);
        if (this.getMobTile(coords)?.id === id) {
          return coords;
        }
      }
    }
  }

  findPlayerTile(id: string): PlayerTile {
    for (let i = 0; i < this.dimensions.width; i++) {
      for (let j = 0; j < this.dimensions.height; j++) {
        let coords = new Coordinates(i, j, this.dimensions.width, this.dimensions.height);
        if (this.getMobTile(coords)?.id === id) {
          return this.getMobTile(coords) as PlayerTile;
        }
      }
    }
  }

  findMobTileCoordinates(id: string): Coordinates {
    for (let i = 0; i < this.dimensions.width; i++) {
      for (let j = 0; j < this.dimensions.height; j++) {
        let coords = new Coordinates(i, j, this.dimensions.width, this.dimensions.height);
        if (this.getMobTile(coords)?.id === id) {
          return coords;
        }
      }
    }
  }

  findMobTile(id: string): MobTile {
    for (let i = 0; i < this.dimensions.width; i++) {
      for (let j = 0; j < this.dimensions.height; j++) {
        let coords = new Coordinates(i, j, this.dimensions.width, this.dimensions.height);
        if (this.getMobTile(coords)?.id === id) {
          return this.getMobTile(coords);
        }
      }
    }
  }

  findPlayer(id: string): Player {
    return this.players.find((player) => player.id === id);
  }

  findMob(id: string): Mob {
    return this.mobs.find((mob) => mob.id === id);
  }

  addPlayerToGame(id: string, name: string): void {
    const player = this.findPlayer(id);
    if (player) player.playerHasQuit = false;
    if (
      this.findPlayerCoordinates(id) == null &&
      (player?.respawnTimer <= 0 || !player)
    ) {
      let spawned = false;

      this.playerSpawn
        .sort(() => Math.random() - 0.5)
        .forEach((coords) => {
          if (!spawned) {
            if (this.getMobTile(coords) === null) {
              this.setMobTile(
                coords,
                new PlayerTile(Constants.DIRECTION_DOWN, id)
              );
              if (player) {
                player.alive = true;
                player.name = name;
                player.playerHasQuit = false;
              } else {
                this.players.push(new Player(id, name));
              }
              spawned = true;
            }
          }
        });
    }
  }

  removePlayerFromGame(id: string): void {
    const coords: Coordinates = this.findPlayerCoordinates(id);
    if (coords) {
      this.setMobTile(coords, null);
    }
    this.findPlayer(id)?.quit();
    this.players = this.players.filter(
      (player) => player.id !== id || player.name !== "Chip"
    );
  }

  addKeypress(id: string, keypress: any): void {
    const currentPlayer = this.findPlayer(id);
    if (currentPlayer) {
      if (keypress >= 0 && keypress <= 3)
        currentPlayer.appendMovement(keypress);
      else if (keypress === Constants.THROW_BOWLING_BALL) {
        if (currentPlayer.inventory.bowlingBalls > 0)
          PlayerService.throwBowlingBall(this, this.findPlayerTile(id));
      } else if (keypress === Constants.CALL_WHISTLE) {
        if (currentPlayer.inventory.whistles > 0)
          PlayerService.callWhistle(this, this.findPlayerTile(id));
      }
    }
  }

  removeMovement(id: string, direction: any): void {
    const currentPlayer = this.findPlayer(id);
    if (currentPlayer) {
      currentPlayer.removeMovement(direction);
    }
  }

  kill(id: string): void {
    var mobTile = this.findMobTile(id);
    MobService.kill(this, mobTile);
  }

  setTerrainTile(coords: Coordinates, tile: TerrainTile): void {
    this.tiles[coords.x][coords.y].terrain = tile;
  }

  getTerrainTile(coords: Coordinates): TerrainTile {
    return this.tiles[coords.x][coords.y].terrain;
  }

  setObjectTile(coords: Coordinates, tile: ObjectTile): void {
    this.tiles[coords.x][coords.y].object = tile;
  }

  getObjectTile(coords: Coordinates): ObjectTile {
    return this.tiles[coords.x][coords.y].object;
  }

  setMobTile(coords: Coordinates, tile: MobTile): void {
    this.tiles[coords.x][coords.y].mob = tile;
  }

  getMobTile(coords: Coordinates): MobTile {
    return this.tiles[coords.x][coords.y].mob;
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
          case "Red Key": this.tiles[spawn.x][spawn.y].object = new KeyTile(Constants.OBJECT_RED_KEY); break;
          case "Yellow Key": this.tiles[spawn.x][spawn.y].object = new KeyTile(Constants.OBJECT_YELLOW_KEY); break;
          case "Green Key": this.tiles[spawn.x][spawn.y].object = new KeyTile(Constants.OBJECT_GREEN_KEY); break;
          case "Blue Key": this.tiles[spawn.x][spawn.y].object = new KeyTile(Constants.OBJECT_BLUE_KEY); break;
          case "Flippers": this.tiles[spawn.x][spawn.y].object = new BootTile(Constants.OBJECT_FLIPPERS); break;
          case "Fire Boots": this.tiles[spawn.x][spawn.y].object = new BootTile(Constants.OBJECT_FIRE_BOOTS); break;
          case "Ice Skates": this.tiles[spawn.x][spawn.y].object = new BootTile(Constants.OBJECT_ICE_SKATES); break;
          case "Force Boots": this.tiles[spawn.x][spawn.y].object = new BootTile(Constants.OBJECT_SUCTION_BOOTS); break;
          case "Bomb": this.tiles[spawn.x][spawn.y].object = new BombTile(); break;
          case "Chip": this.tiles[spawn.x][spawn.y].object = new ChipTile(); break;
          case "Bowling Ball": this.tiles[spawn.x][spawn.y].object = new BowlingBallTile(); break;
          case "Whistle": this.tiles[spawn.x][spawn.y].object = new WhistleTile(); break;
          case "Toggle Chip": break;
          case "Golden Chip": break;
          case "Treasure Chest": break;
          default: break;
        }
      }
    }
  }
}
