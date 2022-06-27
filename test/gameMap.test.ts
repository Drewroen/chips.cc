import { Game } from "../objects/game";
import { TestLevels } from "./levels/levels";
import { TickService } from "../services/tickService";
import { Constants } from "../constants/constants";

test('Creates game from blank level', () => {
    var mapExport = TestLevels.emptyLevel;

    var game: Game = new Game(mapExport);
    expect(game).not.toBeNull();
});

test('Player can move in level', () => {
    var mapExport = TestLevels.emptyLevel;

    var game: Game = new Game(mapExport);

    expect(game).not.toBeNull();

    var id = "any-id-can-go-here";

    game.gameStatus = Constants.GAME_STATUS_PLAYING;
    game.addPlayerToGame(id, "JSON");

    expect(game.players.length).toBe(1);
    expect(game.mobTiles[4][4].id).toBe(id);

    game.addKeypress(id, 0);

    expect(game.mobTiles[4][4].id).toBe(id);

    TickService.tick(game);

    game.removeMovement(id, 0);

    expect(game.mobTiles[4][3].id).toBe(id);
    expect(game.mobTiles[4][4]).toBeNull();
    expect(game.players[0].cooldown).toBe(Constants.MOVEMENT_SPEED * 2);

    for(var i = 0; i < Constants.MOVEMENT_SPEED * 2; i++)
    {
        TickService.tick(game);
    }

    expect(game.players[0].cooldown).toBe(0);
});