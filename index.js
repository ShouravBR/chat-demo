var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var animals = require('./animals').animals;
var users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var user = animals.splice(Math.floor(Math.random()*animals.length), 1);
  users.push(user);
  console.log(user+" connected!");
  socket.emit('username', {user: user, users: users});
  io.emit('user connect', user);
  socket.on('chat message', function(msg){
    console.log("[chat msg] "+msg.user+": "+msg.text);
    io.emit('chat message', msg);
  });
  socket.on('started writing', function(msg){
    console.log("[+writing] "+msg);
    io.emit('started writing', msg);
  });
  socket.on('stopped writing', function(msg){
    console.log("[-writing] "+msg);
    io.emit('stopped writing', msg);
  });
});

http.listen(port, process.env.IP, function(){
  console.log('listening on *:' + port);
});
