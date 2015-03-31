'use strict';

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    flash = require('express-flash'),
    multer  = require('multer'),
    helmet = require('helmet'),
    compression = require('compression'),
    expressLogger = require('./express-logger');

var RedisStore = require('connect-redis')(session);
var timeout = require('connect-timeout');

var middlewareOptions = require('./middlewareOptions');

module.exports = function(done, app, options) {
    app.use(expressLogger.logger);
    app.use(expressLogger.errorLogger);

    app.use(helmet.csp(middlewareOptions('csp', options)));
    app.use(helmet.xssFilter());
    app.use(helmet.xframe());
    app.use(helmet.hsts(middlewareOptions('hsts', options)));
    app.use(helmet.crossdomain(middlewareOptions('crossdomain', options)));
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());

    app.use(cookieParser());

    var _sessionOptions = middlewareOptions('session', options);
    _sessionOptions.store = _sessionOptions.store || new RedisStore({client: options.redisClient, ttl: 60 * 60});
    app.use(session(_sessionOptions));

    var _bodyParserOptions = middlewareOptions('bodyParser', options);
    app.use(bodyParser.json(_bodyParserOptions.json));
    app.use(bodyParser.urlencoded(_bodyParserOptions.urlencoded));

    app.use(flash());
    app.use(multer(middlewareOptions('multer', options)));
    app.use(compression(middlewareOptions('compression', options)));
    app.use(timeout(middlewareOptions('timeout', options).ms));

    app.disable('x-powered-by');

    done();
};