var winston = require('winston');

var levels = {
    // NPM style levels
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5,

    // Custom
    query: 1,
    failed: 1,
    success: 1,
    warning: 1
}

var colors = {
    info: 'grey',
    debug: 'grey',
    warn: 'yellow',
    warning: 'yellow',
    error: 'red',
    success: 'green',
    failed: 'red',
    query: 'magenta'
}

var logger = new (winston.Logger)({
    levels: levels,
    colors: colors
});

logger.add(winston.transports.Console, {
    timestamp: true, 
    colorize: true,
    prettyPrint: true
});

module.exports = logger;
