import { TerrainTile } from '../../terrainTile';
import { Constants } from '../../../constants/constants';
import { Game } from 'objects/game';

export class FinishTile implements TerrainTile {
  value = Constants.TERRAIN_FINISH;
  id = null;
  solidToPlayers = false;
  solidToMobs = true;

  interactionFromPlayer(game: Game, id: string): void {
    game.win();
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }
}
