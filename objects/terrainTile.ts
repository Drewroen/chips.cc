import { GameTile } from "./gameTile";
import { Game } from "./game";
import { Coordinates } from './coordinates';

export interface TerrainTile extends GameTile {
  getBlockedPlayerDirections(game: Game, id: string): number[];
  getBlockedMobDirections(game: Game, id: string): number[];
  canSpawnMobOnIt(direction: number): boolean;
  interactionFromPlayer(game: Game, id: string, coords: Coordinates): void;
  interactionFromMob(game: Game, id: string, coords: Coordinates): void;
  solid(game: Game, id: string, direction: number): boolean;
}
