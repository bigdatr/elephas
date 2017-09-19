import {expect} from 'chai';
import sinon from 'sinon';
import client from '../client';

const payload = 'test';

global.Primus = function() {
    return {
        on(e, cb) {
            return cb('payload');
        },
        write: sinon.spy()
    };
};

const myStore = {
    dispatch: sinon.spy()
};

describe('client', () => {
    it('subscribe to redux store', () => {
        client.connect(myStore);

        expect(myStore.dispatch.called).to.equal(true);
    });

    it('should dispatch to server and client', () => {
        client.dispatch('actionTest');

        expect(myStore.dispatch.calledWith('actionTest')).to.equal(true);
    });
});
