var logger = require('./logger');
var findFiles = require('./findFiles');

var async = require('async');
var _ = require('lodash');

var wsRouter = require('./wsRouter');

function toLogs(files) {
    var routes = _.chain(files)
        .map(function(r) {
            var routePaths = [];

            _.forIn(r, function(v, k) {
                routePaths.push(k);
            });

            return routePaths;
        })
        .reduce(function(a, b) { return a.concat(b); })
        .sortBy()
        .value();

    logger.debug('Added routes');

    routes.forEach(function(r) {
        logger.debug('ws://' + r);
    });
}

module.exports = function(cb, app, path) {
    var _paths = path;

    if (typeof path === 'string') {
        _paths = [path];
    }

    var tasks = _paths.map(function(p) {
        return function(done) {
            findFiles(p, '--ws.js', function(err, files) {
                if (err) {
                    return done(err);
                }

                // Require route file and create express router
                var routeFiles = files.map(function(f) {
                    var r = require(f);
                    return r;
                });

                wsRouter.setRoutes(routeFiles);

                // Log out all routes that were found and added
                toLogs(routeFiles);

                return done();
            });
        };
    });

    return async.series(tasks, cb);
};