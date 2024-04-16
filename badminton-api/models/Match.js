const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({  // Renamed GameSchema to MatchSchema
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    score: String,
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    loser: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    matchState: { type: String, enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'NO_SHOW', 'WALK_OVER'] },
    nextMatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', default: null },  // Changed Game to Match
    startTime: Date,
});

module.exports = mongoose.model('Match', MatchSchema);  // Changed Game to Match
