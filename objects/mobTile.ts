import { GameTile } from './gameTile';
import { Game } from './game';

export interface MobTile extends GameTile{
  direction: number;
  speed: number;

  move(game: Game): void;
  kill(game: Game): void;
}
