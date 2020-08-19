import { Constants } from '../constants/constants';
export class ItemSpawnInfo {
  spawnType: string;
  respawnTime: number;
  currentTime: number;

  constructor(type: string) {
    this.spawnType = type;
    this.respawnTime = (Math.random() * (Constants.SPAWN_MAXIMUM_TIME - Constants.SPAWN_MINIMUM_TIME)) + Constants.SPAWN_MINIMUM_TIME
    this.currentTime = 0;
  }

  resetRespawnTime() {
    this.respawnTime = (Math.random() * (Constants.SPAWN_MAXIMUM_TIME - Constants.SPAWN_MINIMUM_TIME)) + Constants.SPAWN_MINIMUM_TIME
    this.currentTime = 0;
  }
}
