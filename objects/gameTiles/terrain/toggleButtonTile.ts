import { ToggleWallTile } from "./toggleWallTile";
import { TerrainTile } from "./../../terrainTile";
import { Game } from "objects/game";
import { Constants } from "../../../constants/constants";

export class ToggleButtonTile implements TerrainTile {
  value = Constants.TERRAIN_TOGGLE_BUTTON;
  id = null;

  interactionFromPlayer(game: Game, id: string): void {
    game.gameMap.terrainTiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile instanceof ToggleWallTile) tile.toggleWall();
      });
    });
  }

  interactionFromMob(game: Game, id: string): void {
    game.gameMap.terrainTiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile instanceof ToggleWallTile) tile.toggleWall();
      });
    });
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
