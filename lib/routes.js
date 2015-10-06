'use strict';

var express = require('express'),
    logger = require('./logger'),
	findFiles = require('./findFiles');

var async = require('async');

function toRouter(r) {
    var router = express.Router();

    for (var key in r) {
        for (var method in r[key]) {
            router[method.toLowerCase()](key, r[key][method]);
        }
    }

    return router;
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

                files.map(function(f) {
                    var r = require(f);

                    var urlPath = f.replace(p, '').split('/');

                    var prefix = urlPath.filter(function(p, i) {
                        return i < (urlPath.length - 1);
                    }).join('/');

                    return {router: toRouter(r, prefix), path: '', name: prefix};
                })
                .forEach(function(r) {
                    var route = '/' + r.path;

                    app.use(route, r.router);
                    logger.debug('Added routes for /' + r.name);
                });

                return done();
            });
        };
    });

    return async.series(tasks, cb);
};