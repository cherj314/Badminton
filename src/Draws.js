import React, { useState } from 'react';
import axios from 'axios';
import { SingleEliminationBracket, SVGViewer } from '@g-loot/react-tournament-brackets';

const Draws = () => {
    const [draws, setDraws] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to fetch game data by ID
    const fetchGameData = async (gameId) => {
        try {
            // Here, we're assuming that your backend has an endpoint to fetch a game by ID
            // which would look like `http://localhost:3001/games/:gameId`
            const response = await axios.get(`http://localhost:3001/games/${gameId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching game data for ID ${gameId}: `, error);
            throw error; // Re-throw the error to be handled by the caller
        }
    };

    const handleGenerateDraws = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:3001/generate-all-draws');
            console.log('Received draws data:', response.data);
            const matches = await adaptMatchesForSingleElimination(response.data);
            setDraws(matches);
        } catch (error) {
            console.error('Failed to generate draws:', error);
            setError(`Failed to generate draws: ${error.response?.data?.message || error.message}`);
        }
        setLoading(false);
    };    

    const adaptMatchesForSingleElimination = async (draws) => {
        let matches = [];
        if (!draws || !Array.isArray(draws)) {
            console.error('Invalid or no draw data:', draws);
            return matches;
        }
    
        for (const draw of draws) {
            if (draw.rounds && Array.isArray(draw.rounds)) {
                for (const round of draw.rounds) {
                    if (round.matches && Array.isArray(round.matches)) {
                        for (const gameId of round.matches) {
                            try {
                                const gameData = await fetchGameData(gameId);
                                // Construct the match object here using the fetched gameData
                                const match = {
                                    id: gameData._id,
                                    name: `${round.name} - Game ${gameData._id}`,
                                    // Assuming gameData.participants are populated with player details
                                    participants: gameData.participants.map(p => p.name).join(' vs '),
                                    // Add any other properties you need for the bracket component
                                };
                                matches.push(match);
                            } catch (error) {
                                console.error(`Failed to fetch game data for game ID: ${gameId}`);
                            }
                        }
                    } else {
                        console.error('No valid matches data in round:', round);
                    }
                }
            } else {
                console.error('No rounds data or not an array in draw:', draw);
            }
        }
    
        return matches;
    };    
    
    const matches = draws.length > 0 ? adaptMatchesForSingleElimination(draws) : [];

    return (
        <div>
            <h1>Tournament Draws</h1>
            <button onClick={handleGenerateDraws} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Draws'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {matches.length > 0 ? (
                <SingleEliminationBracket
                    matches={matches}
                    svgWrapper={({ children, ...props }) => (
                        <SVGViewer width={800} height={600} {...props}>
                            {children}
                        </SVGViewer>
                    )}
                />
            ) : (
                draws.length > 0 && <p>No games available for these draws.</p>
            )}
        </div>
    );
};

export default Draws;