var _ = require('lodash');
var logger = require('./logger');
var chalk = require('chalk');

var _routes;
function _formatResponseTime(ms) {
    var color = 'gray';

    if (ms >= 500) {
        color = 'red';
    }
    else if (ms >= 300) {
        color = 'magenta';
    }
    else if (ms >= 100) {
        color = 'yellow';
    }

    return chalk[color](ms + 'ms');
}

function log(client, action) {
    const msg = [
        chalk.gray('ACTION'),
        action.type,
        chalk.red('--unkown--' + client.id)
    ].join(' ');

    logger.info(msg);
}

var wsRouter = {
    hasRoutes: function() {
        return _routes ? true : false;
    },
    setActionHandlers: function(routes) {
        _routes = _.reduce(routes, function(prev, next) {
            return _.merge(prev, next);
        });
    },
    route: function(client, action) {
        if (_routes[action.type]) {
            const stream$ = _routes[action.type](client, action);
            log(client, action);
            return stream$;
        }

        logger.warn('Websocket Action not handled', action);
    }
};

module.exports = wsRouter;
