import _ from 'lodash';
import logger from './logger';

var _routes;

var wsRouter = {
    hasRoutes: function() {
        return _routes ? true : false;
    },
    setRoutes: function(routes) {
        _routes = _.reduce(routes, (prev, next) => {
            return _.merge(prev, next);
        });
    },
    route: function(client, action) {
        if (_routes[action.type]) {
            return _routes[action.type](client, action);
        }

        logger.warn('Websocket Action not handled', action);
    }
};

module.exports = wsRouter;