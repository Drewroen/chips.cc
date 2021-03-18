import { Constants } from '../../../constants/constants';
import { ObjectTile } from 'objects/objectTile';
import { Game } from 'objects/game';

export class BowlingBallTile implements ObjectTile {
  value = Constants.OBJECT_BOWLING_BALL;
  id = null;

  interactionFromPlayer(game: Game, id: string, x: number, y: number): void {
    game.findPlayer(id).inventory.bowlingBalls++;
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
