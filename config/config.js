try {
    var config = require('./dev.js');
    config.mode = "development";
} catch (err){
    var config = require('./prod.js');
    config.mode = "production";
}

module.exports = config;