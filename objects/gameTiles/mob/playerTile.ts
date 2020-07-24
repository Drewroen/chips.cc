import { Constants } from '../../../constants/constants';
import { MobTile } from 'objects/mobTile';
import { Game } from 'objects/game';
import { Player } from 'objects/player';

export class PlayerTile implements MobTile {
  value = Constants.MOB_PLAYER;
  id = null;
  solid = true;

  constructor(id: string)
  {
    this.id = id;
  }

  move(game: Game): void {
    return;
  }

  interactionFromPlayer(game: Game, id: string): void {
    return;
  }

  movePlayer(game: Game, direction: string): void {
    const coords: number[] = game.findPlayerCoordinates(this.id);
    const currentPlayer: Player = game.findPlayer(this.id)
    if (coords && currentPlayer.cooldown <= 0) {
      const i = coords[0];
      const j = coords[1];

      let newI = i;
      let newJ = j;
      switch (direction) {
        case Constants.KEY_UP_ARROW: newJ = (j - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
        case Constants.KEY_DOWN_ARROW: newJ = (j + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
        case Constants.KEY_LEFT_ARROW: newI = (i - 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
        case Constants.KEY_RIGHT_ARROW: newI = (i + 1 + Constants.MAP_SIZE) % Constants.MAP_SIZE; break;
        default: break;
      }
      if (this.canPlayerMove(game, newI, newJ)) {
        game.gameMap.getMobTile(newI, newJ)?.interactionFromPlayer(game, this.id);
        game.gameMap.getObjectTile(newI, newJ)?.interactionFromPlayer(game, this.id, newI, newJ);
        game.gameMap.getTerrainTile(newI, newJ).interactionFromPlayer(game, this.id);

        if(currentPlayer.alive)
        {
          game.gameMap.setMobTile(i, j, null);
          game.gameMap.setMobTile(newI, newJ, new PlayerTile(this.id));
          game.updatePlayerCooldown(this.id);
        }
      }
    }
  }

  kill(game: Game): void {
    game.players.map(player => {if(player.id === this.id) (player.kill())})
    const coords: number[] = game.findPlayerCoordinates(this.id);
    game.gameMap.setMobTile(coords[0], coords[1], null);
  }

  private canPlayerMove(game: Game, i: number, j: number) {
    if (game.gameMap.getTerrainTile(i, j).solid) {
      return false;
    }
    else if (game.gameMap.getMobTile(i, j)?.value == Constants.MOB_PLAYER)
    {
      return false;
    }
    return true;
  }
}
