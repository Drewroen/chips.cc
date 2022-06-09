import * as path from "path";
import * as fs from "fs";

export class ChipsDat {
  static getChipsLevelData() {
    return this.processChipsLevels(this.readChipsDat());
  }

  static processChipsLevels(data: string[]) {
    data = data.slice(4); // Magic number in dat file

    const levels: number = this.unsignedWordToInt(data.slice(0, 2)); // Number of levels
    data = data.slice(2);

    const levelData = new Array();

    for (let i = 0; i < levels; i++) {
      const bytesInLevel: number = this.unsignedWordToInt(data.slice(0, 2));
      data = data.slice(2);
      const levelInfo = data.slice(0, bytesInLevel);
      data = data.slice(bytesInLevel);
      levelData.push(levelInfo);
    }
    return levelData;
  }

  static unsignedWordToInt(data: string[]): number {
    return (
      parseInt("0x" + data[0], 16) + parseInt("0x" + data[1], 16) * (16 * 16)
    );
  }

  static readChipsDat(): string[] {
    const directory = path.resolve(__dirname, "../../CHIPS_MMO.dat");
    const map: Buffer = fs.readFileSync(directory);
    return map.toString("hex").match(/../g);
  }
}
