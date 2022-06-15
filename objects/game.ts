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

  tick() {
    if (this.gameStatus === Constants.GAME_STATUS_PLAYING) {
      this.timer--;
      if (this.timer <= 0) this.endGameplay();

      this.mobs
        .filter((mob) => this.findMobTile(mob.id) instanceof BlockTile)
        .forEach((block) => {
          (this.findMobTile(block.id) as BlockTile).lastHitTime--;
        });

      this.gameTick++;
      this.players?.map((player) => {
        player.incrementCooldown();
        if (!player.alive) {
          player.incrementRespawnTime();
          if (player.respawnTimer === 0 && !player.playerHasQuit)
            this.addPlayerToGame(player.id, player.name);
        }
        if (!this.findPlayerTile(player.id) && player.alive) player.kill();
      });
      this.players?.forEach((player) => {
        const playerCoords = this.findPlayerCoordinates(player.id);
        if (playerCoords) {
          const playerTerrain = this.gameMap.getTerrainTile(
            playerCoords
          );
          if (
            playerCoords &&
            player.slipCooldown <= 0 &&
            this.isForceField(playerTerrain.value) &&
            !player.inventory.forceBoots
          ) {
            const forceTile = playerTerrain as ForceTile;
            const playerTile = this.findPlayerTile(player.id);
            PlayerService.movePlayer(
              this,
              playerTile,
              forceTile.direction,
              Constants.MOVE_TYPE_AUTOMATIC
            );
            player.slipCooldown = Constants.MOVEMENT_SPEED;
            player.cooldown = 1;
          } else if (
            playerCoords &&
            player.slipCooldown <= 0 &&
            this.isRandomForceField(playerTerrain.value) &&
            !player.inventory.forceBoots
          ) {
            const forceTile = playerTerrain as ForceTile;
            forceTile.direction = Math.floor(Math.random() * 4);
            const playerTile = this.findPlayerTile(player.id);
            PlayerService.movePlayer(
              this,
              playerTile,
              forceTile.direction,
              Constants.MOVE_TYPE_AUTOMATIC
            );
            player.slipCooldown = Constants.MOVEMENT_SPEED;
            player.cooldown = 1;
          } else if (
            playerCoords &&
            player.slipCooldown <= 0 &&
            this.isIce(playerTerrain.value) &&
            !player.inventory.iceSkates
          ) {
            const playerTile = this.findPlayerTile(player.id);
            PlayerService.movePlayer(
              this,
              playerTile,
              playerTile.direction,
              Constants.MOVE_TYPE_AUTOMATIC
            );
            player.slipCooldown = Constants.MOVEMENT_SPEED;
            player.cooldown = Constants.MOVEMENT_SPEED / 2;
          } else if (
            playerCoords &&
            playerTerrain.value === Constants.TERRAIN_TELEPORT
          ) {
            const possibleTeleports = this.getTeleportLocations()
              .filter(
                (coords) =>
                  !(
                    coords.x === playerCoords.x &&
                    coords.x === playerCoords.y
                  )
              )
              .concat([playerCoords]);

            let teleported = false;
            let previousCoords = playerCoords;
            possibleTeleports.forEach((coords) => {
              if (!teleported && player.alive) {
                this.gameMap.setMobTile(
                  coords,
                  this.findPlayerTile(player.id)
                );
                if (
                  !(
                    previousCoords.x === coords.x &&
                    previousCoords.y === coords.y
                  )
                )
                  this.gameMap.setMobTile(
                    previousCoords,
                    null
                  );
                const playerTile = this.findPlayerTile(player.id);
                PlayerService.movePlayer(
                  this,
                  playerTile,
                  playerTile.direction,
                  Constants.MOVE_TYPE_AUTOMATIC
                );
                previousCoords = coords;
              }
              const movedPlayerCoords = this.findPlayerCoordinates(player.id);
              if (
                movedPlayerCoords &&
                this.gameMap.getTerrainTile(
                  movedPlayerCoords
                ).value !== Constants.TERRAIN_TELEPORT
              )
                teleported = true;
            });
            const finalPlayerCoords = this.findPlayerCoordinates(player.id);
            if (
              finalPlayerCoords &&
              finalPlayerCoords.x === playerCoords.y &&
              finalPlayerCoords.x === playerCoords.y
            ) {
              const playerTile = this.findPlayerTile(player.id);
              PlayerService.movePlayer(
                this,
                playerTile,
                (playerTile.direction + 2) % 4,
                Constants.MOVE_TYPE_AUTOMATIC
              );
            }
          }
          if (
            player.cooldown <= 0 &&
            player.movement[0] !== null &&
            player.keyEligibleForMovement()
          ) {
            const playerTile = this.findPlayerTile(player.id);
            if (playerTile) {
              PlayerService.movePlayer(
                this,
                playerTile,
                player.movement[0].direction,
                Constants.MOVE_TYPE_PLAYER
              );
            }
          }
          player.movement.forEach((move) => move.timeHeld++);
        }
      });
      if (this.gameTick % Constants.MOVEMENT_SPEED === 0) {
        this.mobs?.forEach((mob) => {
          const mobCoords = this.findMobTileCoordinates(mob.id);
          if (mobCoords) {
            const terrainTile = this.gameMap.getTerrainTile(
              mobCoords
            );
            if (
              mob.alive &&
              terrainTile.value !== Constants.TERRAIN_CLONE_MACHINE
            ) {
              const mobTile = this.findMobTile(mob.id);
              if (terrainTile.value === Constants.TERRAIN_TELEPORT) {
                const possibleTeleports = this.getTeleportLocations()
                  .filter(
                    (coords) =>
                      !(
                        coords.x === mobCoords.x && coords.y === mobCoords.y
                      )
                  )
                  .concat([mobCoords]);

                let teleported = false;
                let previousCoords = mobCoords;
                possibleTeleports.forEach((coords) => {
                  if (!teleported && mob.alive) {
                    this.gameMap.setMobTile(coords, mobTile);
                    if (
                      !(
                        previousCoords.x === coords.x &&
                        previousCoords.y === coords.y
                      )
                    )
                      this.gameMap.setMobTile(
                        previousCoords,
                        null
                      );
                    MobService.move(this, this.findMobTile(mob.id));
                    previousCoords = coords;
                  }
                  const movedMobCoords = this.findPlayerCoordinates(mob.id);
                  if (
                    movedMobCoords &&
                    this.gameMap.getTerrainTile(
                      movedMobCoords
                    ).value !== Constants.TERRAIN_TELEPORT
                  )
                    teleported = true;
                });
                const finalMobCoords = this.findPlayerCoordinates(mob.id);
                if (
                  finalMobCoords &&
                  finalMobCoords.x === mobCoords.x &&
                  finalMobCoords.y === mobCoords.y
                ) {
                  mobTile.direction = (mobTile.direction + 2) % 4;
                  MobService.move(this, mobTile);
                }
              } else if (
                this.gameTick % (mobTile.speed * Constants.MOVEMENT_SPEED) ===
                  0 &&
                !this.isForceField(terrainTile.value) &&
                !this.isIce(terrainTile.value) &&
                !this.isRandomForceField(terrainTile.value) &&
                !(mobTile instanceof BlockTile)
              )
                MobService.move(this, mobTile);
              else if (
                this.isForceField(terrainTile.value) ||
                this.isIce(terrainTile.value) ||
                this.isRandomForceField(terrainTile.value)
              ) {
                MobService.move(this, mobTile);
              }
            }
          }
        });
      }
      this.gameMap.spawnItems();
    } else if (this.gameStatus === Constants.GAME_STATUS_NOT_STARTED) {
      this.timer--;
      if (this.timer <= 0) this.startGamePlay();
    } else if (this.gameStatus === Constants.GAME_STATUS_FINISHED) {
      this.timer--;
    }
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
