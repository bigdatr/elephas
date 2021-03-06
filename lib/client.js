'use strict';

var _primus;
var _store;

var elephas = {
    connect: function connect(store) {
        if (!_primus) {
            _primus = new Primus();

            _store = store;

            _primus.on('data', function (action) {
                store.dispatch(action);
            });
        }
    },
    dispatch: function dispatch(action) {
        _store.dispatch(action);
        _primus.write(action);
    },
    subscribe: function subscribe(cb) {
        _primus.on('data', cb);
    }
};

module.exports = elephas;