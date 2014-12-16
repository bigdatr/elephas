var winston = require('winston');
var logger = require('./logger');
var chalk = require('chalk');

function _calcLogLevel(statusCode) {
    if (statusCode >= 500) {
        return 'error';
    }
    else if (statusCode >= 400) {
        return 'warning';
    }

    return 'info';
}

function _formatStatus(statusCode) {
    var color = 'gray';

    if (statusCode >= 500) {
        color = 'red';
    }
    else if (statusCode >= 400) {
        color = 'yellow';
    }
    else if (statusCode >= 300) {
        color = 'cyan';
    }

    return chalk[color](statusCode);
}

function _formatResponseTime(ms) {
    var color = 'gray';

    if (ms >= 500) {
        color = 'red';
    }
    else if (ms >= 300) {
        color = 'magenta';
    }
    else if (ms >= 100) {
        color = 'yellow';
    }

    return chalk[color](ms + 'ms');
}

function _heapDump() {
    return {};
}

function _log(req, res, responseTime) {
    var level = _calcLogLevel(res.statusCode);

    var msg = [
        chalk.gray(req.method),
        _formatStatus(res.statusCode),
        _formatResponseTime(responseTime),
        req.originalUrl,
        chalk.gray(req.session.passport.user)
    ].join(' ');

    logger[level](msg, _heapDump);
}

process.on('uncaughtException', function(err) {
    var meta = winston.exception.getAllInfo(err);
    logger.error('uncaughtException', meta);
});


module.exports.logger = function(req, res, next) {
    var _start = new Date();

    // I feel really disgusted doing this. Can't waith to switch to Koa...
    var end = res.end;
    res.end = function(chunk, encoding) {
        var responseTime = (new Date() - _start);

        res.end = end;
        res.end(chunk, encoding);

        _log(req, res, responseTime);
    };

    next();
};

module.exports.errorLogger = function(err, req, res, next) {
    var _start = new Date();

    // I feel really disgusted doing this. Can't waith to switch to Koa...
    var end = res.end;
    res.end = function(chunk, encoding) {
        var responseTime = (new Date() - _start);

        res.end = end;
        res.end(chunk, encoding);

        _log(req, res, responseTime);
    };

    next();
};