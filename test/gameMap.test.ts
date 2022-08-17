import { Game } from "../objects/game";
import { TestLevels } from "./levels/levels";
import { Constants } from "../constants/constants";
import { TestGameHelper } from "./helper/testGameHelper";

test('Creates game from blank level', () => {
    var mapExport = TestLevels.emptyLevel;

    var game: Game = new Game(mapExport);
    expect(game).not.toBeNull();
});

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

test('Player is stopped by wall', () => {
    var mapExport = TestLevels.emptyLevel;

    var game: Game = new Game(mapExport);

    expect(game).not.toBeNull();

    var id = "any-id-can-go-here";

    game.gameStatus = Constants.GAME_STATUS_PLAYING;
    game.addPlayerToGame(id, "JSON");

    expect(game.players.length).toBe(1);
    expect(game.tiles[4][4].mob.id).toBe(id);

    // Move down 3 tiles
    for(var i = 0; i < 3; i++)
    {
        TestGameHelper.movePlayer(game, id, 2);
        expect(game.tiles[4][5+i].mob.id).toBe(id);
        expect(game.tiles[4][4+i].mob).toBeNull();
        expect(game.players[0].cooldown).toBe(Constants.MOVEMENT_SPEED * 2);
        TestGameHelper.runTicks(game, Constants.MOVEMENT_SPEED * 2);
    }

    // Move down but get blocked by a wall
    TestGameHelper.movePlayer(game, id, 2);
    expect(game.tiles[4][7].mob.id).toBe(id);
    expect(game.tiles[4][8].terrain.value).toBe(Constants.TERRAIN_WALL);

    expect(game.players[0].cooldown).toBeLessThanOrEqual(0);
});