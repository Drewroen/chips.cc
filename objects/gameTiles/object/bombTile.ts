import { Constants } from "../../../constants/constants";
import { ObjectTile } from "objects/objectTile";
import { Game } from "objects/game";
import { MobService } from "./../../../services/mobService";
import { Coordinates } from '../../coordinates';

export class BombTile implements ObjectTile {
  value = Constants.OBJECT_BOMB;
  id = null;

  interactionFromPlayer(game: Game, id: string, coords: Coordinates): void {
    game.kill(id);
    game.setObjectTile(coords, null);
  }

  interactionFromMob(game: Game, id: string, coords: Coordinates): void {
    MobService.kill(game, game.findMobTile(id));
    game.setObjectTile(coords, null);
  }

  solid(game: Game, id: string): boolean {
    if (game.findPlayer(id)) return false;
    if (game.findMob(id)) return false;
    return true;
  }
}
