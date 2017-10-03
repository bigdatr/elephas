'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _wsRouter = require('../wsRouter');

var _wsRouter2 = _interopRequireDefault(_wsRouter);

var _testRoutes = [{ MY_TEST_ACTION: _sinon2['default'].spy() }, { ANOTHER_ACTION: function ANOTHER_ACTION() {
        var e = new Error('dummy');
        console.log(e.stack);
    }

}];

describe('wsRouter', function () {
    it('has no routes by default', function () {
        (0, _chai.expect)(_wsRouter2['default'].hasRoutes()).to.equal(false);
    });

    it('can add websocket routes/action handlers', function () {
        _wsRouter2['default'].setActionHandlers(_testRoutes);

        (0, _chai.expect)(_wsRouter2['default'].hasRoutes()).to.equal(true);
    });

    it('can route to the correct action', function () {
        var client = {};
        var action = { type: 'MY_TEST_ACTION', payload: 'test' };

        _wsRouter2['default'].route(client, action);

        var fn = _testRoutes[0].MY_TEST_ACTION;

        (0, _chai.expect)(fn.called).to.equal(true);
    });

    // it('should not execute an action handler if there is no match', () => {
    //     const client = {};
    //     const action = {type: 'MISSING_ACTION', payload: 'test'};
    //     _testRoutes[1].ANOTHER_ACTION = sinon.spy();
    //     wsRouter.setActionHandlers([_testRoutes[1]]);
    //     wsRouter.route(client, action);

    //     expect(_testRoutes[1].ANOTHER_ACTION.called).to.equal(false);
    // });
});