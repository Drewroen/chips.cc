import { TerrainTile } from '../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';

export class AppearingWallTile implements TerrainTile {
  value = Constants.TERRAIN_FLOOR;
  id = null;

  interactionFromPlayer(game: Game, id: string): void {
    return;
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
    {
      this.value = Constants.TERRAIN_WALL;
      return true;
    }
    if(game.findMob(id))
      return true;
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    return [];
  }

  getBlockedMobDirections(game: Game, id: string): number[] {
    return [];
  }
}
