'use strict';

var GamesService = function (onMessageCallback) {
    var ws = new WebSocket('ws://127.0.0.1:8080/games');

    ws.onmessage = onMessageCallback;

    return ws;
};

module.exports = GamesService;
