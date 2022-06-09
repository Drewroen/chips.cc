import { TerrainTile } from "../../terrainTile";
import { Constants } from "../../../constants/constants";
import { Game } from "objects/game";

export class TeleportTile implements TerrainTile {
  value = Constants.TERRAIN_TELEPORT;
  id = null;

  interactionFromPlayer(game: Game, id: string): void {
    return;
  }

  interactionFromMob(game: Game, id: string): void {
    return;
  }

  solid(game: Game, id: string): boolean {
    if (game.findPlayer(id)) return false;
    if (game.findMob(id)) return false;
    return true;
  }

  getBlockedPlayerDirections(game: Game, id: string): number[] {
    return [];
  }

  getBlockedMobDirections(game: Game, id: string): number[] {
    return [];
  }

  canSpawnMobOnIt(direction: number): boolean {
    return true;
  }
}
