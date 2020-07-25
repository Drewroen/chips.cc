import { PlayerTile } from './gameTiles/mob/playerTile';
import { Constants } from './../constants/constants';
import { Player } from './player';
import { GameMap } from './gameMap';
import { MobTile } from './mobTile';
import { Mob } from './mob';

export class Game {
  gameMap: GameMap;
  players: Player[];
  mobs: Mob[];
  gameTick = 0;

  constructor() {
    this.gameMap = new GameMap();
    this.players = new Array<Player>();
    this.mobs = new Array<Mob>();
    this.gameMap.loadMap(this.mobs);
  }

  tick() {
    this.gameTick++;
    this.players?.map(player => player.incrementCooldown());
    if(this.gameTick % Constants.MOVEMENT_SPEED === 0)
    {
      this.mobs?.forEach(mob => {
        this.findMobTile(mob.id).move(this);
      })
    }
    this.gameMap.spawnChips();
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

      while(!spawned)
      {
        const x = Math.floor(Math.random() * Constants.MAP_SIZE);
        const y = Math.floor(Math.random() * Constants.MAP_SIZE);
        if(this.gameMap.getTerrainTile(x, y).value === Constants.TERRAIN_FLOOR &&
           !this.gameMap.getObjectTile(x, y) &&
           !this.gameMap.getMobTile(x, y))
        {
          this.gameMap.setMobTile(x, y, new PlayerTile(id));
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
      this.findPlayerTile(id).movePlayer(this, direction);
    }
  }

  kill(id: string): void {
    this.findPlayerTile(id)?.kill(this);
  }
}
