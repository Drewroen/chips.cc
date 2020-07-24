import { Constants } from './../../constants/constants';
import { GameTile } from '../gameTile';

export class ChipTile implements GameTile {
  value = Constants.OBJECT_CHIP;
  id = null;
  solid = false;
}
