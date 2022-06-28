import { Game } from "../../objects/game";
import { TickService } from "../../services/tickService";

export class TestGameHelper
{
    static runTicks(game: Game, ticks: number)
    {
        for(var i = 0; i < ticks; i++)
            TickService.tick(game);
    }

    static movePlayer(game: Game, id: string, direction: number)
    {
        game.addKeypress(id, direction);
        TickService.tick(game);
        game.removeMovement(id, direction);
    }
}