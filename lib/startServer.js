'use strict';

var http = require('http');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var logger = require('./logger');

var startServer = function(done, app, options) {
    if (options.cluster) {
        if (cluster.isMaster) {
            // Fork workers.
            for (var i = 0; i < numCPUs; i++) {
                cluster.fork();
            }

            cluster.on('exit', function(worker, code, signal) {
                logger.error('worker ' + worker.process.pid + ' died');
            });
        }
        else {
            // Workers can share any TCP connection
            // In this case its a HTTP server
            http.createServer(app)
                .listen(options.port);

            logger.success('Started worker   pid: ' + cluster.worker.process.pid);
        }
    }
    else {
        var h = http.createServer(app);
        h.listen(options.port);

        logger.success('Started at http://localhost:' + options.port + ' (single core)');
    }

    done();
};

module.exports = startServer;