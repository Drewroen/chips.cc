// Make connection
let socket = io.connect();

let map = document.getElementById('map');
let two = new Two();
two.appendTo(map);

let textures = [
    new Two.Texture('./assets/CC_TILE_0_EMPTY.png'),
    new Two.Texture('./assets/CC_TILE_1_CHIP.png'),
    new Two.Texture('./assets/CC_TILE_2_CHIP.png'),
];

let gameMapGraphic = new Array(MAP_SIZE);
let gameMapValues = new Array(MAP_SIZE);
for(let i = 0; i < MAP_SIZE; i++)
{
    gameMapGraphic[i] = new Array(MAP_SIZE);
    gameMapValues[i] = new Array(MAP_SIZE);
}

initializeMap();

function initializeMap(){
    for(let i = 0; i < MAP_SIZE; i++)
    {
        for(let j = 0; j < MAP_SIZE; j++)
        {
            gameMapGraphic[i][j] = two.makeRectangle((TILE_SIZE / 2) + (TILE_SIZE * i), (TILE_SIZE / 2) + (TILE_SIZE * j), TILE_SIZE, TILE_SIZE);
            gameMapGraphic[i][j].noStroke();
            gameMapValues[i][j] = -1;
        }
    }
}

function updateMap(map){
    var tiles = map.tiles;

    for(let i = 0; i < MAP_SIZE; i++)
    {
        for(let j = 0; j < MAP_SIZE; j++)
        {
            let tileGraphic = 0;

            let tileInfo = tiles[i][j];
            if (tileInfo.playerId != null)
            {
                if (tileInfo.playerId == socket.id)
                {
                    tileGraphic = 1;
                }
                else
                {
                    tileGraphic = 2;
                }
            }
            else
            {
                tileGraphic = tileInfo.value;
            }
            
            if(tileGraphic != gameMapValues[i][j])
            {
                gameMapGraphic[i][j].fill = textures[tileGraphic];
                gameMapValues[i][j] = tileGraphic;
            }
        }
    }
}

two.bind("update", function(frameCount){});

two.play();

socket.on('updateGame', function(data){
    updateMap(data.gameMap);
});

btn = document.getElementById('play');

btn.addEventListener('click', function(){
    socket.emit('start', {});
})