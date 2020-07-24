export class Player {
    cooldown: number;
    id: string;
    name: string;
    score: number;
    alive: boolean;

    constructor(id: string, name: string) {
        this.cooldown = 0;
        this.id = id;
        this.name = name;
        this.score = 0;
        this.alive = true;
    }

    incrementCooldown(): void {
      this.cooldown--;
    }

    resetCoolDown(): void {
      this.cooldown = 30;
    }

    incrementScore(): void {
      this.score++;
    }

    kill(): void {
      this.alive = false;
      this.score = Math.floor(this.score * .5);
    }
}
