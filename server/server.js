var express         = require('express');
var bodyParser      = require('body-parser');
var config          = require('../config/config.js');

var port            = process.env.PORT || config.port;              // App port

var expressApp      = express();
var httpServer      = require('http').createServer(expressApp);     // create http server based on express app
var socketIoServer  = require('socket.io').listen(httpServer);      // soket.io listen same port that http server use

function run(routes){
    expressApp.use('/', routes);
    
    // Run static file server
    expressApp.use(express.static('./www'));
    
    // Sending CORS header
    expressApp.use(function(request, response, next){
        response.header('Access-Control-Allow-Origin', '*'); 
        next();
    });

    
    httpServer.listen(port, function(){console.log('Url checking service running on '+port+' port');});
};

module.exports = {
    run:            run,
    socketIoServer: socketIoServer
}
