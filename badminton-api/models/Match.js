const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    score: String,
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    loser: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    matchState: { type: String, enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'NO_SHOW', 'WALK_OVER'] },
    nextMatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', default: null },
    startTime: Date,
});


module.exports = mongoose.model('Game', GameSchema);