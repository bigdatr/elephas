'use strict';
var winston = require('winston');

// winston.transports.Kafka = require('winston-kafka-transport');

var logger = new (winston.Logger)({
    levels: {
        info: 1,
        debug: 2,
        warning: 3,
        error: 4,
        success: 2,
        failed: 2,
        query: 1
    },
    colors: {
        info: 'grey',
        debug: 'grey',
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
    // json: true,
    prettyPrint: true,
    // formatter: function(options) {
    //     return '(' + process.pid + ') ' + new Date().toISOString() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
    //       (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
    // }
});

module.exports = logger;
