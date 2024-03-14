const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    name: String,
    location: String,
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
});

module.exports = mongoose.model('School', SchoolSchema);
