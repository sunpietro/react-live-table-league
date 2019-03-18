# Live Table League simulation built with React.js

## Introduction

The games are taken from the 2011/12 English Premier League season. For reference, the final table is available here: http://en.wikipedia.org/wiki/2011-12_Premier_League#League_table.

## How to run it?

Run `yarn serve` then `yarn start` to check how it works.

## Rules

* The league table should comprise 20 teams, each starting with 0 points.
* Upon consuming a new game over the WebSocket stream, the league table must be updated.
* 3 points are awarded for a win, 1 for a draw and 0 for a loss
* Teams must be ordered with respect to the following: points, goal difference, goals for and finally team name.
