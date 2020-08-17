import { GameTile } from './gameTile';
import { Game } from './game';

export interface TerrainTile extends GameTile {
  getBlockedPlayerDirections(game: Game, id: string): number[]
  getBlockedMobDirections(game: Game, id: string): number[]
}
