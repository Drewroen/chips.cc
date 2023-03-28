import { Game } from "../objects/game";
import { TestLevels } from "./levels/levels";

test('Creates game from blank level', () => {
    var mapExport = TestLevels.emptyLevel;

    var game: Game = new Game(mapExport);
    expect(game).not.toBeNull();
});