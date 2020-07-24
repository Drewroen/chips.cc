import { Constants } from '../../../constants/constants';
import { ObjectTile } from 'objects/objectTile';
import { Game } from 'objects/game';

export class ChipTile implements ObjectTile {
  value = Constants.OBJECT_CHIP;
  id = null;
  solid = false;

  interactionFromPlayer(game: Game, id: string, x: number, y: number): void {
    game.findPlayer(id).score++;
    game.gameMap.setObjectTile(x, y, null);
  }
}
