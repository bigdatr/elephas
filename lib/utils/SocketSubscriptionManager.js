import _ from 'lodash';

let _subscriptions = {};

export default {
    subscribe(client, key, stream$) {
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
    unsubscribe(client, key) {
        const _stream$ = this.getStream$(client, key);

        if (_stream$) {
            _subscriptions[key][client.id] = null;
            const _disposeable = _stream$.subscribe(() => {});
            return _disposeable.dispose();
        }
    },
    unsubscribeAll(client) {
        _.forIn(_subscriptions, (v, key) => {
            this.unsubscribe(client, key);
        });
    },
    getStream$(client, key) {
        let _stream$;

        if (_subscriptions[key] && _subscriptions[key][client.id]) {
            _stream$ = _subscriptions[key][client.id];
        }

        return _stream$;
    }
};
