const GamesService = (onMessageCallback) => {
    const client = new WebSocket('ws://127.0.0.1:8181/games', 'echo-protocol');

    client.onmessage = onMessageCallback;

    return client;
};

export default GamesService;
