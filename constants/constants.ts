export class Constants {
    public static readonly MAP_SIZE = 32;
    public static readonly MAP_VIEW_SIZE = 9;
    public static readonly TILE_SIZE = 32;
    public static readonly FPS = 60;

    public static readonly SOCKET_EVENT_KEYDOWN = 'keydown';
    public static readonly SOCKET_EVENT_KEYUP = 'keyup';
    public static readonly SOCKET_EVENT_UPDATE_GAME_MAP = 'updateGame';
    public static readonly SOCKET_EVENT_START = 'start';
    public static readonly SOCKET_EVENT_DISCONNECT = 'disconnect';

    public static readonly KEY_UP_ARROW = 'ArrowUp';
    public static readonly KEY_DOWN_ARROW = 'ArrowDown';
    public static readonly KEY_LEFT_ARROW = 'ArrowLeft';
    public static readonly KEY_RIGHT_ARROW = 'ArrowRight';

    public static readonly MOB_PLAYER_UP = 'PLAYER_UP';
    public static readonly MOB_PLAYER_RIGHT = 'PLAYER_RIGHT';
    public static readonly MOB_PLAYER_DOWN = 'PLAYER_DOWN';
    public static readonly MOB_PLAYER_LEFT = 'PLAYER_LEFT';
    public static readonly MOB_OPPONENT_UP = 'OPPONENT_UP';
    public static readonly MOB_OPPONENT_RIGHT = 'OPPONENT_RIGHT';
    public static readonly MOB_OPPONENT_DOWN = 'OPPONENT_DOWN';
    public static readonly MOB_OPPONENT_LEFT = 'OPPONENT_LEFT';
    public static readonly MOB_BALL = 'BALL';
    public static readonly MOB_FIREBALL = 'FIREBALL';
    public static readonly MOB_GLIDER_UP = 'GLIDER_UP';
    public static readonly MOB_GLIDER_RIGHT = 'GLIDER_RIGHT';
    public static readonly MOB_GLIDER_DOWN = 'GLIDER_DOWN';
    public static readonly MOB_GLIDER_LEFT = 'GLIDER_LEFT';
    public static readonly MOB_WALKER_UP_DOWN = 'WALKER_UP_DOWN';
    public static readonly MOB_WALKER_LEFT_RIGHT = 'WALKER_LEFT_RIGHT';
    public static readonly MOB_PAREMECIUM_UP_DOWN = 'PAREMECIUM_UP_DOWN';
    public static readonly MOB_PAREMECIUM_LEFT_RIGHT = 'PAREMECIUM_LEFT_RIGHT';
    public static readonly MOB_BUG_UP = 'BUG_UP';
    public static readonly MOB_BUG_RIGHT = 'BUG_RIGHT';
    public static readonly MOB_BUG_DOWN = 'BUG_DOWN';
    public static readonly MOB_BUG_LEFT = 'BUG_LEFT';
    public static readonly MOB_BLOB = 'BLOB';
    public static readonly MOB_TEETH_UP = 'TEETH_UP';
    public static readonly MOB_TEETH_RIGHT = 'TEETH_RIGHT';
    public static readonly MOB_TEETH_DOWN = 'TEETH_DOWN';
    public static readonly MOB_TEETH_LEFT = 'TEETH_LEFT';

    public static readonly TERRAIN_FLOOR = 'FLOOR';
    public static readonly TERRAIN_WALL = 'WALL';
    public static readonly TERRAIN_WATER = 'WATER';
    public static readonly TERRAIN_FINISH = 'FINISH';
    public static readonly TERRAIN_SOCKET = 'SOCKET';
    public static readonly TERRAIN_FORCE_UP = 'FORCE_UP';
    public static readonly TERRAIN_FORCE_RIGHT = 'FORCE_RIGHT';
    public static readonly TERRAIN_FORCE_DOWN = 'FORCE_DOWN';
    public static readonly TERRAIN_FORCE_LEFT = 'FORCE_LEFT';
    public static readonly TERRAIN_FORCE_RANDOM = 'FORCE_RANDOM';
    public static readonly TERRAIN_ICE = 'ICE';
    public static readonly TERRAIN_TOGGLE_WALL_OPEN = 'TOGGLE_WALL_OPEN';
    public static readonly TERRAIN_TOGGLE_WALL_CLOSED = 'TOGGLE_WALL_CLOSED';
    public static readonly TERRAIN_TOGGLE_BUTTON = 'TOGGLE_BUTTON';
    public static readonly TERRAIN_BLUE_WALL_REAL = 'BLUE_WALL_REAL';
    public static readonly TERRAIN_BLUE_WALL_FAKE = 'BLUE_WALL_FAKE';
    public static readonly TERRAIN_FIRE = 'FIRE';

    public static readonly OBJECT_CHIP = 'CHIP';

    public static readonly DIRECTION_UP = 0;
    public static readonly DIRECTION_RIGHT = 1;
    public static readonly DIRECTION_DOWN = 2;
    public static readonly DIRECTION_LEFT = 3;
    public static readonly DIRECTION_RANDOM = 4;

    public static readonly MINIMUM_CHIPS = 0;

    public static readonly MOVEMENT_SPEED = 8;

    public static readonly GAME_STATUS_NOT_STARTED = 0;
    public static readonly GAME_STATUS_PLAYING = 1;
    public static readonly GAME_STATUS_FINISHED = 2;

    public static readonly START_AND_FINISH_TIMER = 60;

    public static readonly REQUIRED_CHIPS_TO_WIN = 5;

    public static readonly MOVE_TYPE_PLAYER = 0;
    public static readonly MOVE_TYPE_AUTOMATIC = 1;
  }
