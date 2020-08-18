import { Constants } from '../../../constants/constants';
import { ObjectTile } from 'objects/objectTile';
import { Game } from 'objects/game';

export class KeyTile implements ObjectTile {
  value;
  id = null;

  constructor(value: string) {
    this.value = value;
  }

  interactionFromPlayer(game: Game, id: string, x: number, y: number): void {
    switch(this.value)
    {
      case Constants.OBJECT_RED_KEY:
        game.findPlayer(id).inventory.redKeys++;
        break;
      case Constants.OBJECT_YELLOW_KEY:
        game.findPlayer(id).inventory.yellowKeys++;
        break;
      case Constants.OBJECT_BLUE_KEY:
        game.findPlayer(id).inventory.blueKeys++;
        break;
      case Constants.OBJECT_GREEN_KEY:
        game.findPlayer(id).inventory.greenKey = true;
        break;
    }
    game.gameMap.setObjectTile(x, y, null);
  }

  interactionFromMob(game: Game, id: string, x: number, y: number): void {
    return;
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return false;
    if(game.findMob(id))
      return false;
    return true;
  }
}
