import { TerrainTile } from '../../terrainTile';
import { Constants } from '../../../constants/constants';
import { Game } from 'objects/game';

export class BlankTile implements TerrainTile {
  value = Constants.TERRAIN_FLOOR;
  id = null;
  solid = false;

  interactionFromPlayer(game: Game, id: string): void {
    return;
  }
}
