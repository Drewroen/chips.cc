import { BugTile } from './../mob/bugTile';
import { WalkerTile } from './../mob/walkerTile';
import { FireballTile } from './../mob/fireballTile';
import { TerrainTile } from '../../terrainTile';
import { Game } from 'objects/game';
import { Constants } from '../../../constants/constants';

export class FireTile implements TerrainTile {
  value = Constants.TERRAIN_FIRE;
  id = null;

  interactionFromPlayer(game: Game, id: string): void {
    game.findPlayerTile(id).kill(game);
  }

  interactionFromMob(game: Game, id: string): void {
    const mob = game.findMobTile(id);
    if (!(mob instanceof FireballTile))
      mob.kill(game);
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
}
