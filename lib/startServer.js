'use strict';

var http = require('http'),
	logger = require('./logger');

var startServer = function(done, app, options) {
	var h = http.createServer(app);
    h.listen(options.port);

    logger.success('Started at http://localhost:' + options.port);

    done();
};

module.exports = startServer;