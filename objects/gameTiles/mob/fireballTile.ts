import { Constants } from '../../../constants/constants';
import { MobTile } from 'objects/mobTile';
import { Game } from 'objects/game';

export class FireballTile implements MobTile {
  value = Constants.MOB_FIREBALL;
  id: string;
  direction: number;
  speed = 2;

  constructor(direction: number, id?: string)
  {
    this.direction = direction % 4;
    id ? this.id = id : this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  move(game: Game): void {
    const coords: number[] = game.findMobTileCoordinates(this.id);
    if (coords) {
      const i = coords[0];
      const j = coords[1];

      const preferredDirections = this.getPreferredDirections(game);
      for(const directionAttempt of preferredDirections)
      {
        let newI = i;
        let newJ = j;
        switch (directionAttempt) {
          case Constants.DIRECTION_UP: newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case Constants.DIRECTION_DOWN: newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case Constants.DIRECTION_LEFT: newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case Constants.DIRECTION_RIGHT: newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          default: break;
        }
        if (this.canMobMove(game, newI, newJ)) {
          this.direction = directionAttempt;
          game.gameMap.getMobTile(newI, newJ)?.interactionFromMob(game, this.id, newI, newJ);
          game.gameMap.getObjectTile(newI, newJ)?.interactionFromMob(game, this.id, newI, newJ);
          game.gameMap.getTerrainTile(newI, newJ).interactionFromMob(game, this.id, newI, newJ);
          game.gameMap.setMobTile(i, j, null);
          game.gameMap.setMobTile(newI, newJ, this);
          return;
        }
      }
    }
  }

  private getPreferredDirections(game: Game): number[] {
    const coords = game.findMobTileCoordinates(this.id);
    if (game.isForceField(game.gameMap.getTerrainTile(coords[0], coords[1]).value))
      return [this.direction];
    if (game.isIce(game.gameMap.getTerrainTile(coords[0], coords[1]).value))
      return [this.direction, (this.direction + 2) % 4];
    return [
      this.direction,
      (this.direction + 1) % 4,
      (this.direction + 3) % 4,
      (this.direction + 2) % 4
    ];
  }

  kill(game: Game): void {
    const coords = game.findMobTileCoordinates(this.id);
    game.gameMap.setMobTile(coords[0], coords[1], null);
  }

  interactionFromPlayer(game: Game, id: string): void{
    game.kill(id);
  }

  interactionFromMob(game: Game, id: string): void{
    return;
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return false;
    if(game.findMob(id))
      return true;
    return true;
  }

  private canMobMove(game: Game, i: number, j: number) {
    if (game.gameMap.getTerrainTile(i, j).solid(game, this.id) ||
        game.gameMap.getObjectTile(i, j)?.solid(game, this.id) ||
        game.gameMap.getMobTile(i, j)?.solid(game, this.id)) {
      return false;
    }
    return true;
  }
}