import { Constants } from '../../../constants/constants';
import { ObjectTile } from 'objects/objectTile';
import { Game } from 'objects/game';

export class BootTile implements ObjectTile {
  value;
  id = null;

  constructor(value: string) {
    this.value = value;
  }

  interactionFromPlayer(game: Game, id: string, x: number, y: number): void {
    switch(this.value)
    {
      case Constants.OBJECT_FIRE_BOOTS:
        game.findPlayer(id).inventory.fireBoots = true;
        break;
      case Constants.OBJECT_FLIPPERS:
        game.findPlayer(id).inventory.flippers = true;
        break;
      case Constants.OBJECT_SUCTION_BOOTS:
        game.findPlayer(id).inventory.forceBoots = true;
        break;
      case Constants.OBJECT_ICE_SKATES:
        game.findPlayer(id).inventory.iceSkates = true;
        break;
    }
    game.gameMap.setObjectTile(x, y, null);
    game.gameMap.spawningArea[x][y].resetRespawnTime();
  }

  interactionFromMob(game: Game, id: string, x: number, y: number): void {
    return;
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return false;
    if(game.findMob(id))
      return true;
    return true;
  }
}
