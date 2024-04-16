import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    const [players, setPlayers] = useState([]);
    const [schools, setSchools] = useState([]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerGrade, setNewPlayerGrade] = useState('');
    const [newPlayerSchool, setNewPlayerSchool] = useState('');
    const [newPlayerEvent, setNewPlayerEvent] = useState('');
    const [newPlayerPartner, setNewPlayerPartner] = useState('');
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/players')
        .then(response => response.json())
        .then(playerData => {
            console.log('Players:', playerData);
            setPlayers(playerData);
            // Fetch schools after fetching players
            return fetch('http://localhost:3001/schools');
        })
        .then(response => response.json())
        .then(schoolData => {
            console.log('Fetched schools:', schoolData);
            setSchools(schoolData.reduce((acc, school) => ({ ...acc, [school._id]: school }), {}));
        })
        .catch(error => console.log('Error fetching data:', error));
    }, [refresh]);

    const handleCreatePlayer = () => {
        if (!newPlayerName || !newPlayerGrade || !newPlayerSchool || !newPlayerEvent) {
            alert('Please fill in all fields.');
            return;
        }
    
        const playerData = {
            name: newPlayerName,
            grade: newPlayerGrade,
            school: newPlayerSchool,
            event: newPlayerEvent,
            partner: (newPlayerEvent === 'BD' || newPlayerEvent === 'GD' || newPlayerEvent === 'XD') ? newPlayerPartner : null
        };

        fetch('http://localhost:3001/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playerData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create player. Server responded with ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            alert('Player created successfully!');
            setPlayers(prevPlayers => [...prevPlayers, data]);
            setNewPlayerName('');
            setNewPlayerGrade('');
            setNewPlayerSchool('');
            setNewPlayerEvent('');
            setNewPlayerPartner('');
            setRefresh(refresh => !refresh);  // Trigger a refresh to fetch all data again
        })        
        .catch((error) => {
            console.error('Error creating player:', error);
            alert('Failed to create player. ' + error.message);
        });
    };

    const handleEventChange = (event) => {
        setNewPlayerEvent(event.target.value);
    };

    const handlePartnerChange = (event) => {
        setNewPlayerPartner(event.target.value);
    };
        
    
    const findSchoolName = (school) => {
        return school ? school.name : 'Unknown School';
    };    

    const findPlayersInSchool = (schoolId) => {
        return players.filter(player => player.school === schoolId);
    };

    const handleSchoolChange = (event) => {
        setNewPlayerSchool(event.target.value);
    };

    return (
        <div>
            <h1>Players</h1>
            <div>
                <label>Name:</label>
                <input type="text" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} />
                <label>Grade:</label>
                <input type="number" value={newPlayerGrade} onChange={(e) => setNewPlayerGrade(e.target.value)} />
                <label>School:</label>
                <select value={newPlayerSchool} onChange={(e) => setNewPlayerSchool(e.target.value)}>
                    <option value="">Select School</option>
                    {Object.values(schools).map(school => (
                        <option key={school._id} value={school._id}>{school.name}</option>
                    ))}
                </select>
                <label>Event:</label>
                <select value={newPlayerEvent} onChange={(e) => setNewPlayerEvent(e.target.value)}>
                    <option value="">Select Event</option>
                    <option value="BS">Boys Singles (BS)</option>
                    <option value="GS">Girls Singles (GS)</option>
                    <option value="BD">Boys Doubles (BD)</option>
                    <option value="GD">Girls Doubles (GD)</option>
                    <option value="XD">Mixed Doubles (XD)</option>
                </select>
                {(newPlayerEvent === 'BD' || newPlayerEvent === 'GD' || newPlayerEvent === 'XD') && (
                    <div>
                        <label>Partner:</label>
                        <select value={newPlayerPartner} onChange={(e) => setNewPlayerPartner(e.target.value)}>
                            <option value="">Select Partner</option>
                            {players.filter(p => p.grade === newPlayerGrade && p.event === newPlayerEvent).map(player => (
                                <option key={player._id} value={player._id}>{player.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <button onClick={handleCreatePlayer}>Create New Player</button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Grade</th>
                        <th>School</th>
                        <th>Event</th>
                        <th>Partner</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map(player => (
                        <tr key={player._id}>
                            <td>{player.name}</td>
                            <td>{player.grade}</td>
                            <td>{findSchoolName(player.school)}</td>
                            <td>{player.event}</td>
                            <td>{player.partner ? player.partner.name : 'None'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h1>Schools</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Players</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(schools).map(school => (
                        <tr key={school._id}>
                            <td>{school.name}</td>
                            <td>{school.location}</td>
                            <td>
                                <ul>
                                    {findPlayersInSchool(school._id).map(player => (
                                        <li key={player._id}>{player.name}</li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/draws">Go to Draws</Link>
        </div>
    );
}

export default Home;
