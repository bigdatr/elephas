'use strict';

var expressWinston = require('express-winston'),
    logger = require('./logger');

var express = require('express'),
    router = express.Router();


module.exports = function(done, app) {

    router.get('*', function(req, res, next) {
        var err = new Error('404 Page Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function(err, req, res, next) {
        if (err.text) {
            var e = new Error(err.text);
            e.status = err.status;
            e.message = err.text;
            return next(e);
        }

        return next(err);
    });


    // Catch All error logs
    app.use(expressWinston.errorLogger({
        winstonInstance: logger,
        // optional: control whether you want to log the meta data about the request (default to true)
        meta: false,
        // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        msg: "{{req.method}} {{res.statusCode}} {{res.responseTime}}ms {{req.url}} {{req.session.passport.user}}",
        // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
        expressFormat: false,
        // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
        colorStatus: true,
        // different HTTP status codes caused log messages to be logged at different levels (info/warn/error), the default is false
        statusLevels: true,
        // requestFilter: function(req, propName) {
        //     console.log(propName);
        //     return req[propName];
        // },
        dumpExceptions: false,
        showStack: false,
        handleExceptions: false
    }));

    done();
};