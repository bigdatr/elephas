'use strict';

var express = require('express'),
    logger = require('./logger'),
    async = require('async'),
    _ = require('lodash'),
    StatsD = require('node-statsd');

var _statsd = require('./statsd');


var services = require('./services'),
    middleware = require('./middleware'),
    routes = require('./routes'),
    wsRoutes = require('./wsRoutes'),
    postRouteMiddleware = require('./postRouteMiddleware'),
    startServer = require('./startServer'),
    statsd_client = require('./statsd');

var DEFAULT_OPTIONS = {
    httpsOnly: true,
    ping: true,
    server: {
        port: 3000,
        cluster: false
    },
    logger: {
        level: 'debug'
    }
};

function _addStatsD(options, app) {
    if (options) {
        // TODO: Ideally we can avoid exposing this globally
        options.globalize = true;

        new StatsD(options);

        app.use('/api', function(req, res, next) {
            statsd_client.increment('api.request');
            next();
        });

        logger.debug('Enabled statsd. prefix=' + options.prefix);
    }
}

function _HttpsOnly(options, app) {
    if (options) {
        app.use(function(req, res, next) {
            var proto = req.headers['x-forwarded-proto'] || req.protocol;

            if (!proto || proto === 'https') {
                next();
            }
            else {
                return res.redirect('https://' + req.headers.host + req.url);
            }
        });

        logger.debug('Only https traffic is allowed');
    }
}

function _ping(options, app) {
    if (options) {
        app.use('/ping', function(req, res) {
            res.end('200 Service Available');
        });
    }
}

function elephas(options) {
    var app = express();

    options = _.defaults(options || {}, DEFAULT_OPTIONS);

    logger.transports.console.level = options.logger.level || 'debug';

    if (options.__dirname) {
        options.routes_root_path = options.routes_root_path || options.__dirname;
        options.services_root_path = options.services_root_path || options.__dirname;
        options.static_root_path = options.static_root_path || options.__dirname + '/public';
    }
    else {
        logger.error('Require option `__dirname` in elephas config');
        process.exit(1);
    }

    // _addKafkaLogger(options.logger);
    _addStatsD(options.statsd, app);

    _ping(options.ping, app);
    _HttpsOnly(options.httpsOnly, app);

    function _toTask(fn) {
        return function(done) {
            fn(done, app);
        };
    }

    return {
        createServer: function(hooks) {
            hooks = hooks || {};
            var timerResults = [];

            var timerTask = function(taskName) {
                return function(done) {
                    timerResults.push({task: taskName, completed: new Date()});
                    return done();
                };
            };


            var tasks = [];

            // SERVICES
            if (hooks.beforeServices) { tasks.push(_toTask(hooks.beforeServices)); }
            tasks.push(timerTask('beforeServices'));
            tasks.push(function(done) { services(done, options.services_root_path); });
            tasks.push(timerTask('services'));

            // MIDDLEWARE
            if (hooks.beforeMiddleware) { tasks.push(_toTask(hooks.beforeMiddleware)); }
            tasks.push(timerTask('beforeMiddleware'));
            tasks.push(function(done) { middleware(done, app, options, options.redisClient); });
            tasks.push(timerTask('middleware'));

            // ROUTES
            if (hooks.beforeRoutes) { tasks.push(_toTask(hooks.beforeRoutes)); }
            tasks.push(timerTask('beforeRoutes'));
            tasks.push(function(done) { routes(done, app, options.routes_root_path); });
            tasks.push(timerTask('routes'));

            tasks.push(function(done) { wsRoutes(done, app, options.routes_root_path); });
            tasks.push(timerTask('wsRoutes'));

            tasks.push(function(done) { postRouteMiddleware(done, app, options.static_root_path); });
            tasks.push(timerTask('postRouteMiddleware'));
            if (hooks.afterRoutes) { tasks.push(_toTask(hooks.afterRoutes)); }
            tasks.push(timerTask('afterRoutes'));


            // START SERVER
            tasks.push(function(done) { startServer(done, app, options); });
            tasks.push(timerTask('startServer'));

            _statsd.increment('elephas.starting');
            var _startTime = new Date();

            async.series(tasks, function(err, payload) {
                if (err) { throw err; }

                var _startServerPayload = payload[payload.length - 2];

                if (hooks.onComplete) {
                    hooks.onComplete(_startServerPayload);
                }

                var _duration = new Date() - _startTime;

                _statsd.timing('elephas.startup_time', _duration);

                console.log('\n');
                console.log('------------');
                console.log('ELEPHAS');
                console.log('------------');

                console.log('NODE_ENV: ' + process.env.NODE_ENV, '\n');

                timerResults.forEach(function(t, i) {
                    var _start = i === 0 ? _startTime : timerResults[i-1].completed;
                    var _duration = t.completed - _start;
                    console.log(_duration + 'ms', '\t', t.task);
                });

                console.log('================================');
                console.log(_duration + 'ms', '\t', 'TOTAL STARTUP DURATION')
                console.log('\n');
            });
        }
    };
}

module.exports = elephas;