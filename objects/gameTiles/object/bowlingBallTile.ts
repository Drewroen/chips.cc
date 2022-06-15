import { Constants } from "../../../constants/constants";
import { ObjectTile } from "objects/objectTile";
import { Game } from "objects/game";
import { Coordinates } from '../../coordinates';

export class BowlingBallTile implements ObjectTile {
  value = Constants.OBJECT_BOWLING_BALL;
  id = null;

  interactionFromPlayer(game: Game, id: string, coords: Coordinates): void {
    game.findPlayer(id).inventory.bowlingBalls++;
    game.gameMap.setObjectTile(coords, null);
    game.gameMap.spawningArea[coords.x][coords.y].resetRespawnTime();
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
