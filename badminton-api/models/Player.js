const mongoose = require('mongoose');
const School = require('./School');

const PlayerSchema = new mongoose.Schema({
    name: String,
    grade: Number,  // Changed from 'age' to 'grade'
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    event: { type: String, enum: ['BS', 'GS', 'BD', 'GD', 'XD'] },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null }
});

module.exports = mongoose.model('Player', PlayerSchema);
