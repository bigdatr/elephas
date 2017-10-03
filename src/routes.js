var express = require('express');
var logger = require('./logger');
var findFiles = require('./findFiles');

var async = require('async');
var _ = require('lodash');

function toRouter(r) {
    var router = express.Router();

    for (var key in r) {
        for (var method in r[key]) {
            router[method.toLowerCase()](key, r[key][method]);
        }
    }

    return router;
}

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
        logger.debug(r);
    });
}

module.exports = function(cb, app, path) {
    var _paths = path;

    if (typeof path === 'string') {
        _paths = [path];
    }

    var tasks = _paths.map(function(p) {
        return function(done) {
            findFiles(p, '--routes.js', function(err, files) {
                if (err) {
                    return done(err);
                }

                // Require route file and create express router
                var routeFiles = files.map(function(f) {
                    var r = require(f);

                    var urlPath = f.replace(p, '').split('/');

                    var prefix = urlPath.filter(function(p, i) {
                        return i < (urlPath.length - 1);
                    }).join('/');

                    app.use('/', toRouter(r, prefix));

                    // return {router: toRouter(r, prefix), path: '', name: prefix};
                    return r;
                });

                // Log out all routes that were found and added
                toLogs(routeFiles);

                return done();
            });
        };
    });

    return async.series(tasks, cb);
};