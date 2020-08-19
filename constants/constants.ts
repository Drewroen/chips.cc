export class Constants {
    public static readonly MAP_SIZE = 32;
    public static readonly MAP_VIEW_SIZE = 9;
    public static readonly TILE_SIZE = 32;
    public static readonly FPS = 60;

    public static readonly INVENTORY_PIXELS = 192;
    public static readonly INVENTORY_TILES_X = 320;
    public static readonly INVENTORY_TILES_Y = 208;

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
    public static readonly MOB_TANK_UP = 'TANK_UP';
    public static readonly MOB_TANK_RIGHT = 'TANK_RIGHT';
    public static readonly MOB_TANK_DOWN = 'TANK_DOWN';
    public static readonly MOB_TANK_LEFT = 'TANK_LEFT';
    public static readonly MOB_BLOCK = 'BLOCK';
    public static readonly MOB_PLAYER_UP_SWIM = 'PLAYER_UP_SWIM';
    public static readonly MOB_PLAYER_RIGHT_SWIM = 'PLAYER_RIGHT_SWIM';
    public static readonly MOB_PLAYER_DOWN_SWIM = 'PLAYER_DOWN_SWIM';
    public static readonly MOB_PLAYER_LEFT_SWIM = 'PLAYER_LEFT_SWIM';
    public static readonly MOB_OPPONENT_UP_SWIM = 'OPPONENT_UP_SWIM';
    public static readonly MOB_OPPONENT_RIGHT_SWIM = 'OPPONENT_RIGHT_SWIM';
    public static readonly MOB_OPPONENT_DOWN_SWIM = 'OPPONENT_DOWN_SWIM';
    public static readonly MOB_OPPONENT_LEFT_SWIM = 'OPPONENT_LEFT_SWIM';

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
    public static readonly TERRAIN_ICE_CORNER_LEFT_UP = 'ICE_LEFT_UP';
    public static readonly TERRAIN_ICE_CORNER_DOWN_LEFT = 'ICE_DOWN_LEFT';
    public static readonly TERRAIN_ICE_CORNER_RIGHT_DOWN = 'ICE_RIGHT_DOWN';
    public static readonly TERRAIN_ICE_CORNER_UP_RIGHT = 'ICE_UP_RIGHT';
    public static readonly TERRAIN_TOGGLE_WALL_OPEN = 'TOGGLE_WALL_OPEN';
    public static readonly TERRAIN_TOGGLE_WALL_CLOSED = 'TOGGLE_WALL_CLOSED';
    public static readonly TERRAIN_TOGGLE_BUTTON = 'TOGGLE_BUTTON';
    public static readonly TERRAIN_BLUE_WALL_REAL = 'BLUE_WALL_REAL';
    public static readonly TERRAIN_BLUE_WALL_FAKE = 'BLUE_WALL_FAKE';
    public static readonly TERRAIN_FIRE = 'FIRE';
    public static readonly TERRAIN_THIN_WALL_UP = 'THIN_WALL_UP';
    public static readonly TERRAIN_THIN_WALL_LEFT = 'THIN_WALL_LEFT';
    public static readonly TERRAIN_THIN_WALL_DOWN = 'THIN_WALL_DOWN';
    public static readonly TERRAIN_THIN_WALL_RIGHT = 'THIN_WALL_RIGHT';
    public static readonly TERRAIN_THIN_WALL_DOWN_RIGHT = 'THIN_WALL_DOWN_RIGHT';
    public static readonly TERRAIN_CELL_BLOCK = 'CELL_BLOCK';
    public static readonly TERRAIN_GRAVEL = 'GRAVEL';
    public static readonly TERRAIN_DIRT = 'DIRT';
    public static readonly TERRAIN_TANK_TOGGLE_BUTTON = 'TANK_TOGGLE_BUTTON';
    public static readonly TERRAIN_RED_KEY_DOOR = 'RED_KEY_DOOR';
    public static readonly TERRAIN_YELLOW_KEY_DOOR = 'YELLOW_KEY_DOOR';
    public static readonly TERRAIN_BLUE_KEY_DOOR = 'BLUE_KEY_DOOR';
    public static readonly TERRAIN_GREEN_KEY_DOOR = 'GREEN_KEY_DOOR';
    public static readonly TERRAIN_THIEF = 'THIEF';
    public static readonly TERRAIN_TRAP = 'TRAP';
    public static readonly TERRAIN_TRAP_BUTTON = 'TRAP_BUTTON';
    public static readonly TERRAIN_TELEPORT = 'TELEPORT';
    public static readonly TERRAIN_CLONE_MACHINE = 'CLONE_MACHINE';
    public static readonly TERRAIN_CLONE_BUTTON = 'CLONE_BUTTON';

    public static readonly OBJECT_CHIP = 'CHIP';
    public static readonly OBJECT_BOMB = 'BOMB';
    public static readonly OBJECT_RED_KEY = 'RED_KEY';
    public static readonly OBJECT_YELLOW_KEY = 'YELLOW_KEY';
    public static readonly OBJECT_BLUE_KEY = 'BLUE_KEY';
    public static readonly OBJECT_GREEN_KEY = 'GREEN_KEY';
    public static readonly OBJECT_FLIPPERS = 'FLIPPERS';
    public static readonly OBJECT_FIRE_BOOTS = 'FIRE_BOOTS';
    public static readonly OBJECT_ICE_SKATES = 'ICE_SKATES';
    public static readonly OBJECT_SUCTION_BOOTS = 'SUCTION_BOOTS';

    public static readonly SPAWN_PLAYER = 'SPAWN_PLAYER';
    public static readonly SPAWN_CHIP = 'SPAWN_CHIP';
    public static readonly SPAWN_RED_KEY = 'SPAWN_RED_KEY';
    public static readonly SPAWN_BLUE_KEY = 'SPAWN_BLUE_KEY';
    public static readonly SPAWN_GREEN_KEY = 'SPAWN_GREEN_KEY';
    public static readonly SPAWN_YELLOW_KEY = 'SPAWN_YELLOW_KEY';
    public static readonly SPAWN_FLIPPERS = 'SPAWN_FLIPPERS';
    public static readonly SPAWN_FIRE_BOOTS = 'SPAWN_FIRE_BOOTS';
    public static readonly SPAWN_SUCTION_BOOTS = 'SPAWN_SUCTION_BOOTS';
    public static readonly SPAWN_ICE_SKATES = 'SPAWN_ICE_SKATES';

    public static readonly SPAWN_MINIMUM_TIME = 600;
    public static readonly SPAWN_MAXIMUM_TIME = 1200;

    public static readonly DIRECTION_UP = 0;
    public static readonly DIRECTION_RIGHT = 1;
    public static readonly DIRECTION_DOWN = 2;
    public static readonly DIRECTION_LEFT = 3;
    public static readonly DIRECTION_RANDOM = 4;

    public static readonly MINIMUM_CHIPS = 10;

    public static readonly MOVEMENT_SPEED = 8;

    public static readonly GAME_STATUS_NOT_STARTED = 0;
    public static readonly GAME_STATUS_PLAYING = 1;
    public static readonly GAME_STATUS_FINISHED = 2;

    public static readonly START_AND_FINISH_TIMER = 600;

    public static readonly REQUIRED_CHIPS_TO_WIN = 50;

    public static readonly MOVE_TYPE_PLAYER = 0;
    public static readonly MOVE_TYPE_AUTOMATIC = 1;
  }
