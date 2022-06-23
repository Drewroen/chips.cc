import { Constants } from '../constants/constants';

export class Timer
{
    public remaining: number;

    constructor()
    {
        this.remaining = Constants.START_TIMER;
    }

    public tick(): void
    {
        this.remaining--;
    }

    public restart(type: Number): void
    {
        switch (type)
        {
            case Constants.GAME_STATUS_NOT_STARTED: this.remaining = Constants.START_TIMER; break;
            case Constants.GAME_STATUS_PLAYING: this.remaining = Constants.GAMEPLAY_TIMER; break;
            case Constants.GAME_STATUS_FINISHED: this.remaining = Constants.FINISH_TIMER; break;
        }
    }
}