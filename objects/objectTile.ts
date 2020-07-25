import { GameTile } from './gameTile';
import { Game } from './game';

export interface ObjectTile extends GameTile{
  interactionFromPlayer(game: Game, id: string, x: number, y: number): void
  interactionFromMob(game: Game, id: string, x: number, y: number): void
}
