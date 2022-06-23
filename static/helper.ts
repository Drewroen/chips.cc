import { Constants } from '../constants/constants';

export class Helper
{
    static isForceField(value: number): boolean {
        return (
          value === Constants.TERRAIN_FORCE_UP ||
          value === Constants.TERRAIN_FORCE_RIGHT ||
          value === Constants.TERRAIN_FORCE_DOWN ||
          value === Constants.TERRAIN_FORCE_LEFT
        );
      }

    static isRandomForceField(value: number): boolean {
        return value === Constants.TERRAIN_FORCE_RANDOM;
      }
    
    static isIce(value: number): boolean {
        return [
          Constants.TERRAIN_ICE,
          Constants.TERRAIN_ICE_CORNER_DOWN_LEFT,
          Constants.TERRAIN_ICE_CORNER_LEFT_UP,
          Constants.TERRAIN_ICE_CORNER_RIGHT_DOWN,
          Constants.TERRAIN_ICE_CORNER_UP_RIGHT,
        ].includes(value);
      }
}