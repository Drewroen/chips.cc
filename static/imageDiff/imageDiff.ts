export class ImageDiff {
    static processTerrainChanges(oldTerrainImage: string, newTerrainImage: string) {
        let newCoordinates = '';

        const oldTerrainObject = oldTerrainImage ? JSON.parse(oldTerrainImage) : '';
        const newTerrainObject = JSON.parse(newTerrainImage);

        for (let i = 0; i < newTerrainObject.length; i++)
            for (let j = 0; j < newTerrainObject[i].length; j++)
                if (!oldTerrainObject || (oldTerrainObject[i][j] !== newTerrainObject[i][j]))
                    newCoordinates += i + ':' + j + ':' + newTerrainObject[i][j] + ';';

        return newCoordinates;
    }

    static processObjectChanges(oldObjectImage: string, newObjectImage: string) {
        let newCoordinates = '';

        const oldObjectObject = oldObjectImage ? JSON.parse(oldObjectImage) : '';
        const newObjectObject = JSON.parse(newObjectImage);

        for (let i = 0; i < newObjectObject.length; i++)
            for (let j = 0; j < newObjectObject[i].length; j++)
                if (!oldObjectObject || (oldObjectObject[i][j] !== newObjectObject[i][j]))
                    newCoordinates += i + ':' + j + ':' + newObjectObject[i][j] + ';';
        return newCoordinates;
    }

    static processMobChanges(oldMobImage: string, newMobImage: string) {
        let newCoordinates = '';

        const oldMobObject = oldMobImage ? JSON.parse(oldMobImage) : '';
        const newMobObject = JSON.parse(newMobImage);

        for (let i = 0; i < newMobObject.length; i++)
            for (let j = 0; j < newMobObject[i].length; j++)
                if (!oldMobObject || (oldMobObject[i][j] !== newMobObject[i][j]))
                    if (newMobObject[i][j] === 0)
                        newCoordinates += i + ':' + j + ':' + 0 + ';';
                    else
                        newCoordinates += i + ':'
                            + j + ':'
                            + newMobObject[i][j].id + ':'
                            + newMobObject[i][j].value + ':'
                            + newMobObject[i][j].owner + ';';
        return newCoordinates;
    }
}