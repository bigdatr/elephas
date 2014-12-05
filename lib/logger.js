'use strict';
var winston = require('winston');

winston.transports.Kafka = require('winston-kafka-transport');

var logger = new (winston.Logger)({
    levels: {
        info: 1,
        debug: 2,
        warning: 3,
        error: 4,
        success: 4,
        query: 1
    },
    colors: {
        info: 'grey',
        debug: 'yellow',
        warning: 'yellow',
        error: 'red',
        success: 'green',
        query: 'magenta'
    }
});

logger.add(winston.transports.Console, {
    timestamp: true, 
    colorize: 'true',
    // json: true,
    prettyPrint: true,
    
    dumpExceptions: false,
    showStack: false,
    handleExceptions: false
});

module.exports = logger;
