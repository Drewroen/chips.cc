import { Constants } from "../../../constants/constants";
import { ObjectTile } from "objects/objectTile";
import { Game } from "objects/game";
import { Coordinates } from '../../coordinates';

export class WhistleTile implements ObjectTile {
  value = Constants.OBJECT_WHISTLE;
  id = null;

  interactionFromPlayer(game: Game, id: string, coords: Coordinates): void {
    game.findPlayer(id).inventory.whistles++;
    game.setObjectTile(coords, null);
  }

  interactionFromMob(game: Game, id: string, coords: Coordinates): void {
    return;
  }

  solid(game: Game, id: string): boolean {
    if (game.findPlayer(id)) return false;
    if (game.findMob(id)) return true;
    return true;
  }
}
