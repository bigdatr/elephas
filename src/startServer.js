'use strict';

var http = require('http');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var Primus = require('primus');
var clientSocket = require('./clientSocket');
var wsRouter = require('./wsRouter');
var mkdirp = require('mkdirp');

var logger = require('./logger');

var workersStarted = 0;

var startServer = function(done, app, options) {
    var server = options.server;
    var h;
    if(typeof server.listen === 'undefined' || server.listen !== false){
        if (server.cluster) {
            if (cluster.isMaster) {
                // Fork workers.
                for (var i = 0; i < numCPUs; i++) {
                    cluster.fork();
                }

                cluster.on('fork', function() {
                    workersStarted += 1;

                    if (workersStarted === numCPUs) {
                        logger.success('Started at http://localhost:' + h.address().port + ' (using ' + numCPUs + ' cores)');
                    }
                });

                cluster.on('exit', function(worker, code, signal) {
                    logger.error('worker ' + worker.process.pid + ' died');
                });
            }
            else {
                // Workers can share any TCP connection
                // In this case its a HTTP server
                h = http.createServer(app)
                    .listen(server.port);

                logger.success('Started worker   pid: ' + cluster.worker.process.pid);
            }
        }
        else {
            h = http.createServer(app);
            h.listen(server.port, function () {
                logger.success('Started at http://localhost:' + h.address().port + ' (single core)');            
            });
        }
    }
    // Websocket connection
    if (wsRouter.hasRoutes()) {
        var p = new Primus(h, { transformer: 'sockjs' });

        var _path = options.static;

        if (!_path.endsWith('/')) {
            _path += '/';
        }

        mkdirp.sync(_path + 'js');

        p.save(_path + 'js/primus.js');

        p.on('connection', function (spark) {
            spark.on('data', function (action) {
                wsRouter.route(clientSocket(spark), action);
            });
        });
    }
    
    return done(null, {primus: p});
};

module.exports = startServer;
