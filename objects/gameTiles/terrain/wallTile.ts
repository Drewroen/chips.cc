import { TerrainTile } from './../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';

export class WallTile implements TerrainTile {
  value = Constants.TERRAIN_WALL;
  id = null;
  solid = true;

  interactionFromPlayer(game: Game, id: string): void {
    return;
  }
}
