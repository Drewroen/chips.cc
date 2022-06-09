export class Mob {
  id: string;
  alive: boolean;
  ownerId: string;

  constructor(id: string, ownerId: string = null) {
    this.id = id;
    this.alive = true;
    this.ownerId = ownerId;
  }

  kill(): void {
    this.alive = false;
  }
}
