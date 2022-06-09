import { Constants } from "../constants/constants";
export class ItemSpawnInfo {
  spawnType: number;
  respawnTime: number;
  currentTime: number;

  constructor(type: number) {
    this.spawnType = type;
    this.respawnTime =
      Math.random() *
        (Constants.SPAWN_MAXIMUM_TIME - Constants.SPAWN_MINIMUM_TIME) +
      Constants.SPAWN_MINIMUM_TIME;
    this.currentTime = 0;
  }

  resetRespawnTime() {
    const maxSpawnTimeInFrames =
      Constants.SPAWN_MAXIMUM_TIME * Constants.GAME_FPS;
    const minSpawnTimeInFrames =
      Constants.SPAWN_MINIMUM_TIME * Constants.GAME_FPS;

    this.respawnTime =
      Math.random() * (maxSpawnTimeInFrames - minSpawnTimeInFrames) +
      minSpawnTimeInFrames;
    this.currentTime = 0;
  }
}
