export class GameTile {
    value: number;
    playerId: string;

    constructor(value?: number, playerId?: string) {
        this.playerId = playerId;
        this.value = value || 0;
    }
}
