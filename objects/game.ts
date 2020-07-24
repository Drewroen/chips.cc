import { PlayerTile } from './gameTiles/playerTile';
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

  findPlayer(id: string) {
    for (let i = 0; i < Constants.MAP_SIZE; i++) {
      for (let j = 0; j < Constants.MAP_SIZE; j++) {
        if (this.gameMap.getMobTile(i, j)?.playerId === id) {
          return [i, j];
        }
      }
    }
  }

  canPlayerMove(i: number, j: number) {
    if (this.gameMap.getTerrainTile(i, j).solid) {
      return false;
    }
    return true;
  }

  updateCooldown(id: string): void {
    this.players.map(player => {if (player.id === id) (player.cooldown = 30)});
  }

  removePlayerFromGame(id: string): void {
    const coords = this.findPlayer(id);
    if (coords) {
      const x = coords[0];
      const y = coords[1];
      this.gameMap.setMobTile(x, y, null);
    }
    this.players = this.players.filter(player => player.id !== id);
  }

  movePlayer(id: string, direction: any): void {
    const coords = this.findPlayer(id);
    var currentPlayer = this.players.find(player => player.id === id);
    if (coords && currentPlayer.cooldown <= 0) {
      const i = coords[0];
      const j = coords[1];

      let newI = i;
      let newJ = j;
      switch (direction) {
        case Constants.KEY_UP_ARROW: newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
        case Constants.KEY_DOWN_ARROW: newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
        case Constants.KEY_LEFT_ARROW: newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
        case Constants.KEY_RIGHT_ARROW: newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
        default: break;
      }

      if (this.canPlayerMove(newI, newJ)) {
        this.interactObjectFromPlayer(newI, newJ, id);
        this.interactTerrainFromPlayer(newI, newJ, id);

        if(currentPlayer.alive)
        {
          this.gameMap.setMobTile(i, j, null);
          this.gameMap.setMobTile(newI, newJ, new PlayerTile(id));
          this.updateCooldown(id);
        }
      }
    }
  }

  spawnPlayer(id: string, name: string) {
    if(this.findPlayer(id) == null)
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
          this.startPlayer(id, name);
          spawned = true;
        }
      }
    }
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

  tick() {
    this.players?.map(player => player.incrementCooldown());
  }

  kill(id: string): void {
    this.players.map(player => {if(player.id === id) (player.kill())})
    var coords = this.findPlayer(id);
    this.gameMap.setMobTile(coords[0], coords[1], null);
  }

  startPlayer(id: string, name: string): void {
    this.players.find(player => player.id === id) ?
      this.players.map(player => {if (player.id === id) { player.alive = true; player.name = name;}}) :
      this.players.push(new Player(id, name));
  }
}
