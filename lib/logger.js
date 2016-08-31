var winston = require('winston');

var logger = new (winston.Logger)({
    levels: {
        error: 0,
        query: 1
        failed: 1,
        success: 1,
        warn: 1,
        warning: 1,
        info: 2,
        debug: 3
    },
    colors: {
        info: 'grey',
        debug: 'grey',
        warn: 'yellow',
        warning: 'yellow',
        error: 'red',
        success: 'green',
        failed: 'red',
        query: 'magenta'
    }
});

logger.add(winston.transports.Console, {
    timestamp: true, 
    colorize: true,
    prettyPrint: true
});

module.exports = logger;
