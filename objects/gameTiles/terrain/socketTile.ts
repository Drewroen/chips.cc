import { BlankTile } from './blankTile';
import { TerrainTile } from '../../terrainTile';
import { Constants } from '../../../constants/constants';
import { Game } from 'objects/game';

export class SocketTile implements TerrainTile {
  value = Constants.TERRAIN_SOCKET;
  id = null;

  interactionFromPlayer(game: Game, id: string, x: number, y: number): void {
    if(game.findPlayer(id)) {
      const player = game.findPlayer(id);
      if (player.score >= Constants.REQUIRED_CHIPS_TO_WIN)
        game.gameMap.setTerrainTile(x, y, new BlankTile());
    }
    return;
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id)) {
      const player = game.findPlayer(id);
      return player.score < Constants.REQUIRED_CHIPS_TO_WIN;
    }
    if(game.findMob(id))
      return true;
    return true;
  }
}
