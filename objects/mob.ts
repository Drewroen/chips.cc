export class Mob {
  id: string;
  alive: boolean;

  constructor(id: string) {
      this.id = id;
      this.alive = true;
  }

  kill(): void {
    this.alive = false;
  }
}
