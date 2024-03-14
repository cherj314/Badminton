const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: String,
    age: Number,
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }
});

module.exports = mongoose.model('Player', PlayerSchema);
