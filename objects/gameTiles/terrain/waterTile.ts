import { GliderTile } from './../mob/gliderTile';
import { TerrainTile } from './../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';

export class WaterTile implements TerrainTile {
  value = Constants.TERRAIN_WATER;
  id = null;

  interactionFromPlayer(game: Game, id: string): void {
    game.findPlayerTile(id).kill(game);
  }

  interactionFromMob(game: Game, id: string): void {
    const mob = game.findMobTile(id);
    if (!(mob instanceof GliderTile))
      mob.kill(game);
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return false;
    if(game.findMob(id))
      return false;
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    return [];
  }

  getBlockedMobDirections(game: Game, id: string): number[] {
    return [];
  }
}
