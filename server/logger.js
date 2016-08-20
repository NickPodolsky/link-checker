var Config          = require('config');
var Winston         = require('winston');
var Logger          = new Winston.Logger({
    level: 'info',
    transports: [
        new (Winston.transports.Console)(),
        new (Winston.transports.File)({ name: 'info-file', filename: Config.get('path.logs') + 'info.log', level: 'info'}),
        new (Winston.transports.File)({ name: 'error-file', filename: Config.get('path.logs') + 'error.log', level: 'error'}),
        new (Winston.transports.File)({ name: 'debug-file', filename: Config.get('path.logs') + 'debug.log', level: 'debug'})
    ]
});

module.exports = Logger;