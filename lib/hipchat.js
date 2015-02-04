var hipchat = require('node-hipchat');

var _HC;
var BD_HIPCHAT_KEY = process.env.BD_HIPCHAT_KEY;

if (BD_HIPCHAT_KEY) {
	_HC = new hipchat(BD_HIPCHAT_KEY);
}

var METHODS = [
    'postMessage'
];

var hipchat_client = {};

METHODS.forEach(function(k) {
    hipchat_client[k] = function(params) {
        if (_HC) {
            _HC[k](params);
        }
    };
});

module.exports = hipchat_client;