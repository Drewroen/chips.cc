import { TerrainTile } from '../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';

export class BlueWallTile implements TerrainTile {
  value = Constants.TERRAIN_WALL;
  id = null;

  constructor(solid: boolean)
  {
    solid ?
      this.value = Constants.TERRAIN_BLUE_WALL_REAL :
      this.value = Constants.TERRAIN_BLUE_WALL_FAKE;
  }

  interactionFromPlayer(game: Game, id: string): void {
    return;
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      switch(this.value) {
        case Constants.TERRAIN_BLUE_WALL_FAKE:
          this.value = Constants.TERRAIN_FLOOR;
          return false;
        case Constants.TERRAIN_BLUE_WALL_REAL:
          this.value = Constants.TERRAIN_WALL;
          return true;
        case Constants.TERRAIN_WALL:
          return true;
        case Constants.TERRAIN_FLOOR:
          return false;
      }
    if(game.findMob(id))
      switch(this.value) {
        case Constants.TERRAIN_BLUE_WALL_FAKE:
        case Constants.TERRAIN_BLUE_WALL_REAL:
        case Constants.TERRAIN_WALL:
          return true;
        case Constants.TERRAIN_FLOOR:
          return false;
      }
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    return [];
  }

  getBlockedMobDirections(game: Game, id: string): number[] {
    return [];
  }
}
