'use strict';

var util = require("util"),
    events = require("events");

function Service() {
    events.EventEmitter.call(this);    
}


util.inherits(Service, events.EventEmitter);

// for connection retry. 
Service.prototype.retryCount = 0;

// max retry set as 3.
Service.prototype.MAX_RETRY = 3;


Service.prototype.connectionFailed = function() {
    this.retryCount++;
};

Service.prototype.isRetry = function() {
    return this.retryCount < this.MAX_RETRY;
};


Service.prototype.serviceConnected = function() {
    this.retryCount = 0;
    this.emit('connected');
};

Service.prototype.serviceDown = function() {
    this.emit('serviceDown');
};

module.exports = Service;