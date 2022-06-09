import { TerrainTile } from '../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';
import { MobService } from './../../../services/mob/mobService';
import { FireballTile, BlockTile, WalkerTile, BugTile } from './../../../objects/mobTile';

export class FireTile implements TerrainTile {
  value = Constants.TERRAIN_FIRE;
  id = null;

  interactionFromPlayer(game: Game, id: string): void {
    if(!game.findPlayer(id).inventory.fireBoots)
      MobService.kill(game, game.findPlayerTile(id));
  }

  interactionFromMob(game: Game, id: string): void {
    const mob = game.findMobTile(id);
    if (!(mob instanceof FireballTile || mob instanceof BlockTile))
      MobService.kill(game, mob);
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return false;
    if(game.findMob(id))
    {
      if(game.findMobTile(id) instanceof WalkerTile || game.findMobTile(id) instanceof BugTile)
        return true;
      else
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

  canSpawnMobOnIt(direction: number): boolean {
    return true;
  }
}
