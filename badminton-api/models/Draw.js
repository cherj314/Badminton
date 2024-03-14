const mongoose = require('mongoose');

const DrawSchema = new mongoose.Schema({
    games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true }],
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel'
    }],
    onModel: {
        type: String,
        enum: ['Player', 'Team']
    }
}, { timestamps: true });

module.exports = mongoose.model('Draw', DrawSchema);
