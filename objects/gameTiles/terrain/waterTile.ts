import { DirtTile } from './dirtTile';
import { TerrainTile } from './../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';
import { MobService } from './../../../services/mob/mobService';
import { GliderTile, BlockTile } from './../../../objects/mobTile';

export class WaterTile implements TerrainTile {
  value = Constants.TERRAIN_WATER;
  id = null;

  interactionFromPlayer(game: Game, id: string): void {
    if(!game.findPlayer(id).inventory.flippers)
      MobService.kill(game, game.findPlayerTile(id));
  }

  interactionFromMob(game: Game, id: string, x: number, y: number): void {
    const mob = game.findMobTile(id);
    if (!(mob instanceof GliderTile))
    {
      MobService.kill(game, mob);
      if (mob instanceof BlockTile)
        game.gameMap.setTerrainTile(x, y, new DirtTile());
    }
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

  canSpawnMobOnIt(direction: number): boolean {
    return true;
  }
}
