import { MapSetting } from '../static/levels/levelLoading';

export class SpawnSettings
{
    private itemWeights: SpawnWeight[];
    private max: number;

    constructor(settings: MapSetting[])
    {
        this.itemWeights = [];
        var total = 0;
        for(var setting of settings)
        {
            total += setting.value;
            this.itemWeights.push(new SpawnWeight(setting.name, total));
        }

        this.max = total;
    }

    public generateItem(): string
    {
        var random = Math.random() * this.max;

        for(var weight of this.itemWeights)
        {
            if (weight.weight > random)
                return weight.name;
        }
    }
}

class SpawnWeight
{
    public name: string;
    public weight: number;

    constructor(name: string, weight: number)
    {
        this.name = name;
        this.weight = weight;
    }
}