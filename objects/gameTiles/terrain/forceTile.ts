import { TerrainTile } from '../../terrainTile';
import { Constants } from '../../../constants/constants';
import { Game } from 'objects/game';

export class ForceTile implements TerrainTile {
  value: string;
  id = null;
  direction: number;

  constructor(direction: number) {
    this.direction = direction;

    switch(direction) {
      case (Constants.DIRECTION_UP): this.value = Constants.TERRAIN_FORCE_UP; break;
      case (Constants.DIRECTION_LEFT): this.value = Constants.TERRAIN_FORCE_LEFT; break;
      case (Constants.DIRECTION_DOWN): this.value = Constants.TERRAIN_FORCE_DOWN; break;
      case (Constants.DIRECTION_RIGHT): this.value = Constants.TERRAIN_FORCE_RIGHT; break;
    }
  }

  interactionFromPlayer(game: Game, id: string): void {
    game.findPlayer(id).slipCooldown = 0;
    game.findPlayer(id).cooldown = Constants.MOVEMENT_SPEED;
  }

  interactionFromMob(game: Game, id: string): void {
    game.findMobTile(id).direction = this.direction;
  }

  solid(game: Game, id: string): boolean{
    if(game.findPlayer(id))
      return false;
    if(game.findMob(id))
      return false;
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    return [this.direction];
  }
}