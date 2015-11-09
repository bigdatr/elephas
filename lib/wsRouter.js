import _ from 'lodash';
import logger from './logger';

let _routes;

const wsRouter = {
    hasRoutes() {
        return _routes ? true : false;
    },
    setRoutes(routes) {
        _routes = _.reduce(routes, (prev, next) => {
            return _.merge(prev, next);
        });
    },
    route(client, action) {
        if (_routes[action.type]) {
            return _routes[action.type](client, action);
        }

        logger.warn('Websocket Action not handled', action);
    }
};

module.exports = wsRouter;