import React, { Component, Fragment } from 'react';
import GamesService from '../services/Games.Service';
import LeagueTableRow from './League.Table.Row';
import LeagueTableHeader from './League.Table.Header';

const POINTS_WIN = 3;
const POINTS_DRAW = 1;

class LeagueTable extends Component {
    _gamesService = null;
    state = {
        oldTable: [],
        table: [],
        games: {},
        teamsMap: {}
    };

    componentDidMount() {
        this.getTeams();
        this._gamesService = new GamesService(this.updateTable);
    }

    updateTable = (event) => {
        const game = JSON.parse(event.data);
        const games = JSON.parse(JSON.stringify(this.state.games));
        const teamsMap = JSON.parse(JSON.stringify(this.state.teamsMap));
        const teamHome = teamsMap[game.homeTeamId];
        const teamAway = teamsMap[game.awayTeamId];
        const oldTable = JSON.parse(JSON.stringify(this.state.table));
        let goalsHome = parseInt(game.homeGoals, 10);
        let goalsAway = parseInt(game.awayGoals, 10);
        let newTable = JSON.parse(JSON.stringify(this.state.table));

        if (games[game.date]) {
            games[game.date].push(game);
        } else {
            games[game.date] = [game];
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

        newTable = this.orderByGoals(this.orderByPoints(newTable.map(team => {
            if (team.id === teamHome.id) {
                return teamHome;
            } else if (team.id === teamAway.id) {
                return teamAway;
            }

            return team;
        })));

        const oldTableTeamHome = oldTable.find(team => team.id === teamHome.id);
        const oldTableTeamAway = oldTable.find(team => team.id === teamAway.id);
        const oldTablePositionTeamHome = oldTable.indexOf(oldTableTeamHome);
        const oldTablePositionTeamAway = oldTable.indexOf(oldTableTeamAway);
        const newTablePositionTeamHome = newTable.indexOf(teamHome);
        const newTablePositionTeamAway = newTable.indexOf(teamAway);

        if (oldTablePositionTeamHome > newTablePositionTeamHome) {
            teamHome.positionChange = -1;
        } else if (oldTablePositionTeamHome < newTablePositionTeamHome) {
            teamHome.positionChange = 1;
        } else {
            teamHome.positionChange = 0;
        }

        if (oldTablePositionTeamAway > newTablePositionTeamAway) {
            teamAway.positionChange = -1;
        } else if (oldTablePositionTeamAway < newTablePositionTeamAway) {
            teamAway.positionChange = 1;
        } else {
            teamAway.positionChange = 0;
        }

        this.setState({
            games,
            oldTable,
            table: newTable,
            teamsMap,
        });
    };

    orderByGoals(table) {
        var pointGroups = {},
            pointGroupsKeys,
            orderedTable = [];

        table.forEach(function(team) {
            if (pointGroups[team.points]) {
                pointGroups[team.points].push(team);
            } else {
                pointGroups[team.points] = [team];
            }
        });

        pointGroupsKeys = Object.keys(pointGroups);

        pointGroupsKeys.forEach(function(pointKey) {
            // ordering by goals difference
            pointGroups[pointKey].sort(function(team1, team2) {
                return team1.goalsDiff > team2.goalsDiff ? -1 : team1.goalsDiff < team2.goalsDiff ? 1 : 0;
            });

            // ordering by goals for
            pointGroups[pointKey].sort(function(team1, team2) {
                if (team1.goalsDiff === team2.goalsDiff) {
                    return team1.goalsScored > team2.goalsScored ? -1 : team1.goalsScored < team2.goalsScored ? 1 : 0;
                }
            });
        });

        pointGroupsKeys.reverse().forEach(function(pointKey) {
            pointGroups[pointKey].forEach(function(team) {
                orderedTable.push(team);
            });
        });

        return orderedTable;
    }

    orderByPoints(table) {
        table.sort((team1, team2) => (team1.points > team2.points ? -1 : team1.points < team2.points ? 1 : 0));

        return table;
    }

    orderByName(table) {
        table.sort((team1, team2) => {
            const team1Name = team1.name.toLowerCase();
            const team2Name = team2.name.toLowerCase();

            return team1Name < team2Name ? -1 : team1Name > team2Name ? 1 : 0;
        });

        return table;
    }

    getTeams() {
        fetch('http://127.0.0.1:8181/teams')
            .then((response) => response.json())
            .then(this.initTable);
    }

    initTable = (response) => {
        const table = this.orderByName(response).map(this.initTeam);
        const teamsMap = table.reduce((total, team) => {
            total[team.id] = team;

            return total;
        }, {});

        this.setState(() => ({ table, teamsMap, oldTable: JSON.parse(JSON.stringify(table)) }));
    };

    closeWebSocketConnection = () => {
        this._gamesService.close();
    };

    initTeam = (team) => {
        team.points = 0;
        team.goalsScored = 0;
        team.goalsConceded = 0;
        team.goalsDiff = 0;
        team.played = 0;
        team.positionChange = 0;

        return team;
    };

    renderRow(row, index) {
        return <LeagueTableRow key={`${index}-${row.name}-${row.points}`} {...row} index={index} />;
    }

    render() {
        return (
            <Fragment>
                <button onClick={this.closeWebSocketConnection}>Close connection</button>
                <div className="lt-table">
                    <LeagueTableHeader />
                    <div className="lt-table__data lt-grid__row">{this.state.table.map(this.renderRow)}</div>
                </div>
            </Fragment>
        );
    }
}

export default LeagueTable;
