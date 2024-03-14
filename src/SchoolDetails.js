import React from 'react';

function SchoolDetails({ school }) {
    return (
        <div>
            <h2>{school.name}</h2>
            <p>Location: {school.location}</p>
            <p>Number of Players: {school.players.length}</p>
        </div>
    );
}

export default SchoolDetails;
