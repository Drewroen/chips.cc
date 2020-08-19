import { BlockTile } from './gameTiles/mob/blockTile';
import { BlankTile } from './gameTiles/terrain/blankTile';
import { IceTile } from './gameTiles/terrain/iceTile';
import { PlayerTile } from './gameTiles/mob/playerTile';
import { Constants } from './../constants/constants';
import { Player } from './player';
import { GameMap } from './gameMap';
import { MobTile } from './mobTile';
import { Mob } from './mob';
import { ForceTile } from './gameTiles/terrain/forceTile';

export class Game {
  gameMap: GameMap;
  players: Player[];
  mobs: Mob[];
  gameTick = 0;
  gameStatus: number;
  startingTimer: number;
  finishTimer: number;
  level: string[];

  constructor(levelInfo: string[]) {
    this.players = new Array<Player>();
    this.mobs = new Array<Mob>();
    this.level = levelInfo;
    this.gameMap = new GameMap();
    this.gameMap.loadMap(this.mobs, this.level);
    this.gameStatus = Constants.GAME_STATUS_NOT_STARTED;
    this.startingTimer = Constants.START_AND_FINISH_TIMER;
    this.finishTimer = Constants.START_AND_FINISH_TIMER;
  }

  tick() {
    this.gameTick++;
    this.players?.map(player => {
      player.incrementCooldown();
      if(!this.findPlayerTile(player.id) && player.alive)
      {
        player.kill();
      }
      if (player.attemptedMoveCooldown === 0 && this.findPlayerTile(player.id))
        this.findPlayerTile(player.id).value = Constants.MOB_PLAYER_DOWN;
    });
    this.players?.forEach(player => {
      const playerCoords = this.findPlayerCoordinates(player.id);
      if(playerCoords &&
         player.slipCooldown <= 0 &&
         this.isForceField(this.gameMap.getTerrainTile(playerCoords[0], playerCoords[1]).value) &&
         !player.inventory.forceBoots)
      {
        const forceTile = this.gameMap.getTerrainTile(playerCoords[0], playerCoords[1]) as ForceTile;
        this.findPlayerTile(player.id).movePlayer(this, forceTile.direction, Constants.MOVE_TYPE_AUTOMATIC);
        player.slipCooldown = Constants.MOVEMENT_SPEED;
        player.cooldown = 1;
      }
      else if (playerCoords &&
        player.slipCooldown <= 0 &&
        this.isRandomForceField(this.gameMap.getTerrainTile(playerCoords[0], playerCoords[1]).value) &&
        !player.inventory.forceBoots)
      {
        const forceTile = this.gameMap.getTerrainTile(playerCoords[0], playerCoords[1]) as ForceTile;
        forceTile.direction = Math.floor(Math.random() * 4);
        this.findPlayerTile(player.id).movePlayer(this, forceTile.direction, Constants.MOVE_TYPE_AUTOMATIC);
        player.slipCooldown = Constants.MOVEMENT_SPEED;
        player.cooldown = 1;
      }
      else if(playerCoords &&
         player.slipCooldown <= 0 &&
         this.isIce(this.gameMap.getTerrainTile(playerCoords[0], playerCoords[1]).value) &&
         !player.inventory.iceSkates)
      {
        const iceTile = this.gameMap.getTerrainTile(playerCoords[0], playerCoords[1]) as IceTile;
        const playerTile = this.findPlayerTile(player.id);
        playerTile.movePlayer(this, playerTile.direction, Constants.MOVE_TYPE_AUTOMATIC);
        player.slipCooldown = Constants.MOVEMENT_SPEED;
        player.cooldown = 1;
      }
      else if(playerCoords &&
        this.gameMap.getTerrainTile(playerCoords[0], playerCoords[1]).value === Constants.TERRAIN_TELEPORT)
      {
        const possibleTeleports = this.getTeleportLocations()
          .filter(coords => !(coords[0] === playerCoords[0] && coords[1] === playerCoords[1]))
          .concat([playerCoords]);

        let teleported = false;
        let previousCoords = playerCoords;
        possibleTeleports.forEach(coords => {
          if(!teleported && player.alive)
          {
            this.gameMap.setMobTile(coords[0], coords[1], this.findPlayerTile(player.id));
            if (!(previousCoords[0] === coords[0] && previousCoords[1] === coords[1]))
              this.gameMap.setMobTile(previousCoords[0], previousCoords[1], null);
            this.findPlayerTile(player.id).movePlayer(this, this.findPlayerTile(player.id).direction, Constants.MOVE_TYPE_AUTOMATIC);
            previousCoords = coords;
          }
          const movedPlayerCoords = this.findPlayerCoordinates(player.id);
          if(movedPlayerCoords &&
            this.gameMap.getTerrainTile(movedPlayerCoords[0], movedPlayerCoords[1]).value !== Constants.TERRAIN_TELEPORT)
            teleported = true;
        });
        const finalPlayerCoords = this.findPlayerCoordinates(player.id);
        if(finalPlayerCoords && finalPlayerCoords[0] === playerCoords[0] && finalPlayerCoords[1] === playerCoords[1])
          this.findPlayerTile(player.id).movePlayer(this,
                                                    (this.findPlayerTile(player.id).direction + 2) % 4,
                                                    Constants.MOVE_TYPE_AUTOMATIC);
      }
      if (player.cooldown <= 0 && player.movement[0] !== null && player.keyEligibleForMovement())
      {
        if(this.findPlayerTile(player.id))
        {
          this.findPlayerTile(player.id).movePlayer(this, player.movement[0].direction, Constants.MOVE_TYPE_PLAYER);
        }
      }
      player.movement.forEach(move => move.timeHeld++);
    })
    if(this.gameTick % (Constants.MOVEMENT_SPEED) === 0)
    {
      this.mobs?.filter(mob => mob.alive === true &&
                        this.findMobTileCoordinates(mob.id) &&
                        this.gameMap.getTerrainTile(this.findMobTileCoordinates(mob.id)[0],
                                                    this.findMobTileCoordinates(mob.id)[1]).value !== Constants.TERRAIN_CLONE_MACHINE)
        .forEach(mob => {
          const mobCoords = this.findMobTileCoordinates(mob.id);
          if (this.gameMap.getTerrainTile(mobCoords[0], mobCoords[1]).value === Constants.TERRAIN_TELEPORT)
          {
            const possibleTeleports = this.getTeleportLocations()
              .filter(coords => !(coords[0] === mobCoords[0] && coords[1] === mobCoords[1]))
              .concat([mobCoords]);

            let teleported = false;
            let previousCoords = mobCoords;
            possibleTeleports.forEach(coords => {
              if(!teleported && mob.alive)
              {
                this.gameMap.setMobTile(coords[0], coords[1], this.findMobTile(mob.id));
                if (!(previousCoords[0] === coords[0] && previousCoords[1] === coords[1]))
                  this.gameMap.setMobTile(previousCoords[0], previousCoords[1], null);
                this.findMobTile(mob.id).move(this);
                previousCoords = coords;
              }
              const movedMobCoords = this.findPlayerCoordinates(mob.id);
              if(movedMobCoords && this.gameMap.getTerrainTile(movedMobCoords[0], movedMobCoords[1]).value !== Constants.TERRAIN_TELEPORT)
                teleported = true;
            });
            const finalMobCoords = this.findPlayerCoordinates(mob.id);
            if(finalMobCoords && finalMobCoords[0] === mobCoords[0] && finalMobCoords[1] === mobCoords[1])
            {
              this.findMobTile(mob.id).direction = (this.findMobTile(mob.id).direction + 2) % 4;
              this.findMobTile(mob.id).move(this);
            }
          }
          else if (this.gameTick % (this.findMobTile(mob.id).speed * Constants.MOVEMENT_SPEED) === 0 &&
            !this.isForceField(this.gameMap.getTerrainTile(mobCoords[0], mobCoords[1]).value) &&
            !this.isIce(this.gameMap.getTerrainTile(mobCoords[0], mobCoords[1]).value) &&
            !this.isRandomForceField(this.gameMap.getTerrainTile(mobCoords[0], mobCoords[1]).value) &&
            !(this.findMobTile(mob.id) instanceof BlockTile))
            this.findMobTile(mob.id).move(this);
          else if(this.isForceField(this.gameMap.getTerrainTile(mobCoords[0], mobCoords[1]).value) ||
            this.isIce(this.gameMap.getTerrainTile(mobCoords[0], mobCoords[1]).value) ||
            this.isRandomForceField(this.gameMap.getTerrainTile(mobCoords[0], mobCoords[1]).value))
          {
            this.findMobTile(mob.id).move(this);
          }
      })
    }
    this.gameMap.spawnItems();
  }

