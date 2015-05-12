'use strict';

var express = require('express'),
    logger = require('./logger'),
    // kafkaTransport = require('winston-kafka-transport'),
    os = require('os'),
    async = require('async'),
    _ = require('lodash'),
    StatsD = require('node-statsd');

var _statsd = require('./statsd');


var services = require('./services'),
    middleware = require('./middleware'),
    routes = require('./routes'),
    postRouteMiddleware = require('./postRouteMiddleware'),
    startServer = require('./startServer'),
    statsd_client = require('./statsd');

var DEFAULT_OPTIONS = {
    routes_root_path: './routes',
    services_root_path: './services',
    static_root_path: null,
    httpsOnly: true,
    ping: true,
    server: {
        port: 3000,
        cluster: false
    },
    logger: null
};

// Add logging to kafka
// function _addKafkaLogger(options) {
//     if (options && options.kafka && options.kafka.topic) {
//         logger.debug('Logging to kafka');

//         logger.add(kafkaTransport, {
//             topic: options.kafka.topic,
//             connectionString: options.kafka.zkConnectionString,
//             meta: {
//                 hostname: os.hostname(),
//                 pid: process.pid
//             }
//         });
//     }
// }

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

    if (options.__dirname) {
        // TODO: Relative paths aren't working for us!!
        // var dirname = options.__dirname + '/..';
        // options.routes_root_path = dirname;
        // options.services_root_path = dirname;
        // options.static_root_path = dirname + '/public';
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
            var tasks = [];

            // SERVICES
            if (hooks.beforeServices) { tasks.push(_toTask(hooks.beforeServices)); }
            tasks.push(function(done) { services(done, options.services_root_path); });

            // MIDDLEWARE
            if (hooks.beforeMiddleware) { tasks.push(_toTask(hooks.beforeMiddleware)); }
            tasks.push(function(done) { middleware(done, app, options, options.redisClient); });

            // ROUTES
            if (hooks.beforeRoutes) { tasks.push(_toTask(hooks.beforeRoutes)); }
            tasks.push(function(done) { routes(done, app, options.routes_root_path); });
            tasks.push(function(done) { postRouteMiddleware(done, app, options.static_root_path); });
            if (hooks.afterRoutes) { tasks.push(_toTask(hooks.afterRoutes)); }


            // START SERVER
            tasks.push(function(done) { startServer(done, app, options.server); });

            _statsd.increment('elephas.starting');
            var _startTime = new Date();

            async.series(tasks, function(err) {
                if (err) { throw err; }

                if (hooks.onComplete) {
                    hooks.onComplete();
                }

                _statsd.timing('elephas.startup_time', new Date() - _startTime);
            });
        }
    };
}

module.exports = elephas;