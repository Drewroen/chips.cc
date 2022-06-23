import { Constants } from "./../constants/constants";
import { Player } from "./player";
import { GameMap } from "./gameMap";
import { BlockTile, MobTile, PlayerTile } from "./mobTile";
import { Mob } from "./mob";
import { ForceTile } from "./gameTiles/terrain/forceTile";
import { MobService } from "./../services/mobService";
import { PlayerService } from "./../services/playerService";
import { Coordinates } from './coordinates';

export class Game {
  gameMap: GameMap;
  players: Player[];
  mobs: Mob[];
  gameTick = 0;
  gameStatus: number;
  timer: number;
  level: string[];

  constructor(levelInfo: string[]) {
    this.players = new Array<Player>();
    this.mobs = new Array<Mob>();
    this.level = levelInfo;
    this.gameMap = new GameMap();
    this.gameMap.loadMap(this.mobs, this.level);
    this.gameStatus = Constants.GAME_STATUS_NOT_STARTED;
    this.timer = Constants.START_AND_FINISH_TIMER;
  }
  
  findPlayerCoordinates(id: string): Coordinates {
    for (let i = 0; i < Constants.MAP_SIZE; i++) {
      for (let j = 0; j < Constants.MAP_SIZE; j++) {
        let coords = new Coordinates(i, j);
        if (this.gameMap.getMobTile(coords)?.id === id) {
          return coords;
        }
      }
    }
  }

  findPlayerTile(id: string): PlayerTile {
    for (let i = 0; i < Constants.MAP_SIZE; i++) {
      for (let j = 0; j < Constants.MAP_SIZE; j++) {
        let coords = new Coordinates(i, j);
        if (this.gameMap.getMobTile(coords)?.id === id) {
          return this.gameMap.getMobTile(coords) as PlayerTile;
        }
      }
    }
  }

  findPlayer(id: string): Player {
    return this.players.find((player) => player.id === id);
  }

  findMobTileCoordinates(id: string): Coordinates {
    for (let i = 0; i < Constants.MAP_SIZE; i++) {
      for (let j = 0; j < Constants.MAP_SIZE; j++) {
        let coords = new Coordinates(i, j);
        if (this.gameMap.getMobTile(coords)?.id === id) {
          return coords;
        }
      }
    }
  }

  findMobTile(id: string): MobTile {
    for (let i = 0; i < Constants.MAP_SIZE; i++) {
      for (let j = 0; j < Constants.MAP_SIZE; j++) {
        let coords = new Coordinates(i, j);
        if (this.gameMap.getMobTile(coords)?.id === id) {
          return this.gameMap.getMobTile(coords);
        }
      }
    }
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

      this.gameMap.playerSpawn
        .sort(() => Math.random() - 0.5)
        .forEach((coords) => {
          if (!spawned) {
            if (this.gameMap.getMobTile(coords) === null) {
              this.gameMap.setMobTile(
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
      this.gameMap.setMobTile(coords, null);
    }
    this.findPlayer(id)?.quit();
    this.players = this.players.filter(
      (player) => player.id !== id || player.name !== "Chip"
    );
  }

  updatePlayerCooldown(id: string): void {
    this.findPlayer(id).cooldown = Constants.MOVEMENT_SPEED * 2;
  }

  movePlayer(id: string, direction: any): void {
    const currentPlayerTile = this.findPlayerTile(id);
    if (currentPlayerTile) {
      PlayerService.movePlayer(
        this,
        currentPlayerTile,
        direction,
        Constants.MOVE_TYPE_PLAYER
      );
    }
  }

  addKeypress(id: string, direction: any): void {
    const currentPlayer = this.findPlayer(id);
    if (currentPlayer) {
      if (direction >= 0 && direction <= 3)
        currentPlayer.addKeypress(direction);
      else if (direction === Constants.THROW_BOWLING_BALL) {
        if (currentPlayer.inventory.bowlingBalls > 0)
          PlayerService.throwBowlingBall(this, this.findPlayerTile(id));
      } else if (direction === Constants.CALL_WHISTLE) {
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

  private startGamePlay(): void {
    this.timer = Constants.GAMEPLAY_TIMER;
    this.gameStatus = Constants.GAME_STATUS_PLAYING;
  }

  private endGameplay(): void {
    this.timer = Constants.START_AND_FINISH_TIMER;
    this.gameStatus = Constants.GAME_STATUS_FINISHED;
  }

  isForceField(value: number): boolean {
    return (
      value === Constants.TERRAIN_FORCE_UP ||
      value === Constants.TERRAIN_FORCE_RIGHT ||
      value === Constants.TERRAIN_FORCE_DOWN ||
      value === Constants.TERRAIN_FORCE_LEFT
    );
  }

  isRandomForceField(value: number): boolean {
    return value === Constants.TERRAIN_FORCE_RANDOM;
  }

  isIce(value: number): boolean {
    return [
      Constants.TERRAIN_ICE,
      Constants.TERRAIN_ICE_CORNER_DOWN_LEFT,
      Constants.TERRAIN_ICE_CORNER_LEFT_UP,
      Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN,
      Constants.TERRAIN_ICE_CORNER_UP_RIGHT,
    ].includes(value);
  }

  isMobOnCloneMachine(id: string): boolean {
    const coords = this.findMobTileCoordinates(id);
    if (coords)
      return (
        this.gameMap.getTerrainTile(coords).value ===
        Constants.TERRAIN_CLONE_MACHINE
      );
    return false;
  }

  getTeleportLocations(): Coordinates[] {
    const teleportCoords = new Array<Coordinates>();
    for (let i = 0; i < this.gameMap.terrainTiles.length; i++)
      for (let j = 0; j < this.gameMap.terrainTiles[i].length; j++) {
        if (
          this.gameMap.getTerrainTile(new Coordinates(i, j)).value === Constants.TERRAIN_TELEPORT
        )
          teleportCoords.push(new Coordinates(i, j));
      }

    return teleportCoords
      .sort(() => Math.random() - 0.5)
      .filter(
        (coords) => this.gameMap.getMobTile(coords) === null
      );
  }
}
