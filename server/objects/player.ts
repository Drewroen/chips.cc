export class Player {
    cooldown: number;
    id: string;

    constructor(id: string) {
        this.cooldown = 0;
        this.id = id;
    }

    incrementCooldown(): void {
        this.cooldown--;
    }

    resetCoolDown(): void {
        this.cooldown = 30;
    }
}