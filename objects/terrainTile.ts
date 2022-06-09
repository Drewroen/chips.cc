import { GameTile } from "./gameTile";
import { Game } from "./game";

export interface TerrainTile extends GameTile {
  getBlockedPlayerDirections(game: Game, id: string): number[];
  getBlockedMobDirections(game: Game, id: string): number[];
  canSpawnMobOnIt(direction: number): boolean;
  interactionFromPlayer(game: Game, id: string, x: number, y: number): void;
  interactionFromMob(game: Game, id: string, x: number, y: number): void;
  solid(game: Game, id: string, direction: number): boolean;
}
