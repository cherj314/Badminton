const mongoose = require('mongoose');

const DrawSchema = new mongoose.Schema({
    event: String,
    rounds: [{
        name: String,
        matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }]  // Changed games to matches
    }],
    type: String,
    grade: Number
});

module.exports = mongoose.model('Draw', DrawSchema);
