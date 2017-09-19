'use strict';

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    flash = require('express-flash'),
    helmet = require('helmet'),
    compression = require('compression'),
    expressLogger = require('./express-logger');

var RedisStore = require('connect-redis')(session);
var timeout = require('connect-timeout');

var middlewareOptions = require('./middlewareOptions');
// var logger = require('./logger');

module.exports = function(done, app, options) {
    app.use(expressLogger.logger);
    app.use(expressLogger.errorLogger);

    if (options.csp !== false) {
        app.use(helmet.contentSecurityPolicy(middlewareOptions('csp', options)));
    }
    if(options.frameguard !== false){
        app.use(helmet.frameguard.apply(this, middlewareOptions('frameguard', options)));
    }
    app.use(helmet.xssFilter());
    app.use(helmet.hsts(middlewareOptions('hsts', options)));
    // app.use(helmet.crossdomain(middlewareOptions('crossdomain', options)));
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());

    app.use(cookieParser());
    if(options.session !== false ){
        var _sessionOptions = middlewareOptions('session', options);
        _sessionOptions.store = _sessionOptions.store;
        
        if (!_sessionOptions.store && options.redisClient) {
            _sessionOptions.store = new RedisStore({client: options.redisClient, ttl: 60 * 60});
        }
        app.use(session(_sessionOptions));
        app.use(flash());
    }
    var _bodyParserOptions = middlewareOptions('bodyParser', options);
    if (options.bodyParser !== false) {
        app.use(bodyParser.json(_bodyParserOptions.json));
        app.use(bodyParser.urlencoded(_bodyParserOptions.urlencoded));
    }

    app.use(flash());
    if(typeof options.multer !== 'undefined' && options.multer.disable !== true){
        var multer  = require('multer');
        app.use(multer(middlewareOptions('multer', options)));
    }
    if(typeof options.compression !== 'undefined' && options.compression.disable !== true){
        app.use(compression(middlewareOptions('compression', options)));
    }
    app.use(timeout(middlewareOptions('timeout', options).ms));

    app.disable('x-powered-by');

    done();
};
