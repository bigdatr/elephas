'use strict';

var express = require('express'),
    router = express.Router();

module.exports = function(done, app, static_root_path) {
    if (static_root_path) {
        app.use(express.static(static_root_path));
    }

    router.get('*', function(req, res, next) {
        var err = new Error('404 Page Not Found');
        err.status = 404;
        next(err);
    });

    done();
};