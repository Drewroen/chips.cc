const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const socket = require('socket.io')
const Constants = require('../constants/constants')

// App setup
var server = express()
  .use(express.static(path.join(__dirname, '../public')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

console.log(__dirname);

// Socket setup & pass server
var io = socket(server);

// Create map
var map = new Array(Constants.MAP_SIZE);
for(var i = 0; i < Constants.MAP_SIZE; i++)
{
  map[i] = new Array(Constants.MAP_SIZE);
}

for(var i = 0; i < Constants.MAP_SIZE; i++)
{
  for(var j = 0; j < Constants.MAP_SIZE; j++)
  {
    map[i][j] = { tile: 0 };
  }
}

var playerList = [];

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on('start', function(){
    if(!playerInGame(socket.id))
    {
      var randomX = Math.random() * Constants.MAP_SIZE | 0;
      var randomY = Math.random() * Constants.MAP_SIZE | 0;
      map[randomX][randomY] = { tile: 1, playerId: socket.id };
      playerList.push({id: socket.id, cooldown: 0});
    }
  });

  socket.on('movement', function(data){
    movePlayer(socket.id, data.direction);
  })

  socket.on('disconnect', function(){
    removePlayerFromGame(socket.id)
  });
});

setInterval(updateGame, 1000.0 / Constants.FPS);

function updateGame()
{
  playerList.map(player => player.cooldown--);
  io.sockets.emit('updateGame', { gameMap: map });
}

function playerInGame(id)
{
  var coords = findPlayer(id);
  return coords != null;
}

function removePlayerFromGame(id)
{
  var coords = findPlayer(id);
  if (coords != null)
  {
    var x = coords[0];
    var y = coords[1];
    map[x][y] = { tile: 0 };
  }
}

function movePlayer(id, direction)
{
  var coords = findPlayer(id);
  if(coords != null && playerList.find(player => player.id == id).cooldown <= 0)
  {
    var i = coords[0];
    var j = coords[1];

    var newI = i;
    var newJ = j;
    switch(direction)
    {
      case 'up': newJ--; break;
      case 'down': newJ++; break;
      case 'left': newI--; break;
      case 'right': newI++; break;
      default: break;
    }
    
    if(canMove(newI, newJ))
    {
      map[i][j] = { tile: 0 };
      map[newI][newJ] = { tile: 1, playerId: id };
      updateCooldown(id);
    }
  }
}

function updateCooldown(id)
{
  playerList[playerList.findIndex(player => player.id == id)].cooldown = 30;
}

function findPlayer(id)
{
  for(var i = 0; i < Constants.MAP_SIZE; i++)
  {
    for(var j = 0; j < Constants.MAP_SIZE; j++)
    {
      if (map[i][j].playerId == id)
      {
        return [i, j];
      }
    }
  }
}

function canMove(i, j)
{
  if(i < 0 || i >= Constants.MAP_SIZE || j < 0 || j >= Constants.MAP_SIZE)
  {
    return false
  }
  if(map[i][j].tile != 0)
  {
    return false;
  }
  return true;
}