var Server  = require('./server.js');
var Io      = Server.socketIoServer;

var _spectators = 0;

Io.newSpectator = function(){
    Io.of('/spectators-counter').emit('counter', ++_spectators);
    console.log(_spectators);
};

// PUBLISHING QUEUE
Io.of('/spectators-counter').on('connection', function(socket){
    // When somebody connect to this namespace sending current counter
    socket.emit('counter', _spectators);
});

module.exports = Io;


