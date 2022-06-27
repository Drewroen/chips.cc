import { Game } from '../objects/game';
import { Mob } from '../objects/mob';
import { MobTile } from '../objects/mobTile';

export class GameService
{
    static addMob(
        game: Game,
        x: number,
        y: number,
        mob: MobTile,
        ownerId: string = null
      ): void {
        game.mobTiles[x][y] = mob;
        game.mobs.push(new Mob(game.mobTiles[x][y].id, ownerId));
      }
}