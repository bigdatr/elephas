var _primus;
var _store;

var elephas = {
    connect: function(store) {
        if (!_primus) {
            _primus = new Primus();

            _store = store;

            _primus.on('data', function(action) {
                store.dispatch(action);
            });
        }
    },
    dispatch: function(action) {
        _store.dispatch(action);
        _primus.write(action);
    }
};

module.exports = elephas;
