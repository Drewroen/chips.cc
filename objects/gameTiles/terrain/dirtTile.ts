import { BlankTile } from "./blankTile";
import { TerrainTile } from "../../terrainTile";
import { Game } from "objects/game";
import { Constants } from "../../../constants/constants";
import { Coordinates } from '../../coordinates';

export class DirtTile implements TerrainTile {
  value = Constants.TERRAIN_DIRT;
  id = null;

  interactionFromPlayer(game: Game, id: string, coords: Coordinates): void {
    game.setTerrainTile(coords, new BlankTile());
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }

  solid(game: Game, id: string): boolean {
    if (game.findPlayer(id)) return false;
    if (game.findMob(id)) return true;
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    return [];
  }

  getBlockedMobDirections(game: Game, id: string): number[] {
    return [];
  }

  canSpawnMobOnIt(direction: number): boolean {
    return false;
  }
}
