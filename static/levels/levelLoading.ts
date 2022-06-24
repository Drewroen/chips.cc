import { Levels } from './levels';

export class LevelLoading {
    static getChipsLevelData(): MapExport[] {
        var finalLevels: MapExport[] = [];
        for(var level of Levels.LEVELS)
            finalLevels.push(JSON.parse(level.toString()) as MapExport);
        return finalLevels;
    }
  }

export class MapExport {
  public gameMap: TileExport[][];
  public settings: Array<MapSetting>;
}

export class TileExport {
  public terrain: number;
  public mob: number;
  public spawn: number;
}

export class MapSetting
{
  public name: string;
  public value: number;

  constructor(name: string, value: number)
  {
    this.name = name;
    this.value = value;
  }
}