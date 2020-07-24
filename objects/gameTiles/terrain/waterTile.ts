import { TerrainTile } from './../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';

export class WaterTile implements TerrainTile {
  value = Constants.TERRAIN_WATER;
  id = null;
  solid = false;

  interactionFromPlayer(game: Game, id: string): void {
    game.findPlayerTile(id).kill(game);
  }
}
