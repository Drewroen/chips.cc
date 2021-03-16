import { TerrainTile } from '../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';

export class ToggleWallTile implements TerrainTile {
  value;
  id = null;

  constructor(solid: boolean)
  {
    solid ?
      this.value = Constants.TERRAIN_TOGGLE_WALL_CLOSED :
      this.value = Constants.TERRAIN_TOGGLE_WALL_OPEN;
  }

  interactionFromPlayer(game: Game, id: string): void {
    return;
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return this.value === Constants.TERRAIN_TOGGLE_WALL_CLOSED;
    if(game.findMob(id))
      return this.value === Constants.TERRAIN_TOGGLE_WALL_CLOSED;
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    return [];
  }

  getBlockedMobDirections(game: Game, id: string): number[] {
    return [];
  }

  toggleWall(): void {
    this.value === Constants.TERRAIN_TOGGLE_WALL_OPEN ?
      this.value = Constants.TERRAIN_TOGGLE_WALL_CLOSED :
      this.value = Constants.TERRAIN_TOGGLE_WALL_OPEN;
  }

  canSpawnMobOnIt(direction: number): boolean {
    return this.value === Constants.TERRAIN_TOGGLE_WALL_OPEN;
  }
}
