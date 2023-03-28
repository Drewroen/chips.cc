import { Game } from "../objects/game";
import { TestLevels } from "./levels/levels";
import { Constants } from "../constants/constants";
import { TestGameHelper } from "./helper/testGameHelper";

test('Player is stopped by wall when going each direction', () => {
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
        TestGameHelper.movePlayer(game, id, Constants.DIRECTION_DOWN);
        expect(game.tiles[4][5+i].mob.id).toBe(id);
        expect(game.tiles[4][4+i].mob).toBeNull();
        expect(game.players[0].cooldown).toBe(Constants.MOVEMENT_SPEED * 2);
        TestGameHelper.runTicks(game, Constants.MOVEMENT_SPEED * 2);
    }

    // Move down but get blocked by a wall
    TestGameHelper.movePlayer(game, id, Constants.DIRECTION_DOWN);
    expect(game.tiles[4][7].mob.id).toBe(id);
    expect(game.tiles[4][8].terrain.value).toBe(Constants.TERRAIN_WALL);

    expect(game.players[0].cooldown).toBeLessThanOrEqual(0);

    // Move left 3 tiles
    for(var i = 0; i < 3; i++)
    {
        TestGameHelper.movePlayer(game, id, Constants.DIRECTION_LEFT);
        expect(game.tiles[3-i][7].mob.id).toBe(id);
        expect(game.tiles[4-i][7].mob).toBeNull();
        expect(game.players[0].cooldown).toBe(Constants.MOVEMENT_SPEED * 2);
        TestGameHelper.runTicks(game, Constants.MOVEMENT_SPEED * 2);
    }

    // Move left but get blocked by a wall
    TestGameHelper.movePlayer(game, id, Constants.DIRECTION_LEFT);
    expect(game.tiles[1][7].mob.id).toBe(id);
    expect(game.tiles[0][7].terrain.value).toBe(Constants.TERRAIN_WALL);

    expect(game.players[0].cooldown).toBeLessThanOrEqual(0);
});