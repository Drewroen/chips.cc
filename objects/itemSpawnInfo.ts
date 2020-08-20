import { Constants } from '../constants/constants';
export class ItemSpawnInfo {
  spawnType: number;
  respawnTime: number;
  currentTime: number;

  constructor(type: number) {
    this.spawnType = type;
    this.respawnTime = (Math.random() * (Constants.SPAWN_MAXIMUM_TIME - Constants.SPAWN_MINIMUM_TIME)) + Constants.SPAWN_MINIMUM_TIME
    this.currentTime = 0;
  }

  resetRespawnTime() {
    this.respawnTime = (Math.random() * (Constants.SPAWN_MAXIMUM_TIME - Constants.SPAWN_MINIMUM_TIME)) + Constants.SPAWN_MINIMUM_TIME
    this.currentTime = 0;
  }
}
