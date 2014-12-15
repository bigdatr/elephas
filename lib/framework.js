'use strict';

var express = require('express'),
    logger = require('./logger'),
    kafkaTransport = require('winston-kafka-transport'),
    os = require('os'),
    async = require('async'),
    _ = require('lodash'),
    StatsD = require('node-statsd');


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
    server: {
        port: 3000
    },
    logger: null
};

// Add logging to kafka
function _addKafkaLogger(options) {
    if (options && options.kafka && options.kafka.topic) {
        logger.debug('Logging to kafka');

        logger.add(kafkaTransport, {
            topic: options.kafka.topic,
            connectionString: options.kafka.zkConnectionString,
            meta: {
                hostname: os.hostname(),
                pid: process.pid
            }
        });
    }
}

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

function elephas(options) {
    var app = express();

    options = _.defaults(options || {}, DEFAULT_OPTIONS);

    _addKafkaLogger(options.logger);
    _addStatsD(options.statsd, app);
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
            tasks.push(function(done) { middleware(done, app, options.redisClient); });

            // ROUTES
            if (hooks.beforeRoutes) { tasks.push(_toTask(hooks.beforeRoutes)); }
            tasks.push(function(done) { routes(done, app, options.routes_root_path); });
            tasks.push(function(done) { postRouteMiddleware(done, app, options.static_root_path); });
            if (hooks.afterRoutes) { tasks.push(_toTask(hooks.afterRoutes)); }

            // START SERVER
            tasks.push(function(done) { startServer(done, app, options.server); });

            // COMPLETE
            if (hooks.onComplete) { tasks.push(_toTask(hooks.onComplete)); }

            async.series(tasks);
        }
    };
}

module.exports = elephas;