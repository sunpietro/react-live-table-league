import React from 'react';
import PropType from 'prop-types';
import './scss/League.Table.Row.scss';

const LeagueTableRow = ({index, name, played, points, goalsConceded, goalsScored, positionChange}) => {
    let rowClassName = 'lt-row lt-grid';

    if (positionChange === 1) {
        rowClassName = `${rowClassName} lt-row--is-up`;
    } else if (positionChange === -1) {
        rowClassName = `${rowClassName} lt-row--is-down`;
    }

    return (
        <div className={rowClassName}>
            <div className="lt-row__cell">{index + 1}</div>
            <div className="lt-row__cell">{name}</div>
            <div className="lt-row__cell lt-grid--centered">{played}</div>
            <div className="lt-row__cell lt-grid--centered">{points}</div>
            <div className="lt-row__cell lt-grid--centered">{goalsScored}</div>
            <div className="lt-row__cell lt-grid--centered">{goalsConceded}</div>
            <div className="lt-row__cell lt-grid--centered">{goalsScored - goalsConceded}</div>
        </div>
    );
};

LeagueTableRow.propTypes = {
    index: PropType.number.isRequired,
    name: PropType.string.isRequired,
    played: PropType.number.isRequired,
    points: PropType.number.isRequired,
    goalsScored: PropType.number.isRequired,
    goalsConceded: PropType.number.isRequired,
    positionChange: PropType.number.isRequired,
};

export default LeagueTableRow;
