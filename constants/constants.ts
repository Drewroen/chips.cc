export class Constants {
    public static readonly MAP_SIZE = 10;
    public static readonly MAP_VIEW_SIZE = 9;
    public static readonly TILE_SIZE = 32;
    public static readonly FPS = 60;

    public static readonly SOCKET_EVENT_MOVE = 'movement';
    public static readonly SOCKET_EVENT_UPDATE_GAME_MAP = 'updateGame';
    public static readonly SOCKET_EVENT_START = 'start';
    public static readonly SOCKET_EVENT_DISCONNECT = 'disconnect';

    public static readonly KEY_UP_ARROW = 'ArrowUp';
    public static readonly KEY_DOWN_ARROW = 'ArrowDown';
    public static readonly KEY_LEFT_ARROW = 'ArrowLeft';
    public static readonly KEY_RIGHT_ARROW = 'ArrowRight';

    public static readonly MOB_PLAYER = 'PLAYER';
    public static readonly MOB_OPPONENT = 'OPPONENT';
    public static readonly MOB_BALL = 'BALL';

    public static readonly TERRAIN_FLOOR = 'FLOOR';
    public static readonly TERRAIN_WALL = 'WALL';
    public static readonly TERRAIN_WATER = 'WATER';

    public static readonly OBJECT_CHIP = 'CHIP';

    public static readonly MOB_DIRECTION_UP = 0;
    public static readonly MOB_DIRECTION_RIGHT = 1;
    public static readonly MOB_DIRECTION_DOWN = 2;
    public static readonly MOB_DIRECTION_LEFT = 3;

    public static readonly MINIMUM_CHIPS = 12;

    public static readonly MOVEMENT_SPEED = 8;
  }
