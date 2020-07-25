import { TerrainTile } from './../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';

export class WallTile implements TerrainTile {
  value = Constants.TERRAIN_WALL;
  id = null;
  solidToPlayers = true;
  solidToMobs = true;

  interactionFromPlayer(game: Game, id: string): void {
    return;
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }
}
