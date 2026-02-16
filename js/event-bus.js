// ============================================================
// EventBus — message board for inter-tile communication
//
// Tiles post and listen for messages instead of calling each
// other directly. This keeps them independent.
//
// Usage:
//   EventBus.on('character-generated', function(data) { ... });
//   EventBus.emit('character-generated', characterData);
//   EventBus.off('character-generated', myCallback);
// ============================================================

var EventBus = {
    _listeners: {},

    // Subscribe to an event
    on: function(event, callback) {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
    },

    // Unsubscribe from an event
    off: function(event, callback) {
        if (!this._listeners[event]) return;
        this._listeners[event] = this._listeners[event].filter(function(cb) {
            return cb !== callback;
        });
    },

    // Post a message — all listeners for this event are notified
    emit: function(event, data) {
        if (!this._listeners[event]) return;
        for (var i = 0; i < this._listeners[event].length; i++) {
            this._listeners[event][i](data);
        }
    }
};
