import React from 'react';

function MatchResults({ match }) {
    return (
        <div>
            <h2>Match: {match.title}</h2>
            <p>Winner: {match.winner}</p>
            <p>Score: {match.score}</p>
        </div>
    );
}

export default MatchResults;
