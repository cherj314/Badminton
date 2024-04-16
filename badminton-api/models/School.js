const mongoose = require('mongoose');
const Player = require('./Player');

const SchoolSchema = new mongoose.Schema({
    name: String,
    location: String,
    // Define players as an array of ObjectIds referencing the Player model
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
});

module.exports = mongoose.model('School', SchoolSchema);

