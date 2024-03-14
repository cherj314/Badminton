import React, { useState, useEffect } from 'react';

function TournamentList() {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/tournaments')
            .then(response => response.json())
            .then(data => setTournaments(data))
            .catch(error => console.error('Error fetching tournaments:', error));
    }, []);

    return (
        <div>
            <h2>Tournaments</h2>
            <ul>
                {tournaments.map((tournament) => (
                    <li key={tournament._id}>{tournament.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default TournamentList;
