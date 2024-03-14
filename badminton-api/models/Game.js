const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true
    }],
    onModel: {
        type: String,
        required: true,
        enum: ['Player', 'Team']
    },
    scores: [{
        gameNumber: Number,
        score1: Number,
        score2: Number
    }],
    winner: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel', required: true },
    loser: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);
