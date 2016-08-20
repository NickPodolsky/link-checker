var Path            = require('path');
var BodyParser      = require('body-parser');
var JsonParser      = BodyParser.json();
var AppConfig       = require('./config/config.js');
var SocketIo        = require('./server/socketIo.js');
var Server          = require('./server/server.js');
var Router          = require('express').Router();
var Mongo           = require('./mongo/mongo.js');
var Controllers     = require('./controllers/controllers.js')(AppConfig, Mongo);

//
// Returning Angular app
//
Router.get('/', function(request, response){
    response.sendFile(Path.join(__dirname, './www/', 'index.html'));
});

//
// Response for check site on broken links
// (with site url in body)
//
Router.post('/check', JsonParser, Controllers.task.run);



Server.run(Router);