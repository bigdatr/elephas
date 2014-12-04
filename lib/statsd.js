'use strict';
var StatsD = require('node-statsd');

var client;

module.exports = function(options) {
	if (!client) {
		client = new StatsD(options);
		client.socket.on('error', function(error) {
		  return console.error("Error in socket: ", error);
		});
	}
	return client;
};