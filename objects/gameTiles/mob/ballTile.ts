import { Constants } from '../../../constants/constants';
import { MobTile } from 'objects/mobTile';
import { Game } from 'objects/game';

export class BallTile implements MobTile {
  value = Constants.MOB_BALL;
  id: string;
  solidToPlayers = false;
  solidToMobs = true;
  direction = Constants.MOB_DIRECTION_UP;
  speed = 2;
  tick = 0;

  constructor(direction: number, id?: string)
  {
    this.direction = direction % 4;
    id ? this.id = id : this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  move(game: Game): void {
    this.tick++;
    if(this.tick % this.speed == 0)
    {
      const coords: number[] = game.findMobTileCoordinates(this.id);
      if (coords) {
        const i = coords[0];
        const j = coords[1];

        let newI = i;
        let newJ = j;
        switch (this.direction) {
          case Constants.MOB_DIRECTION_UP: newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case Constants.MOB_DIRECTION_DOWN: newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case Constants.MOB_DIRECTION_LEFT: newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          case Constants.MOB_DIRECTION_RIGHT: newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
          default: break;
        }
        if (this.canMobMove(game, newI, newJ)) {
          game.gameMap.getMobTile(newI, newJ)?.interactionFromMob(game, this.id);
          game.gameMap.getObjectTile(newI, newJ)?.interactionFromMob(game, this.id, newI, newJ);
          game.gameMap.getTerrainTile(newI, newJ).interactionFromMob(game, this.id);
          game.gameMap.setMobTile(i, j, null);
          game.gameMap.setMobTile(newI, newJ, new BallTile(this.direction, this.id));
        }
        else
        {
          this.direction = (this.direction + 2) % 4;
          let newI = i;
          let newJ = j;
          switch (this.direction) {
            case Constants.MOB_DIRECTION_UP: newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            case Constants.MOB_DIRECTION_DOWN: newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            case Constants.MOB_DIRECTION_LEFT: newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            case Constants.MOB_DIRECTION_RIGHT: newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
            default: break;
          }
          if (this.canMobMove(game, newI, newJ)) {
            game.gameMap.getMobTile(newI, newJ)?.interactionFromMob(game, this.id);
            game.gameMap.getObjectTile(newI, newJ)?.interactionFromMob(game, this.id, newI, newJ);
            game.gameMap.getTerrainTile(newI, newJ).interactionFromMob(game, this.id);
            game.gameMap.setMobTile(i, j, null);
            game.gameMap.setMobTile(newI, newJ, new BallTile(this.direction, this.id));
          }
        }
      }
    }
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

  private canMobMove(game: Game, i: number, j: number) {
    if (game.gameMap.getTerrainTile(i, j).solidToMobs ||
        game.gameMap.getObjectTile(i, j)?.solidToMobs ||
        game.gameMap.getMobTile(i, j)?.solidToMobs) {
      return false;
    }
    return true;
  }
}
