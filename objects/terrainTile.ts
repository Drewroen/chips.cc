import { GameTile } from './gameTile';
import { GameMap } from './gameMap';
import { Game } from './game';

export interface TerrainTile extends GameTile {
  interactionFromPlayer(game: Game, id: string): void
  interactionFromMob(game: Game, id: string): void
}
