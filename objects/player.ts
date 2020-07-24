export class Player {
    cooldown: number;
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.cooldown = 0;
        this.id = id;
        this.name = name;
    }

    incrementCooldown(): void {
        this.cooldown--;
    }

    resetCoolDown(): void {
        this.cooldown = 30;
    }
}
