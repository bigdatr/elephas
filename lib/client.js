let _primus;

const elephas = {
    connect(store) {
        if (!_primus) {
            _primus = new Primus();

            _primus.on('data', function(action) {
                store.dispatch(action);
            });
        }
    },
    dispatch(action) {
        _primus.write(action);
    }
};

module.exports = elephas;
