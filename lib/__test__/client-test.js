'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _client = require('../client');

var _client2 = _interopRequireDefault(_client);

var payload = 'test';

global.Primus = function () {
    return {
        on: function on(e, cb) {
            return cb('payload');
        },
        write: _sinon2['default'].spy()
    };
};

var myStore = {
    dispatch: _sinon2['default'].spy()
};

describe('client', function () {
    it('subscribe to redux store', function () {
        _client2['default'].connect(myStore);

        (0, _chai.expect)(myStore.dispatch.called).to.equal(true);
    });

    it('should dispatch to server and client', function () {
        _client2['default'].dispatch('actionTest');

        (0, _chai.expect)(myStore.dispatch.calledWith('actionTest')).to.equal(true);
    });
});