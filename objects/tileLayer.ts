import { TerrainTile } from "./terrainTile";
import { ObjectTile } from "./objectTile";
import { MobTile } from "./mobTile";
export class TileLayer {
  public mob: MobTile;
  public object: ObjectTile;
  public terrain: TerrainTile;

  constructor(mob: MobTile, object: ObjectTile, terrain: TerrainTile) {
    this.mob = mob;
    this.object = object;
    this.terrain = terrain;
  }
}
