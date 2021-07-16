export class Constants {
    public static readonly MAP_SIZE = 32;
    public static readonly MAP_VIEW_SIZE = 9;
    public static readonly TILE_SIZE = 32;
    public static readonly GAME_FPS = 20;
    public static readonly MOVEMENT_SPEED = 2;

    public static readonly SPAWN_MINIMUM_TIME = 12;
    public static readonly SPAWN_MAXIMUM_TIME = 24;


    public static readonly GAME_LOBBY_MAX_SIZE = 16;

    public static readonly INVENTORY_PIXELS = 192;
    public static readonly INVENTORY_TILES_X = 320;
    public static readonly INVENTORY_TILES_Y = 208;

    public static readonly SOCKET_EVENT_KEYDOWN = 'keydown';
    public static readonly SOCKET_EVENT_KEYUP = 'keyup';
    public static readonly SOCKET_EVENT_UPDATE_GAME_MAP_FULL = 'updateGameFull';
    public static readonly SOCKET_EVENT_UPDATE_GAME_MAP_DELTA = 'updateGameDelta';
    public static readonly SOCKET_EVENT_UPDATE_ROOM_COUNTS = 'updateRoomCounts';
    public static readonly SOCKET_EVENT_UPDATE_CURRENT_ROOM = 'updateCurrentRoom';
    public static readonly SOCKET_EVENT_START = 'start';
    public static readonly SOCKET_EVENT_DISCONNECT = 'disconnect';
    public static readonly SOCKET_EVENT_JOIN_ROOM = 'joinroom';
    public static readonly SOCKET_EVENT_LOGIN = 'login';
    public static readonly SOCKET_EVENT_LOGOUT = 'logout';
    public static readonly SOCKET_EVENT_MULTILOGIN = 'multiplelogins';
    public static readonly SOCKET_EVENT_UPDATE_ELO = 'sendNewElos';

    public static readonly KEY_UP_ARROW = 'ArrowUp';
    public static readonly KEY_DOWN_ARROW = 'ArrowDown';
    public static readonly KEY_LEFT_ARROW = 'ArrowLeft';
    public static readonly KEY_RIGHT_ARROW = 'ArrowRight';
    public static readonly KEY_ENTER = 'Enter';
    public static readonly KEY_THROW_BOWLING_BALL = 'q';

    public static readonly TERRAIN_FLOOR = 0;
    public static readonly TERRAIN_WALL = 1;
    public static readonly TERRAIN_WATER = 2;
    public static readonly TERRAIN_FINISH = 3;
    public static readonly TERRAIN_SOCKET = 4;
    public static readonly TERRAIN_FORCE_UP = 5;
    public static readonly TERRAIN_FORCE_RIGHT = 6;
    public static readonly TERRAIN_FORCE_DOWN = 7;
    public static readonly TERRAIN_FORCE_LEFT = 8;
    public static readonly TERRAIN_FORCE_RANDOM = 9;
    public static readonly TERRAIN_ICE = 10;
    public static readonly TERRAIN_ICE_CORNER_LEFT_UP = 11;
    public static readonly TERRAIN_ICE_CORNER_DOWN_LEFT = 12;
    public static readonly TERRAIN_ICE_CORNER_RIGHT_DOWN = 13;
    public static readonly TERRAIN_ICE_CORNER_UP_RIGHT = 14;
    public static readonly TERRAIN_TOGGLE_WALL_OPEN = 15;
    public static readonly TERRAIN_TOGGLE_WALL_CLOSED = 16;
    public static readonly TERRAIN_TOGGLE_BUTTON = 17;
    public static readonly TERRAIN_BLUE_WALL_REAL = 18;
    public static readonly TERRAIN_BLUE_WALL_FAKE = 19;
    public static readonly TERRAIN_FIRE = 20;
    public static readonly TERRAIN_THIN_WALL_UP = 21;
    public static readonly TERRAIN_THIN_WALL_LEFT = 22;
    public static readonly TERRAIN_THIN_WALL_DOWN = 23;
    public static readonly TERRAIN_THIN_WALL_RIGHT = 24;
    public static readonly TERRAIN_THIN_WALL_DOWN_RIGHT = 25;
    public static readonly TERRAIN_CELL_BLOCK = 26;
    public static readonly TERRAIN_GRAVEL = 27;
    public static readonly TERRAIN_DIRT = 28;
    public static readonly TERRAIN_TANK_TOGGLE_BUTTON = 29;
    public static readonly TERRAIN_RED_KEY_DOOR = 30;
    public static readonly TERRAIN_YELLOW_KEY_DOOR = 31;
    public static readonly TERRAIN_BLUE_KEY_DOOR = 32;
    public static readonly TERRAIN_GREEN_KEY_DOOR = 33;
    public static readonly TERRAIN_THIEF = 34;
    public static readonly TERRAIN_TRAP = 35;
    public static readonly TERRAIN_TRAP_BUTTON = 36;
    public static readonly TERRAIN_TELEPORT = 37;
    public static readonly TERRAIN_CLONE_MACHINE = 38;
    public static readonly TERRAIN_CLONE_BUTTON = 39;

    public static readonly OBJECT_CHIP = 40;
    public static readonly OBJECT_BOMB = 41;
    public static readonly OBJECT_RED_KEY = 42;
    public static readonly OBJECT_YELLOW_KEY = 43;
    public static readonly OBJECT_BLUE_KEY = 44;
    public static readonly OBJECT_GREEN_KEY = 45;
    public static readonly OBJECT_FLIPPERS = 46;
    public static readonly OBJECT_FIRE_BOOTS = 47;
    public static readonly OBJECT_ICE_SKATES = 48;
    public static readonly OBJECT_SUCTION_BOOTS = 49;

    public static readonly SPAWN_PLAYER = 50;
    public static readonly SPAWN_CHIP = 51;
    public static readonly SPAWN_RED_KEY = 52;
    public static readonly SPAWN_BLUE_KEY = 53;
    public static readonly SPAWN_GREEN_KEY = 54;
    public static readonly SPAWN_YELLOW_KEY = 55;
    public static readonly SPAWN_FLIPPERS = 56;
    public static readonly SPAWN_FIRE_BOOTS = 57;
    public static readonly SPAWN_SUCTION_BOOTS = 58;
    public static readonly SPAWN_ICE_SKATES = 59;

    public static readonly MOB_PLAYER_UP = 60;
    public static readonly MOB_PLAYER_RIGHT = 61;
    public static readonly MOB_PLAYER_DOWN = 62;
    public static readonly MOB_PLAYER_LEFT = 63;
    public static readonly MOB_OPPONENT_UP = 64;
    public static readonly MOB_OPPONENT_RIGHT = 65;
    public static readonly MOB_OPPONENT_DOWN = 66;
    public static readonly MOB_OPPONENT_LEFT = 67;
    public static readonly MOB_BALL = 68;
    public static readonly MOB_FIREBALL = 69;
    public static readonly MOB_GLIDER_UP = 70;
    public static readonly MOB_GLIDER_RIGHT = 71;
    public static readonly MOB_GLIDER_DOWN = 72;
    public static readonly MOB_GLIDER_LEFT = 73;
    public static readonly MOB_WALKER_UP_DOWN = 74;
    public static readonly MOB_WALKER_LEFT_RIGHT = 75;
    public static readonly MOB_PAREMECIUM_UP_DOWN = 76;
    public static readonly MOB_PAREMECIUM_LEFT_RIGHT = 77;
    public static readonly MOB_BUG_UP = 78;
    public static readonly MOB_BUG_RIGHT = 79;
    public static readonly MOB_BUG_DOWN = 80;
    public static readonly MOB_BUG_LEFT = 81;
    public static readonly MOB_BLOB = 82;
    public static readonly MOB_TEETH_UP = 83;
    public static readonly MOB_TEETH_RIGHT = 84;
    public static readonly MOB_TEETH_DOWN = 85;
    public static readonly MOB_TEETH_LEFT = 86;
    public static readonly MOB_TANK_UP = 87;
    public static readonly MOB_TANK_RIGHT = 88;
    public static readonly MOB_TANK_DOWN = 89;
    public static readonly MOB_TANK_LEFT = 90;
    public static readonly MOB_BLOCK = 91;
    public static readonly MOB_PLAYER_UP_SWIM = 92;
    public static readonly MOB_PLAYER_RIGHT_SWIM = 93;
    public static readonly MOB_PLAYER_DOWN_SWIM = 94;
    public static readonly MOB_PLAYER_LEFT_SWIM = 95;
    public static readonly MOB_OPPONENT_UP_SWIM = 96;
    public static readonly MOB_OPPONENT_RIGHT_SWIM = 97;
    public static readonly MOB_OPPONENT_DOWN_SWIM = 98;
    public static readonly MOB_OPPONENT_LEFT_SWIM = 99;

    public static readonly OBJECT_BOWLING_BALL = 100;
    public static readonly MOB_BOWLING_BALL = 101;
    public static readonly SPAWN_BOWLING_BALL = 102;

    public static readonly MOB_BLOCK_BROKEN = 103;

    public static readonly OBJECT_WHISTLE = 104;
    public static readonly SPAWN_WHISTLE = 105;
    public static readonly MOB_BLOCK_BROKEN_2 = 106;
    public static readonly MOB_BLOCK_BROKEN_3 = 107;

    public static readonly DIRECTION_UP = 0;
    public static readonly DIRECTION_RIGHT = 1;
    public static readonly DIRECTION_DOWN = 2;
    public static readonly DIRECTION_LEFT = 3;
    public static readonly DIRECTION_RANDOM = 4;
    public static readonly THROW_BOWLING_BALL = 5;
    public static readonly CALL_WHISTLE = 6;

    public static readonly MINIMUM_CHIPS = 10;

    public static readonly GAME_STATUS_NOT_STARTED = 0;
    public static readonly GAME_STATUS_PLAYING = 1;
    public static readonly GAME_STATUS_FINISHED = 2;

    public static readonly START_AND_FINISH_TIMER = Constants.GAME_FPS * 10;
    public static readonly GAMEPLAY_TIMER = Constants.GAME_FPS * 60 * 3;

    public static readonly REQUIRED_CHIPS_TO_WIN = 5;

    public static readonly DEATH_CHIP_MULTIPLIER = .6;

    public static readonly MOVE_TYPE_PLAYER = 0;
    public static readonly MOVE_TYPE_AUTOMATIC = 1;

    public static readonly ELO_MAX_RATING_CHANGE = 20;
    public static readonly ELO_MIN_RATING_CHANGE = 3;
  }
