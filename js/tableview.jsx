'use strict';

var React = require('../node_modules/react/addons'),
    GamesService = require('./gamesservice'),
    Ajax = require('./ajax'),
    TableView;

(function (document) {
    var teamsMap = {},
        POINTS_WIN = 3,
        POINTS_DRAW = 1;

    TableView = React.createClass({
        /*
         * Configures default view state values
         *
         * @method getInitialState
         */
        getInitialState: function () {
            return {
                table: [],
                games: {}
            };
        },

        /*
         * Starts fetching team data before rendering a view
         *
         * @method componentWillMount
         */
        componentWillMount: function () {
            this._getTeams();
        },

        /*
         * After initial view rendering starts fetching matches data from an endpoint
         *
         * @method componentDidMount
         */
        componentDidMount: function () {
            new GamesService(this._updateTable);
        },

        /*
         * The callback fired when Web Sockets server sends a message.
         * It makes calculations of current league table state according to the match results.
         * When all calculations are done then it updates a view state.
         *
         * @private
         * @method _updateTable
         * @param event {Object} Web Sockets event object
         */
        _updateTable: function (event) {
            var game = JSON.parse(event.data),
                gamesList = this.state.games,
                table = this.state.table,
                teamHome = teamsMap[game.homeTeamId],
                teamAway = teamsMap[game.awayTeamId],
                goalsHome = parseInt(game.homeGoals, 10),
                goalsAway = parseInt(game.awayGoals, 10);

            if (gamesList[game.date]) {
                gamesList[game.date].push(game);
            } else {
                gamesList[game.date] = [game];
            }

            if (goalsHome === goalsAway) {
                teamHome.points += POINTS_DRAW;
                teamAway.points += POINTS_DRAW;
            } else if (goalsHome > goalsAway) {
                teamHome.points += POINTS_WIN;
            } else {
                teamAway.points += POINTS_WIN;
            }

            teamHome.played += 1;
            teamHome.goalsScored += goalsHome;
            teamHome.goalsConceded += goalsAway;
            teamHome.goalsDiff = teamHome.goalsScored - teamHome.goalsConceded;

            teamAway.played += 1;
            teamAway.goalsScored += goalsAway;
            teamAway.goalsConceded += goalsHome;
            teamAway.goalsDiff = teamAway.goalsScored - teamAway.goalsConceded;

            table = this._orderByPoints(table);
            table = this._orderByGoals(table);

            this.setState({
                games: gamesList,
                table: table
            });
        },

        /*
         * Orders teams in table by goal difference at first.
         * Then orders by goals for values.
         *
         * @private
         * @method _orderByGoals
         * @param table {Array} league table
         * @returns {Array}
         */
        _orderByGoals: function (table) {
            var pointGroups = {},
                pointGroupsKeys,
                orderedTable = [];

            table.forEach(function (team) {
                if (pointGroups[team.points]) {
                    pointGroups[team.points].push(team);
                } else {
                    pointGroups[team.points] = [team];
                }
            });

            pointGroupsKeys = Object.keys(pointGroups);

            pointGroupsKeys.forEach(function (pointKey) {
                // ordering by goals difference
                pointGroups[pointKey].sort(function (team1, team2) {
                    return team1.goalsDiff > team2.goalsDiff ? -1 : team1.goalsDiff < team2.goalsDiff ? 1 : 0;
                });

                // ordering by goals for
                pointGroups[pointKey].sort(function (team1, team2) {
                    if (team1.goalsDiff === team2.goalsDiff) {
                        return team1.goalsScored > team2.goalsScored ? -1 : team1.goalsScored < team2.goalsScored ? 1 : 0;
                    }
                });
            });

            pointGroupsKeys.reverse().forEach(function (pointKey) {
                pointGroups[pointKey].forEach(function (team) {
                    orderedTable.push(team);
                });
            });

            return orderedTable;
        },

        /*
         * Orders teams in table by points.
         *
         * @private
         * @method _orderByPoints
         * @param table {Array} league table
         * @returns {Array}
         */
        _orderByPoints: function (table) {
            table.sort(function (team1, team2) {
                return team1.points > team2.points ? -1 : team1.points < team2.points ? 1 : 0;
            });

            return table;
        },

        /*
         * Orders teams in table by name.
         *
         * @private
         * @method _orderByName
         * @param table {Array} league table
         * @returns {Array}
         */
        _orderByName: function (table) {
            table.sort(function (team1, team2) {
                var team1Name = team1.name.toLowerCase(),
                    team2Name = team2.name.toLowerCase();

                return team1Name < team2Name ? -1 : team1Name > team2Name ? 1 : 0;
            });

            return table;
        },

        /*
         * Gets a list of teams in Premier League season 2011/12.
         * Makes an AJAX call to the server endpoint to fetch the teams.
         * Updates the view state when data is fetched succesfully
         *
         * @private
         * @method _getTeams
         */
        _getTeams: function () {
            var that = this,
                teamsSuccessCallback = function (response) {
                    var teamsInTable = that._orderByName(JSON.parse(response));

                    teamsInTable.forEach(function (team) {
                        team.points = 0;
                        team.goalsScored = 0;
                        team.goalsConceded = 0;
                        team.goalsDiff = 0;
                        team.played = 0;

                        teamsMap[team.id] = team;
                    });

                    that.setState({
                        table: teamsInTable
                    });
                };

            new Ajax('http://127.0.0.1:8080/teams', teamsSuccessCallback);
        },

        /*
         * Renders a view both on init and after state change.
         *
         * @method render
         */
        render: function () {
            var rows = this.state.table.map(function (row, index) {
                return (<tr key={JSON.stringify(row)} className="table--league__body__row">
                    <td className="table--league__body__row__cell table--league__body__row__cell--position">{index + 1}</td>
                    <td className="table--league__body__row__cell table--league__body__row__cell--name">{row.name}</td>
                    <td className="table--league__body__row__cell table--league__body__row__cell--played">{row.played}</td>
                    <td className="table--league__body__row__cell table--league__body__row__cell--points">{row.points}</td>
                    <td className="table--league__body__row__cell table--league__body__row__cell--goals-f">{row.goalsScored}</td>
                    <td className="table--league__body__row__cell table--league__body__row__cell--goals-a">{row.goalsConceded}</td>
                    <td className="table--league__body__row__cell table--league__body__row__cell--goals-d">{row.goalsDiff}</td>
                </tr>);
            });

            return (<table className="table--league">
                <thead className="table--league__header">
                    <tr className="table--league__header__row">
                        <th className="table--league__header__row__cell">#</th>
                        <th className="table--league__header__row__cell">Name</th>
                        <th className="table--league__header__row__cell">P</th>
                        <th className="table--league__header__row__cell">Pts</th>
                        <th className="table--league__header__row__cell">F</th>
                        <th className="table--league__header__row__cell">A</th>
                        <th className="table--league__header__row__cell">GD</th>
                    </tr>
                </thead>
                <tbody className="table--league__body">{rows}</tbody>
            </table>);
        }
    });

    React.render(<TableView />, document.getElementById('app'));
})(window.document);
