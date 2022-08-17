import { TerrainTile } from "../../terrainTile";
import { Constants } from "../../../constants/constants";
import { Game } from "objects/game";

export class TrapTile implements TerrainTile {
  value = Constants.TERRAIN_TRAP;
  id = null;

  interactionFromPlayer(_game: Game, _id: string): void {
    return;
  }

  interactionFromMob(_game: Game, _id: string): void {
    return;
  }

  solid(game: Game, id: string): boolean {
    if (game.findPlayer(id)) return false;
    if (game.findMob(id)) return false;
    return true;
  }

  getBlockedPlayerDirections(game: Game, _id: string): number[] {
    if (this.trapOpen(game)) return [];
    return [
      Constants.DIRECTION_UP,
      Constants.DIRECTION_RIGHT,
      Constants.DIRECTION_DOWN,
      Constants.DIRECTION_LEFT,
    ];
  }

  getBlockedMobDirections(game: Game, _id: string): number[] {
    if (this.trapOpen(game)) return [];
    return [
      Constants.DIRECTION_UP,
      Constants.DIRECTION_RIGHT,
      Constants.DIRECTION_DOWN,
      Constants.DIRECTION_LEFT,
    ];
  }

  private trapOpen(game: Game): boolean {
    for (let i = 0; i < game.tiles.length; i++)
      for (let j = 0; j < game.tiles[i].length; j++)
        if (
          game.tiles[i][j].terrain.value ===
          Constants.TERRAIN_TRAP_BUTTON &&
          game.tiles[i][j].mob !== null
        )
          return true;

    return false;
  }

  canSpawnMobOnIt(_direction: number): boolean {
    return true;
  }
}
