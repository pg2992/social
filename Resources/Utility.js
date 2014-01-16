var UIEvent = function (sender) {
    var _sender = sender;
    var _listeners = [];

    var callAsyn = function (index, args) {
        setTimeout(function () {
            _listeners[index](_sender, args);
        }, 0);
    };

    return {
        attach: function (listener) {
            _listeners.push(listener);
        },
        notify: function (args, async) {
            var isAsync = false;
            if (typeof async == "boolean")
                isAsync = async;
            for (var i = 0; i < _listeners.length; i++) {
                if (isAsync)
                    callAsyn(i, args);
                else
                    _listeners[i](_sender, args);
            }
        }
    };
};