"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(id) {
        this.cooldown = 0;
        this.id = id;
    }
    incrementCooldown() {
        this.cooldown--;
    }
    resetCoolDown() {
        this.cooldown = 30;
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map