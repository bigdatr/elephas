let _primus;

const elephas = {
    connect: function(store) {
        if (!_primus) {
            _primus = new Primus();

            _primus.on('data', function(action) {
                store.dispatch(action);
            });
        }
    },
    dispatch: function(action) {
        store.dispatch(action);
        _primus.write(action);
    }
};

module.exports = elephas;
