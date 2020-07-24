import { ChipTile } from './gameTiles/chipTile';
import { PlayerTile } from './gameTiles/mobs/playerTile';
import { Constants } from './../constants/constants';
import { Player } from './player';
import { GameMap } from './gameMap';
import { GameTile } from './gameTile';

export class Game {
  gameMap: GameMap;
  players: Player[];

  constructor() {
    this.gameMap = new GameMap();
    this.players = new Array<Player>();
    this.gameMap.loadMap();
  }

  tick() {
    this.players?.map(player => player.incrementCooldown());
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
          return <PlayerTile>this.gameMap.getMobTile(i, j)
        }
      }
    }
  }

  findPlayer(id: string): Player {
    return this.players.find(player => player.id === id);
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
          var player = this.findPlayer(id);
          player ?
            (player.alive = true) && (player.name = name) :
            this.players.push(new Player(id, name));
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
    this.findPlayer(id).cooldown = 30;
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

  interactObjectFromPlayer(x: number, y: number, id: string) {
    const objectTile: GameTile = this.gameMap.getObjectTile(x, y);
    if (objectTile?.value === Constants.OBJECT_CHIP) {
      this.players.find(player => player.id === id).score++;
      this.gameMap.setObjectTile(x, y, null);
    }
  }

  interactTerrainFromPlayer(x: number, y: number, id: string) {
    const terrainTile: GameTile = this.gameMap.getTerrainTile(x, y);
    if (terrainTile?.value === Constants.TERRAIN_WATER) {
      this.kill(id);
    }
  }
}
