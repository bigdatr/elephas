'use strict';

var METHODS = [
    'timing',
    'increment',
    'decrement',
    'histogram',
    'gauge',
    'set',
    'unique'
];

var statsd_client = {};

METHODS.forEach(function(k) {
    statsd_client[k] = function(stat, value, sampleRate, tags, callback) {
        // StatsD instance must be initialized with globalize=true
        if (global.statsd) {
            global.statsd[k](stat, value, sampleRate, tags, callback);
        }
    };
});

module.exports = statsd_client;