  findPlayerCoordinates(id: string): number[] {
    for (let i = 0; i < Constants.MAP_SIZE; i++) {
      for (let j = 0; j < Constants.MAP_SIZE; j++) {
        if (this.gameMap.getMobTile(i, j)?.id === id) {
          return [i, j];
        }
      }
    }
  }

  findPlayerTile(id: string): PlayerTile {
    for (let i = 0; i < Constants.MAP_SIZE; i++) {
      for (let j = 0; j < Constants.MAP_SIZE; j++) {
        if (this.gameMap.getMobTile(i, j)?.id === id) {
          return this.gameMap.getMobTile(i, j) as PlayerTile;
        }
      }
    }
  }

  findPlayer(id: string): Player {
    return this.players.find(player => player.id === id);
  }

  findMobTileCoordinates(id: string): number[] {
    for (let i = 0; i < Constants.MAP_SIZE; i++) {
      for (let j = 0; j < Constants.MAP_SIZE; j++) {
        if (this.gameMap.getMobTile(i, j)?.id === id) {
          return [i, j];
        }
      }
    }
  }

  findMobTile(id: string): MobTile {
    for (let i = 0; i < Constants.MAP_SIZE; i++) {
      for (let j = 0; j < Constants.MAP_SIZE; j++) {
        if (this.gameMap.getMobTile(i, j)?.id === id) {
          return this.gameMap.getMobTile(i, j);
        }
      }
    }
  }

