import React, { memo } from 'react';

const LeagueTableHeader = () => {
    return (
        <div className="lt-header">
            <div className="lt-header__row lt-grid">
                <div className="lt-header__cell">#</div>
                <div className="lt-header__cell">Team</div>
                <div className="lt-header__cell lt-grid--centered">Games</div>
                <div className="lt-header__cell lt-grid--centered">Pts</div>
                <div className="lt-header__cell lt-grid--centered">+</div>
                <div className="lt-header__cell lt-grid--centered">-</div>
                <div className="lt-header__cell lt-grid--centered">+/-</div>
            </div>
        </div>
    );
};

export default memo(LeagueTableHeader);
