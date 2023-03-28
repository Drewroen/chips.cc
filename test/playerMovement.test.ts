import { Game } from "../objects/game";
import { TestLevels } from "./levels/levels";
import { Constants } from "../constants/constants";
import { TestGameHelper } from "./helper/testGameHelper";

test('Player can move every direction in level', () => {
    var mapExport = TestLevels.emptyLevel;

    var game: Game = new Game(mapExport);

    expect(game).not.toBeNull();

    var id = "any-id-can-go-here";

    game.gameStatus = Constants.GAME_STATUS_PLAYING;
    game.addPlayerToGame(id, "JSON");

    expect(game.players.length).toBe(1);
    expect(game.tiles[4][4].mob.id).toBe(id);

    // Move up
    TestGameHelper.movePlayer(game, id, 0);
    expect(game.tiles[4][3].mob.id).toBe(id);
    expect(game.tiles[4][4].mob).toBeNull();
    expect(game.players[0].cooldown).toBe(Constants.MOVEMENT_SPEED * 2);
    TestGameHelper.runTicks(game, Constants.MOVEMENT_SPEED * 2);

    // Move down
    TestGameHelper.movePlayer(game, id, 2);
    expect(game.tiles[4][4].mob.id).toBe(id);
    expect(game.tiles[4][3].mob).toBeNull();
    expect(game.players[0].cooldown).toBe(Constants.MOVEMENT_SPEED * 2);
    TestGameHelper.runTicks(game, Constants.MOVEMENT_SPEED * 2);

    // Move right
    TestGameHelper.movePlayer(game, id, 1);
    expect(game.tiles[5][4].mob.id).toBe(id);
    expect(game.tiles[4][4].mob).toBeNull();
    expect(game.players[0].cooldown).toBe(Constants.MOVEMENT_SPEED * 2);
    TestGameHelper.runTicks(game, Constants.MOVEMENT_SPEED * 2);

    // Move left
    TestGameHelper.movePlayer(game, id, 3);
    expect(game.tiles[4][4].mob.id).toBe(id);
    expect(game.tiles[5][4].mob).toBeNull();
    expect(game.players[0].cooldown).toBe(Constants.MOVEMENT_SPEED * 2);
    TestGameHelper.runTicks(game, Constants.MOVEMENT_SPEED * 2);
});