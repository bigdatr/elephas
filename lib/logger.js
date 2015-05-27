'use strict';
var winston = require('winston');

// winston.transports.Kafka = require('winston-kafka-transport');

var logger = new (winston.Logger)({
    levels: {
        info: 2,
        debug: 1,
        warn: 3,
        warning: 3,
        error: 4,
        success: 3,
        failed: 3,
        query: 2
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
    // level: 'warning',
    // json: true,
    prettyPrint: true,
    // formatter: function(options) {
    //     return '(' + process.pid + ') ' + new Date().toISOString() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
    //       (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
    // }
});

module.exports = logger;
