var Mongo           = require('mongoose');
var Bluebird        = require('bluebird');
var Config          = require('../config/config.js');

Mongo.Promise = Bluebird;
Mongo.connect(Config.db.mongoConnection);

var models = {
    task: Mongo.model('task', require('./schemas/task.js'))
};

module.exports = models;