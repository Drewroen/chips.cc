import { Constants } from '../../../constants/constants';
import { ObjectTile } from 'objects/objectTile';
import { Game } from 'objects/game';

export class BombTile implements ObjectTile {
  value = Constants.OBJECT_BOMB;
  id = null;

  interactionFromPlayer(game: Game, id: string, x: number, y: number): void {
    game.kill(id);
    game.gameMap.setObjectTile(x, y, null);
  }

  interactionFromMob(game: Game, id: string, x: number, y: number): void {
    game.findMobTile(id).kill(game);
    game.gameMap.setObjectTile(x, y, null);
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return false;
    if(game.findMob(id))
      return false;
    return true;
  }
}
