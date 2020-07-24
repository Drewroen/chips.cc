import { GameTile } from './gameTile';
import { GameMap } from './gameMap';
import { Game } from './game';

export interface TerrainTile extends GameTile{
  solid: boolean;

  interactionFromPlayer(game: Game, id: string): void
}
