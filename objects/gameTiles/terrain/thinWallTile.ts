import { TerrainTile } from '../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';

export class ThinWallTile implements TerrainTile {
  value;
  id = null;

  constructor(value: number) {
    this.value = value;
  }

  interactionFromPlayer(game: Game, id: string): void {
    return;
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }

  solid(game: Game, id: string, direction: number): boolean{
    if(game.findPlayer(id) || game.findMob(id))
    {
      switch(this.value)
      {
        case Constants.TERRAIN_THIN_WALL_UP: return direction === Constants.DIRECTION_DOWN;
        case Constants.TERRAIN_THIN_WALL_LEFT: return direction === Constants.DIRECTION_RIGHT;
        case Constants.TERRAIN_THIN_WALL_DOWN: return direction === Constants.DIRECTION_UP;
        case Constants.TERRAIN_THIN_WALL_RIGHT: return direction === Constants.DIRECTION_LEFT;
        case Constants.TERRAIN_THIN_WALL_DOWN_RIGHT: return direction === Constants.DIRECTION_UP || direction === Constants.DIRECTION_LEFT;
      }
    }
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    switch(this.value)
    {
      case Constants.TERRAIN_THIN_WALL_UP: return [Constants.DIRECTION_UP];
      case Constants.TERRAIN_THIN_WALL_DOWN: return [Constants.DIRECTION_DOWN];
      case Constants.TERRAIN_THIN_WALL_LEFT: return [Constants.DIRECTION_LEFT];
      case Constants.TERRAIN_THIN_WALL_RIGHT: return [Constants.DIRECTION_RIGHT];
      case Constants.TERRAIN_THIN_WALL_DOWN_RIGHT: return [Constants.DIRECTION_DOWN, Constants.DIRECTION_RIGHT];
    }
    return [];
  }

  getBlockedMobDirections(game: Game, id: string): number[] {
    switch(this.value)
    {
      case Constants.TERRAIN_THIN_WALL_UP: return [Constants.DIRECTION_UP];
      case Constants.TERRAIN_THIN_WALL_DOWN: return [Constants.DIRECTION_DOWN];
      case Constants.TERRAIN_THIN_WALL_LEFT: return [Constants.DIRECTION_LEFT];
      case Constants.TERRAIN_THIN_WALL_RIGHT: return [Constants.DIRECTION_RIGHT];
      case Constants.TERRAIN_THIN_WALL_DOWN_RIGHT: return [Constants.DIRECTION_DOWN, Constants.DIRECTION_RIGHT];
    }
    return [];
  }

  canSpawnMobOnIt(direction: number): boolean {
    switch(this.value)
    {
      case Constants.TERRAIN_THIN_WALL_UP: return direction !== Constants.DIRECTION_DOWN;
      case Constants.TERRAIN_THIN_WALL_DOWN: return direction !== Constants.DIRECTION_UP;
      case Constants.TERRAIN_THIN_WALL_LEFT: return direction !== Constants.DIRECTION_RIGHT;
      case Constants.TERRAIN_THIN_WALL_RIGHT: return direction !== Constants.DIRECTION_LEFT;
      case Constants.TERRAIN_THIN_WALL_DOWN_RIGHT: return [Constants.DIRECTION_DOWN, Constants.DIRECTION_RIGHT].includes(direction);
    }
  }
}
