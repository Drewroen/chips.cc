import { GameTile } from "./gameTile";
import { Game } from "./game";
import { Coordinates } from './coordinates';

export interface ObjectTile extends GameTile {
  interactionFromPlayer(game: Game, id: string, coords: Coordinates): void;
  interactionFromMob(game: Game, id: string, coords: Coordinates): void;
  solid(game: Game, id: string, direction: number): boolean;
}
