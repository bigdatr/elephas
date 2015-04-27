'use strict';

var express = require('express'),
    logger = require('./logger'),
	findFiles = require('./findFiles');


function toRouter(r, prefix) {
    var router = express.Router();

    for (var key in r) {
        for (var method in r[key]) {
            if (key.indexOf('/api/') === 0) {
                router[method.toLowerCase()](key, r[key][method]);
            }
            else {
                // FIXME: STOP USING THE FOLDER PATH AS A PREFIX
                router[method.toLowerCase()]('/' + prefix + key, r[key][method]);

                var err = new Error('ELEPHAS: Add full route path into --routes files. prefix: ' + prefix);
                console.error(err.stack);
            }
        }
    }

    return router;
}

module.exports = function(cb, app, path) {
    findFiles(path, '--routes.js', function(err, files) {
        if (err) {
        	if (cb) {
        		return cb(err);
        	}
        	else {
        		throw Error(err);
        	}
        }

        files.map(function(f) {
            var r = require(f);

            var urlPath = f.replace(path, '').split('/');

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

        if (cb) {
            cb(null);
        }
    });
};