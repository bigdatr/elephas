var logger = require('./logger');
var chalk = require('chalk');
var statsd = require('./statsd');
var cluster = require('cluster');

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

    // var pid = cluster.isWorker ? cluster.worker.process.pid : process.pid;

    var user;

    if (req && req.user && req.user.username) {
        user = chalk.gray(req.user.username);
    }
    else if (req && req.session && req.session.passport && req.session.passport.user) {
        user = chalk.gray(req.session.passport.user);
    }
    else {
        user = chalk.red('anonymous');
    }

    var msg = [
        chalk.gray(req.method),
        _formatStatus(res.statusCode),
        _formatResponseTime(responseTime),
        req.originalUrl,
        user,
        // chalk.gray('pid=' + pid)
    ].join(' ');

    logger[level](msg, _heapDump);

    statsd.timing('api.response_time', responseTime);
}

process.on('uncaughtException', function(err) {
    logger.error(err.stack);
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
