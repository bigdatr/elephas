var _ = require('lodash');
var logger = require('./logger');

var _routes;

function log(client, action, stream$) {
    

    return stream$;
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
            return log(client, action, stream$);
        }

        logger.warn('Websocket Action not handled', action);
    }
};

module.exports = wsRouter;