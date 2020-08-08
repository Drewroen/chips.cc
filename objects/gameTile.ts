import { Game } from './game';

export interface GameTile {
  value: string;
  id: string;
  solid(game: Game, id: string, direction: number): boolean;
  interactionFromPlayer(game: Game, id: string, x: number, y: number): void
  interactionFromMob(game: Game, id: string, x: number, y: number): void
}

