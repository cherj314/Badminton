const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Importing models
const Player = require('./models/Player');
const Match = require('./models/Match');  // Renamed Game to Match
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
    const players = await Player.find().populate('school').populate('partner');
    res.json(players);
});

app.post('/players', async (req, res) => {
    const { name, grade, school, event, partner } = req.body;
    const player = new Player({ name, grade, school: new mongoose.Types.ObjectId(school), event, partner: partner ? new mongoose.Types.ObjectId(partner) : null });

    await player.save();
    res.status(201).json(player);
});

app.get('/matches', async (req, res) => {  // Changed endpoint from /games to /matches
    const matches = await Match.find().populate('participants winner loser');
    res.json(matches);
});

app.get('/schools', async (req, res) => {
    const schools = await School.find().populate('players');
    res.json(schools);
});

app.get('/matches/:matchId', async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId).populate('participants');
        if (!match) {
            return res.status(404).send('Match not found');
        }
        res.json(match);
    } catch (error) {
        res.status(500).send('Server error');
    }
});


// POST endpoint to generate all draws
app.post('/generate-all-draws', async (req, res) => {
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
                let matches = [];
                for (let i = 0; i < players.length; i += 2) {
                    let matchParticipants = players.slice(i, i + 2);
                    let match = new Match({
                        participants: matchParticipants.map(p => p ? p._id : null)
                    });
                    await match.save();
                    matches.push(match._id);  // Storing IDs of matches for easier retrieval
                }
                rounds.push({ name: `Round ${rounds.length + 1}`, matches: matches });
                players = matches.map(() => ({})); // Placeholder for winners
            }
            const draw = new Draw({
                event: event,
                grade: grade,
                rounds: rounds,
                type: 'main'
            });

            await draw.save();
            allDraws.push(draw);
        }
    }
    res.json(allDraws);
});

// GET endpoint to fetch all draws with populated match details
app.get('/draws', async (req, res) => {
    const { grade, event } = req.query;
    const query = {};
    if (grade) query.grade = parseInt(grade);
    if (event) query.event = event;

    const draws = await Draw.find(query).populate({
        path: 'rounds.matches',
        populate: {
            path: 'participants',
            model: 'Player'
        }
    });
    res.json(draws);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
