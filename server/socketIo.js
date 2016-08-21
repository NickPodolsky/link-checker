var Server  = require('./server.js');
var Io      = Server.socketIoServer;

Io.updateProgress = function(taskId, total, item){
    Io.of('/'+taskId).emit('progress', {
       total: total,
       item: item
    });
};
Io.updateStatus = function(taskId, status){
    Io.of('/'+taskId).emit('status', status);
};
Io.sendResult = function(taskId, total, items){
    Io.of('/'+taskId).emit('result', {
        total: total,
        items: items
    });
};

// PUBLISHING QUEUE
Io.of('/init').on('connection', function(socket){
    // When somebody connect to this namespace sending current counter
    socket.emit('counter', 0);
});

module.exports = Io;


