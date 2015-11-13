var _ = require('lodash');

var _subscriptions = {};

var SocketSubscriptionManager = {
    subscribe: function(client, key, stream$) {
        if (!client || !key || !stream$) {
            console.log('elephas.SocketSubscriptionManager::Missing client or key or stream$', key, id, stream$);
        }

        // Unsubscribe to any stream$ before adding new subscription
        this.unsubscribe(client, key);

        // Add new subscription
        _subscriptions[key] = _subscriptions[key] || {};
        _subscriptions[key][client.id] = stream$;

        // When the connection is closed
        client.on('end', () => this.unsubscribeAll(client));
    },
    unsubscribe: function(client, key) {
        var _stream$ = this.getStream$(client, key);

        if (_stream$) {
            _subscriptions[key][client.id] = null;
            var _disposeable = _stream$.subscribe(() => {});
            return _disposeable.dispose();
        }
    },
    unsubscribeAll: function(client) {
        _.forIn(_subscriptions, function(v, key) {
            this.unsubscribe(client, key);
        }, this);
    },
    getStream$: function(client, key) {
        var _stream$;

        if (_subscriptions[key] && _subscriptions[key][client.id]) {
            _stream$ = _subscriptions[key][client.id];
        }

        return _stream$;
    }
};

module.exports = SocketSubscriptionManager;
