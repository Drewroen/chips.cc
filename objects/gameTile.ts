import { GameMap } from 'objects/gameMap';
export interface GameTile {
    value: string;
    id: string;
    solidToPlayers: boolean;
    solidToMobs: boolean;
}