  findMob(id: string): Mob {
    return this.mobs.find(mob => mob.id === id);
  }

  addPlayerToGame(id: string, name: string): void {
    if(this.findPlayerCoordinates(id) == null)
    {
      let spawned = false;

      this.gameMap.playerSpawn.sort(() => Math.random() - .5).forEach(coords =>
      {
        if(!spawned)
        {
          if(this.gameMap.getMobTile(coords[0], coords[1]) === null)
          {
            this.gameMap.setMobTile(coords[0], coords[1], new PlayerTile(id));
            const player = this.findPlayer(id);
            if (player)
            {
              player.alive = true;
              player.name = name;
            }
            else
            {
              this.players.push(new Player(id, name));
            }
            spawned = true;
          }
        }
      });
    }
  }

  removePlayerFromGame(id: string): void {
    const coords: number[] = this.findPlayerCoordinates(id);
    if (coords) {
      this.gameMap.setMobTile(coords[0], coords[1], null);
    }
    this.players = this.players.filter(player => player.id !== id);
  }

  updatePlayerCooldown(id: string): void {
    this.findPlayer(id).cooldown = Constants.MOVEMENT_SPEED * 2;
  }

  movePlayer(id: string, direction: any): void {
    if(this.findPlayerTile(id))
    {
      this.findPlayerTile(id).movePlayer(this, direction, Constants.MOVE_TYPE_PLAYER);
    }
  }

  addMovement(id: string, direction: any): void {
    if(this.findPlayer(id))
    {
      this.findPlayer(id).addMovement(direction);
    }
  }

  removeMovement(id: string, direction: any): void {
    if(this.findPlayer(id))
    {
      this.findPlayer(id).removeMovement(direction);
    }
  }

  kill(id: string): void {
    this.findPlayerTile(id)?.kill(this);
  }

  win(): void {
    this.gameStatus = Constants.GAME_STATUS_FINISHED;
  }

  isForceField(value: string): boolean {
    return value === Constants.TERRAIN_FORCE_UP ||
           value === Constants.TERRAIN_FORCE_RIGHT ||
           value === Constants.TERRAIN_FORCE_DOWN ||
           value === Constants.TERRAIN_FORCE_LEFT;
  }

  isRandomForceField(value: string): boolean {
    return value === Constants.TERRAIN_FORCE_RANDOM;
  }

  isIce(value: string): boolean {
    return [
      Constants.TERRAIN_ICE,
      Constants.TERRAIN_ICE_CORNER_DOWN_LEFT,
      Constants.TERRAIN_ICE_CORNER_LEFT_UP,
      Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN,
      Constants.TERRAIN_ICE_CORNER_UP_RIGHT
    ].includes(value);
  }

  getTeleportLocations(): number[][] {
    const teleportCoords = new Array<number[]>();
    for(let i = 0; i < this.gameMap.terrainTiles.length; i++)
      for(let j = 0; j < this.gameMap.terrainTiles[i].length; j++)
      {
        if(this.gameMap.getTerrainTile(i, j).value === Constants.TERRAIN_TELEPORT)
        teleportCoords.push([i, j]);
      }

    return teleportCoords.sort(() => Math.random() - 0.5).filter(coords => this.gameMap.getMobTile(coords[0], coords[1]) === null);
  }
}
