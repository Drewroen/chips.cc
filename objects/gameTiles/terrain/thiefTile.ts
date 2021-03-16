import { BlankTile } from './blankTile';
import { TerrainTile } from '../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';

export class ThiefTile implements TerrainTile {
  value = Constants.TERRAIN_THIEF;
  id = null;

  interactionFromPlayer(game: Game, id: string, x: number, y: number): void {
    game.findPlayer(id).inventory.iceSkates = false;
    game.findPlayer(id).inventory.fireBoots = false;
    game.findPlayer(id).inventory.forceBoots = false;
    game.findPlayer(id).inventory.flippers = false;
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return false;
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

  canSpawnMobOnIt(direction: number): boolean {
    return false;
  }
}
