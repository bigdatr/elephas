'use strict';

var _ = require('lodash');
var logger = require('./logger');
var chalk = require('chalk');
var Rx = require('rx');

var _routes;
var actionStream$;

function log(client, action) {
    var msg = [chalk.gray('ACTION'), action.type, chalk.red('--unkown--' + client.id)].join(' ');

    logger.info(msg);
}

function init() {
    actionStream$ = new Rx.Subject();

    _.forIn(_routes, function (action_fn, action_type) {
        var actionHandler$ = actionStream$.filter(function (payload) {
            return payload.action.type === action_type;
        });

        action_fn(actionHandler$);
    });
}

var wsRouter = {
    hasRoutes: function hasRoutes() {
        return _routes ? true : false;
    },
    setActionHandlers: function setActionHandlers(routes) {
        _routes = _.reduce(routes, function (prev, next) {
            return _.merge(prev, next);
        });

        init();
    },
    route: function route(client, action) {
        log(client, action);
        actionStream$.onNext({ action: action, client: client });
    }
};

module.exports = wsRouter;