import {expect} from 'chai';
import sinon from 'sinon';
import wsRouter from '../wsRouter';

const _testRoutes = [
    { MY_TEST_ACTION: sinon.spy() },
    { ANOTHER_ACTION: ()=>{
        var e = new Error('dummy');
        console.log(e.stack);
        } 
        
        }
];

describe('wsRouter', () => {
    it('has no routes by default', () => {
        expect(wsRouter.hasRoutes()).to.equal(false);
    });

    it('can add websocket routes/action handlers', () => {
        wsRouter.setActionHandlers(_testRoutes);

        expect(wsRouter.hasRoutes()).to.equal(true);
    });

    it('can route to the correct action', () => {
        const client = {};
        const action = {type: 'MY_TEST_ACTION', payload: 'test'};

        wsRouter.route(client, action);

        const fn = _testRoutes[0].MY_TEST_ACTION;

        expect(fn.called).to.equal(true);
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
