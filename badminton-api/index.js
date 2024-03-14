const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Importing models
const Tournament = require('./models/Tournament'); // Assuming the path is correct
const Player = require('./models/Player');
const Team = require('./models/Team'); // Import the Team model
const Game = require('./models/Game'); // Import the Game model
const Draw = require('./models/Draw'); // Import the Draw model

const app = express();
const PORT = 3001;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/badmintonTournament', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());


// GET all tournaments
app.get('/tournaments', async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.json(tournaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to get all players
app.get('/players', async (req, res) => {
    try {
        const players = await Player.find().populate('school'); // Populate school if you store a reference to a School model
        res.json(players.map(player => ({
            _id: player.id,
            name: player.name,
            age: player.age,
            schoolName: player.school ? player.school.name : 'N/A' // Adjust according to your model
        })));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// create a player
app.post('/players', async (req, res) => {
    const player = new Player({
        name: req.body.name,
        age: req.body.age,
        school: req.body.school
    });

    try {
        const savedPlayer = await player.save();
        res.json(savedPlayer);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Example of a new endpoint to create a team
app.post('/teams', async (req, res) => {
    const { players, name } = req.body;
    const team = new Team({
        players,
        name
    });

    try {
        const savedTeam = await team.save();
        res.json(savedTeam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Example of a new endpoint to get all games
app.get('/games', async (req, res) => {
    try {
        const games = await Game.find().populate('participants');
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Example of a new endpoint to create a draw
app.post('/draws', async (req, res) => {
    const { games, participants } = req.body;
    const draw = new Draw({
        games,
        participants
    });

    try {
        const savedDraw = await draw.save();
        res.json(savedDraw);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

