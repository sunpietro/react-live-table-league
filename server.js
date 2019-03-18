const http = require('http');
const WebSocketServer = require('websocket').server;
const fs = require('fs');
const path = require('path');
const readFile = (fileName) => fs.readFileSync(
    path.resolve(path.join(__dirname, '.', 'data', fileName))
);
const INTERVAL_BASE = 2500;
const SOCKET_PORT = 8181;
const PROCESS_PORT = process.env.PORT || SOCKET_PORT;
const PROCESS_HOST = process.env.HOST || 'localhost';
const TEAMS_ROUTE = /^\/teams\/?$/;
const GAMES = JSON.parse(readFile('games.json'));
const TEAMS = JSON.parse(readFile('teams.json'));
const TEAMS_DATA = JSON.stringify(TEAMS);
const httpServer = http.createServer((request, response) => {
    if (TEAMS_ROUTE.test(request.url)) {
        response.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Content-Type': 'application/json',
            'Content-Length': TEAMS_DATA.length,
        });

        response.write(TEAMS_DATA);
        response.end();
    }

    response.writeHead(404);
    response.end();
});
let INTERVAL;

httpServer.listen(PROCESS_PORT, PROCESS_HOST, () => {
    const { address, port } = httpServer.address();

    console.log(`Server listening on http://${address}:${port}`);
});

const webSocketServer = new WebSocketServer({
    httpServer,
    path: '/games',
    port: SOCKET_PORT,
});

webSocketServer.on('request', (request) => {
    const connection = request.accept('echo-protocol', request.origin);
    const queue = [...GAMES];
    const time = (Math.random() * INTERVAL_BASE) | 250;

    INTERVAL = setInterval(() => connection.send(JSON.stringify(queue.shift())), time);

    connection.on('close', () => clearInterval(INTERVAL));
});
