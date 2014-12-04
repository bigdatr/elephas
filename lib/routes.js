'use strict';

var express = require('express'),
    logger = require('./logger'),
	findFiles = require('./findFiles');


function toRouter(r, prefix) {
    var router = express.Router();

    for (var key in r) {
        for (var method in r[key]) {
            //router path is only the key. should we consider filename too
            // and take the value before --router.js
            // eg. should the route be /api/campaigns/campaignsXX
            router[method.toLowerCase()]('/' + prefix + key, r[key][method]);
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