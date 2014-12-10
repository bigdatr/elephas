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

function statsd() {
    return global.statsd;
}

var statsd_client = {};

METHODS.forEach(function(k) {
    statsd_client[k] = function(stat, value, sampleRate, tags, callback) {
        return statsd()[k](stat, value, sampleRate, tags, callback);
    };
});

module.exports = statsd_client;