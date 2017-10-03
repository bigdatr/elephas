'use strict';

var logger = require('./logger');
var chalk = require('chalk');

function log(client, action) {
    var msg = [chalk.gray('DISPATCH'), action.type, chalk.red('--unkown--' + client.id)].join(' ');

    logger.info(msg);
}

var clientSocket = function clientSocket(spark) {
    return {
        id: spark.id,
        on: function on(e, cb) {
            spark.on(e, cb);
        },
        dispatch: function dispatch(action) {
            spark.write(action);
            log(this, action);
        }
    };
};

module.exports = clientSocket;