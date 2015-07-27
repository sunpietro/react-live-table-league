# Live Table League simulation built with React.js

## Introduction

The games in this task are taken from the 2011/12 English Premier League season. For reference, the final table is available here: http://en.wikipedia.org/wiki/2011-12_Premier_League#League_table.

## Getting started

* Make sure you have node.js and npm installed;
* Install all dependencies by running `npm install`;
* Start the server by running `npm start`. The server will be available at http://localhost:8080 or 127.0.0.1:8080, according to your system settings.
* Open index.html in your browser and watch the result.


## Data sources

There are 2 kinds of data sources available in this project:

### Teams

A list of teams for the season is available at http://localhost:8080/teams. This is a regular HTTP endpoint that returns a list of teams as JSON. The format of the response is as follows:

```json
[
    { "id": 1, "Blackburn" },
    { "id": 2, "Wolves" }
]
```

### Games

A stream of games is available at http://localhost:8080/games. This is a realtime stream over WebSockets that you will need to consume. The format of each message is as follows:

```json
{
    "date": "13/08/11",
    "homeTeamId": 1,
    "awayTeamId": 2,
    "homeGoals": 1,
    "awayGoals": 2
}
```

## Rules

* The league table should comprise 20 teams, each starting with 0 points.
* Upon consuming a new game over the WebSocket stream, the league table must be updated.
* 3 points are awarded for a win, 1 for a draw and 0 for a loss
* Teams must be ordered with respect to the following: points, goal difference, goals for and finally team name.
