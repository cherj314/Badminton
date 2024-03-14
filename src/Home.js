import React, { useEffect, useState } from 'react';
import './Home.css';

function Home() {
    const [players, setPlayers] = useState([]);
    const [draws, setDraws] = useState([]);
    const [selectedDraw, setSelectedDraw] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/players')
            .then(response => response.json())
            .then(data => setPlayers(data))
            .catch(error => console.log('Error fetching players:', error));

        // Fetch draws when the component mounts
        fetch('http://localhost:3001/draws')
            .then(response => response.json())
            .then(data => setDraws(data))
            .catch(error => console.log('Error fetching draws:', error));
    }, []);

    const handleCreatePlayer = () => {

        const playerName = `Player ${new Date().getTime()}`; // Example player name
        const playerAge = `14`; 
        const playerSchool = `School ${new Date().getTime()}`; 

        fetch('http://localhost:3001/players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ age: playerAge , name: playerName, school: playerSchool }),
        })
            .then(response => response.json())
            .then(data => {
                alert('Team created successfully!');
                console.log(data);
                // Here you might want to update your application state or re-fetch teams
            })
            .catch((error) => {
                console.error('Error creating team:', error);
            });
    };

    const handleCreateTeam = () => {
        if (players.length < 2) {
            alert("Not enough players to form a team.");
            return;
        }

        // Simplification: select the first two players (replace this with user selection)
        const teamPlayers = players.slice(0, 2).map(player => player._id);
        const teamName = `Team ${new Date().getTime()}`; // Example team name

        fetch('http://localhost:3001/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ players: teamPlayers, name: teamName }),
        })
            .then(response => response.json())
            .then(data => {
                alert('Team created successfully!');
                console.log(data);
                // Here you might want to update your application state or re-fetch teams
            })
            .catch((error) => {
                console.error('Error creating team:', error);
            });
    };


    const handleCreateDraw = () => {
        // Simplification: This assumes you have game IDs to use
        // In a real scenario, you'd likely have a selection process for games to include in the draw
        const exampleGameIds = ['GameId1', 'GameId2']; // Replace with actual game IDs from your application

        fetch('http://localhost:3001/draws', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ games: exampleGameIds }),
        })
            .then(response => response.json())
            .then(data => {
                alert('Draw created successfully!');
                console.log(data);
                // Update state or UI accordingly
            })
            .catch((error) => {
                console.error('Error creating draw:', error);
            });
    };


    const handleSelectDraw = (drawId) => {
        // Fetch the selected draw's games
        fetch(`http://localhost:3001/draws/${drawId}`)
            .then(response => response.json())
            .then(data => setSelectedDraw(data))
            .catch(error => console.log('Error fetching draw details:', error));
    };

    return (
        <div>
            <h1>Players</h1>
            <button onClick={handleCreateTeam}>Create New Team</button>
            <button onClick={handleCreateDraw}>Create New Draw</button>
            <button onClick={handleCreatePlayer}>Create New Player</button>
            <div>
                <h2>Draws</h2>
                <ul>
                    {draws.map((draw) => (
                        <li key={draw._id} onClick={() => handleSelectDraw(draw._id)}>{draw.name}</li>
                    ))}
                </ul>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>Participants</th>
                        <th>Winner</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedDraw && selectedDraw.games.map((game, index) => (
                        <tr key={index}>
                            <td>{`Game ${index + 1}`}</td>
                            <td>{game.participants.map(participant => participant.name).join(' vs ')}</td>
                            <td>{game.winner.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Home;
