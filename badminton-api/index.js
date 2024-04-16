const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Importing models
const Player = require('./models/Player');
const Game = require('./models/Match');
const Draw = require('./models/Draw');
const School = require('./models/School');

const app = express();
const PORT = 3001;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/badmintonTournament')
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(bodyParser.json());

app.get('/players', async (req, res) => {
    try {
        const players = await Player.find().populate('school').populate('partner');
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/players', async (req, res) => {
    const { name, grade, school, event, partner } = req.body;
    const player = new Player({
        name,
        grade,
        school: new mongoose.Types.ObjectId(school),
        event,
        partner: partner ? new mongoose.Types.ObjectId(partner) : null
    });

    try {
        await player.save();
        res.status(201).json(player);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/games', async (req, res) => {
    try {
        const games = await Game.find().populate('participants winner loser');
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint to get all schools
app.get('/schools', async (req, res) => {
    try {
        const schools = await School.find().populate('players');
        res.json(schools);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/generate-all-draws', async (req, res) => {
    try {
        const events = ['BS', 'GS', 'BD', 'GD', 'XD'];
        const grades = [10, 11, 12];
        let allDraws = [];
        for (let grade of grades) {
            for (let event of events) {
                let players = await Player.find({ grade: grade, event: event }).populate('partner');
                if (players.length < 2) {  
                    continue;  
                }
                let totalPlayers = players.length;
                let byePlayers = 16 - totalPlayers % 16;
                if (byePlayers === 16) byePlayers = 0;
                for (let i = 0; i < byePlayers; i++) {
                    players.push(null);
                }
                let rounds = [];
                while (players.length > 1) {
                    let games = [];
                    for (let i = 0; i < players.length; i += 2) {
                        let matchParticipants = players.slice(i, i + 2);
                        let game = new Game({
                            participants: matchParticipants.map(p => p ? p._id : null)
                        });
                        await game.save();
                        games.push(game);
                    }
                    rounds.push({ name: `Round ${rounds.length + 1}`, games: games.map(game => game._id) });
                    players = games.map(() => ({})); // Placeholder for winners
                }
                const draw = new Draw({
                    event: event,
                    grade: grade,
                    rounds: rounds.map(round => ({ name: round.name, matches: round.games })), // Use 'matches' here as per your DrawSchema
                    type: 'main' // Assuming a single main type for simplicity
                });
    
                await draw.save();
                allDraws.push(draw);
            }
        }
        res.json(allDraws);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/draws', async (req, res) => {
    try {
        const { grade, event } = req.query;
        const query = {};
        if (grade) query.grade = parseInt(grade);
        if (event) query.event = event;

        const draws = await Draw.find(query).populate({
            path: 'games',
            populate: {
                path: 'participants winner loser',
                model: 'Player'
            }
        });
        res.json(draws);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
