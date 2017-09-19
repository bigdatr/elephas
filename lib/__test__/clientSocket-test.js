'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _clientSocket = require('../clientSocket');

var _clientSocket2 = _interopRequireDefault(_clientSocket);

describe('clientSocket', function () {
    it('should dispatch to the client', function () {
        var spark = {
            write: _sinon2['default'].spy()
        };

        var client = (0, _clientSocket2['default'])(spark);

        client.dispatch('myAction');

        (0, _chai.expect)(spark.write.calledWith('myAction')).to.equal(true);
    });
});