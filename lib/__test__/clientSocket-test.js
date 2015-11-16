import {expect} from 'chai';
import sinon from 'sinon';
import clientSocket from '../clientSocket';

describe('clientSocket', () => {
    it('should dispatch to the client', () => {
        const spark = {
            write: sinon.spy()
        };

        const client = clientSocket(spark);

        client.dispatch('myAction');

        expect(spark.write.calledWith('myAction')).to.equal(true);
    });
});
